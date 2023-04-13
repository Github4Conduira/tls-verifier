type GithubError = {
    message: string;
    documentation_url?: string;
    errors?: unknown[];
};
export declare const isGithubError: (error: unknown) => error is GithubError;
export {};
