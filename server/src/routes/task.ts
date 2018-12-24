import { Express } from "express"
import { query, sql } from "services/db"

import { firestore, dataWithID } from "services/firestore"

export default (app: Express) => {
  app.post("/task/getTasks", (req, res, next) => {
    console.log("getTasks")

    firestore
      .collection("tasks")
      .get()
      .then(result => {
        return result.docs.map(dataWithID)
      })
      .then(tasks => res.send(tasks))
      .catch(next)
  })

  app.post("/task/getTask", (req, res, next) => {
    const { task_id } = req.body

    firestore
      .collection("tasks")
      .doc(task_id)
      .get()
      .then(doc => {
        const data = dataWithID(doc)
        if (!data) {
          throw Error("No such task")
        }

        res.send(data)
      })
      .catch(next)
  })

  app.post("/task/addTask", (req, res, next) => {
    console.log("addTask")
    const { task } = req.body

    if (!task || !task.title) {
      throw Error("Invalid task input")
    }

    delete task.id
    const now = Date.now()
    const new_task = {
      title: "",
      checked: false,
      created_at: Date.now(),
      updated_at: now,
      ...task,
    }

    firestore
      .collection("tasks")
      .add(new_task)
      .then(result => result.get())
      .then(result => res.send(dataWithID(result)))
      .catch(next)
  })

  app.post("/task/removeTask", (req, res, next) => {
    const { task_id } = req.body

    firestore
      .collection("tasks")
      .doc(task_id)
      .delete()
      .then(() => res.send({ id: task_id }))
      .catch(next)
  })

  app.post("/task/editTask", (req, res, next) => {
    const { task_id, data } = req.body

    const task_collection = firestore.collection("tasks")

    task_collection
      .doc(task_id)
      .update({ ...data, updated_at: Date.now() })
      .then(() => task_collection.doc(task_id).get())
      .then(ref => res.send(dataWithID(ref)))
      .catch(next)
  })

  app.post("/task/mockData", (req, res, next) => {
    const task_collection = firestore.collection("tasks")

    Promise.all([
      task_collection.doc("1-manualid").set({
        title: "Learn Firestore",
        completed: false,
      }),

      task_collection.doc("2-manualid").set({
        title: "Learn PostgreSQL",
        completed: true,
      }),
    ])
      .then(() => res.send("Mock data populated"))
      .catch(next)
  })
}
