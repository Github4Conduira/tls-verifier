declare const providers: {
    'google-login': import("..").Provider<{
        emailAddress: string;
    }, {
        token: string;
    }>;
    'mock-login': import("..").Provider<{
        emailAddress: string;
    }, {
        token: string;
    }>;
    'amazon-order-history': import("..").Provider<{
        productName: string;
    }, {
        cookieStr: string;
        qstring: string;
    }>;
    'yc-login': import("..").Provider<{
        userId: number;
    }, {
        cookieStr: string;
    }>;
    'github-contributor': import("..").Provider<{
        repo: string;
    }, {
        token: string;
        username: string;
        repo: string;
    }>;
    'twitter-login': import("..").Provider<{
        username: string;
    }, {
        token: string;
    }>;
    http: import("..").Provider<import("./http-provider").HTTPProviderParams, import("./http-provider").HTTPProviderSecretParams>;
};
export type ProviderName = keyof typeof providers;
type Provider<E extends ProviderName> = (typeof providers)[E];
export type ProviderParams<E extends ProviderName> = Parameters<Provider<E>['assertValidProviderReceipt']>[1];
export type ProviderSecretParams<E extends ProviderName> = Parameters<Provider<E>['createRequest']>[0];
export default providers;
