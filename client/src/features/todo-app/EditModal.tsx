import React from "react"

import { Formik, Form } from "formik"
import { Input, Button } from "./widgets"

import { Modal } from "lib/components"
import { Task } from "./types"

type Values = Omit<Task, "id">

type Props = Stylable & {
  open: boolean
  onClose: () => void
  initialValues: Values
  onSubmit: (values: Values) => Promise<void> | void
}

const EditModal: React.FunctionComponent<Props> = ({
  className,
  style,
  open,
  onClose,
  initialValues,
  onSubmit,
}) => {
  return (
    <Modal open={open} onClose={onClose} className={className} style={style}>
      <Formik<Values>
        initialValues={initialValues}
        onSubmit={async (values, actions) => {
          await onSubmit(values)
          actions.setSubmitting(false)
        }}
      >
        {({ setFieldValue, values, isSubmitting }) => (
          <Form style={{ width: 500, maxWidth: "100%" }}>
            <div className="mt-2">
              <label>
                <div>
                  <strong>Title:</strong>
                </div>
                <Input
                  value={values.title}
                  onChange={e => setFieldValue("title", e.target.value)}
                />
              </label>
            </div>

            <div className="mt-2">
              <label>
                <div>
                  <strong>Notes:</strong>
                </div>
                <Input
                  value={values.notes}
                  onChange={e => setFieldValue("notes", e.target.value)}
                />
              </label>
            </div>

            <div className="fj-e mt-2">
              <Button type="submit" disabled={isSubmitting}>
                Save
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default EditModal
