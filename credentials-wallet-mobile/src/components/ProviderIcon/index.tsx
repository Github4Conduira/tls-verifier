import React from 'react';
import { SizedImage } from '@app/components/ProviderIcon/styles';
import { ProviderType } from '@app/providers';

interface Props {
  provider: ProviderType;
  height?: number;
  width?: number;
}

const ProviderIcon: React.FC<Props> = ({ provider, height = 50, width = 50 }) => {
  if (provider === 'google-login') {
    return <SizedImage source={require('@app/assets/google.png')} height={height} width={width} />;
  }
  if (provider === 'github-repo') {
    return <SizedImage source={require('@app/assets/github.png')} height={height} width={width} />;
  }
  return <></>;
};

export default ProviderIcon;
