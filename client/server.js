const express = require("express")
const path = require("path")

const app = express()

app.use(express.static(path.resolve(__dirname, "./")))

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./index.html"))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})
