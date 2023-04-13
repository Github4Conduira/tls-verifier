import { VerificationRequest } from '@questbook/reclaim-client-sdk'

// eslint-disable-next-line no-restricted-syntax
export enum NotificationType {
  NEWVRQ = 'new verification request',
  APPROVEDVRQ = 'approved verification request',
  DECLINEDVRQ = 'declined verification request',
}

export interface Notification {
  id: string
  title: string | undefined
  body: string | undefined
  type: NotificationType
  requestor?: string
  verificationRequest: VerificationRequest
}
