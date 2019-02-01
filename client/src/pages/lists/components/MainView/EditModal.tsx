import React from "react"
import { styled } from "theme"

import { Formik, Form } from "formik"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"
import Modal from "lib/components/Modal"

const StatusText = styled.div`
  color: ${({ theme }) => theme.grey_text};
  font-size: 1rem;
  font-weight: 400;
`

type Values = Omit<Task, "id">

type Props = {
  open: boolean
  onClose: () => void
  initialValues: Values
  onSubmit: (values: Values) => Promise<void> | void
}

const EditModal: React.FunctionComponent<Props> = ({
  open,
  onClose,
  initialValues,
  onSubmit,
}) => {
  return (
    <Formik<Values>
      initialValues={initialValues}
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
          title={
            <StatusText>{isSubmitting ? "Saving..." : "Saved"}</StatusText>
          }
        >
          <Form>
            <div>
              <TextField
                autoFocus
                label="Task"
                fullWidth
                variant="outlined"
                value={values.title}
                onChange={e => setFieldValue("title", e.target.value)}
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
                onChange={e => setFieldValue("notes", e.target.value)}
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
        </Modal>
      )}
    </Formik>
  )
}

export default EditModal
