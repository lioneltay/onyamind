const express = require("express")
const path = require('path')

const app = express()

app.use(express.static("./dist"))

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, './dist/index.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
