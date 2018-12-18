const express = require("express")

const app = express()

app.use(express.static("./dist"))

app.get("*", (req, res) => {
  res.sendFile("./dist/index.html")
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
