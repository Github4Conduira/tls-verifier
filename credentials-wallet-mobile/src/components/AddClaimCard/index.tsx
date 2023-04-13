import React from 'react';
import { GrayContainer, InfoContainer } from '@app/components/AddClaimCard/styles';
import { GrayH3 } from '@app/components/LinkCardContent/styles';
import PlusButton from '@app/components/PlusButton';
import messages from '@app/lib/messages.json';
import { H2 } from '@app/lib/styles/common';

interface Props {
  handleAddPress: () => void;
}

const AddClaimCard: React.FC<Props> = ({ handleAddPress }) => {
  return (
    <GrayContainer>
      <PlusButton onPress={handleAddPress} />
      <InfoContainer>
        <H2>{messages.createLink.card.title}</H2>
        <GrayH3>{messages.createLink.card.description}</GrayH3>
      </InfoContainer>
    </GrayContainer>
  );
};

export default AddClaimCard;
