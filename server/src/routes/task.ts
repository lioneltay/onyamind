import { Express } from "express"
import { query, sql } from "services/db"

export default (app: Express) => {
  app.post("/task/getTaskLists", (req, res) => {
    query(sql`SELECT * FROM TaskList`).then(result => {
      console.dir(result)
      res.send(result)
    })
  })

  app.post("/task/getTaskList", (req, res) => {
    const { task_list_id } = req.body

    query(sql`SELECT * FROM Task WHERE id = $1`, [task_list_id]).then(
      ([task_list]) => {
        if (!task_list) {
          throw Error("No such task list")
        }
        res.send(task_list)
      }
    )
  })

  app.post("/task/addTaskList", (req, res, next) => {
    const { task } = req.body

    if (!task || !task.title) {
      throw Error("Invalid task input")
    }

    query(
      sql`
        INSERT INTO TaskList(title) VALUES ($1)
        RETURNING id, title;
      `,
      [task.title]
    )
      .then(([task_list]) => res.send(task_list))
      .catch(next)
  })

  app.post("/task/removeTaskList", (req, res, next) => {
    const { task_list_id } = req.body

    query(sql`DELETE FROM TaskList WHERE id = $1`, [task_list_id])
      .then(() => res.send("delete succesful"))
      .catch(next)
  })

  app.post("/task/addTask", (req, res, next) => {
    const { task_list_id, title } = req.body

    if (!title) {
      throw Error("Title must be present")
    }

    if (!task_list_id) {
      throw Error("task_list_id must be presetn")
    }

    query(sql`INSERT INTO Task(task_list_id, title) VALUES ($1, $2);`, [
      task_list_id,
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
      INSERT INTO TaskList(title) VALUES
        ('Learning'),
        ('Shopping List');

      INSERT INTO Task(task_list_id, title, description) VALUES
        (1, 'PostgreSQL', 'The coolest elephant database around'),
        (1, 'Google Cloud Platform', 'AWS What?'),
        (1, 'React', 'A library for building UI'),
        (2, 'Milk', 'Gotta have some for that cereal'),
        (2, 'Bread', 'Toast!')
    `)
      .then(() => res.send("Mock data populated"))
      .catch(next)
  })
}
