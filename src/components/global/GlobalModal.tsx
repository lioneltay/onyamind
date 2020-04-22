import React from "react"
import { noopTemplate as css } from "lib/utils"

import { Modal } from "lib/components"

import { useActions, useSelector } from "services/store"

export default () => {
  const {
    ui: { closeModal },
  } = useActions()

  const { modal } = useSelector((state) => ({
    modal: state.ui.modal,
  }))

  return (
    <Modal
      open={!!modal}
      onClose={closeModal}
      title={modal?.title}
      css={css`
        max-width: 600px;
        width: 100vw;
      `}
      actions={modal?.actions}
    >
      {modal?.content}
    </Modal>
  )
}
