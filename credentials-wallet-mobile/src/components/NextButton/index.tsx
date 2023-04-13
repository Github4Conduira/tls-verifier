import React from 'react';
import { Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { nextIconXml } from '../../assets/svgs';

interface Props {
  onPress: () => void;
}

const NextButton: React.FC<Props> = ({ onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <SvgXml xml={nextIconXml} />
    </Pressable>
  );
};

export default NextButton;
