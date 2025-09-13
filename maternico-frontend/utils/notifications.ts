import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const scheduleNotification = async (
  title: string,
  body: string,
  datetime: Date
) => {
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== "granted") {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== "granted") return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: datetime as any,
  });
};
