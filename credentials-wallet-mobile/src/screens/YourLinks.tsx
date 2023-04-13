import React, { useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import ActionButton from '@app/components/ActionButton';
import Card from '@app/components/Card';
import LinkCardContent from '@app/components/LinkCardContent';
import ScreenContainer from '@app/components/ScreenContainer';
import messages from '@app/lib/messages.json';
import { H3 } from '@app/lib/styles/common';
import { useReduxDispatch, useReduxSelector } from '@app/redux/config';
import { resetTempLink } from '@app/redux/links';
import { createNewLink } from '@app/redux/links/actions';
import { getLinksList, isLinkMine } from '@app/redux/links/selectors';
import { type Link } from '@app/redux/links/types';
import { type Template } from '@app/redux/templates/types';
import { generateEphemeralWallet } from '@app/redux/userWallet/actions';
import { getUserPublicKey } from '@app/redux/userWallet/selectors';
import { type NativeStackScreenProps } from '@react-navigation/native-stack';
import { type RootStackParamList } from '.';
import EmptyState from '@app/components/EmptyState';

type Props = NativeStackScreenProps<RootStackParamList, 'YourLinks'>;

const YourLinks: React.FC<Props> = ({ navigation }) => {
  const links = useReduxSelector(getLinksList);
  const publicKey = useReduxSelector(getUserPublicKey);
  const dispatch = useReduxDispatch();
  console.log(links);
  const handleShareClick = React.useCallback(
    (link: Link) => {
      navigation.navigate('ShareLink', { link });
    },
    [navigation]
  );

  const renderLinkScreen = React.useCallback(
    (link: Link) => {
      navigation.navigate('LinkScreen', { link: link.id });
    },
    [navigation]
  );

  const renderTemplateScreen = React.useCallback(
    (template: Template) => {
      navigation.navigate('Template', { template });
    },
    [navigation]
  );

  const handleCreateLink = React.useCallback(() => {
    dispatch(resetTempLink());
    dispatch(createNewLink(publicKey));
    navigation.navigate('CreateLink');
  }, [dispatch, navigation, publicKey]);

  useEffect(() => {
    dispatch(generateEphemeralWallet(false));
  }, [dispatch]);

  return (
    <ScreenContainer
      navigation={navigation}
      headerRight={<ActionButton onPress={handleCreateLink} text={messages.common.create} />}
      title={messages.yourLinks.title}
    >
      {(!links || links.length === 0) && <EmptyState onPress={handleCreateLink} />}
      <ScrollView>
        {links?.map((link, index) => {
          return (
            <Card key={index}>
              <LinkCardContent
                link={link}
                handleShareClick={() => {
                  handleShareClick(link);
                }}
                handleMenuButtonPress={() => {
                  renderLinkScreen(link);
                }}
              />
            </Card>
          );
        })}
      </ScrollView>
    </ScreenContainer>
  );
};

export default YourLinks;
