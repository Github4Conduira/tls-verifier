import { ClaimProof } from "../proto/";

export interface ClaimProofInterface extends Omit<ClaimProof, 'signatures'>{
    /** Id of the claim */
    id: number;
    signatures: string[]
}