const crypto = require('crypto');
var email = '1';
var id = '2';

async function main() {
  var key;
  key = crypto.pbkdf2Sync(email, id, 4, 32, 'sha256');

  await console.log(key.toString('hex'));

  await console.log(key, "!1");
}

main();
