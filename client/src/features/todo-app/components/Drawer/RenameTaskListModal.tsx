import React from "react"

import { Form, Formik, FormikActions } from "formik"

import Typography from "@material-ui/core/Typography"
import Modal from "@material-ui/core/Modal"
import Paper from "@material-ui/core/Paper"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"

import { TaskList } from "../../types"

type Values = {
  name: string
}

type Props = {
  task_list: TaskList
  open: boolean
  onClose: () => void
  onSubmit: (values: Values, actions: FormikActions<Values>) => Promise<void>
}

const RenameTaskListModal: React.FunctionComponent<Props> = ({
  open,
  onClose,
  onSubmit,
  task_list,
}) => {
  return (
    <Modal className="fj-c fa-c" open={open} onClose={onClose}>
      <Formik<Values>
        initialValues={{ name: task_list.name }}
        onSubmit={async (values, actions) => {
          await onSubmit(values, actions)
          actions.setSubmitting(false)
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <Paper className="p-3" style={{ width: 500, maxWidth: "100%" }}>
              <Typography variant="h6">Rename list</Typography>

              <div className="mt-3">
                <TextField
                  required
                  fullWidth
                  variant="outlined"
                  label="Name"
                  value={values.name}
                  onChange={e => setFieldValue("name", e.currentTarget.value)}
                />
              </div>

              <div className="fj-e">
                <Button color="primary" onClick={onClose}>
                  Cancel
                </Button>
                <Button disabled={isSubmitting} color="primary" type="submit">
                  Rename
                </Button>
              </div>
            </Paper>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default RenameTaskListModal
