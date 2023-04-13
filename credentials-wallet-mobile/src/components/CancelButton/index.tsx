import React from 'react';
import { Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { cancelIconXml } from '../../assets/svgs';

interface Props {
  onPress: () => void;
}

const CancelButton: React.FC<Props> = ({ onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <SvgXml xml={cancelIconXml} width="24px" height="24px" />
    </Pressable>
  );
};

export default CancelButton;
