let registration: ServiceWorkerRegistration | null = null

export const registerServiceWorker = (reg: ServiceWorkerRegistration) => {
  registration = reg
}

export const createTaskNotification = async (task: Task) => {
  if (Notification.permission !== "granted") {
    await Notification.requestPermission()
  }

  registration?.showNotification(task.title, {
    requireInteraction: true,
    body: task.notes,
    renotify: true,
    tag: task.id,
    data: task,
    // Shows in notification
    badge: "/public/favicon/favicon.ico",
    // Shows in notification bar
    icon: "/public/favicon/favicon.ico",
    // Large image to show in notification
    // image: "/public/favicon.png",
    actions: [
      {
        title: "Dismiss",
        action: "DISMISS",
      },
      {
        title: "Complete",
        action: "COMPLETE_TASK",
      },
    ],
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
