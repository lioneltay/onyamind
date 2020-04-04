const axios = require("axios")

axios
  .post(
    `https://api.github.com/repos/lioneltay/onyamind/issues?access_token=3151fb7f8e57049bd4da35435ba39ee24255ad74`,
    {
      title: "playasdkfjasd",
      body: "whydafsdf",
      milestone: 1,
      labels: ["feedback"],
    },
  )
  .then(console.log, console.error)
