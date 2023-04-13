import { RootState } from '@app/redux/config';

export const getNotificationsList = (state: RootState) => state.notifications.list;

export const getNotificationkById = (id: string | undefined) => (state: RootState) =>
  getNotificationsList(state).find((notification) => notification.id === id);

export const getNotificationsReadStatus = (state: RootState) => state.notifications.unRead;
