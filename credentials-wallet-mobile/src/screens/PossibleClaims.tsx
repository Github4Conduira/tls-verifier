import React from 'react';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app/screens';
import ScreenContainer from '@app/components/ScreenContainer';
import BackButton from '@app/components/BackButton';
import MenuButton from '@app/components/MenuButton';
import { PROVIDERS } from '@app/providers';
import PossibleClaimCard from '@app/components/PossibleClaimCard';
import { useReduxDispatch, useReduxSelector } from '@app/redux/config';
import { addClaim } from '@app/redux/links/actions';
import { getTempLink } from '@app/redux/links/selectors';

type Props = NativeStackScreenProps<RootStackParamList, 'PossibleClaims'>;

const PossibleClaims: React.FC<Props> = ({ navigation, route }) => {
  const { provider } = route.params;
  const dispatch = useReduxDispatch();
  const link = useReduxSelector(getTempLink);

  const providerData = PROVIDERS.find((p) => p.provider === provider);

  return (
    <ScreenContainer
      navigation={navigation}
      title="Possible Claims"
      headerLeft={<BackButton onPress={() => navigation.goBack()} />}
      headerRight={<MenuButton onPress={() => {}} />}
    >
      {providerData &&
        Object.values(providerData.possibleClaims).map((possibleClaim) => (
          <PossibleClaimCard
            key={possibleClaim.description}
            provider={providerData}
            possibleClaim={possibleClaim}
            onPress={() => {
              dispatch(
                addClaim({
                  provider: providerData,
                  claimName: possibleClaim.providerName,
                  link,
                  isTemp: true,
                })
              );
              navigation.navigate('CreateLink');
            }}
          />
        ))}
    </ScreenContainer>
  );
};

export default PossibleClaims;
