import React from "react"

import MModal from "@material-ui/core/Modal"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import Paper from "@material-ui/core/Paper"
import Divider from "@material-ui/core/Divider"

import Clear from "@material-ui/icons/Clear"

type Props = Stylable & {
  open: boolean
  onClose: () => void
  title: React.ReactNode
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
      <Paper style={style} className={className}>
        <div className="fj-sb fa-c pl-3">
          <Typography variant="h6">{title}</Typography>

          <IconButton onClick={onClose}>
            <Clear />
          </IconButton>
        </div>

        <Divider />

        <div className="p-3">
          {children}

          <div className="fj-e mt-2">{actions}</div>
        </div>
      </Paper>
    </MModal>
  )
}

export default Modal
