import { Provider } from '../../types';
type AmazonOrderHistoryParams = {
    /**
     * the name of the product you're trying
     * to claim to have purchased
     * */
    productName: string;
};
type AmazonOrderHistorySecretParams = {
    /** cookie string for authentication */
    cookieStr: string;
    /**
     * query that'll return the product you're trying to claim
     * Eg. if you've bought "ABCD mouse",
     * then the query could be "mouse"
     */
    qstring: string;
};
declare const amazonOrderHistory: Provider<AmazonOrderHistoryParams, AmazonOrderHistorySecretParams>;
export default amazonOrderHistory;
