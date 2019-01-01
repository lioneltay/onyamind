import React from "react"
import styled from "styled-components"

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
`

const Content = styled.div`
  background: white;
  max-width: 100%;
`

type Props = Stylable & {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export default class Modal extends React.Component<Props> {
  render() {
    return (
      this.props.open && (
        <Container onClick={this.props.onClose}>
          <Content
            onClick={e => e.stopPropagation()}
            className={this.props.className}
            style={this.props.style}
          >
            {this.props.children}
          </Content>
        </Container>
      )
    )
  }
}
