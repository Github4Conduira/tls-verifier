import styled from 'styled-components/native'

interface ButtonProps {
  backgroundColor?: string
  width?: string
  disabled?: boolean
}

interface RoundedProps {
  width?: string
  borderRadius?: string
}

export const StyledButton = styled.Pressable<ButtonProps>`
  background-color: ${(props) => props.backgroundColor ?? props.theme.palette.common.blue};
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: ${(props) => props.width ?? '100%'};
`

export const StyledRoundCtaButton = styled(StyledButton)<RoundedProps>`
  height: 40px;
  border-radius: ${(props) => props.borderRadius ?? '24px'};
  width: ${(props) => props.width ?? '100%'};
`
