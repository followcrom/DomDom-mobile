import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './Home';
import Text from './Text';
import Search from './Search';
import Speech from './Speech';
import Mediatations from './Meditations';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'RanDOM WisDOM' }}
        />
        <Stack.Screen
          name="Text"
          component={Text}
          options={{ 
            headerShown: true,
            headerStyle: { height: 40 },
          }}
        />
        <Stack.Screen
          name="Speech"
          component={Speech}
          options={{ headerShown: true,
            headerStyle: { height: 40 },
          }}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{ headerShown: true,
            headerStyle: { height: 40 },
          }}
        />
          <Stack.Screen
          name="Meditations"
          component={Mediatations}
          options={{ headerShown: true,
            headerStyle: { height: 40 },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
