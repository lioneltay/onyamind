import React, { useRef, useEffect, useState } from "react"
import styled from "styled-components"
import { useGesture } from "lib/useGesture"

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 50px;
`

const Item = styled.div`
  height: 200vh;
  width: 100%;
  background: linear-gradient(to bottom, black, grey);
  border: 1px solid black;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
`

export default () => {
  const bind = useGesture({
    // onPointerDown: () => {
    //   console.log("onPointerDown")
    // },

    // onPointerMove: () => {
    //   console.log("onPointerMove")
    // },

    // onPointerUp: () => {
    //   console.log("onPointerUp")
    // },

    onPress: () => {
      console.log("onPress")
    },

    onSwipe: () => {
      console.log("onSwipe")
    },

    onHold: () => {
      console.log("onHold")
    },

    onSwipeLeft: () => {
      console.log("onSwipeLeft")
    },

    onSwipeRight: () => {
      console.log("onSwipeRight")
    },

    onPull: ({ distance, displacement }) => {
      console.log("onPull", distance, displacement)
    },
  })

  return (
    <React.Fragment>
      <Toggler>
        <Container>
          <Item {...bind({ ref: el => console.log("MY REF", el) })}>
            <div style={{ height: 200, width: 200, background: "red" }} />
          </Item>
        </Container>
      </Toggler>
    </React.Fragment>
  )
}

const Toggler: React.FunctionComponent = ({ children }) => {
  const [show, setShow] = useState(true)

  return (
    <React.Fragment>
      <button onClick={() => setShow(show => !show)}>Toggle</button>
      {show && children}
    </React.Fragment>
  )
}
