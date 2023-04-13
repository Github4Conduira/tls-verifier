import { ProviderData, PROVIDERS, ProviderType } from "@app/providers";

export const getProviderData = (provider: ProviderType): ProviderData => PROVIDERS.find(p => p.provider === provider)!;
