import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Leaderboard from './screens/leaderboard'
import Menu from './screens/menu';
import TicTacToe from './screens/ticTacToe'
import Home from './screens/Home'
import firestore from '@react-native-firebase/firestore';


const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} /> 
        <Stack.Screen name="Leaderboard" component={Leaderboard} />
        <Stack.Screen name="Menu" component={Menu} />
        <Stack.Screen name="TicTacToe" component={TicTacToe} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({})