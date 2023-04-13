/**
 * Use the Google People API to get the email address of the user
 * to prove they are owners of the same email address.
 *
 * https://developers.google.com/people/api/rest/v1/people/get
 */
import { Provider } from '../types';
type GoogleLoginParams = {
    emailAddress: string;
};
type GoogleLoginSecretParams = {
    token: string;
};
declare const googleLogin: Provider<GoogleLoginParams, GoogleLoginSecretParams>;
export default googleLogin;
