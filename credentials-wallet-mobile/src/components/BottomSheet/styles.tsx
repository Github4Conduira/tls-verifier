import styled from 'styled-components/native';
import BottomSheet from '@gorhom/bottom-sheet';

export const Container = styled.View`
  background-color: ${(props) => props.theme.palette.common.white};
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 24px;
`;

export const Header = styled.View`
  background-color: ${(props) => props.theme.palette.common.white};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const LinkHeader = styled.View`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const LinkContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  padding-right: 50px;
`;

export const BottomSheetBody = styled.View`
  background: rgba(51, 47, 237, 0.1);
  border-radius: 24px;
  padding: 16px;
`;

export const BottomSheetFooter = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
`;

export const BottomSheetContainer = styled(BottomSheet)``;
