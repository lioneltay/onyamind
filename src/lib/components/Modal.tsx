import React from "react"

import MModal from "@material-ui/core/Modal"
import { Text } from "lib/components"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Paper from "@material-ui/core/Paper"
import Divider from "@material-ui/core/Divider"

import Clear from "@material-ui/icons/Clear"

type Props = Stylable & {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  actions?: React.ReactNode
}

const Modal: React.FunctionComponent<Props> = ({
  className,
  style,
  open,
  onClose,
  title,
  actions,
  children,
}) => {
  return (
    <MModal className="fj-c fa-c" open={open} onClose={onClose}>
      <Paper data-testid="modal" style={style} className={className}>
        <div className="fj-sb fa-c pl-3">
          <Text variant="h6">{title}</Text>

          <IconButton onClick={onClose}>
            <Clear />
          </IconButton>
        </div>

        <Divider />

        <div className="p-3">
          {children}

          {actions ? <div className="fj-e mt-2">{actions}</div> : null}
        </div>
      </Paper>
    </MModal>
  )
}

export default Modal
