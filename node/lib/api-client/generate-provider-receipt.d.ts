import { Logger } from 'pino';
import { ReclaimWitnessClient } from '../proto/api';
import { InitialiseSessionRequest_ProviderClaimRequest as ProviderClaimRequest } from '../proto/api';
import { ProviderName, ProviderParams, ProviderSecretParams } from '../providers';
import { TLSConnectionOptions } from '../types';
export interface GenerateProviderReceiptOptions<N extends ProviderName> {
    /** name of the provider to generate signed receipt for */
    name: N;
    /**
     * secrets that are used to make the API request;
     * not included in the receipt & cannot be viewed by anyone
     * outside this client
     */
    secretParams: ProviderSecretParams<N>;
    params: ProviderParams<N>;
    requestData?: ProviderClaimRequest;
    client: ReclaimWitnessClient;
    additionalConnectOpts?: TLSConnectionOptions;
    logger?: Logger;
}
export declare function generateProviderReceipt<Name extends ProviderName>({ name, secretParams, params, client, requestData, additionalConnectOpts, logger, }: GenerateProviderReceiptOptions<Name>): Promise<import("../proto/api").FinaliseSessionResponse>;
