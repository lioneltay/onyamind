import React, { useState } from "react"
import styled from "styled-components"
import { Transition } from "react-spring"

import { LoginWidget } from "services/components"
import { Modal } from "lib/components"
import { firebase, firestore, dataWithId } from "services/firebase"
import { Task, ID, User } from "./types"

import TaskItem from "./Task"
import TaskAdder from "./TaskAdder"

import { Observable, combineLatest } from "rxjs"
import { switchMap, map } from "rxjs/operators"
import { withPropsStream } from "lib/hocs"

import { Formik, Form } from "formik"
import { Input, Button, Checkbox } from "./widgets"

const PageContainer = styled.div`
  display: flex;
  justify-content: center;

  padding-top: 50px;
  padding-bottom: 50px;

  background: linear-gradient(#71afd1, #3ae7bb);
  min-height: 100vh;
`

const Container = styled.div`
  width: 100%;
  max-width: 600px;
`

const HeaderContainer = styled.div`
  padding: 10px 20px;
  background: teal;
  font-size: 25px;
`

const Header = styled.div`
  color: white;
`

const TaskContainer = styled.div`
  background: white;
  padding: 20px 20px;
`

const addTask = async (
  task: Omit<Task, "id" | "created_at" | "updated_at" | "complete">,
): Promise<Task> => {
  return firestore
    .collection("tasks")
    .add({
      ...task,
      uid: task.uid || null,
      completed: false,
      created_at: Date.now(),
      updated_at: Date.now(),
    })
    .then(async x => {
      return dataWithId(await x.get()) as Task
    })
    .catch(err => {
      console.log(err)
      return err
    })
}

const editTask = async (
  task_id: ID,
  task_data: Partial<Omit<Task, "id">>,
): Promise<Task> => {
  await firestore
    .collection("tasks")
    .doc(task_id)
    .update({
      ...task_data,
      updated_at: Date.now(),
    })

  const edited_task = await firestore
    .collection("tasks")
    .doc(task_id)
    .get()
    .then(dataWithId)

  return edited_task as Task
}

const removeTask = async (task_id: ID): Promise<ID> => {
  await firestore
    .collection("tasks")
    .doc(task_id)
    .delete()
  return task_id
}

type Props = {
  tasks: Task[]
  user?: User
}

const TaskPage: React.FunctionComponent<Props> = ({ user, tasks }) => {
  const [title, setTitle] = useState("")
  const [show_edit_modal, setShowEditModal] = useState(false)
  const [editing_task_id, setEditingTaskId] = useState(null as null | ID)

  return (
    <PageContainer>
      <Container>
        <HeaderContainer>
          <Header className="fj-sb fa-c">
            <span>Tasks</span>

            {user && user.uid ? (
              <>
                <span style={{ fontSize: 16 }}>{user.email}</span>

                <Button
                  style={{ color: "white" }}
                  onClick={() => firebase.auth().signOut()}
                >
                  Logout
                </Button>
              </>
            ) : (
              <LoginWidget />
            )}
          </Header>
        </HeaderContainer>

        <TaskContainer>
          <TaskAdder
            title={title}
            onChange={setTitle}
            onAdd={title => {
              setTitle("")
              return addTask({
                title,
                description: "",
                uid: user ? user.uid : null,
              }).then(() => {})
            }}
          />

          <div className="my-3" style={{ height: 1, background: "#eee" }} />

          <Transition
            items={tasks.sort((a, b) => (a.created_at > b.created_at ? -1 : 1))}
            keys={task => task.id}
            from={{ opacity: 0, backgroundColor: "lightgreen" }}
            enter={{ opacity: 1, backgroundColor: "white" }}
            leave={{ opacity: 0, backgroundColor: "tomato" }}
          >
            {task => props => (
              <TaskItem
                key={task.id}
                style={props}
                task={task}
                onRequestEdit={id => {
                  setShowEditModal(true)
                  setEditingTaskId(id)
                }}
                onEdit={data => editTask(task.id, data)}
                onRemove={() => removeTask(task.id)}
              />
            )}
          </Transition>
        </TaskContainer>
      </Container>

      {(() => {
        const task = tasks.find(task => task.id === editing_task_id)
        return task && editing_task_id ? (
          <EditModal
            className="p-4"
            initialValues={task}
            open={show_edit_modal}
            onClose={() => setShowEditModal(false)}
            onSubmit={async values => {
              await editTask(editing_task_id, values)
              setShowEditModal(false)
            }}
          />
        ) : null
      })()}
    </PageContainer>
  )
}

type Values = Omit<Task, "id">

type EditModalProps = Stylable & {
  open: boolean
  onClose: () => void
  initialValues: Values
  onSubmit: (values: Values) => Promise<void> | void
}

const EditModal: React.FunctionComponent<EditModalProps> = ({
  className,
  style,
  open,
  onClose,
  initialValues,
  onSubmit,
}) => {
  return (
    <Modal open={open} onClose={onClose} className={className} style={style}>
      <Formik<Values>
        initialValues={initialValues}
        onSubmit={async (values, actions) => {
          await onSubmit(values)
          actions.setSubmitting(false)
        }}
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Form>
            <h1>Edit Task</h1>

            <div className="mt-2">
              <label>
                <strong>Completed:</strong>
                <Checkbox
                  style={{ display: "inline" }}
                  className="mr-3"
                  checked={values.complete}
                  onChange={complete => setFieldValue("complete", complete)}
                />
              </label>
            </div>

            <div className="mt-2">
              <label>
                <div>
                  <strong>Title:</strong>
                </div>
                <Input
                  value={values.title}
                  onChange={e => setFieldValue("title", e.target.value)}
                />
              </label>
            </div>

            <div className="mt-2">
              <label>
                <div>
                  <strong>Description:</strong>
                </div>
                <Input
                  value={values.description}
                  onChange={e => setFieldValue("description", e.target.value)}
                />
              </label>
            </div>

            <div className="fj-e mt-2">
              <Button type="submit" disabled={isSubmitting}>
                Save
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

const auth_stream = new Observable<User | undefined>(observer => {
  return firebase
    .auth()
    .onAuthStateChanged(user => observer.next(user ? user : undefined))
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

const current_user_tasks_stream = auth_stream.pipe(
  switchMap(user => createTasksStream(user ? user.uid : undefined)),
)

// current_user_tasks_stream.subscribe(tasks =>
//   console.log("current_user_tasks_stream", tasks),
// )

const props_stream: Observable<Props> = combineLatest(
  current_user_tasks_stream,
  auth_stream,
).pipe(map(([tasks, user]) => ({ tasks, user }))) as Observable<Props>

// props_stream.subscribe(props => console.log("props_stream", props))

export default withPropsStream(props_stream)(TaskPage)
