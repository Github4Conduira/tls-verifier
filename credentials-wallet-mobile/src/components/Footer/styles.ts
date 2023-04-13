import styled from 'styled-components/native'

export const FooterView = styled.View<{ height?: string }>`
  align-items: center;
  margin-top: 4px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: ${(props) => props.theme.palette.common.lightGray};
`

export const ExtendedScrollView = styled.ScrollView<{ unfocused?: boolean }>`
  background-color: ${(props) => props.unfocused ? props.theme.palette.unfocusedBackground : props.theme.palette.common.white};
  flex: 1;
`
