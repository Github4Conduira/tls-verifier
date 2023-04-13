import React from 'react';
import { Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { menuIconXml } from '../../assets/svgs';

interface Props {
  onPress: () => void;
}

const MenuButton: React.FC<Props> = ({ onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <SvgXml xml={menuIconXml} />
    </Pressable>
  );
};

export default MenuButton;
