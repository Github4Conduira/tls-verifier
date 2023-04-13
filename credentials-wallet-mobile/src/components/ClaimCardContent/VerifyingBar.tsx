import React from 'react';
import { FlexColumn, FlexRow, H3 } from '@app/lib/styles/common';
import { BarContainer } from './styles';
import { Animated, Easing } from 'react-native';
import { loader } from '@app/assets/svgs';
import { SvgXml } from 'react-native-svg';
import { CreateStep } from '@questbook/reclaim-node';

interface Props{
  message?: CreateStep['name'];
}

const fullMessage: Record<CreateStep['name'], string> = {
  'creating': 'Created claim on chain, contacting witnesses...',
  'witness-done': 'Collected a few signatures, almost there...'
}

const VerifyingBar: React.FC<Props> = ({ message }) => {
  const spinValue = new Animated.Value(0);

  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 360,
      duration: 600000,
      easing: Easing.linear,
      useNativeDriver: true,
    })
  ).start();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  return (
    <BarContainer>
      <FlexRow gap="15px">
        <Animated.View
          style={{
            transform: [{ rotate: spin }],
          }}
        >
          <SvgXml xml={loader} />
        </Animated.View>
        <FlexColumn>
          <H3 color="black" weight="700">
            Verifying this claim
          </H3>
          <H3 weight="500">{message ? fullMessage[message] : 'Creating claim on chain, assigning witnesses...'}</H3>
          <H3 weight="500">This may take up to 30 seconds</H3>
        </FlexColumn>
      </FlexRow>
    </BarContainer>
  );
};

export default VerifyingBar;
