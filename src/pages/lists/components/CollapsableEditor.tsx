import React from "react"

import Collapse from "@material-ui/core/Collapse"

import { Formik, Form } from "formik"
import Button from "@material-ui/core/Button"
import TextField from "@material-ui/core/TextField"

type Values = Omit<Task, "id">

type Props = {
  open: boolean
  task: Values
  onSubmit: (values: Values) => Promise<void> | void
}

const CollapsableEditor: React.FunctionComponent<Props> = ({
  open,
  onSubmit,
  task,
}) => {
  return (
    <Collapse in={open}>
      <Formik<Values>
        initialValues={task}
        onSubmit={async (values, actions) => {
          await onSubmit(values)
          actions.setSubmitting(false)
        }}
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Form
            style={{
              paddingTop: 16,
              paddingBottom: 8,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >
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
        )}
      </Formik>
    </Collapse>
  )
}

export default CollapsableEditor
