import React from 'react';
import Card from '../Card';
import { H3, makeMarginTopComponent, Bold } from '@app/lib/styles/common';
import theme from '@app/lib/styles/theme';
import { CtaButton } from '../CtaButton';
import { HeaderContainer } from './styles';
import { PossibleClaimData, ProviderData } from '@app/providers';
import { HighlighContainer } from './styles';
import { H4 } from '@app/lib/styles/common';
import { CreateClaimOptions, ProviderName } from '@questbook/reclaim-node';
import { useReduxSelector } from '@app/redux/config';
import { SizedImage } from '@app/components/ProviderIcon/styles';

interface Props<T extends ProviderName> {
  provider: ProviderData;
  possibleClaim: PossibleClaimData<T>;
  onPress: () => void;
  inputParams?: CreateClaimOptions<T>['params'];
}

const MarginTop = makeMarginTopComponent(1);

const PossibleClaimCard = <T extends ProviderName>({
  provider,
  possibleClaim,
  onPress,
  inputParams
}: Props<T>) => {
  const params = inputParams ?? useReduxSelector(possibleClaim.getParams);
  
  return (
    <Card>
      <HeaderContainer>
        <>
          <SizedImage source={provider.iconPath} height={30} width={30} />
          <H3 color="black">{provider.name}</H3>
        </>
      </HeaderContainer>
      <H4 color={theme.palette.common.black} weight="700" fontSize="17px" lineHeight="20px">
        <Bold>{possibleClaim.description}</Bold>
      </H4>
      <HighlighContainer>
        <H4 color={theme.palette.common.black} weight="700" fontSize="17px" lineHeight="20px">
          {Object.values(params)[0] ?  Object.values(params)[0] : possibleClaim.placeholder}
        </H4>
      </HighlighContainer>
      <MarginTop />
      <CtaButton onPress={() => onPress()} text={'Add claim'} />
    </Card>
  );
};

export default PossibleClaimCard;
