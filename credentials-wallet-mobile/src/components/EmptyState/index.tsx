import React from 'react';
import { SvgXml } from 'react-native-svg';
import { emptyLink } from '../../assets/svgs';
import { Container } from './styles';
import { H3, H2 } from '@app/lib/styles/common';
import { CtaButton } from '../CtaButton';

interface Props {
  onPress: () => void;
}

const EmptyState: React.FC<Props> = ({ onPress }) => {
  return (
    <Container>
      <SvgXml xml={emptyLink} />
      <H2>Prove yourself privately</H2>
      <H3 weight="500" style={{ textAlign: 'center' }}>
        Create a link to prove certain claims like owning a username, contributing to a Github
        repository and others
      </H3>
      <CtaButton onPress={onPress} text={'Create link'} width="100px" />
    </Container>
  );
};

export default EmptyState;
