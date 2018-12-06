import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Constants, ImagePicker, Permissions } from 'expo'
import { View, Text } from 'react-native'
import { ExpoConfigView } from '@expo/samples'
import firebase from 'firebase'
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
  Button,
  CheckBox,
  Avatar,
} from 'react-native-elements'

const convertBlobToBase64 = blob =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => resolve(reader.result)
    reader.readAsDataURL(blob)
  })

export class SettingsScreen extends React.Component {
  static navigationOptions = {
    title: 'Settings',
  }

  /**
   * propTypes
   * @type {object}
   */
  static propTypes = {
    authentication: PropTypes.any,
  }

  /**
   * defaultProps
   * @type {object}
   */
  static defaultProps = {
    authentication: false,
  }

  /**
   * constructor
   * @param  {object} props React props.
   * @return {void}
   */
  constructor(props) {
    super(props)
    this.state = { userData: {}, listnerReady: !!props.authentication }
  }

  /**
   * componentDidMount
   * @return {void}
   */
  componentDidMount() {
    const removeListner = this.setListener()
    this.setState({ removeListner })
  }

  /**
   * componentDidUpdate
   * @param  {object} prevProps prev props
   * @param  {object} prevState prev state
   * @param  {object} snapshot  snapshot
   * @return {void}
   */
  componentDidUpdate(prevProps) {
    const { listnerReady } = this.state

    if (
      !listnerReady &&
      this.props.authentication &&
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

  setListener = () => {
    // metadata
    const { currentUser } = firebase.auth()
    const userId = currentUser.uid
    const userDataRef = firebase.database().ref('users/' + userId)
    this.setState({ user: currentUser })

    userDataRef.on('value', snapshot =>
      this.setState({ userData: snapshot.val() || {} }),
    )

    return () => userDataRef.off()
  }

  update = key => value =>
    this.setState({ userData: { ...this.state.userData, [key]: value } })

  updateRole = role => () => {
    const prevRole = this.state.userData.roles || {}
    const nextRole = { ...prevRole, [role]: !prevRole[role] }
    this.setState({ userData: { ...this.state.userData, roles: nextRole } })
  }

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

  pickImage = async () => {
    const { status: cameraRollPerm } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL,
    )

    // only if user allows permission to camera roll
    if (cameraRollPerm === 'granted') {
      const { uri } = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      })

      if (!uri) {
        return
      }

      const uriParts = uri.split('.')
      const fileType = uriParts[uriParts.length - 1]

      // Create a Storage Ref w/ username
      const imageRef = firebase
        .storage()
        .ref()
        .child(`users/${this.state.user.uid}/profile.image`)

      const blob = await fetch(uri).then(res => res.blob())

      // Upload file
      imageRef
        .put(blob, { fileType })
        .then(console.log)
        .catch(console.error)
    }
  }

  renderProfileConfig = () => {
    const { userData, user } = this.state
    const roles = userData.roles || {}

    return (
      <View>
        <Avatar
          xlarge
          rounded
          source={ user && { uri: user.photoUrl } }
          onPress={ this.pickImage }
          activeOpacity={ 0.7 }
        />
        <FormLabel>{'username'}</FormLabel>
        <FormInput
          value={ userData.username || '' }
          onChangeText={ this.update('username') }
          autoCapitalize={ 'none' }
          autoCorrect={ false }
        />

        <CheckBox
          checked={ !!roles['role-a'] }
          title={ 'Role A' }
          onPress={ this.updateRole('role-a') }
        />
        <CheckBox
          checked={ !!roles['role-b'] }
          title={ 'Role B' }
          onPress={ this.updateRole('role-b') }
        />
        <CheckBox
          checked={ !!roles['role-c'] }
          title={ 'Role C' }
          onPress={ this.updateRole('role-c') }
        />

        <Button onPress={ this.onPress } title={ 'UPDATE' } />
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
const mapStateToProps = state => {
  return {
    authentication: state.authentication.data,
  }
}

export default connect(mapStateToProps)(SettingsScreen)
