import React from "react"
import { styled } from "theme"

import { Formik, Form } from "formik"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Modal from "lib/components/Modal"

type Values = {
  title: string
  notes: string
}

type Props = {
  open: boolean
  onClose: () => void
  initialValues: Partial<Values>
  onSubmit: (values: Values) => Promise<void> | void
}

const CreateTaskModal: React.FunctionComponent<Props> = ({
  open,
  onClose,
  initialValues,
  onSubmit,
}) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      style={{ width: 500, maxWidth: "100%" }}
      title="New Task"
    >
      {open && (
        <Formik<Values>
          initialValues={{ title: "", notes: "", ...initialValues }}
          onSubmit={async (values, actions) => {
            await onSubmit(values)
            actions.setSubmitting(false)
          }}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form>
              <div>
                <TextField
                  autoFocus
                  label="Task"
                  placeholder="Task"
                  fullWidth
                  variant="outlined"
                  value={values.title}
                  onChange={(e) => setFieldValue("title", e.target.value)}
                />
              </div>

              <div className="mt-3">
                <TextField
                  label="Notes"
                  fullWidth
                  multiline={true}
                  rows={3}
                  rowsMax={5}
                  variant="outlined"
                  placeholder="Add notes"
                  value={values.notes}
                  onChange={(e) => setFieldValue("notes", e.target.value)}
                />
              </div>

              <div className="fj-e mt-2">
                <Button
                  variant="outlined"
                  color="primary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  Save
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Modal>
  )
}

export default CreateTaskModal
