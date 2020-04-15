import React from "react"
import { noUndefinedValues } from "lib/utils"

import { Formik, Form } from "formik"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Modal from "lib/components/Modal"

type Values = {
  title?: string
  notes?: string
}

type Props = {
  title: string
  open: boolean
  onClose: () => void
  initialValues?: Values
  onSubmit: (values: Values) => Promise<void> | void
}

const EditModal: React.FunctionComponent<Props> = ({
  title,
  open,
  onClose,
  initialValues,
  onSubmit,
}) => {
  return (
    <Formik<Values>
      initialValues={{
        title: "",
        notes: "",
        ...noUndefinedValues(initialValues),
      }}
      onSubmit={async (values, actions) => {
        await onSubmit(values)
        actions.setSubmitting(false)
      }}
    >
      {({ setFieldValue, values, isSubmitting }) => (
        <Modal
          open={open}
          onClose={onClose}
          style={{ width: 500, maxWidth: "100%" }}
          title={title}
        >
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
                placeholder="Notes"
                fullWidth
                multiline={true}
                rows={3}
                rowsMax={5}
                variant="outlined"
                value={values.notes}
                onChange={(e) => setFieldValue("notes", e.target.value)}
              />
            </div>

            <div className="fj-e mt-4">
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
        </Modal>
      )}
    </Formik>
  )
}

export default EditModal
