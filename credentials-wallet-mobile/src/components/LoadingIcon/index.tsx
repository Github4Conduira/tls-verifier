import React from 'react';
import { CenteredImage, LoadingContainer } from '@app/components/LoadingIcon/style';

const LoadingIcon: React.FC = () => {
  return (
    <LoadingContainer>
      <CenteredImage source={require('@app/assets/loading.gif')} />
    </LoadingContainer>
  );
};

export default LoadingIcon;
