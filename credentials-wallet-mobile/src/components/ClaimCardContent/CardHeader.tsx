import React from 'react';
import { H3, FlexRow, Bold } from '@app/lib/styles/common';
import { SizedImage } from '@app/components/ProviderIcon/styles';
import { ProviderData } from '@app/providers';

const CardHeader: React.FC<{ provider: ProviderData; unfocused?: boolean }> = ({
  provider,
  unfocused,
}) => {
  return (
    <FlexRow gap={'10px'}>
      <SizedImage source={provider.iconPath} height={24} width={24} unfocused={unfocused} />
      <H3>
        <Bold>{provider.name}</Bold>
      </H3>
    </FlexRow>
  );
};

export default CardHeader;
