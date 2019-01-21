import React from "react"

import Modal from "../Modal"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"

type Props = {
  open: boolean
  onClose: () => void
  onConfirmDelete: () => void
  task_list_name?: string
}

const DeleteTaskListModal: React.FunctionComponent<Props> = ({
  open,
  onClose,
  onConfirmDelete,
  task_list_name = "list",
}) => {
  return (
    <Modal
      style={{ width: 300, maxWidth: "100%" }}
      open={open}
      onClose={onClose}
      title={`Delete ${task_list_name}`}
      actions={
        <Button variant="outlined" color="primary" onClick={onConfirmDelete}>
          Confirm
        </Button>
      }
    >
      <Typography className="mt-3" variant="body2">
        Are you sure you want to delete this list?
      </Typography>
    </Modal>
  )
}

export default DeleteTaskListModal
