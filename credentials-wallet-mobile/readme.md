# Reclaim Wallet
Reclaim Wallet is a secure mobile app that allows users to export their data from any website with provable authenticity, using HTTPS and zero-knowledge proof technology. With our efficient zk circuits, users can generate proofs of their bank balance, identity, and more, without revealing sensitive information. All of this happens on the client side, ensuring maximum privacy and security. Reclaim Wallet puts users in control of their data and empowers them to use it in new ways.

## Development Setup
- Make sure you have node version `v19.4.0`, consider installing nvm or other node version management tools to set your node version.

- Follow the guide on [the offical react native website](https://reactnative.dev/docs/environment-setup) to setup React Native Cli on your machine based on your environment. You should set up the environment for IOS and Android.

- Run `install:deps` in `../node`, to build and configure the dependancies that are used the reclaim wallet.

- Make sure your emulators time/date is in sync by running:

```
adb shell su root date $(date +%m%d%H%M%Y.%S)
```

- Run `npm install`

- To run android run `npm run android` and `npm run ios` for IOS, in case metro didn't start automatically run `npm run start` in a separate terminal.

- You can open URIs in the app from your terminal using `uri-scheme` using:

```
npx uri-scheme open "reclaim://your-links" --android
```

- In case metro was showing errors like package is missing consider using this command to clean node module & all the caches and clean start the app:

```
npm run clean-start-android
```

## Production Setup

- Follow this [guide](https://reactnative.dev/docs/signed-apk-android) to generate an upload key and set it up in Gradle.

- Run this command to generate an APK:

```
cd android
./gradlew assembleRelease
```

You can find your APK in `android/app/build/outputs/apk/release`.

- You can start the app in production mode on your emulator by running:
```
npm run android --mode=release
```

## Providers
The reclaim wallets contains multiple providers for the users to use to claim credentials, to add a provider you only need to add changes in the providers folder. Please check the readme in the providers folder for more information and examples.