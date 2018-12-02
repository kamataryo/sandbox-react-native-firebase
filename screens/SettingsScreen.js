import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { View, Text } from 'react-native'
import { ExpoConfigView } from '@expo/samples'
import firebase from 'firebase'
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button
} from 'react-native-elements'

export class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings'
  }

  /**
   * propTypes
   * @type {object}
   */
  static propTypes = {
    authentication: PropTypes.any
  }

  /**
   * constructor
   * @param  {object} props React props.
   * @return {void}
   */
  constructor(props) {
    super(props)
    if (props.authentication) {
      const removeListner = this.setListener()
      this.state = { userData: {}, listnerReady: true, removeListner }
    } else {
      this.state = { userData: {}, listnerReady: false }
    }
  }

  setListener = () => {
    const userId = firebase.auth().currentUser.uid
    const ref = firebase.database().ref('users/' + userId)
    ref.on('value', snapshot =>
      this.setState({ userData: snapshot.val() || {} })
    )
    return () => ref.off()
  }

  /**
   * componentDidUpdate
   * @param  {object} prevProps prev props
   * @param  {object} prevState prev state
   * @param  {object} snapshot  snapshot
   * @return {void}
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { listnerReady } = this.state

    if (
      !listnerReady &&
      this.props.authentcation &&
      !prevProps.authentication
    ) {
      const removeListner = this.setListener()
      this.setState({ listnerReady: true, removeListner })
    }
  }

  /**
   * componentWillUnmount
   * @return {void}
   */
  componentWillUnmount() {
    typeof this.state.removeListner === 'function' && this.state.removeListner()
  }

  update = key => value =>
    this.setState({ userData: { ...this.state.userData, [key]: value } })

  onPress = () => {
    const { userData } = this.state
    const { authentication } = this.props
    if (!authentication) {
      return
    }
    const userId = firebase.auth().currentUser.uid
    const ref = firebase.database().ref('users/' + userId)
    ref.set(userData).then(() => console.log('firebase set'))
  }

  renderProfileConfig = () => {
    const { userData } = this.state
    return (
      <View>
        <FormLabel>{'username'}</FormLabel>
        <FormInput
          value={userData.username || ''}
          onChangeText={this.update('username')}
          autoCapitalize={'none'}
          autoCorrect={false}
        />
        <Button onPress={this.onPress} title={'UPDATE'} />
      </View>
    )
  }

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */

    const { authentication } = this.props

    return (
      <View>
        {authentication ? (
          this.renderProfileConfig()
        ) : (
          <Text>{'You are not signed in.'}</Text>
        )}
      </View>
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
    authentication: state.authentication.data
  }
}

export default connect(mapStateToProps)(SettingsScreen)
