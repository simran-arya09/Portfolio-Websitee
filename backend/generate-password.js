/**
 * Run this script to generate a bcrypt hash of your admin password.
 * Usage: node generate-password.js
 *
 * Then copy the output into your .env file as ADMIN_PASSWORD_HASH
 */

const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question('Enter your admin password: ', async (password) => {
  if (!password || password.length < 6) {
    console.log('\n❌ Password must be at least 6 characters.\n');
    rl.close();
    return;
  }
  const hash = await bcrypt.hash(password, 10);
  console.log('\n✅ Add this to your backend .env file:\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
  rl.close();
});
