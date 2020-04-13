import React from "react"
import { noopTemplate as css } from "lib/utils"
import { TextField } from "@material-ui/core"
import { ChevronLeftIcon } from "lib/icons"
import { Text, Button } from "lib/components"
import { Formik, Form } from "formik"

import { useActions } from "services/store"

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "services/api"

function validateFactory(creatingAccount: boolean) {
  return (values: Values) => {
    const errors = {} as Record<keyof Values, string | undefined>

    if (creatingAccount) {
      if (values.password !== values.confirmPassword) {
        errors.confirmPassword = "Passwords do not match"
      }
    }

    return errors
  }
}

type Values = {
  email: string
  password: string
  confirmPassword: string
}

type Props = {
  creatingAccount: boolean
  goBack: () => void
}

export default ({ goBack, creatingAccount }: Props) => {
  const {
    ui: { openSnackbar, closeAuthModal },
    auth: { setUser },
  } = useActions()

  const method = creatingAccount ? "Sign up" : "Sign in"

  return (
    <Formik<Values>
      initialValues={{ email: "", password: "", confirmPassword: "" }}
      validate={validateFactory(creatingAccount)}
      onSubmit={async (values) => {
        if (creatingAccount) {
          const user = await createUserWithEmailAndPassword({
            email: values.email,
            password: values.password,
          })
            .then((user) => {
              setUser(user)
              closeAuthModal()
            })
            .catch((error) => {
              if (error.code === "auth/email-already-in-use") {
                return openSnackbar({
                  type: "error",
                  text: "An account with this email address already exists",
                })
              }
              if (error.code === "auth/invalid-email") {
                return openSnackbar({
                  type: "error",
                  text: "Invalid email address",
                })
              }

              if (error.code === "auth/weak-password") {
                return openSnackbar({ type: "error", text: error.message })
              }

              throw error
            })
        } else {
          await signInWithEmailAndPassword({
            email: values.email,
            password: values.password,
          })
            .then((user) => {
              setUser(user)
              closeAuthModal()
            })
            .catch((error) => {
              if (
                error.code === "auth/user-not-found" ||
                error.code === "auth/wrong-password"
              ) {
                return openSnackbar({
                  type: "error",
                  text: "Your password or email address is incorrect",
                })
              }

              throw error
            })
        }
      }}
    >
      {({
        values,
        errors,
        touched,
        setFieldValue,
        setFieldTouched,
        isValid,
      }) => {
        return (
          <Form className="fd-c fa-c">
            <Text variant="h5" align="center" style={{ marginBottom: 24 }}>
              {method} with email
            </Text>

            <TextField
              required
              label="Email"
              placeholder="Email"
              variant="outlined"
              type="email"
              InputLabelProps={{
                shrink: true,
              }}
              value={values.email}
              onChange={(e) => setFieldValue("email", e.target.value)}
            />

            <TextField
              required
              label="Password"
              placeholder="Password"
              className="mt-4"
              variant="outlined"
              type="password"
              InputLabelProps={{
                shrink: true,
              }}
              value={values.password}
              onChange={(e) => setFieldValue("password", e.target.value)}
            />

            {creatingAccount ? (
              <TextField
                required
                label="Confirm password"
                placeholder="Confirm password"
                className="mt-4"
                variant="outlined"
                type="password"
                helperText={
                  touched.confirmPassword && errors.confirmPassword ? (
                    <Text color="error" variant="caption">
                      {errors.confirmPassword}
                    </Text>
                  ) : undefined
                }
                InputLabelProps={{
                  shrink: true,
                }}
                value={values.confirmPassword}
                onBlur={(e) => setFieldTouched("confirmPassword", true)}
                onChange={(e) =>
                  setFieldValue("confirmPassword", e.target.value)
                }
              />
            ) : null}

            <Button
              type="submit"
              color="primary"
              variant="outlined"
              fullWidth
              className="mt-4"
              disabled={!isValid}
            >
              {method}
            </Button>

            <Button
              className="fa-c"
              css={css`
                margin-top: 24px;
                margin-bottom: 24px;
              `}
              color="primary"
              onClick={goBack}
            >
              <ChevronLeftIcon className="mr-3" color="primary" />
              All sign in options
              <ChevronLeftIcon
                className="mr-3"
                color="primary"
                style={{ visibility: "hidden" }}
              />
            </Button>
          </Form>
        )
      }}
    </Formik>
  )
}
