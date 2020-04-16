import React from "react"
import { noopTemplate as css } from "lib/utils"

import { Text, Button, Modal } from "lib/components"
import { Divider, TextField } from "@material-ui/core"
import { Formik, Form } from "formik"

import { useSelector, useActions } from "services/store"

import { SectionTitle, SubSectionTitle } from "./components"

import { updateEmail } from "services/api"

import { logError } from "services/analytics/error-reporting"

export default (props: Stylable) => {
  const [showEmailModal, setShowEmailModal] = React.useState(false)

  const { user } = useSelector((state) => ({
    user: state.auth.user,
    darkMode: state.settings.darkMode,
  }))

  const {
    ui: { openSnackbar, openAuthModal },
    auth: { setUser },
  } = useActions()

  if (!user) {
    return null
  }

  return (
    <div {...props}>
      <SectionTitle>Email settings</SectionTitle>

      <Divider className="mt-4" />

      <div
        className="mt-4"
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        `}
      >
        <div>
          <SubSectionTitle gutterBottom>Your email</SubSectionTitle>

          <Text variant="body2">{user.email}</Text>
        </div>

        <Button variant="outlined" onClick={() => setShowEmailModal(true)}>
          Edit email
        </Button>

        <Modal
          open={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          title="Edit email"
        >
          <Formik<{ email: string }>
            initialValues={{ email: user.email ?? "" }}
            onSubmit={async ({ email }, { setSubmitting }) => {
              try {
                const user = await updateEmail(email)
                setUser(user)
                openSnackbar({
                  type: "success",
                  text: "Email updated",
                })
                setShowEmailModal(false)
              } catch (error) {
                if (error.code === "auth/requires-recent-login") {
                  openSnackbar({
                    type: "error",
                    text: error.message,
                  })
                  openAuthModal("signin-only")
                } else if (error.code === "auth/invalid-email") {
                  openSnackbar({
                    type: "error",
                    text: "Invalid email",
                  })
                }

                logError(error)
              }

              setSubmitting(false)
            }}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form>
                <TextField
                  label="Email"
                  placeholder="email"
                  type="email"
                  fullWidth
                  variant="outlined"
                  value={values.email}
                  onChange={(e) => setFieldValue("email", e.target.value)}
                />

                <div className="fa-c fj-e mt-4">
                  <Button
                    disabled={isSubmitting}
                    variant="outlined"
                    color="primary"
                    type="submit"
                  >
                    Save
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Modal>
      </div>

      <Divider className="mt-4" />
    </div>
  )
}
