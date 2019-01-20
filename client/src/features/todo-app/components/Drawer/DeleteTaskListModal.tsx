import React from "react"

import Modal from "@material-ui/core/Modal"
import Typography from "@material-ui/core/Typography"
import Button from "@material-ui/core/Button"
import Paper from "@material-ui/core/Paper"

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
    <Modal className="fj-c fa-c" open={open} onClose={onClose}>
      <Paper className="p-3">
        <Typography variant="h6">Delete {task_list_name}</Typography>

        <Typography className="mt-3" variant="caption">
          Are you sure you want to delete this list?
        </Typography>

        <div className="fj-e mt-3">
          <Button color="primary" onClick={onClose}>
            Cancel
          </Button>
          <Button color="primary" onClick={onConfirmDelete}>
            Confirm
          </Button>
        </div>
      </Paper>
    </Modal>
  )
}

export default DeleteTaskListModal
