import React from 'react'
import { Text, View } from 'react-native'
import { Container } from './styled'
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button
} from 'react-native-elements'
import firebase from 'firebase'

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  state = {
    email: '',
    password: '',
    status: 'not_yet',
    authentication: false
  }

  update = key => value => this.setState({ [key]: value, status: 'not_yet' })

  onSignUpPress = () => {
    const { email, password } = this.state
    this.setState({ status: 'requesting' })

    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(authentication =>
        this.setState({
          authentication,
          status: 'success',
          message: 'Successfully Signed up!'
        })
      )
      .catch(err => this.setState({ status: 'failure', message: err.message }))
  }

  onSignInPress = () => {
    const { email, password } = this.state
    this.setState({ status: 'requesting' })

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(authentication =>
        this.setState({
          authentication,
          status: 'success',
          message: 'Successfully Signed in!'
        })
      )
      .catch(err => this.setState({ status: 'failure', message: err.message }))
  }

  onSignOutPress = () =>
    firebase
      .auth()
      .signOut()
      .then(() =>
        this.setState({
          status: 'success',
          message: 'Successfully Signed out!'
        })
      )
      .catch(err => this.setState({ status: 'failure', message: err.message }))

  render() {
    const { email, password, status, message } = this.state
    return (
      <Container>
        <View>
          <FormLabel>{'email'}</FormLabel>
          <FormInput
            value={email}
            onChangeText={this.update('email')}
            autoCapitalize={'none'}
            autoCorrect={false}
            autoFocus={true}
            keyboardType={'email-address'}
          />
        </View>

        <View>
          <FormLabel>{'password'}</FormLabel>
          <FormInput
            value={password}
            onChangeText={this.update('password')}
            autoCapitalize={'none'}
            autoCorrect={false}
            autoFocus={false}
            keyboardType={'default'}
            secureTextEntry={true}
          />
        </View>

        <Button onPress={this.onSignUpPress} title={'SIGNUP'} />
        <Button onPress={this.onSignInPress} title={'SIGNIN'} />
        <Button onPress={this.onSignOutPress} title={'SIGNOUT'} />
        {status === 'failure' && (
          <FormValidationMessage>{message}</FormValidationMessage>
        )}
        {status === 'success' && <Text>{message}</Text>}
      </Container>
    )
  }
}
