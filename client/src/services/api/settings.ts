import { firestore, dataWithId } from "services/firebase"

export const createSettings = async (
  user_id: ID | null,
  data: Partial<
    Omit<Settings, "id" | "user_id" | "created_at" | "updated_at">
  > = {},
): Promise<Settings> => {
  const settings = await firestore
    .collection("settings")
    .add({
      dark: false,
      ...data,
      user_id,
      created_at: Date.now(),
      updated_at: Date.now(),
    } as Settings)
    .then(ref => ref.get())
    .then(dataWithId)

  return settings as Settings
}

export const updateSettings = async (
  user_id: ID | null,
  settings_data: Partial<
    Omit<Settings, "id" | "user_id" | "created_at" | "updated_at">
  >,
): Promise<void> => {
  const [settings] = await firestore
    .collection("settings")
    .where("user_id", "==", user_id)
    .limit(1)
    .get()
    .then(ref => ref.docs.map(dataWithId))

  if (settings) {
    return firestore
      .collection("settings")
      .doc(settings.id)
      .update({ ...settings_data, updated_at: Date.now() })
  }

  await createSettings(user_id, settings_data)
}
