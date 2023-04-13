import { flex1, flexColumn, flexRow, paddingLeft } from '@app/lib/styles/common'
import { paddingRight } from '@app/lib/styles/common'
import styled from 'styled-components/native'

export const Container = styled.View`
  ${paddingLeft[0]}
  ${paddingRight[0]}
  width: 100%;
  padding: 15px;
`

export const HeaderContainer = styled.View`
  height: 50px;
  ${flexRow}
`

export const BodyContainer = styled.View`
  ${flex1}
  gap: 20px;
`

export const TextContainer = styled.View`
  ${flexColumn}
`

export const FooterContainer = styled.View`
  ${flexRow}
  margin-top: 20px;
`
