import { firebase, firestore, dataWithId } from "./firebase"

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
//         number_of_incomplete_tasks: firebase.firestore.FieldValue.delete(),
//         number_of_complete_tasks: firebase.firestore.FieldValue.delete(),
//       })
//     })

//     return batch.commit()
//   })
//   .then(() => console.log("done"))
