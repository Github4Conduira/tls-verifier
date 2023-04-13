import { Provider } from '../../types';
type GithubLoginParams = {
    repo: string;
};
type GithubRepoContributorsListSecretParams = {
    token: string;
    username: string;
    repo: string;
};
declare const githubContributor: Provider<GithubLoginParams, GithubRepoContributorsListSecretParams>;
export default githubContributor;
