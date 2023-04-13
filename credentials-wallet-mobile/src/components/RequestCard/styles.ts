import { flex1, flexRow } from '@app/lib/styles/common'
import styled from 'styled-components/native'

export const Container = styled.View`
  background-color: ${(props) => props.theme.palette.common.white};
  border-radius: 16px;
  padding: 15px;
  gap: 10px;
`

export const HeaderContainer = styled.View`
  height: 50px;
  ${flexRow}
`

export const BodyContainer = styled.View`
  ${flex1}
`

export const FooterContainer = styled.View`
  ${flexRow}
  margin-top: 5px;
  gap: 5px;
`
