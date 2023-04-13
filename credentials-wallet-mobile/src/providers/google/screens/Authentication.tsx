import React from 'react';
import LoadingIcon from '@app/components/LoadingIcon';
import { ProvidersStackScreenProps } from '@app/providers/navigation';
import { useReduxDispatch } from '@app/redux/config';
import { fetchGoogleInfo } from '@app/providers/google/redux/userInfo/actions';

type Props = ProvidersStackScreenProps<'google', 'Authentication'>;

const Authentication: React.FC<Props> = ({ navigation, route }) => {
  const { returnScreen } = route.params;
  const dispatch = useReduxDispatch();

  React.useEffect(() => {
    if (!returnScreen || !navigation) return;

    dispatch(fetchGoogleInfo()).then(() => navigation.navigate(...returnScreen));
  }, [returnScreen, navigation]);

  return <LoadingIcon />;
};

export default Authentication;
