import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Text, View, TouchableOpacity } from 'react-native'
import { Container, LoginItem } from './styled'
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button,
} from 'react-native-elements'
import firebase from 'firebase'
import { createActions as createAuthenticationActions } from '../../reducers/authentication'

export class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }

  /**
   * propTypes
   * @type {object}
   */
  static propTypes = {
    // stateProps
    authentication: PropTypes.any.isRequired,
    // dispatchProps
    setAuthentication: PropTypes.func.isRequired,
    unsetAuthentication: PropTypes.func.isRequired,
  }

  state = {
    email: '',
    password: '',
    status: 'not_yet',
  }

  update = key => value => this.setState({ [key]: value, status: 'not_yet' })

  onSignUpPress = () => {
    const { email, password } = this.state
    this.setState({ status: 'requesting' })

    firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(() =>
        firebase.auth().createUserWithEmailAndPassword(email, password),
      )
      .then(authentication => {
        this.props.setAuthentication(authentication)
        this.setState({
          status: 'success',
          message: 'Successfully Signed up!',
        })
        authentication.sendEmailVerification()
      })
      .catch(err => this.setState({ status: 'failure', message: err.message }))
  }

  onSignInPress = () => {
    const { email, password } = this.state
    this.setState({ status: 'requesting' })

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(authentication => {
        this.props.setAuthentication(authentication)
        this.setState({
          status: 'success',
          message: 'Successfully Signed in!',
        })
      })
      .catch(err => this.setState({ status: 'failure', message: err.message }))
  }

  onSignOutPress = () =>
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.unsetAuthentication()
        this.setState({
          status: 'success',
          message: 'Successfully Signed out!',
        })
      })
      .catch(err => this.setState({ status: 'failure', message: err.message }))

  onVerificationEmailRequestPress = () =>
    firebase.auth().currentUser.sendEmailVerification()

  renderInputs = () => {
    const { email, password, status, message } = this.state
    return (
      <View>
        <LoginItem>
          <FormLabel>{'email'}</FormLabel>
          <FormInput
            value={ email }
            onChangeText={ this.update('email') }
            autoCapitalize={ 'none' }
            autoCorrect={ false }
            autoFocus
            keyboardType={ 'email-address' }
          />
          <FormLabel>{'password'}</FormLabel>
          <FormInput
            value={ password }
            onChangeText={ this.update('password') }
            autoCapitalize={ 'none' }
            autoCorrect={ false }
            autoFocus={ false }
            keyboardType={ 'default' }
            secureTextEntry
          />
        </LoginItem>

        <LoginItem>
          <Button onPress={ this.onSignUpPress } title={ 'SIGNUP' } />
        </LoginItem>

        <LoginItem>
          <Button onPress={ this.onSignInPress } title={ 'SIGNIN' } />
        </LoginItem>
      </View>
    )
  }

  renderSignOut = () => (
    <View>
      <Button onPress={ this.onSignOutPress } title={ 'SIGNOUT' } />
      {this.props.authentication.user.emailVerified || (
        <TouchableOpacity onPress={ this.onVerificationEmailRequestPress }>
          <Text>{'send verification email'}</Text>
        </TouchableOpacity>
      )}
    </View>
  )

  render() {
    const { email, password, status, message } = this.state
    const { authentication } = this.props
    return (
      <Container>
        {authentication ? this.renderSignOut() : this.renderInputs()}

        {status === 'failure' && (
          <FormValidationMessage>{message}</FormValidationMessage>
        )}
        {status === 'success' && <Text>{message}</Text>}
      </Container>
    )
  }
}

/**
 * map state to props
 * @param  {object} state    state tree
 * @param  {object} ownProps own props
 * @return {object}          state props
 */
const mapStateToProps = (state, ownProps) => {
  return {
    authentication: state.authentication.data,
  }
}

/**
 * map dispatch to props
 * @param  {function} dispatch dispatcher
 * @param  {object}   ownProps own props
 * @return {object}            dispatch props
 */
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setAuthentication: auth => dispatch(createAuthenticationActions.set(auth)),
    unsetAuthentication: () => dispatch(createAuthenticationActions.unset()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoginScreen)
