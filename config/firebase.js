var admin = require("firebase-admin");

var serviceAccount = require('../secretFiles/betser-f5b9a-firebase-adminsdk-fbsvc-5918dee54e.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
