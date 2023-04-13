import styled from 'styled-components/native';
import { flexRow } from '@app/lib/styles/common';
import theme from '@app/lib/styles/theme';
import { manropeFont } from '@app/lib/styles/common';
import { flexColumn } from '@app/lib/styles/common';

export const HeaderContainer = styled.View`
  ${flexRow}
  padding-bottom: 20px;
  gap: 10px;
`;

export const HighlighContainer = styled.View<{ color?: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  padding: 5px;
  border-radius: 8px;
  background-color: ${(props) => props.color ?? props.theme.palette.common.lightGray};
  margin-right: auto;
`;

export const ClaimContainer = styled.View`
  ${flexColumn}
`;
