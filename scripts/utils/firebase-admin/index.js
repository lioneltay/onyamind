const admin = require("firebase-admin")

const serviceAccount = require("./onyamind-staging-firebase-adminsdk-ihuyg-0b7d0a9368")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://onyamind-staging.firebaseio.com",
})

module.exports = admin
