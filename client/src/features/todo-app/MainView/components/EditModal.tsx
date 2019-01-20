import React from "react"
import styled from "styled-components"

import { Formik, Form } from "formik"
import Button from "@material-ui/core/Button"

import Modal from "@material-ui/core/Modal"
import Paper from "@material-ui/core/Paper"
import { Task } from "../../types"
import { grey_text } from "../../constants"
import { Divider } from "@material-ui/core"
import { useAppState } from "../../state"

import IconButton from "@material-ui/core/IconButton"
import TextField from "@material-ui/core/TextField"
import Clear from "@material-ui/icons/Clear"

const Container = styled(Paper)`
  max-width: 100%;
  width: 500px;
` as typeof Paper

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
  const {
    actions: { stopEditingTask },
  } = useAppState()

  return (
    <Modal className="fj-c fa-c" open={open} onClose={onClose}>
      <Formik<Values>
        initialValues={initialValues}
        onSubmit={async (values, actions) => {
          await onSubmit(values)
          actions.setSubmitting(false)
        }}
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Container>
            <div className="fj-sb fa-c pl-3">
              <div style={{ color: grey_text }}>
                {isSubmitting ? "Saving..." : "Saved"}
              </div>

              <IconButton onClick={stopEditingTask}>
                <Clear />
              </IconButton>
            </div>

            <Divider />

            <Form
              className="px-3 pb-3"
              style={{ width: 500, maxWidth: "100%" }}
            >
              <div className="mt-3">
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
          </Container>
        )}
      </Formik>
    </Modal>
  )
}

export default EditModal
