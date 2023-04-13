import { ethers } from 'ethers';
import { createClient } from 'nice-grpc-web';
import { Logger } from 'pino';
import { ProviderClaimData, ReclaimWitnessDefinition } from '../proto/api';
import { ProviderName, ProviderParams, ProviderSecretParams } from '../providers';
import { CreateStep, TLSConnectionOptions } from '../types';
type CreateRequestResult = {
    chainId: number;
    claimId: number;
    witnessHosts: string[];
};
export type CreateRequestFn = (infoHash: string, logger: Logger) => Promise<CreateRequestResult>;
export interface CreateClaimOptions<N extends ProviderName> {
    /** name of the provider to generate signed receipt for */
    name: N;
    /**
     * parameters to verify the provider receipt with
     */
    params: ProviderParams<N>;
    /** additional data for signing */
    context?: string;
    /**
     * secrets that are used to make the API request;
     * not included in the receipt & cannot be viewed by anyone
     * outside this client
     */
    secretParams: ProviderSecretParams<N>;
    /** request creation from the smart contract or any other source */
    requestCreate: CreateRequestFn;
    /** Pass to resume from a specific step */
    resumeFromStep?: CreateStep;
    /** listen for when a certain step is reached */
    didUpdateCreateStep?: (step: CreateStep) => void;
    additionalConnectOpts?: TLSConnectionOptions;
    makeGrpcClient?: (url: string) => ReturnType<typeof createClient<ReclaimWitnessDefinition>>;
    logger?: Logger;
}
type SmartContractCreateOptions = {
    /** Chain ID on which to create the claim */
    chainId: number;
    /** Signer to use to connect & sign transactions */
    signer: ethers.Signer;
    /** If creating for another user, provide the authorisation sig */
    authorisation?: {
        signature: Uint8Array;
        timestampMs: number;
    };
};
/**
 * Create a claim on chain
 * @param param0 parameters to create the claim with
 */
export declare function createClaim<Name extends ProviderName>({ name, params, context, secretParams, requestCreate, resumeFromStep, didUpdateCreateStep, additionalConnectOpts, makeGrpcClient, logger, }: CreateClaimOptions<Name>): Promise<{
    claimId: number;
    claimData: ProviderClaimData;
    signatures: string[];
    witnessHosts: string[];
    chainId: number;
}>;
export declare function makeSmartContractCreateRequest({ chainId, signer, authorisation, }: SmartContractCreateOptions): CreateRequestFn;
export {};
