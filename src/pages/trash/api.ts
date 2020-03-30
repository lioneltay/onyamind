import { firestore, dataWithId } from "services/firebase"

type OnTrashTasksChangeInput = {
  userId: ID
  onChange: (tasks: Task[]) => void
}
export const onTrashTasksChange = ({
  userId,
  onChange,
}: OnTrashTasksChangeInput) => {
  return firestore
    .collection("task")
    .where("userId", "==", userId)
    .where("archived", "==", true)
    .onSnapshot((snapshot) => {
      const tasks = snapshot.docs.map((doc) => dataWithId(doc) as Task)
      onChange(tasks)
    })
}
