declare global {
  namespace CallableFunction {
    export type Function<Data, Result = void> = (data: Data) => Promise<Result>

    export type SendFeedbackData = {
      subject: string
      description?: string
    }

    type MigrateUserDataData = {
      fromUserId: string
      toUserId: string
    }
  }
}

export {}
