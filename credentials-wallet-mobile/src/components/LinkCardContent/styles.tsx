import { H3 } from '@app/lib/styles/common';
import styled from 'styled-components/native';

export const GrayH3 = styled(H3)`
  color: ${(props) => props.theme.palette.common.darkGray};
  margin-top: 8px;
`;

export const Container = styled.View`
  display: flex;
  flex-direction: column;
  padding-left: 15px;
`;
