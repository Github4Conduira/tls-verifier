import { isLinksLoading } from '@app/redux/links/selectors'
import { createSelector } from '@reduxjs/toolkit'

export const isAppLoading = createSelector(isLinksLoading, (...args) => {
	return args.some((arg) => arg)
})
