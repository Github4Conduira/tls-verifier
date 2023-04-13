import { Logger } from 'pino';
import { ReclaimWitnessClient } from '../proto/api';
import { ProviderName, ProviderParams, ProviderSecretParams } from '../providers';
export interface MockCreateClaimOptions<N extends ProviderName> {
    /** name of the provider to generate signed receipt for */
    name: N;
    params: ProviderParams<N>;
    /**
     * secrets that are used to make the API request;
     * not included in the receipt & cannot be viewed by anyone
     * outside this client
     */
    secretParams: ProviderSecretParams<N>;
    client: ReclaimWitnessClient;
    logger?: Logger;
}
export declare function mockCreateClaim<Name extends ProviderName>({ name, params, secretParams, client, logger, }: MockCreateClaimOptions<Name>): Promise<{
    receipt: import("../proto/api").TLSReceipt | undefined;
}>;
