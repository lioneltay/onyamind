import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react"
import { firebase, firestore, dataWithId } from "services/firebase"
import { Observable } from "rxjs"
import { switchMap } from "rxjs/operators"
import { Task, User, ID } from "./types"
import { uniq, max, update } from "ramda"
import { addTask, removeTask, editTask } from "./api"

type Context = {
  touch_screen: boolean
  editing: boolean
  user: User | null
  tasks: Task[]
  show_edit_modal: boolean
  editing_task_id: ID | null
  new_task_title: string
  selected_tasks: ID[]

  actions: {
    addTask: (
      task: Omit<
        Task,
        "id" | "created_at" | "updated_at" | "complete" | "position"
      >,
    ) => Promise<Task>
    editTask: (
      task_id: ID,
      task_data: Partial<Omit<Task, "id">>,
    ) => Promise<Task>
    removeTask: (task_id: ID) => Promise<ID>

    moveTask: (from: number, to: number) => void
    endTaskRepositioning: () => Promise<void>

    selectAllIncompleteTasks: () => void
    toggleTaskSelection: (id: ID) => void
    setNewTaskTitle: (title: string) => void
    startEditingTask: (task_id: ID) => void
    stopEditingTask: () => void
    checkSelectedTasks: () => Promise<void>
    deleteSelectedTasks: () => Promise<void>
    stopEditing: () => void
    uncheckCompletedTasks: () => Promise<void>
    deleteCompletedTasks: () => Promise<void>
  }
}

const Context = createContext((null as unknown) as Context)

export const useAppState = () => {
  return useContext(Context)
}

const useObservableState = <T extends any>(
  observable: Observable<T>,
  initial_value: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [value, setValue] = useState(initial_value)

  useEffect(() => {
    const subscription = observable.subscribe(value => setValue(value))
    return () => subscription.unsubscribe()
  }, [])

  return [value, setValue]
}

