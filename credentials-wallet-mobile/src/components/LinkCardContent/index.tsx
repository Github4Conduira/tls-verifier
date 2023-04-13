import React from 'react';
import { Pressable, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { externalLinkIconXml } from '@app/assets/svgs';
import { claimsIcon } from '@app/assets/svgs';
import { GrayH3 } from '@app/components/LinkCardContent/styles';
import MenuButton from '@app/components/MenuButton';
import { BodyEmphasized, FlexRow, H2, MetaActionBar, RightView } from '@app/lib/styles/common';
import theme from '@app/lib/styles/theme';
import { stringifyClaims } from '@app/lib/utils';
import { Link } from '@app/redux/links/types';
import { Container } from './styles';

interface Props {
  link: Link;
  handleShareClick: () => void;
  handleMenuButtonPress: () => void;
}

const LinkCardContent: React.FC<Props> = ({ link, handleShareClick, handleMenuButtonPress }) => {
  return (
    <>
      <FlexRow>
        <SvgXml xml={claimsIcon} />
        <Container>
          <H2>{link.name}</H2>
          <GrayH3>{stringifyClaims(link.claims)}</GrayH3>
        </Container>
        <RightView>
          <MenuButton onPress={handleMenuButtonPress} />
        </RightView>
      </FlexRow>
      <MetaActionBar margin-top="24px">
        <Pressable onPress={handleShareClick}>
          <FlexRow gap="4px">
            <SvgXml xml={externalLinkIconXml} width="15px" height="15px" />
            <BodyEmphasized color={theme.palette.common.blue}>Share</BodyEmphasized>
          </FlexRow>
        </Pressable>

        {!!link.template ? (
          <>
            <View />
            <GrayH3>From submission</GrayH3>
          </>
        ) : (
          <GrayH3>{link.views} views</GrayH3>
        )}
      </MetaActionBar>
    </>
  );
};

export default LinkCardContent;
