// Initialize the FirebaseUI Widget using Firebase.

var ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start('#firebaseui-auth-container', {
  // signInSuccessUrl: 'http://localhost:3000/',
  callbacks: {
    signInSuccessWithAuthResult: function (authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      console.log('authResult', authResult);
      console.log('redirectUrl', redirectUrl);
      console.log('uid', authResult.user.uid);

      firebase
        .auth()
        .currentUser.getIdToken(/* forceRefresh */ true)
        .then(function (idToken) {
          // Send token to your backend via HTTPS
          console.log('token', idToken);
          // ...
        })
        .catch(function (error) {
          // Handle error
        });

      return false;
    },
    uiShown: function () {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    },
  },
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,

    {
      provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      recaptchaParameters: {
        type: 'image',
        size: 'invisible',
        badge: 'inline',
      },
      defaultCountry: 'TW',
    },
  ],
});