export const Provider: React.FunctionComponent = ({ children }) => {
  const [touch_screen, setTouchScreen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [show_edit_modal, setShowEditModal] = useState(false)
  const [editing_task_id, setEditingTaskId] = useState(null as ID | null)
  const [new_task_title, setNewTaskTitle] = useState("")
  const [selected_tasks, setSelectedTasks] = useState([] as ID[])

  useEffect(() => {
    const handler = () => setTouchScreen(true)
    window.addEventListener("touchstart", handler)
    return () => window.removeEventListener("touchstart", handler)
  })

  const [user] = useObservableState(user_stream, null)
  const [tasks, setTasks] = useObservableState(current_user_tasks_stream, [])

  const tasks_ref = useRef(tasks)
  tasks_ref.current = tasks

  return (
    <Context.Provider
      value={{
        touch_screen,
        editing,
        user,
        tasks,
        show_edit_modal,
        editing_task_id,
        new_task_title,
        selected_tasks,

        actions: {
          addTask: data => {
            const next_position =
              tasks.reduce((acc, task) => max(acc, task.position), 0) + 1 || 1

            return addTask({ ...data, position: next_position })
          },

          editTask,

          removeTask: async id => {
            const task = tasks.find(task => task.id === id)
            if (!task) {
              throw Error("No such task")
            }
            const position = task.position
            const above_tasks = tasks.filter(task => task.position > position)

            const batch = firestore.batch()

            above_tasks.forEach(task => {
              batch.update(firestore.collection("tasks").doc(task.id), {
                position: task.position + 1,
                updated_at: Date.now(),
              })
            })

            await batch.commit()

            return removeTask(id)
          },

          moveTask: async (from: number, to: number) => {
            const delta = from > to ? 1 : -1
            const upper = from > to ? from - 1 : to
            const lower = from > to ? to : from + 1

            console.log(from, tasks)
            const from_task = tasks.find(task => task.position === from)
            if (!from_task) {
              throw Error("No such from task")
            }

            const updateTaskSync = (id: ID, data: Partial<Task>): void => {
              setTasks(tasks => {
                const index = tasks.findIndex(task => task.id === id)
                if (index < 0) {
                  return tasks
                }
                return update(
                  index,
                  { ...tasks[index], ...data, updated_at: Date.now() },
                  tasks,
                )
              })
            }

            tasks
              .filter(task => task.position >= lower && task.position <= upper)
              .map(task => ({ ...task, position: task.position + delta }))
              .forEach(task => updateTaskSync(task.id, task))

            updateTaskSync(from_task.id, { position: to })
          },

          endTaskRepositioning: async () => {
            console.log("endTaskRepositioning")

            const tasks = tasks_ref.current
            console.log(tasks)

            const batch = firestore.batch()

            tasks.forEach(task => {
              batch.update(firestore.collection("tasks").doc(task.id), {
                position: task.position,
                updated_at: Date.now(),
              })
            })

            return batch.commit()
          },

          selectAllIncompleteTasks: () => {
            setSelectedTasks(ids =>
              uniq(
                ids.concat(
                  tasks.filter(task => !task.complete).map(task => task.id),
                ),
              ),
            )
          },

          deleteCompletedTasks: async () => {
            const batch = firestore.batch()

            tasks
              .filter(task => task.complete)
              .forEach(task => {
                batch.delete(firestore.collection("tasks").doc(task.id))
              })

            return batch.commit()
          },

          uncheckCompletedTasks: async () => {
            const batch = firestore.batch()

            tasks
              .filter(task => task.complete)
              .forEach(task => {
                batch.update(firestore.collection("tasks").doc(task.id), {
                  complete: false,
                  updated_at: Date.now(),
                })
              })

            return batch.commit()
          },

          checkSelectedTasks: async () => {
            setEditing(false)
            setSelectedTasks([])

            const batch = firestore.batch()

            selected_tasks.forEach(id => {
              batch.update(firestore.collection("tasks").doc(id), {
                complete: true,
                updated_at: Date.now(),
              })
            })

            return batch.commit()
          },

          deleteSelectedTasks: async () => {
            setEditing(false)
            setSelectedTasks([])

            const batch = firestore.batch()

            selected_tasks.forEach(id => {
              batch.delete(firestore.collection("tasks").doc(id))
            })

            return batch.commit()
          },

          stopEditing: () => {
            setEditing(false)
            setSelectedTasks([])
          },

          toggleTaskSelection: id =>
            setSelectedTasks(selected_tasks => {
              setEditing(true)
              const index = selected_tasks.findIndex(task_id => task_id === id)
              const new_selected_tasks =
                index >= 0
                  ? selected_tasks.filter(task_id => task_id !== id)
                  : [...selected_tasks, id]

              if (new_selected_tasks.length === 0) {
                setEditing(false)
                return []
              }

              return new_selected_tasks
            }),

          setNewTaskTitle,

          startEditingTask: id => {
            setShowEditModal(true)
            setEditingTaskId(id)
          },

          stopEditingTask: () => {
            setShowEditModal(false)
            setEditingTaskId(null)
          },
        },
      }}
    >
      {children}
    </Context.Provider>
  )
}

const user_stream = new Observable<User | null>(observer => {
  return firebase.auth().onAuthStateChanged(user => observer.next(user))
})

const createTasksStream = (user_id?: string) =>
  new Observable<Task[]>(observer => {
    if (typeof user_id === "undefined") {
      return firestore
        .collection("tasks")
        .where("uid", "==", null)
        .onSnapshot(snapshot => {
          const tasks: Task[] = snapshot.docs.map(dataWithId) as Task[]
          observer.next(tasks)
        })
    } else {
      return firestore
        .collection("tasks")
        .where("uid", "==", user_id)
        .onSnapshot(snapshot => {
          const tasks: Task[] = snapshot.docs.map(dataWithId) as Task[]
          observer.next(tasks)
        })
    }
  })

const current_user_tasks_stream = user_stream.pipe(
  switchMap(user => createTasksStream(user ? user.uid : undefined)),
)
