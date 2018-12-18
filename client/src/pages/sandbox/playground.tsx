import React from "react"

export default class Playground extends React.Component {
  render() {
    return (
      <div>
        <h1>Playground</h1>
      </div>
    )
  }
}

class C {
  c: string

  constructor() {
    this.c = "c"
  }

  sayC() {
    console.log("c")
  }
}

class B extends C {
  b: string

  constructor() {
    super()

    this.b = "b"
  }

  sayB() {
    console.log("b")
  }
}

class A extends B {
  a: string

  constructor() {
    super()

    this.a = "a"
  }

  sayA() {
    console.log("a")
  }
}