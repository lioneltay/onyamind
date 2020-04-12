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
  subject: string
  description: string
}

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (values: Values, actions: FormikHelpers<Values>) => Promise<void>
}

export default ({ open, onClose, onSubmit }: Props) => {
  return (
    <Modal
      className="p-3"
      style={{ width: 500, maxWidth: "100%" }}
      open={open}
      onClose={onClose}
      title="Feedback"
    >
      <Formik<Values>
        initialValues={{ subject: "", description: "" }}
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
                label="Subject"
                placeholder="Subject"
                value={values.subject}
                onChange={(e) =>
                  setFieldValue("subject", e.currentTarget.value)
                }
              />
            </div>

            <div className="mt-3">
              <TextField
                label="Description"
                fullWidth
                multiline={true}
                rows={3}
                rowsMax={5}
                variant="outlined"
                placeholder="Description"
                value={values.description}
                onChange={(e) => setFieldValue("description", e.target.value)}
              />
            </div>

            <div className="fj-e">
              <Button color="primary" onClick={onClose}>
                Cancel
              </Button>
              <Button disabled={isSubmitting} color="primary" type="submit">
                Submit
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}
