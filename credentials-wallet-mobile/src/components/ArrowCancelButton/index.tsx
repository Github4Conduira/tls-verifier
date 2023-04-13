import React from 'react';
import { Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { arrowCancelIconXml } from '../../assets/svgs';

interface Props {
  onPress: () => void;
}

const ArrowCancelButton: React.FC<Props> = ({ onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <SvgXml xml={arrowCancelIconXml} width="24px" height="24px" />
    </Pressable>
  );
};

export default ArrowCancelButton;
