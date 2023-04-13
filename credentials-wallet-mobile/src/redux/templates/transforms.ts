import { getProviderType } from '@app/lib/utils';
import { ProviderType } from '@app/providers';
import { BaseTemplate, Template } from '@app/redux/templates/types';

export const transformBaseTemplate = (template: BaseTemplate): Template => {
  console.log(template.claims);
  return {
    ...template,
    claims: template.claims.map((claim, index) => ({
      ...claim,
      claimed: false,
      id: index,
      claimProvider: claim.provider,
      provider: getProviderType(claim.provider),
    })),
  };
};
