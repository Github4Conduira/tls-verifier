import React from 'react';
import { BodyEmphasized } from '@app/lib/styles/common';
import theme from '@app/lib/styles/theme';
import { Container } from './styles';

interface Props {
  text: string | number;
}

export const HighlitedText: React.FC<Props> = ({ text }) => {
  return (
    <Container>
      <BodyEmphasized color={theme.palette.accentColor}>{text}</BodyEmphasized>
    </Container>
  );
};
