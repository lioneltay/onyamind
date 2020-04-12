const admin = require("firebase-admin")

const serviceAccount = require("./private/onyamind-staging-firebase-adminsdk-wu0e4-411f930fcd.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://onyamind-staging.firebaseio.com",
})

module.exports = admin
