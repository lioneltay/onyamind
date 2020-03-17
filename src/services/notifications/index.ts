export const createTaskNotification = async (task: Task) => {
  console.log(Notification.permission)
  if (Notification.permission !== "granted") {
    await Notification.requestPermission()
  }

  new Notification(task.title, {
    requireInteraction: true,
    body: task.notes,
    renotify: true,
    tag: task.id,
  })
}

export const createTaskNotifications = async (tasks: Task[]) => {
  if (Notification.permission !== "granted") {
    await Notification.requestPermission()
  }

  tasks.forEach((task, index) =>
    setTimeout(() => createTaskNotification(task), index * 1000),
  )
}
