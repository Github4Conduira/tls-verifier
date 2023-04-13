import { flex1 } from '@app/lib/styles/common';
import styled from 'styled-components/native';

export const LoadingContainer = styled.View`
  z-index: 9999;
  ${flex1};
  background-color: white;
`;

export const CenteredImage = styled.Image`
  margin: auto;
`;
