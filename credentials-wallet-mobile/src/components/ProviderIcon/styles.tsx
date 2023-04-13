import styled from 'styled-components/native';

interface SizeImageProps {
  height: number;
  width: number;
  unfocused?: boolean;
}
export const SizedImage = styled.Image<SizeImageProps>`
  height: ${(props) => props.height}px;
  width: ${(props) => props.width}px;
  opacity: ${(props) => (props.unfocused ? 0.2 : 1)};
`;
