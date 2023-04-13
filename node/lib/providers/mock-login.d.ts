/**
 * Mock login provider for testing;
 * mimicks the Google login provider
 *
 * essentially, if you provide token = "foo",
 * then it'll return a JSON with "emailAddress" = "foo@mock.com"
 */
import { Provider } from '../types';
type MockLoginParams = {
    emailAddress: string;
};
type MockLoginSecretParams = {
    token: string;
};
declare const mockLogin: Provider<MockLoginParams, MockLoginSecretParams>;
export default mockLogin;
