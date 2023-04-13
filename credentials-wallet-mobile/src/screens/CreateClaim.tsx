import React from 'react';
import BackButton from '@app/components/BackButton';
import { GrayH3 } from '@app/components/LinkCardContent/styles';
import ScreenContainer from '@app/components/ScreenContainer';
import messages from '@app/lib/messages.json';
import { FlexRow, makeMarginTopComponent, RightView, H2, FlexColumn } from '@app/lib/styles/common';
import { useReduxDispatch, useReduxSelector } from '@app/redux/config';
import { PROVIDERS } from '@app/providers';
import LoadingIcon from '@app/components/LoadingIcon';
import { isAppLoading } from '@app/redux/selectors';
import { SizedImage } from '@app/components/ProviderIcon/styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@app/screens';
import { Pressable } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { nextIconXml } from '@app/assets/svgs';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateClaim'>;

const Margin = makeMarginTopComponent(2);

const CreateClaim: React.FC<Props> = ({ navigation }) => {
  const dispatch = useReduxDispatch();
  const isLoading = useReduxSelector(isAppLoading);

  if (isLoading) return <LoadingIcon />;
  return (
    <ScreenContainer
      navigation={navigation}
      headerLeft={
        <>
          <BackButton onPress={() => navigation.goBack()} />
        </>
      }
      title={messages.createClaim.title}
    >
      <GrayH3>{messages.createClaim.description}</GrayH3>
      <Margin />
      <FlexColumn gap="20px">
        {PROVIDERS.map((provider) => {
          return (
            <Pressable
              key={provider.provider}
              onPress={async () => {
                navigation.navigate('Providers', {
                  screen: provider.provider,
                  params: {
                    screen: 'Authentication',
                    params: {
                      returnScreen: ['PossibleClaims', { provider: provider.provider }],
                    },
                  },
                });
              }}
            >
              <FlexRow>
                <SizedImage source={provider.iconPath} height={36} width={36} />
                <H2>
                  {'  '} {provider.name}
                </H2>
                <RightView>
                  <SvgXml xml={nextIconXml} />
                </RightView>
              </FlexRow>
            </Pressable>
          );

          function navigateToPossibleClaims() {
            navigation.navigate('PossibleClaims', { provider: provider.provider });
          }
        })}
      </FlexColumn>
    </ScreenContainer>
  );
};

export default CreateClaim;
