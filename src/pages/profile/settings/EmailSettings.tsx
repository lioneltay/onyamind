import React from "react"

import { Button, Modal, ListItemText } from "lib/components"
import { TextField, ListItem, ListItemIcon, Avatar } from "@material-ui/core"
import { Formik, Form } from "formik"
import { EmailIcon } from "lib/icons"

import { useSelector, useActions } from "services/store"

import { updateEmail } from "services/api"

import { logError } from "services/analytics/error-reporting"

export default () => {
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
    <React.Fragment>
      <ListItem onClick={() => setShowEmailModal(true)}>
        <ListItemIcon>
          <Avatar>
            <EmailIcon htmlColor="white" />
          </Avatar>
        </ListItemIcon>

        <ListItemText primary="Your Email" secondary={user.email} />
      </ListItem>

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
                autoFocus
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
    </React.Fragment>
  )
}
