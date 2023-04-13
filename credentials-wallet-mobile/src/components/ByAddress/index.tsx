import { FlexRow } from '@app/lib/styles/common';
import React from 'react';
import { H3 } from '@app/lib/styles/common';
import { truncateAddress } from '@app/lib/utils/helpers';

interface Props {
  address: string;
}

const ByAddress: React.FC<Props> = ({ address }) => {
  return (
    <FlexRow gap="5px">
      <H3 color="black" weight="500">
        By
      </H3>
      <H3 color="black" weight="700">
        {truncateAddress(address)}
      </H3>
    </FlexRow>
  );
};

export default ByAddress;
