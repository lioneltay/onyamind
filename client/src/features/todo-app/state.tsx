import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react"
import { firebase, firestore, dataWithId } from "services/firebase"
import { Observable, Subject, combineLatest, Subscription } from "rxjs"
import { switchMap } from "rxjs/operators"
import { Task, User, ID, TaskList } from "./types"
import { uniq, max, update } from "ramda"
import {
  addTask,
  removeTask,
  editTask,
  addTaskList,
  editTaskList,
  removeTaskList,
  getPrimaryTaskList,
  getCurrentUser,
} from "./api"

type Context = {
  selected_task_list_id: ID | null
  touch_screen: boolean
  editing: boolean
  user: User | null
  tasks: Task[]
  task_lists: TaskList[]
  show_edit_modal: boolean
  editing_task_id: ID | null
  new_task_title: string
  selected_tasks: ID[]
  show_drawer: boolean

  actions: {
    selectTaskList: (list_id: ID) => void

    setShowDrawer: (show: boolean) => void

    addTaskList: typeof addTaskList
    removeTaskList: typeof removeTaskList
    editTaskList: typeof editTaskList
    setPrimaryTaskList: (id: ID) => Promise<void>

    addTask: (
      task: Omit<
        Task,
        "id" | "created_at" | "updated_at" | "complete" | "list_id"
      >,
    ) => Promise<Task>
    editTask: (
      task_id: ID,
      task_data: Partial<Omit<Task, "id">>,
    ) => Promise<Task>
    removeTask: (task_id: ID) => Promise<ID>

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

const useObservable = <T extends any>(
  observable: Observable<T>,
  initial_value: T,
): T => {
  const [value, setValue] = useState(initial_value)

  useEffect(
    () => {
      const subscription = observable.subscribe(value => setValue(value))
      return () => subscription.unsubscribe()
    },
    [observable],
  )

  return value
}

const useSubject = <T extends any>(): [Subject<T>, (value: T) => void] => {
  const subject_ref = useRef(new Subject<T>())
  const subject = subject_ref.current

  return [
    subject,
    (value: T) => {
      subject.next(value)
    },
  ]
}

export const Provider: React.FunctionComponent = ({ children }) => {
  const [touch_screen, setTouchScreen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [show_drawer, setShowDrawer] = useState(false)
  const [show_edit_modal, setShowEditModal] = useState(false)
  const [editing_task_id, setEditingTaskId] = useState(null as ID | null)
  const [new_task_title, setNewTaskTitle] = useState("")
  const [selected_tasks, setSelectedTasks] = useState([] as ID[])

  const [
    selected_task_list_id_stream,
    setSelectedTaskListId,
  ] = useSubject<ID | null>()

  const selected_task_list_id = useObservable(
    selected_task_list_id_stream,
    null,
  )

  const { current: tasks_stream } = useRef(
    selected_task_list_id_stream.pipe(
      switchMap(list_id => createTasksStream(list_id)),
    ),
  )

  const tasks = useObservable(tasks_stream, [] as Task[])

  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function initStuff() {
      const user = await getCurrentUser()

      const primary_list = await getPrimaryTaskList(
        user ? user.uid : null,
      ).catch(() => {
        return addTaskList({
          name: "Tasks",
          number_of_tasks: 0,
          primary: true,
          user_id: user ? user.uid : null,
        })
      })

      setSelectedTaskListId(primary_list.id)
      setReady(true)
    }

    initStuff()
  }, [])

  const user = useObservable(user_stream, null)
  const task_lists = useObservable(task_lists_stream, [])

  useEffect(() => {
    const handler = () => setTouchScreen(true)
    window.addEventListener("touchstart", handler)
    return () => window.removeEventListener("touchstart", handler)
  })

  if (!ready) {
    return null
  }

  return (
    <Context.Provider
      value={{
        task_lists,
        touch_screen,
        editing,
        user,
        tasks,
        show_edit_modal,
        editing_task_id,
        new_task_title,
        selected_tasks,
        show_drawer,
        selected_task_list_id,

        actions: {
          selectTaskList: setSelectedTaskListId,
          addTaskList,
          editTaskList,
          removeTaskList,

          setPrimaryTaskList: async (id: ID) => {
            const batch = firestore.batch()

            batch.update(firestore.collection("task_lists").doc(id), {
              primary: true,
            })

            task_lists
              .filter(list => list.id !== id && list.primary)
              .forEach(list => {
                batch.update(firestore.collection("task_lists").doc(list.id), {
                  primary: false,
                })
              })

            batch.commit()
          },

          setShowDrawer,

          addTask: async data => {
            const task_list = task_lists.find(
              list => list.id === selected_task_list_id,
            )
            if (!task_list) {
              throw Error("No such task list")
            }
            if (!selected_task_list_id) {
              throw Error("No selected_task_list_id. Not initialised correctly")
            }

            const [task] = await Promise.all([
              addTask({
                ...data,
                list_id: selected_task_list_id,
              }),
              editTaskList(selected_task_list_id, {
                number_of_tasks: task_list.number_of_tasks + 1,
              }),
            ])

            return task
          },

          editTask,

          removeTask: async id => {
            const task = tasks.find(task => task.id === id)
            if (!task) {
              throw Error("No such task")
            }

            // Task List stuff
            const task_list = task_lists.find(
              list => list.id === selected_task_list_id,
            )
            if (!task_list) {
              throw Error("No such task list")
            }
            if (!selected_task_list_id) {
              throw Error("No selected_task_list_id. Not initialised correctly")
            }

            const [deleted_id] = await Promise.all([
              removeTask(id),
              editTaskList(selected_task_list_id, {
                number_of_tasks: max(task_list.number_of_tasks - 1, 0),
              }),
            ])

            return deleted_id
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

            const completed_tasks = tasks.filter(task => task.complete)

            completed_tasks.forEach(task => {
              batch.delete(firestore.collection("tasks").doc(task.id))
            })

            const task_list = task_lists.find(
              list => list.id === selected_task_list_id,
            )
            if (!task_list) {
              throw Error("No such task list")
            }
            if (!selected_task_list_id) {
              throw Error("No selected_task_list_id. Not initialised correctly")
            }

            await Promise.all([
              batch.commit(),
              editTaskList(selected_task_list_id, {
                number_of_tasks: max(
                  task_list.number_of_tasks - completed_tasks.length,
                  0,
                ),
              }),
            ])
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

            const task_list = task_lists.find(
              list => list.id === selected_task_list_id,
            )
            if (!task_list) {
              throw Error("No such task list")
            }
            if (!selected_task_list_id) {
              throw Error("No selected_task_list_id. Not initialised correctly")
            }

            await Promise.all([
              batch.commit(),
              editTaskList(selected_task_list_id, {
                number_of_tasks: max(
                  task_list.number_of_tasks - selected_tasks.length,
                  0,
                ),
              }),
            ])
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

const createListsStream = (user_id: ID | null) =>
  new Observable<TaskList[]>(observer => {
    return firestore
      .collection("task_lists")
      .where("user_id", "==", user_id)
      .onSnapshot(snapshot => {
        const ists: TaskList[] = snapshot.docs.map(dataWithId) as TaskList[]
        observer.next(ists)
      })
  })

const createTasksStream = (list_id: ID | null) =>
  new Observable<Task[]>(observer => {
    return firestore
      .collection("tasks")
      .where("list_id", "==", list_id)
      .onSnapshot(snapshot => {
        const tasks: Task[] = snapshot.docs.map(dataWithId) as Task[]
        observer.next(tasks)
      })
  })

const user_stream = new Observable<User | null>(observer => {
  return firebase.auth().onAuthStateChanged(user => observer.next(user))
})

const task_lists_stream = user_stream.pipe(
  switchMap(user => createListsStream(user ? user.uid : null)),
)
