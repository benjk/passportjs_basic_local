const msg = require ('./data.json').messages

const registrationSchema = {
    password: {
      isEmpty: { 
        negated: true,
        errorMessage: msg.errorPasswordEmpty,
      },
      isLength: {
        options: {min: 2, max: 4},
        errorMessage: msg.errorPasswordWeak,
      }
    },
    username: {
        isEmail : {
          errorMessage: msg.errorEmailFormat
        }
    }
  }

  module.exports = {
    registrationSchema
  };