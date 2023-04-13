import styled from 'styled-components/native'

interface IStyledButton {
  backgroundColor?: string
}

interface IStyledButtonText {
  color?: string
}

export const StyledButton = styled.Pressable<IStyledButton>`
  background-color: ${(props) => props.backgroundColor ?? props.theme.palette.common.white};
`

export const StyledButtonText = styled.Text<IStyledButtonText>`
  color: ${(props) => props.color ?? props.theme.palette.common.blue};
  font-weight: 700;
  font-size: 16px;
`
