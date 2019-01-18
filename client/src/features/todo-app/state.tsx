import React, { createContext, useState, useEffect, useContext } from "react"
import { firebase, firestore, dataWithId } from "services/firebase"
import { Observable } from "rxjs"
import { switchMap } from "rxjs/operators"
import { Task, User, ID } from "./types"
import { editTask, removeTask } from "./api"
import uniq from "ramda/es/uniq"

type Context = {
  editing: boolean
  user: User | null
  tasks: Task[]
  show_edit_modal: boolean
  editing_task_id: ID | null
  new_task_title: string
  selected_tasks: ID[]

  actions: {
    selectAllIncompleteTasks: () => void
    toggleTaskSelection: (id: ID) => void
    setNewTaskTitle: (title: string) => void
    startEditingTask: (task_id: ID) => void
    stopEditingTask: () => void
    checkSelectedTasks: () => void
    deleteSelectedTasks: () => void
    stopEditing: () => void
    uncheckCompletedTasks: () => void
    deleteCompletedTasks: () => void
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

  useEffect(() => {
    const subscription = observable.subscribe(value => setValue(value))
    return () => subscription.unsubscribe()
  }, [])

  return value
}

export const Provider: React.FunctionComponent = ({ children }) => {
  const [editing, setEditing] = useState(false)
  const [show_edit_modal, setShowEditModal] = useState(true)
  const [editing_task_id, setEditingTaskId] = useState(
    "Cb16f3XEAzq9IfxwWO0j" as ID | null,
  )
  const [new_task_title, setNewTaskTitle] = useState("")
  const [selected_tasks, setSelectedTasks] = useState([] as ID[])

  const user = useObservable(user_stream, null)
  const tasks = useObservable(current_user_tasks_stream, [])

  return (
    <Context.Provider
      value={{
        editing,
        user,
        tasks,
        show_edit_modal,
        editing_task_id,
        new_task_title,
        selected_tasks,

        actions: {
          selectAllIncompleteTasks: () => {
            setSelectedTasks(ids =>
              uniq(
                ids.concat(
                  tasks.filter(task => !task.complete).map(task => task.id),
                ),
              ),
            )
          },

          deleteCompletedTasks: () => {
            const batch = firestore.batch()

            tasks
              .filter(task => task.complete)
              .forEach(task => {
                batch.delete(firestore.collection("tasks").doc(task.id))
              })

            batch.commit()
          },

          uncheckCompletedTasks: () => {
            const batch = firestore.batch()

            selected_tasks.forEach(id => {
              batch.update(firestore.collection("tasks").doc(id), {
                complete: false,
                updated_at: Date.now(),
              })
            })

            batch.commit()
          },

          checkSelectedTasks: () => {
            const batch = firestore.batch()

            selected_tasks.forEach(id => {
              batch.update(firestore.collection("tasks").doc(id), {
                complete: true,
                updated_at: Date.now(),
              })
            })

            batch.commit()

            setEditing(false)
            setSelectedTasks([])
          },

          deleteSelectedTasks: () => {
            const batch = firestore.batch()

            selected_tasks.forEach(id => {
              batch.delete(firestore.collection("tasks").doc(id))
            })

            batch.commit()

            setEditing(false)
            setSelectedTasks([])
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

// auth_stream.subscribe(user => console.log("auth_stream", user))

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

// current_user_tasks_stream.subscribe(tasks =>
//   console.log("current_user_tasks_stream", tasks),
// )
