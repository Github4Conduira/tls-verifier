import { View } from 'react-native';
import { ExtendedScrollView, FooterView } from './styles';

interface Props {
  footer: React.ReactNode;
  children: React.ReactNode;
  height?: string;
  unfocused?: boolean;
}

const Footer: React.FC<Props> = ({ footer, children, height, unfocused }) => {
  return (
    <View style={{ flex: 1 }}>
      <ExtendedScrollView unfocused={unfocused}>{children}</ExtendedScrollView>
      <FooterView height={height}>{footer}</FooterView>
    </View>
  );
};

export default Footer;
