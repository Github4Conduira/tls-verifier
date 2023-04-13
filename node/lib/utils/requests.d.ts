import { BigNumber } from 'ethers';
import { Reclaim } from '../types';
export type RequestClaim = {
    infoHash: string;
    owner: string;
    timestampS: number;
    claimId: BigNumber;
};
/**
 * Get details about the claim from the specified chain
 * @param chainId Chain where the claim is stored
 * @param claimId ID of the claim request
 */
export declare function getClaimDataFromRequestId(chainId: number, claimId: string | number): Promise<RequestClaim>;
export declare function getContract(chainId: number): Reclaim;
/**
 * Optionally load extra chains & RPC urls from a file.
 * This is useful to extend the functionality of the server
 * without having to recompile the code.
 */
export declare function loadExtraChains(filename: string): void;
