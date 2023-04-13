import { Provider } from '../../types';
type YCombinatorLoginParams = {
    userId: number;
};
type YCombinatorLoginSecretParams = {
    /** cookie string for authentication */
    cookieStr: string;
};
declare const YCombinatorLogin: Provider<YCombinatorLoginParams, YCombinatorLoginSecretParams>;
export default YCombinatorLogin;
