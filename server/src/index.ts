import Express = require("express")

const app = Express()

app.get("*", (req, res) => {
  res.send("Hello there - Travis CI")
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
})
