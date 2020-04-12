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
  } = useActions()

  const method = creatingAccount ? "Sign up" : "Sign in"

  return (
    <Formik<Values>
      initialValues={{ email: "", password: "", confirmPassword: "" }}
      onSubmit={async (values) => {
        if (creatingAccount) {
          await createUserWithEmailAndPassword({
            email: values.email,
            password: values.password,
          })
            .then(closeAuthModal)
            .catch((error) => {
              if (error.code === "auth/invalid-email") {
                openSnackbar({ text: "Invalid email address" })
              }

              if (error.code === "auth/weak-password") {
                openSnackbar({ text: error.message })
              }
              console.error(error)
              throw error
            })
        } else {
          await signInWithEmailAndPassword({
            email: values.email,
            password: values.password,
          })
            .then(closeAuthModal)
            .catch((error) => {
              if (
                error.code === "auth/user-not-found" ||
                error.code === "auth/wrong-password"
              ) {
                openSnackbar({
                  text: "Your password or email address is incorrect",
                })
              }

              throw error
            })
        }
      }}
    >
      {({ values, setFieldValue }) => (
        <Form className="fd-c fa-c">
          <Text variant="h5" align="center" style={{ marginBottom: 24 }}>
            {method} with email
          </Text>

          <TextField
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
              label="Confirm password"
              placeholder="Confirm password"
              className="mt-4"
              variant="outlined"
              type="password"
              InputLabelProps={{
                shrink: true,
              }}
              value={values.confirmPassword}
              onChange={(e) => setFieldValue("confirmPassword", e.target.value)}
            />
          ) : null}

          <Button
            type="submit"
            color="primary"
            variant="outlined"
            fullWidth
            className="mt-4"
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
      )}
    </Formik>
  )
}
