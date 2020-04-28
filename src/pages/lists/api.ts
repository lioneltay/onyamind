import { firestore, dataWithId } from "services/firebase"

type OnTasksChangeInput = {
  userId: ID
  listId: ID
  onChange: (tasks: Task[]) => void
}
export const onTasksChange = ({
  userId,
  listId,
  onChange,
}: OnTasksChangeInput) => {
  return firestore
    .collection("task")
    .where("listId", "==", listId)
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .onSnapshot((snapshot) => {
      const tasks = snapshot.docs.map((doc) => dataWithId(doc) as Task)
      onChange(tasks)
    })
}
