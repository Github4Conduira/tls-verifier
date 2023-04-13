import React, { useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import CancelButton from '@app/components/CancelButton';
import Card from '@app/components/Card';
import ClaimCardContent from '@app/components/ClaimCardContent';
import Footer from '@app/components/Footer';
import RequestsView from '@app/components/RequestsView';
import ScreenContainer from '@app/components/ScreenContainer';
import { H3 } from '@app/lib/styles/common';
import { useReduxDispatch, useReduxSelector } from '@app/redux/config';
import { getLinkById } from '@app/redux/links/selectors';
import { Claim } from '@app/redux/links/types';
import { getVerificationRequestDetails } from '@app/redux/verificationRequests/actions';
import { RootStackParamList } from '@app/screens';
import { GetVerificationRequestsResponse } from '@questbook/reclaim-client-sdk';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import ByAddress from '@app/components/ByAddress';
import LoadingIcon from '@app/components/LoadingIcon';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationInfo'>;

const NotificationInfo: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useReduxDispatch();
  const [request, setRequest] = React.useState<GetVerificationRequestsResponse['requests'][0]>();
  const [loading, setLoading] = React.useState(true);

  const verificationReqId = route.params.id;
  const linkId = route.params.linkId;

  const link = useReduxSelector(getLinkById(linkId));

  useEffect(() => {
    dispatch(getVerificationRequestDetails({ verificationReqId })).then((request) => {
      setRequest(request.payload);
      setLoading(false);
    });
  }, [dispatch, verificationReqId]);

  return (
    <>
      {link !== null && link !== undefined && !loading ? (
        <Footer footer={<RequestsView request={{ ...request, link: link }} />}>
          <ScreenContainer
            headerLeft={<CancelButton onPress={() => navigation.navigate('NotificationHome')} />}
            title={link.name}
          >
            <ByAddress address={link.userId} />
            <H3>
              {link.claims.length} {link.claims.length > 1 ? 'claims' : 'claim'}. Private
            </H3>
            <ScrollView>
              {link?.claims.map((claim: Claim, index: number) => {
                return (
                  <Card key={index}>
                    <ClaimCardContent claim={claim} />
                  </Card>
                );
              })}
            </ScrollView>
          </ScreenContainer>
        </Footer>
      ) : (
        <LoadingIcon />
      )}
    </>
  );
};

export default NotificationInfo;
