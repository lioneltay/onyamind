const admin = require("./utils/firebase-admin")

async function listAllUsers(nextPageToken) {
  try {
    const { users, pageToken } = await admin.auth().listUsers(10, nextPageToken)

    await Promise.all(users.map((user) => admin.auth().deleteUser(user.uid)))

    console.log("deleted batch")

    if (pageToken) {
      return listAllUsers(pageToken)
    }
  } catch (error) {
    console.log("Error listing users:", error)
  }
}

listAllUsers().then(() => process.exit())
