import React from 'react';
import { SvgXml } from 'react-native-svg';
import { downArrow } from '../../assets/svgs';
import { H2, H3, RightView } from '@app/lib/styles/common';
import { FlexRow } from '@app/lib/styles/common';
import theme from '@app/lib/styles/theme';

interface Props {
  reOrder: () => void;
  descending: boolean;
}

const UsedOrder: React.FC<Props> = ({ reOrder, descending }) => {
  return (
    <FlexRow gap="5px">
      <H2>Possible claims</H2>
      <RightView></RightView>
      <H3 color={theme.palette.common.blue} weight="700">
        Most used
      </H3>
      <SvgXml xml={downArrow} />
    </FlexRow>
  );
};

export default UsedOrder;
