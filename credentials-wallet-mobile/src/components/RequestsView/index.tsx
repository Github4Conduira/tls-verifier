import { H3, RightView } from '@app/lib/styles/common';
import { Container, BodyContainer, FooterContainer, TextContainer } from './styles';
import messages from '@app/lib/messages.json';
import { RoundCtaButton } from '../CtaButton';
import RequestCard from '../RequestCard';
import { ScrollView } from 'react-native-gesture-handler';
import { GetVerificationRequestsResponse } from '@questbook/reclaim-client-sdk';

interface Props {
  request: GetVerificationRequestsResponse['requests'][0];
}

const RequestsView: React.FC<Props> = ({ request }) => {
  return (
    <Container>
      <ScrollView>
        <BodyContainer>
          <RequestCard request={request}></RequestCard>
        </BodyContainer>
      </ScrollView>
      <FooterContainer>
        <TextContainer>
          <H3 color="black" weight="700">
            Only you
          </H3>
          <H3>Share to give others access</H3>
        </TextContainer>
        <RightView></RightView>
        <RoundCtaButton
          onPress={() => console.log("Share isn't implemented yet")}
          text={messages.common.share}
          width="20%"
        />
      </FooterContainer>
    </Container>
  );
};

export default RequestsView;
