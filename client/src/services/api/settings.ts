import { firestore, dataWithId } from "services/firebase"

export const createSettings = async (
  userId: ID | null,
  data: Partial<
    Omit<Settings, "id" | "userId" | "createdAt" | "updatedAt">
  > = {},
): Promise<Settings> => {
  const settings = await firestore
    .collection("settings")
    .add({
      dark: false,
      ...data,
      userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    } as Omit<Settings, "id">)
    .then(ref => ref.get())
    .then(dataWithId)

  return settings as Settings
}

export const updateSettings = async (
  userId: ID | null,
  settingsData: Partial<
    Omit<Settings, "id" | "userId" | "createdAt" | "updatedAt">
  >,
): Promise<void> => {
  const [settings] = await firestore
    .collection("settings")
    .where("userId", "==", userId)
    .limit(1)
    .get()
    .then(ref => ref.docs.map(dataWithId))

  if (settings) {
    return firestore
      .collection("settings")
      .doc(settings.id)
      .update({ ...settingsData, updatedAt: Date.now() })
  }

  await createSettings(userId, settingsData)
}
