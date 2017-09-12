# TapRoute-firebase
functions hosted on firebase

Import the file DB/rules.json to Firebase rules. This file contains DB security rules to protect your DB.

Import master data from DB/sample_data.json to Firebase DB

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
firebase deploy --only functions
```