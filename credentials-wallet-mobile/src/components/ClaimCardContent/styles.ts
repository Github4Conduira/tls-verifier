import { padding } from '@app/lib/styles/common'
import styled from 'styled-components/native'

export const BarContainer = styled.View`
  background-color: ${(props) => props.theme.palette.common.lightGray};
  border-color: ${(props) => props.theme.palette.common.lightGray};
  margin-right: -16px;
  margin-bottom: -16px;
  margin-left: -16px;
  border-bottom-right-radius: 12px;
  border-bottom-left-radius: 12px;
  ${padding[0]}
`

export const ContentContainer = styled.View<{ opacity?: number }>`
  opacity: ${(props) => props.opacity ?? 1};
`
