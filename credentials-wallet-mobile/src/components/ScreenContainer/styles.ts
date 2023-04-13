import {
  flex1,
  flexColumn,
  flexRow,
  marginBottom,
  paddingLeft,
  RightView,
} from '@app/lib/styles/common';
import { paddingRight } from '@app/lib/styles/common';
import styled from 'styled-components/native';

export const Container = styled.View<{unfocused?: boolean}>`
  ${({ unfocused }) => !unfocused && `
    background-color: white;
  `}
  ${paddingLeft[0]}
  ${paddingRight[0]}
  height: 100%;
`;

export const HeaderContainer = styled.View`
  height: 50px;
  ${flexRow}
`;

export const HeaderLeftContainer = styled.View`
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
`;

export const HeaderMiddleContainer = styled.View`
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
  margin-left: auto;
`;

export const HeaderRightContainer = styled(RightView)`
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
`;

export const TitleContainer = styled.View`
  ${marginBottom[1]}
`;

export const BodyContainer = styled.View``;

export const FooterContainer = styled.View`
  ${flexColumn}
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
`;
