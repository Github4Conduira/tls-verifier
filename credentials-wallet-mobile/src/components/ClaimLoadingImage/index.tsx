import React from 'react';
import { SvgXml } from 'react-native-svg';
import { claimLoadingIconXml } from '../../assets/svgs';

const ClaimLoadingImage: React.FC = () => {
  return <SvgXml xml={claimLoadingIconXml} />;
};

export default ClaimLoadingImage;
