# Sandbox React Native Firebase

## setup

### repository

```shell
$ git clone git@github.com:kamataryo/sandbox-react-native-firebase.git
$ cd sandbox-react-native-firebase
$ yarn
```

### Firebase

1. Launch Firebase console [https://console.firebase.google.com/u/0/?hl=ja](https://console.firebase.google.com/u/0/?hl=ja) and create your project

2. exec `cp ./config.sample.js ./config.js`

3. Get your API keys and fill the `config.js`

4. At Firebase console, follow [Development] -> [Authentication] -> [sign-in method] and enable the email/password login provider

## tips

- list Android Virtual Devices

  ```shell
  $ emulator -list-avds
  ```

- launch an Android Virtual Device

  ```shell
  $ emulator -avd pixel2
  ```
