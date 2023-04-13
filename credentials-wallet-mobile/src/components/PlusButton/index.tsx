import React from 'react';
import { Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { plusIconXml } from '../../assets/svgs';

interface Props {
  onPress: () => void;
}

const PlusButton: React.FC<Props> = ({ onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <SvgXml xml={plusIconXml} />
    </Pressable>
  );
};

export default PlusButton;
