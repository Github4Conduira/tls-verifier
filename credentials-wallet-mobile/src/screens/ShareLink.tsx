import React, { useCallback, useMemo, useRef } from 'react';
import { SvgXml } from 'react-native-svg';
import { securityLockIconXml } from '@app/assets/svgs';
import BottomSheetView from '@app/components/BottomSheet';
import { BottomSheetFooter, LinkContainer, LinkHeader } from '@app/components/BottomSheet/styles';
import CancelButton from '@app/components/CancelButton';
import Card from '@app/components/Card';
import ClaimCardContent from '@app/components/ClaimCardContent';
import { RoundCtaButton } from '@app/components/CtaButton';
import { CtaButton } from '@app/components/CtaButton';
import Footer from '@app/components/Footer';
import LinkView from '@app/components/LinkView';
import { Container } from '@app/components/RequestsView/styles';
import ScreenContainer from '@app/components/ScreenContainer';
import messages from '@app/lib/messages.json';
import { ClaimsContainer, FlexColumn, FlexRow, H3, RightView } from '@app/lib/styles/common';
import { BodyEmphasized } from '@app/lib/styles/common';
import theme from '@app/lib/styles/theme';
import { useReduxSelector } from '@app/redux/config';
import { getLastLink } from '@app/redux/links/selectors';
import BottomSheet from '@gorhom/bottom-sheet';
import Clipboard from '@react-native-clipboard/clipboard';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BottomSheetBody } from './styles';
import { RootStackParamList } from '.';
import ByAddress from '@app/components/ByAddress';
import { Share } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'ShareLink'>;

const ShareLink: React.FC<Props> = ({ navigation, route }) => {
  let link = useReduxSelector(getLastLink);
  const routeLink = route.params?.link;
  if (routeLink !== undefined) {
    link = routeLink;
  }

  const [isOpenShareSheet, setIsOpenShareSheet] = React.useState(false);

  const copyToClipboard = () => {
    Clipboard.setString(`http://share.reclaimprotocol.org/link/${link.id}`);
  };

  const moreCopyOptions = () => {
    Share.share({
      message: `http://share.reclaimprotocol.org/link/${link.id}`,
      url: `http://share.reclaimprotocol.org/link/${link.id}`,
    });
  };

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPointsShare = useMemo(() => ['25%', '50%'], []);

  // callbacks
  const handleSheetChanges = useCallback(() => {}, []);

  return (
    <>
      <Footer
        footer={
          <Container>
            <FlexRow>
              <FlexColumn>
                <H3 color="black" weight="700">
                  Only you
                </H3>
                <H3>Share to give others access</H3>
              </FlexColumn>
              <RightView />
              <RoundCtaButton
                onPress={() => setIsOpenShareSheet(true)}
                text={messages.common.share}
                width="20%"
              />
            </FlexRow>
          </Container>
        }
        unfocused={isOpenShareSheet}
      >
        <ScreenContainer
          navigation={navigation}
          headerLeft={<CancelButton onPress={() => navigation.navigate('YourLinks')} />}
          title={link.name}
          unfocused={isOpenShareSheet}
        >
          <ByAddress address={link.userId} />
          <H3>
            {link.claims.length} {link.claims.length > 1 ? 'claims' : 'claim'} . Private
          </H3>
          <ClaimsContainer>
            {link?.claims.map((claim, index) => {
              return (
                <Card key={index}>
                  <ClaimCardContent claim={claim} unfocused={isOpenShareSheet} />
                </Card>
              );
            })}
          </ClaimsContainer>
        </ScreenContainer>
      </Footer>
      {isOpenShareSheet && (
        <BottomSheetView
          title="Share"
          bottomSheetRef={bottomSheetRef}
          snapPoints={snapPointsShare}
          onChange={handleSheetChanges}
          setOpenSheet={setIsOpenShareSheet}
        >
          <LinkView linkTitle={link.name} owner={link.userId} />
          <BottomSheetBody>
            <LinkContainer>
              <SvgXml xml={securityLockIconXml} />
              <LinkHeader>
                <BodyEmphasized>Only be visible to you</BodyEmphasized>
                <H3>
                  Links are encrypted by default. To allow others to view it, they need to send a
                  request.
                </H3>
              </LinkHeader>
            </LinkContainer>
          </BottomSheetBody>
          <BottomSheetFooter>
            <CtaButton text={messages.editLink.copyUrl} onPress={copyToClipboard} width="48%" />
            <CtaButton
              text={messages.editLink.moreOptions}
              onPress={moreCopyOptions}
              width="48%"
              backgroundColor={theme.palette.common.lightGray}
              textColor={theme.palette.common.black}
            />
          </BottomSheetFooter>
        </BottomSheetView>
      )}
    </>
  );
};

export default ShareLink;
