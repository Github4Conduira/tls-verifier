import React from 'react';
import { StyledButton, StyledButtonText } from './styles';

interface IButton {
  onPress: () => void;
  backgroundColor?: string;
  text?: string;
  textColor?: string;
}

const ActionButton: React.FC<IButton> = ({ onPress, text, backgroundColor, textColor }) => {
  return (
    <StyledButton onPress={onPress} backgroundColor={backgroundColor}>
      <StyledButtonText color={textColor}>{text}</StyledButtonText>
    </StyledButton>
  );
};

export default ActionButton;
