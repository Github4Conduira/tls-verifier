import { Provider } from '../../types';
export type HTTPProviderParams = {
    /**
     * which URL does the request have to be made to
     * for eg. https://amazon.in/orders?q=abcd
     */
    url: string;
    /** HTTP method */
    method: 'GET' | 'POST';
    /** which portions to select from a response. If both are set, then JSON path is taken after xPath is found */
    responseSelections: [
        {
            /**
             * expect an HTML response, and to contain a certain xpath
             * for eg. "/html/body/div.a1/div.a2/span.a5"
             */
            xPath?: string;
            /**
             * expect a JSON response, retrieve the item at this path
             * using dot notation
             * for e.g. 'email.addresses.0'
             */
            jsonPath?: string;
            /** A regexp to match the "responseSelection" to */
            responseMatch: string;
        }
    ];
};
export type HTTPProviderSecretParams = {
    /** cookie string for authorisation. Will be redacted from witness */
    cookieStr?: string;
    /** authorisation header value. Will be redacted from witness */
    authorisationHeader?: string;
};
declare const index: Provider<HTTPProviderParams, HTTPProviderSecretParams>;
export default index;
