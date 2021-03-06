import React from 'react'
import { createSwitchNavigator } from 'react-navigation'
import { Platform } from 'react-native'
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation'

import TabBarIcon from '../components/TabBarIcon'

// screens
import HomeScreen from '../screens/home-screen'
import LoginScreen from '../screens/login-screen'
import LinksScreen from '../screens/LinksScreen'
import SettingsScreen from '../screens/SettingsScreen'

const HomeStack = createStackNavigator({
  Home: HomeScreen,
})

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={ focused }
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
}

const LoginStack = createStackNavigator({
  Login: LoginScreen,
})

LoginStack.navigationOptions = {
  tabBarLabel: 'Login',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={ focused }
      name={ Platform.OS === 'ios' ? 'ios-person' : 'md-person' }
    />
  ),
}

const LinksStack = createStackNavigator({
  Links: LinksScreen,
})

LinksStack.navigationOptions = {
  tabBarLabel: 'Links',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={ focused }
      name={ Platform.OS === 'ios' ? 'ios-link' : 'md-link' }
    />
  ),
}

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
})

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={ focused }
      name={ Platform.OS === 'ios' ? 'ios-options' : 'md-options' }
    />
  ),
}

const MainTabNavigator = createBottomTabNavigator({
  HomeStack,
  LoginStack,
  LinksStack,
  SettingsStack,
})

export default createSwitchNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  Main: MainTabNavigator,
})
