const admin = require('firebase-admin');
const serviceAccount = require('./badaro-eventos-firebase-adminsdk-37lc1-e364bc26e9.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const dbAdmin = admin.firestore();
module.exports = { admin, dbAdmin };

