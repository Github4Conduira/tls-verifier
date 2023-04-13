import React from 'react';
import { Text } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { linkIconXml } from '@app/assets/svgs';
import { Bold, H3 } from '@app/lib/styles/common';
import theme from '@app/lib/styles/theme';
import { LinkContainer, LinkHeader } from './styles';
import { truncateAddress } from '@app/lib/utils/helpers';

interface Props {
  linkTitle: string;
  owner: string;
}

const LinkView: React.FC<Props> = ({ linkTitle, owner }) => {
  return (
    <LinkContainer>
      <SvgXml xml={linkIconXml} />
      <LinkHeader>
        <H3 color={theme.palette.common.black}>
          <Bold>{linkTitle}</Bold>
        </H3>
        <Text>{truncateAddress(owner)}</Text>
      </LinkHeader>
    </LinkContainer>
  );
};

export default LinkView;
