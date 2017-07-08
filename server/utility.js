var crypto = require('crypto');

export function hashing(pwd) {
    return crypto.createHash('md5').update(pwd).digest('hex');
}



