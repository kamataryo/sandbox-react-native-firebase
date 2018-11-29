import React from 'react'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'
import { AppLoading, Asset, Font, Icon } from 'expo'
import AppNavigator from './navigation/AppNavigator'
import styled from 'styled-components'

const AppView = styled.View`
  flex: 1;
  background-color: #fff;
`

export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  }

  _loadResourcesAsync = async () =>
    Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png')
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in home-screen/index.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf')
      })
    ])

  // In this case, you might want to report the error to your error
  // reporting service, for example Sentry
  onLoadingError = error => console.warn(error)
  onLoadingFinish = () => this.setState({ isLoadingComplete: true })

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this.onLoadingError}
          onFinish={this.onLoadingFinish}
        />
      )
    } else {
      return (
        <AppView>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </AppView>
      )
    }
  }
}
