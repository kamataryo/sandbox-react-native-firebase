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

5. Set database rules. follow [Development] -> [Database] -> [rules] and add rule described below

   ```json
   {
     "rules": {
       "users": {
         "$uid": {
           ".read": "$uid === auth.uid",
           ".write": "$uid === auth.uid"
         }
       }
     }
   }
   ```

## tips

- list devices

  ```shell
  $ emulator -list-avds # Android
  $ instruments -s devices # iOS
  ```

- launch an Android device
  ```shell
  $ emulator -avd pixel2
  ```
