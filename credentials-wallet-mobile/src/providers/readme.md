### Providers

A "provider" in reclaim's context is simply a provider for some reputation or credential.

Each provider has a name, and a set of possible claims that it can verify. For example, the "google" provider has "google-login" as a possible claim. Which is configured to verify claims of ownership of google accounts.

### How to add a provider to the app

1. [ ] Create a folder with the name of your provider in `src/providers`, this folder will hold all of your provider's code.

2. [ ] Create a screens folder in your provider's folder, this will hold all of your provider's screens.

3. [ ] Create a redux folder in your provider's folder, this will hold all of your provider's redux code.

4. [ ] You will need a root reducer for your redux subreducers, create a file called `reducer.ts` in your provider's redux folder, and add your subreducers to it. Check: src/providers/google/redux/reducer.ts for an example. Also, add your reducer to the provider's root reducer in `src/providers/reducer.ts`.

5. [ ] Your screens must include a screen called `Authentication`, this will be called to log the user in to your provider. Check: src/providers/google/screens/Authentication.tsx for an example.

6. [ ] Create an `index.tsx` file in your screens folder, this will be the entry point for your screens, you have to define a stack param list and define a navigator. Check: src/providers/google/screens/index.tsx for an example.

7. [ ] Add your provider's `StackParamList` to `ProvidersStackParamList` in `src/providers/navigation.tsx`, and add a new screen for your provider `ProvidersStackNavigator` as well.

8. [ ] Implement your Authentication screen, this screen must log the user in, and store the secret params such as a token in redux. You can implement this using a native library, check `src/providers/google/screens/Authentication.tsx` for an example. Or, using a webview and cookies, check `src/providers/yc/screens/Authentication.tsx` for an example. Your authentication screen accept `returnScreen` as a param, and navigate to it after the user is logged in.

9. [ ] Implement a selector to get the params from redux, and a selector to get the secret params, check `src/providers/google/redux/selectors.ts` for an example.

10. [ ] Add a suitable icon for your provider in `src/providers/<your-provider>/assets`.

11. [ ] Add your new provider in `src/providers/index.ts`, by adding a new object with the configuration of your provider to `PROVIDERS`.
