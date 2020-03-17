export const createTaskNotification = async (task: Task) => {
  if (!Notification.permission) {
    console.log('REQUESTIONG PERMISSION')
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
  tasks.forEach((task, index) =>
    setTimeout(() => createTaskNotification(task), index * 1000),
  )
}
