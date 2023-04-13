import React from 'react';
import { Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { backIconXml } from '../../assets/svgs';

interface Props {
  onPress: () => void;
}

const BackButton: React.FC<Props> = ({ onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <SvgXml xml={backIconXml} />
    </Pressable>
  );
};

export default BackButton;
