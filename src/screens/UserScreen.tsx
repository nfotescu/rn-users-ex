import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useMachine} from '@xstate/react';
import React, {FC} from 'react';
import {ActivityIndicator, View, Image, StyleSheet, Text} from 'react-native';
import {RootStackParamList} from '../../App';
import singleUserFetchMachine from '../machine/UserMachine';
import {getUserFullName} from '../utils';

type Props = NativeStackScreenProps<RootStackParamList, 'User'>;

const UserScreen: FC<Props> = ({navigation, route}) => {
  const [current, send] = useMachine(singleUserFetchMachine, {
    context: {id: route.params.userId},
  });

  const {user} = current.context;

  send('FETCH');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    image: {
      width: '50%',
      height: '25%',
    },
  });

  if (current.matches('loading') || current.matches('idle')) {
    return <ActivityIndicator size="large" />;
  }

  if (current.context.errorMessage) {
    return <Text>{current.context.errorMessage}</Text>;
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        resizeMode="cover"
        source={{
          uri: user?.image,
        }}
      />
      <Text>{getUserFullName(user!)}</Text>
      <Text>{user?.age}</Text>
      <Text>{user?.address?.city}</Text>
    </View>
  );
};

export {UserScreen};
