import { font, manropeFont } from '@app/lib/styles/common'
import styled from 'styled-components/native'

export const NotificationText = styled.Text<{ color?: string, weight?: string }>`
  ${manropeFont}
  font-weight: ${(props) => props.weight ?? 500};
  ${font[2]}
  line-height: 16px;
  color: ${(props) => props.color ?? props.theme.palette.common.black};
  margin-right: 50px;
`
