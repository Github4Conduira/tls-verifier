import { RootState } from '@app/redux/config';
import { ClaimStatus } from '@app/redux/links/types';
import { LoadingState } from '@app/redux/types';
import { createSelector } from '@reduxjs/toolkit';

export const getLinksList = (state: RootState) => state.links.list;
export const getTempLink = (state: RootState) => state.links.tempLink;
export const getLastLink = (state: RootState) =>
  getLinksList(state)[getLinksList(state).length - 1];

export const getLinkById = (id: string | undefined) => (state: RootState) =>
  getLinksList(state).find((link) => link.id === id);

export const isLinksLoading = (state: RootState) => state.links.loading === LoadingState.PENDING;

export const isAllClaimsMintedInTempLink = (state: RootState) =>
  getTempLink(state).claims.every((claim) => claim.status === ClaimStatus.MINTED);

export const isTempLinkReadyForSubmit = createSelector(
	getTempLink,
	isAllClaimsMintedInTempLink,
	(tempLink, allClaimsMinted) => tempLink.name.length > 0 && tempLink.claims.length > 0 && allClaimsMinted
)

export const isLinkMine = (id: string) => (state: RootState) => getLinkById(id)(state)?.userId !== '';
