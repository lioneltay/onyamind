import React from "react"
import { noUndefinedValues, noopTemplate as css } from "lib/utils"

import { Formik, Form } from "formik"
import { InputBase, IconButton } from "@material-ui/core"
import { FullScreenModal, FullScreenModalProps, Button } from "lib/components"
import { SubjectIcon } from "lib/icons"

type Values = {
  title?: string
  notes?: string
}

type Props = Omit<FullScreenModalProps, "children" | "onSubmit"> & {
  initialValues?: Values
  onSubmit: (values: Values) => Promise<void> | void
}

const EditModal: React.FunctionComponent<Props> = ({
  initialValues,
  onSubmit,
  ...rest
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
        <FullScreenModal
          css={css`
            display: grid;
            grid-template-rows: auto 1fr;
          `}
          {...rest}
        >
          <Form
            className="px-1h pb-1h"
            css={css`
              display: grid;
              grid-template-rows: 1fr auto;
            `}
          >
            <div>
              <div>
                <InputBase
                  css={css`
                    font-size: 24px;
                  `}
                  autoFocus
                  placeholder="Enter title"
                  fullWidth
                  value={values.title}
                  onChange={(e) => setFieldValue("title", e.target.value)}
                />
              </div>

              <div className="mt-1h fa-s">
                <IconButton
                  css={css`
                    width: 32px;
                    height: 32px;
                  `}
                  size="small"
                  className="mr-1"
                >
                  <SubjectIcon fontSize="small" />
                </IconButton>

                <InputBase
                  placeholder="Add details"
                  fullWidth
                  multiline={true}
                  value={values.notes}
                  onChange={(e) => setFieldValue("notes", e.target.value)}
                />
              </div>
            </div>

            <div className="fj-e mt-1h">
              <Button
                variant="outlined"
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                Done
              </Button>
            </div>
          </Form>
        </FullScreenModal>
      )}
    </Formik>
  )
}

export default EditModal
