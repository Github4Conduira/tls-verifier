import { padding } from '@app/lib/styles/common';
import styled from 'styled-components/native';

export const Container = styled.View`
  ${padding[0]}
  border: 1px solid rgba(0, 0, 0, 0.1);

  // TODO: Shadows not working in react native, fix it.
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08);
  border-radius: 12px;

  margin-bottom: 12px;
`;
