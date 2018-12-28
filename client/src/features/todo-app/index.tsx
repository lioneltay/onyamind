import React from "react"
import { LoginWidget } from "services/components"
import styled from "styled-components"
import { firebase, firestore, dataWithId } from "services/firebase"
import { Task, ID, User } from "./types"

import TaskItem from "./Task"
import TaskAdder from "./TaskAdder"

import { Observable, of, combineLatest } from "rxjs"
import { switchMap, map } from "rxjs/operators"
import { withPropsStream } from "lib/hocs"

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

type Props = {
  tasks: Task[]
  user?: User
}

type State = {
  title: string
}

class TaskPage extends React.Component<Props, State> {
  state: State = {
    title: "",
  }

  addTask = async (
    task: Omit<Task, "id" | "created_at" | "updated_at" | "complete">,
  ): Promise<Task> => {
    this.setState({ title: "" })

    console.log("addTask", task)

    return firestore
      .collection("tasks")
      .add({
        ...task,
        uid: this.props.user ? this.props.user.uid : null,
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

  editTask = async (
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

  removeTask = async (task_id: ID): Promise<ID> => {
    await firestore
      .collection("tasks")
      .doc(task_id)
      .delete()
    return task_id
  }

  render() {
    console.log("this.props", this.props)

    return (
      <PageContainer>
        <Container>
          <HeaderContainer>
            <Header className="fj-sb fa-c">
              <span>Tasks</span>

              {this.props.user && this.props.user.uid ? (
                <>
                  <span>{this.props.user.email}</span>

                  <button
                    style={{ color: "white" }}
                    onClick={() => {
                      console.log("logout")
                      firebase.auth().signOut()
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <LoginWidget />
              )}
            </Header>
          </HeaderContainer>

          <TaskContainer>
            <TaskAdder
              title={this.state.title}
              onChange={title => this.setState({ title })}
              onAdd={title => this.addTask({ title }).then(() => {})}
            />

            <div className="my-3" style={{ height: 1, background: "#eee" }} />

            {this.props.tasks
              .sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
              .map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={data => this.editTask(task.id, data)}
                  onRemove={() => this.removeTask(task.id)}
                />
              ))}
          </TaskContainer>
        </Container>
      </PageContainer>
    )
  }
}

const auth_stream = new Observable<User | undefined>(observer => {
  return firebase
    .auth()
    .onAuthStateChanged(user => observer.next(user ? user : undefined))
})

auth_stream.subscribe(user => console.log("auth_stream", user))

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

props_stream.subscribe(props => console.log("props_stream", props))

export default withPropsStream(props_stream)(TaskPage)
