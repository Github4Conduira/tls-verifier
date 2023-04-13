import React from 'react';
import { Pressable } from 'react-native';
import { H2, H3 } from '@app/lib/styles/common';
import { RepoContainer } from './styles';

interface Props {
  onPress: (provider: string, claim: string, param: string) => void;
  name: string;
  owner: string;
  lastCommit: string;
}

const RepoCard: React.FC<Props> = ({ onPress, name, owner, lastCommit }) => {
  return (
    <RepoContainer>
      <Pressable onPress={() => onPress('github', 'repoContribution', name)}>
        <H2>{name}</H2>
        <H3>
          {owner} . Last commit {lastCommit}
        </H3>
      </Pressable>
    </RepoContainer>
  );
};

export default RepoCard;
