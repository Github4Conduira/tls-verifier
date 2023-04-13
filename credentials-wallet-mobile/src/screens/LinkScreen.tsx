import React, { useEffect, useState } from 'react';
import { SvgXml } from 'react-native-svg';
import ActionButton from '@app/components/ActionButton';
import CancelButton from '@app/components/CancelButton';
import Card from '@app/components/Card';
import ClaimCardContent from '@app/components/ClaimCardContent';
import { CtaButton } from '@app/components/CtaButton';
import Footer from '@app/components/Footer';
import LoadingIcon from '@app/components/LoadingIcon';
import ScreenContainer from '@app/components/ScreenContainer';
import { getClient } from '@app/lib/client';
import { ClaimsContainer, ContainerView, H2, H3 } from '@app/lib/styles/common';
import theme from '@app/lib/styles/theme';
import { useReduxDispatch, useReduxSelector } from '@app/redux/config';
import { fetchLinkDetails } from '@app/redux/links/actions';
import { Claim, ClaimStatus, Link } from '@app/redux/links/types';
import { generateEphemeralWallet } from '@app/redux/userWallet/actions';
import { getEphemeralPublicKey, getUserPrivateKey } from '@app/redux/userWallet/selectors';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { privateIcon } from '../../public/private';
import { RootStackParamList } from '.';
import { getLinkById } from '@app/redux/links/selectors';
import ByAddress from '@app/components/ByAddress';

type Props = NativeStackScreenProps<RootStackParamList, 'LinkScreen'>;

const LinkScreen: React.FC<Props> = ({ navigation, route }) => {
  const linkId = route.params.link;

  const dispatch = useReduxDispatch();
  const masterPrivateKey = useReduxSelector(getUserPrivateKey);
  const ephemeralPublicKey = useReduxSelector(getEphemeralPublicKey);

  const [status, setStatus] = React.useState<string>('Pending');

  const link = useReduxSelector(getLinkById(linkId));
  const ePubKey = Buffer.from(ephemeralPublicKey, 'hex');

  const client = getClient(masterPrivateKey, true);

  useEffect(() => {
    dispatch(generateEphemeralWallet(false));
    if (linkId) {
      dispatch(fetchLinkDetails(linkId));
    }
  }, [linkId, dispatch]);

  const handleRequestAccess = async () => {
    setStatus('requesting ...');

    await client.createVerificationReq({
      linkId: linkId,
      communicationPublicKey: ePubKey,
      context: '',
    });

    setStatus('Access requested');
  };

  return (
    <>
      {link !== undefined ? (
        <Footer
          footer={
            <ContainerView>
              <SvgXml xml={privateIcon} />
              <H2>The link is private</H2>
              <H3>You must request access to view claims</H3>
              {status === 'Pending' ? (
                <CtaButton onPress={() => handleRequestAccess()} text="Request access" />
              ) : (
                <CtaButton
                  onPress={() => {}}
                  text={status}
                  backgroundColor={theme.palette.common.lightGray}
                  textColor={theme.palette.common.black}
                />
              )}
            </ContainerView>
          }
        >
          <ScreenContainer
            navigation={navigation}
            headerLeft={<CancelButton onPress={() => navigation.navigate('YourLinks')} />}
            title={link.name}
          >
            <ByAddress address={link.userId} />
            {link.claims && (
              <H3>
                {link?.claims.length} {link.claims.length > 1 ? 'claims' : 'claim'} . Private
              </H3>
            )}
            <ClaimsContainer>
              {link?.claims.map((claim: Claim, index: number) => {
                return (
                  <Card key={index}>
                    <ClaimCardContent claim={{ ...claim, status: ClaimStatus.MINTED }} />
                  </Card>
                );
              })}
            </ClaimsContainer>
          </ScreenContainer>
        </Footer>
      ) : (
        <LoadingIcon />
      )}
    </>
  );
};

export default LinkScreen;
