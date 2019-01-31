import { firestore, dataWithId } from "./firebase"

// firestore
//   .collection("tasks")
//   .get()
//   .then(tasks => {
//     return tasks.docs.map(dataWithId)
//   })
//   .then(tasks => {
//     const batch = firestore.batch()

//     tasks.forEach(task => {
//       batch.update(firestore.collection("tasks").doc(task.id), {
//         archived: false,
//       })
//     })

//     return batch.commit()
//   })
