import { H3, makeMarginTopComponent, FlexColumn, ScreenTitle, Bold } from '@app/lib/styles/common';
import { Claim, ClaimStatus } from '@app/redux/links/types';
import React from 'react';
import { getMonthAndDate } from '@app/lib/utils';
import { HighlitedText } from '@app/components/HighlitedText';
import CardHeader from '@app/components/ClaimCardContent/CardHeader';
import { TemplateClaim } from '@app/redux/templates/types';
import { PROVIDERS } from '@app/providers';
import LoadingIcon from '@app/components/LoadingIcon';
import VerifyingBar from './VerifyingBar';
import { ContentContainer } from './styles';

interface Props {
  claim: Claim;
  handleCreateClaim?: (claim: TemplateClaim) => void;
  unfocused?: boolean;
}

const MarginTop = makeMarginTopComponent(0);

const ClaimCardContent: React.FC<Props> = ({ claim, handleCreateClaim, unfocused }) => {
  const getOpacityValue = () => {
    if (claim.status === ClaimStatus.PENDING) {
      return 0.5;
    } else {
      return 1;
    }
  };

  const provider = PROVIDERS.find((p) => p.provider === claim.provider) ?? PROVIDERS[0];
  const claimProvider =
    provider?.possibleClaims[claim.claimProvider] ?? provider?.possibleClaims['google-login'];

  const redactedParams = claim.redactedParameters.replace(/:\s*(\*+)/g, ':"$1"');

  const alternative =
    claim.redactedParameters.length > 0
      ? JSON.parse(redactedParams)[claimProvider?.placeholder || 'emailAddress']
      : claimProvider?.placeholder;

  if (!claimProvider) return <LoadingIcon />;
  return (
    <>
      <ContentContainer opacity={getOpacityValue()}>
        <CardHeader provider={provider} unfocused={unfocused} />
        <MarginTop />
        <FlexColumn>
          <ScreenTitle>
            <Bold>{claimProvider?.description}</Bold>
          </ScreenTitle>
          <HighlitedText
            text={
              claim.params && Object.values(claim.params).length > 0
                ? Object.values(claim.params)[0]
                : alternative
            }
          />
        </FlexColumn>
        <MarginTop />
        {claim.status === ClaimStatus.MINTED && (
          <H3>
            Encrypted {getMonthAndDate(claim.timestampS)}. Signed by {claim.witnessAddresses.length}{' '}
            blind witnesses
          </H3>
        )}
        {claim.status === ClaimStatus.REJECTED && (
          <H3 color="red">Failed please try again. {claim.errorMessage}</H3>
        )}
      </ContentContainer>
      {claim.status === ClaimStatus.PENDING && <VerifyingBar message={claim.statusMessage} />}
    </>
  );
};

export default ClaimCardContent;
