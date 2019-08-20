const mongoose = require('mongoose');

// _id: 5a724953ab8354795741e6a

// 12 bytes
  // 4 bytes: timestamp
  // 3 bytes: machine identifier
  // 2 bytes: process identifier
  // 3 bytes: counter


const id = new mongoose.Types.ObjectId();
console.log(id.getTimestamp());

const isValid = mongoose.Types.ObjectId.isValid('1234');
console.log(isValid);