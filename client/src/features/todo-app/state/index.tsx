import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react"
import { firebase, firestore, dataWithId } from "features/todo-app/firebase"
import { Observable } from "rxjs"
import { switchMap } from "rxjs/operators"
import { Task, User, ID, TaskList } from "../types"
import { uniq, max } from "ramda"
import {
  createDefaultTaskList,
  getTaskLists,
  addTask,
  removeTask,
  editTask,
  addTaskList,
  editTaskList,
  removeTaskList,
} from "./api"

type Context = {
  selected_task_list_id: ID | null
  touch_screen: boolean
  editing: boolean
  user: User | null
  tasks: Task[] | null
  task_lists: TaskList[] | null
  show_edit_modal: boolean
  editing_task_id: ID | null
  new_task_title: string
  selected_tasks: ID[]
  show_drawer: boolean

  actions: {
    signOut: () => Promise<void>
    signInWithGoogle: () => Promise<void>

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

const user$ = new Observable<User | null>(observer => {
  return firebase.auth().onAuthStateChanged(user => observer.next(user))
})

const createCurrentListsStream = (user_id: ID | null) =>
  new Observable<TaskList[] | null>(observer => {
    observer.next(null)
    return firestore
      .collection("task_lists")
      .where("user_id", "==", user_id)
      .onSnapshot(snapshot => {
        const lists: TaskList[] = snapshot.docs.map(dataWithId) as TaskList[]
        observer.next(lists)
      })
  })

const list$ = user$.pipe(
  switchMap(user => createCurrentListsStream(user ? user.uid : null)),
)

const createCurrentTasksStream = (list_id: ID | null) =>
  new Observable<Task[] | null>(observer => {
    observer.next(null)
    return firestore
      .collection("tasks")
      .where("list_id", "==", list_id)
      .onSnapshot(snapshot => {
        const tasks: Task[] = snapshot.docs.map(dataWithId) as Task[]
        observer.next(tasks)
      })
  })

const useObservable = <T extends any>(
  observable: Observable<T>,
  initial_value: T,
): T => {
  const [value, setValue] = useState(initial_value)

  useEffect(
    () => {
      const subscription = observable.subscribe(value => setValue(value))
      console.log("subscribing")
      return () => subscription.unsubscribe()
    },
    [observable],
  )

  return value
}

export const useAppState = () => {
  return useContext(Context)
}

export const Provider: React.FunctionComponent = ({ children }) => {
  const [touch_screen, setTouchScreen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [show_drawer, setShowDrawer] = useState(false)
  const [show_edit_modal, setShowEditModal] = useState(false)
  const [editing_task_id, setEditingTaskId] = useState(null as ID | null)
  const [new_task_title, setNewTaskTitle] = useState("")
  const [selected_tasks, setSelectedTasks] = useState([] as ID[])

  const [selected_task_list_id, setSelectedTaskListId] = useState(
    null as ID | null,
  )
  const user = useObservable(user$, null)
  const task_lists = useObservable(list$, null)
  const tasks = useObservable(
    useMemo(() => createCurrentTasksStream(selected_task_list_id), [
      selected_task_list_id,
    ]),
    null,
  )

  useEffect(
    () => {
      const subscription = user$.subscribe(async user => {
        const user_id = user ? user.uid : null
        const lists = await getTaskLists(user_id)
        let primary_list = lists.find(list => list.primary)
        if (!primary_list) {
          primary_list = await createDefaultTaskList(user_id)
        }
        setSelectedTaskListId(primary_list.id)
      })
      return () => subscription.unsubscribe()
    },
    [user$],
  )

  useEffect(() => {
    const handler = () => setTouchScreen(true)
    window.addEventListener("touchstart", handler)
    return () => window.removeEventListener("touchstart", handler)
  })

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
          signOut: async () => {
            await firebase.auth().signOut()
          },

          signInWithGoogle: async () => {
            const google_provider = new firebase.auth.GoogleAuthProvider()

            google_provider.setCustomParameters({
              prompt: "select_account",
            })

            const { user } = await firebase
              .auth()
              .signInWithPopup(google_provider)
          },

          selectTaskList: setSelectedTaskListId,
          addTaskList,
          editTaskList,
          removeTaskList,

          setPrimaryTaskList: async (id: ID) => {
            if (!task_lists) {
              throw Error("No task lists")
            }

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
            if (!task_lists) {
              throw Error("No task lists")
            }

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
            if (!tasks) {
              throw Error("No tasks")
            }
            if (!task_lists) {
              throw Error("No task lists")
            }

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
            if (!tasks) {
              throw Error("No tasks")
            }

            setSelectedTasks(ids =>
              uniq(
                ids.concat(
                  tasks.filter(task => !task.complete).map(task => task.id),
                ),
              ),
            )
          },

          deleteCompletedTasks: async () => {
            if (!tasks) {
              throw Error("No tasks")
            }
            if (!task_lists) {
              throw Error("No task lists")
            }

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
            if (!tasks) {
              throw Error("No tasks")
            }

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
            if (!task_lists) {
              throw Error("No task lists")
            }

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
