import React from "react"

import { Form, Formik, FormikActions } from "formik"

import Modal from "../Modal"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"

import { TaskList } from "../../types"

type Values = {
  name: string
}

type Props = {
  task_list: TaskList
  open: boolean
  onClose: () => void
  onSubmit: (values: Values, actions: FormikActions<Values>) => Promise<void>
}

const RenameTaskListModal: React.FunctionComponent<Props> = ({
  open,
  onClose,
  onSubmit,
  task_list,
}) => {
  return (
    <Formik<Values>
      initialValues={{ name: task_list.name }}
      onSubmit={async (values, actions) => {
        await onSubmit(values, actions)
        actions.setSubmitting(false)
      }}
    >
      {({ values, setFieldValue, isSubmitting }) => (
        <Modal
          open={open}
          onClose={onClose}
          title="Rename list"
          style={{ width: 500, maxWidth: "100%" }}
        >
          <Form>
            <TextField
              required
              fullWidth
              variant="outlined"
              label="Name"
              value={values.name}
              onChange={e => setFieldValue("name", e.currentTarget.value)}
            />

            <div className="fj-e mt-2">
              <Button disabled={isSubmitting} color="primary" type="submit">
                Rename
              </Button>
            </div>
          </Form>
        </Modal>
      )}
    </Formik>
  )
}

export default RenameTaskListModal
