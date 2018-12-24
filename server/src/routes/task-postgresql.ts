import { Express } from "express"
import { query, sql } from "services/db"

export default (app: Express) => {
  app.post("/task/getTasks", (req, res) => {
    query(sql`SELECT * FROM Task`).then(result => {
      console.dir(result)
      res.send(result)
    })
  })

  app.post("/task/getTask", (req, res) => {
    const { task_id } = req.body

    query(sql`SELECT * FROM Task WHERE id = $1`, [task_id]).then(([task]) => {
      if (!task) {
        throw Error("No such task list")
      }
      res.send(task)
    })
  })

  app.post("/task/addTask", (req, res, next) => {
    const { task } = req.body

    if (!task || !task.title) {
      throw Error("Invalid task input")
    }

    query(
      sql`
        INSERT INTO Task(title) VALUES ($1)
        RETURNING id, title;
      `,
      [task.title]
    )
      .then(([task]) => res.send(task))
      .catch(next)
  })

  app.post("/task/removeTask", (req, res, next) => {
    const { task_id } = req.body

    query(sql`DELETE FROM Task WHERE id = $1`, [task_id])
      .then(() => res.send({ id: task_id }))
      .catch(next)
  })

  app.post("/task/editTask", (req, res, next) => {
    const {
      task_id,
      data: { title },
    } = req.body

    query(
      sql`
        UPDATE Task
        SET title = $1
        WHERE id = $2
        RETURNING *
      `,
      [title, task_id]
    )
      .then(([task]) => res.send(task))
      .catch(next)
  })

  app.post("/task/addTask", (req, res, next) => {
    const { task_id, title } = req.body

    if (!title) {
      throw Error("Title must be present")
    }

    if (!task_id) {
      throw Error("task_id must be presetn")
    }

    query(sql`INSERT INTO Task(task_id, title) VALUES ($1, $2);`, [
      task_id,
      title,
    ])
      .then(result => {
        console.dir(result)
        res.send(result)
      })
      .catch(next)
  })

  app.post("/task/mockData", (req, res, next) => {
    query(sql`
      INSERT INTO Task(title) VALUES
        ('Learn Firestore'),
        ('Learn PostgreSQL');
    `)
      .then(() => res.send("Mock data populated"))
      .catch(next)
  })
}
