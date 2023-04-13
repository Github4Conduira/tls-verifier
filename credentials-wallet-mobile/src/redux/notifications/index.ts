import { Notification } from '@app/redux/notifications/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationsState {
  list: Notification[];
  unRead: boolean;
}

const initialState: NotificationsState = {
  list: [],
  unRead: false,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<Notification[]>) => ({
      ...state,
      list: action.payload,
      unRead: true,
    }),
    addNotification: (state, action: PayloadAction<Notification>) => ({
      ...state,
      list:
        state.list.map((notification) => notification.id).includes(action.payload.id) &&
        state.list.map((notification) => notification.title).includes(action.payload.title)
          ? state.list
          : [...state.list, action.payload],
      unRead: true,
    }),
    readNotification: (state) => ({
      ...state,
      unRead: false,
    }),
    updateStatus: (state, action: PayloadAction<{ status: number; id: string }>) => ({
      ...state,
      list: state.list.map((notification) =>
        notification.id === action.payload.id
          ? {
              ...notification,
              verificationRequest: {
                ...notification.verificationRequest,
                status: action.payload.status,
              },
            }
          : notification
      ),
    }),
  },
});

export const { setNotifications, addNotification, readNotification, updateStatus } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
