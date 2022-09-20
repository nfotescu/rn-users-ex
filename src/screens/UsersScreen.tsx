import {useMachine} from '@xstate/react';
import React, {FC} from 'react';
import {ActivityIndicator, Button, FlatList, View} from 'react-native';
import usersInfiniteScrollMachine from '../machine/UsersMachine';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../../App';
import {getUserFullName} from '../utils';
import {ErrorComponent} from '../components/ErrorComponent';

type Props = NativeStackScreenProps<RootStackParamList, 'Users'>;

const UsersScreen: FC<Props> = ({navigation}) => {
  const [current, send] = useMachine(usersInfiniteScrollMachine);

  if (current.matches('fetchingUsers')) {
    return <ActivityIndicator size="large" />;
  }

  if (current.context.errorMessage) {
    return <ErrorComponent error={current.context.errorMessage} />;
  }

  return (
    <View style={{flex: 1, width: '100%'}}>
      <FlatList
        data={current.context.data}
        onEndReachedThreshold={0.2}
        onEndReached={() => {
          send('SCROLL_TO_BOTTOM');
        }}
        renderItem={({item}) => (
          <Button
            title={getUserFullName(item)}
            onPress={() => navigation.navigate('User', {userId: item.id})}
          />
        )}
      />
    </View>
  );
};

export {UsersScreen};
