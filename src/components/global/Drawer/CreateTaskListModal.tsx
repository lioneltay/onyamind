import React from "react"

import { Form, Formik, FormikHelpers } from "formik"

import {
  Paper,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core"

import { Modal, Text } from "lib/components"

type Values = {
  name: string
  primary: boolean
}

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (values: Values, actions: FormikHelpers<Values>) => Promise<void>
}

const CreateTaskListModal: React.FunctionComponent<Props> = ({
  open,
  onClose,
  onSubmit,
}) => {
  return (
    <Modal
      className="p-3"
      style={{ width: 500, maxWidth: "100%" }}
      open={open}
      onClose={onClose}
      title="Create a new list"
    >
      <Formik<Values>
        initialValues={{ name: "", primary: false }}
        onSubmit={async (values, actions) => {
          await onSubmit(values, actions)
          actions.setSubmitting(false)
        }}
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form>
            <div className="mt-3">
              <TextField
                autoFocus
                required
                fullWidth
                variant="outlined"
                label="Name"
                placeholder="Name"
                value={values.name}
                onChange={(e) => setFieldValue("name", e.currentTarget.value)}
              />
            </div>

            <div className="mt-3">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={values.primary}
                    onChange={(e, checked) => setFieldValue("primary", checked)}
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
        )}
      </Formik>
    </Modal>
  )
}

export default CreateTaskListModal
