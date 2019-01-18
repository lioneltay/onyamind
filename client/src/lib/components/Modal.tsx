import React from "react"
import styled from "styled-components"

const Container = styled.div`
  z-index: 9000;
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

const Modal: React.FunctionComponent<Props> = ({
  children,
  open,
  onClose,
  className,
  style,
}) => {
  if (!open) {
    return null
  }

  return (
    <Container onClick={onClose}>
      <Content
        onClick={e => e.stopPropagation()}
        className={className}
        style={style}
      >
        {children}
      </Content>
    </Container>
  )
}

export default Modal
