const bcrypt = require('bcrypt')

async function hashPassword(password){
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password,salt);
        return hashedPass;
    }catch(e){
        console.log(e);
    }
}

module.exports = hashPassword;