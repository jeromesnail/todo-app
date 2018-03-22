const { SHA256 } = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const password = '123abc';
// bcrypt.genSalt(10, (e, salt) => {
//   bcrypt.hash(password, salt, (e, hash) => {
//     console.log(hash);    
//   });
// });

const hashedPassword = '$2a$10$CdGTgl1dC3RbooQdQOMRp.92w/IZKkdIw6tBWfL7AL7CmsMK.enCy';

bcrypt.compare(password, hashedPassword, (e, res) => {
  console.log(res);  
});

// const data = {
//   id: 10
// };

// const token = jwt.sign(data, 'proutlol');
// console.log(token);

// const decoded = jwt.verify(token, 'proutlol');
// console.log(decoded);

// const message = 'I am user number 3';
// const hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// const data = {
//   id: 4
// };

// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(data)).toString();

// const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed, don\'t trust!');
// }