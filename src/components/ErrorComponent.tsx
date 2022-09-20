import React, {FC} from 'react';
import {Text, View} from 'react-native';

const ErrorComponent: FC<{error: string}> = ({error}) => (
  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
    <Text style={{color: 'red'}}>{error}</Text>
  </View>
);

export {ErrorComponent};
