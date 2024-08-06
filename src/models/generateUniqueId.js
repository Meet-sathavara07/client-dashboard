const crypto = require('crypto');
const Client = require('./dataSchema'); // Adjust path as needed

const generateUniqueId = async (length = 8) => {
  let uniqueId;
  let isUnique = false;

  while (!isUnique) {
    uniqueId = crypto.randomBytes(length).toString('hex').slice(0, length).toUpperCase();
    
    const existingClient = await Client.findById(uniqueId);
    if (!existingClient) {
      isUnique = true;
    }
  }

  return uniqueId;
};

module.exports = { generateUniqueId };
