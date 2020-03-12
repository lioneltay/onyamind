import React from "react"

import { Form, Formik, FormikActions } from "formik"

import {Text} from "lib/components"
import Modal from "@material-ui/core/Modal"
import Paper from "@material-ui/core/Paper"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"

type Values = {
  name: string
  primary: boolean
}

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (values: Values, actions: FormikActions<Values>) => Promise<void>
}

const CreateTaskListModal: React.FunctionComponent<Props> = ({
  open,
  onClose,
  onSubmit,
}) => {
  return (
    <Modal className="fj-c fa-c" open={open} onClose={onClose}>
      <Formik<Values>
        initialValues={{ name: "", primary: false }}
        onSubmit={async (values, actions) => {
          await onSubmit(values, actions)
          actions.setSubmitting(false)
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Paper className="p-3" style={{ width: 500, maxWidth: "100%" }}>
            <Form>
              <Text variant="h6">Create a new list</Text>

              <div className="mt-3">
                <TextField
                  autoFocus
                  required
                  fullWidth
                  variant="outlined"
                  label="Name"
                  value={values.name}
                  onChange={e => setFieldValue("name", e.currentTarget.value)}
                />
              </div>

              <div className="mt-3">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.primary}
                      onChange={(e, checked) =>
                        setFieldValue("primary", checked)
                      }
                      color="primary"
                    />
                  }
                  label="Make this my primary list"
                />
              </div>

              <div className="fj-e">
                <Button color="primary" onClick={onClose}>
                  Cancel
                </Button>
                <Button disabled={isSubmitting} color="primary" type="submit">
                  Create
                </Button>
              </div>
            </Form>
          </Paper>
        )}
      </Formik>
    </Modal>
  )
}

export default CreateTaskListModal
