# TapRoute-firebase
functions hosted on firebase

Import the file database.rules.json to Firebase rules. This file contains DB security rules to protect your DB.

Import master data from DB/data.json to Firebase DB

### Setup firebase functions
[Cloud Functions](https://firebase.google.com/docs/functions/) for Firebase lets you automatically run backend code in response to events triggered by Firebase features and HTTPS requests. Your code is stored in Google’s cloud and runs in a managed environment. There's no need to manage and scale your own servers.
Go to functions directory and run
```
npm install
```

Login to your firebase

```
firebase login
```

Deploy your changes
```
firebase deploy 

or if you are working with functions only

firebase deploy --only functions
```

To use this feature, firebase-tools must have minimum version 3.8.0, and firebase-functions SDK must have minimum version 0.5.7. To update both, run the following commands in the functions/ directory for your project:

```
npm install --save firebase-functions@latest
npm install -g firebase-tools
```
To run functions locally, use firebase serve:
```
firebase serve --only functions # to only emulate functions
firebase serve --only functions,hosting # to emulate both functions and hosting
```