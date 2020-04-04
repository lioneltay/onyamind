import { firebase } from "services/firebase"

function callableFunction<D, R = void>(
  name: string,
): CallableFunction.Function<D, R> {
  return (firebase
    .functions()
    .httpsCallable(name) as unknown) as CallableFunction.Function<D, R>
}

export const sendFeedback = callableFunction<CallableFunction.SendFeedbackData>(
  "sendFeedback",
)

export const migrateUserData = callableFunction<
  CallableFunction.MigrateUserDataData
>("migrateUserData")
