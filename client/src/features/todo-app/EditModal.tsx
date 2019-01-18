import React, { Fragment } from "react"
import styled from "styled-components"

import { Formik, Form } from "formik"
import { Button } from "./widgets"

import { Modal } from "lib/components"
import { Task } from "./types"
import { IconButton } from "./widgets"
import { grey_text } from "./constants"
import { Divider } from "@material-ui/core"

const Textarea = styled.textarea`
  resize: none;
  width: 100%;
  border-radius: 5px;
  border: 1px solid #ddd;
  height: 100px;
  padding: 8px;
  font-size: 16px;
`

const Input = styled.input`
  width: 100%;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
  padding: 8px;
`

const Container = styled.div``

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
          <Container>
            <div className="fj-sb fa-c pl-3">
              <div style={{ color: grey_text }}>
                {isSubmitting ? "Saving..." : "Saved"}
              </div>

              <IconButton className="fas fa-times" />
            </div>

            <Divider />

            <Form
              className="px-3 pb-3"
              style={{ width: 500, maxWidth: "100%" }}
            >
              <div className="mt-3">
                <label>
                  <div>
                    <strong>Task</strong>
                  </div>
                  <Input
                    value={values.title}
                    onChange={e => setFieldValue("title", e.target.value)}
                  />
                </label>
              </div>

              <div className="mt-3">
                <label>
                  <div>
                    <strong>Notes</strong>
                  </div>
                  <Textarea
                    placeholder="Add notes"
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
          </Container>
        )}
      </Formik>
    </Modal>
  )
}

export default EditModal
