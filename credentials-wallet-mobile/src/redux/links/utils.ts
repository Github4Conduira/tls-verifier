import { Claim, ClaimStatus, Link } from '@app/redux/links/types';

export const isClaim = (obj: any): obj is Claim => {
  return (obj as Claim).status !== undefined;
};

export const getClaimByIdFromLink = (link: Link, id: number) =>
  link.claims.find((claim) => claim.internalId === id);

export const getVerifiedClaimsLength = (link: Link) => link.claims.filter(claim => claim.status === ClaimStatus.MINTED).length
