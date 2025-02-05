var firebaseAdmin = require("firebase-admin");

var serviceAccount = require('../secretFiles/betser-f5b9a-firebase-adminsdk-fbsvc-5918dee54e.json');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount)
});

module.exports = firebaseAdmin;
