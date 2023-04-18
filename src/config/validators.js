const msg = require("./data.json").messages;

const registrationSchema = {
  username: {
    isEmpty: {
      negated: true,
      errorMessage: msg.errorFieldEmpty,
      bail: true, // Permet de stopper la chaine de validation pour ce champ uniquement (username)
    },
    isEmail: {
      errorMessage: msg.errorEmailFormat,
    },
  },
  password: {
    isEmpty: {
      negated: true,
      errorMessage: msg.errorFieldEmpty,
      bail: true,
    },
    isLength: {
      options: { min: 2, max: 4 },
      errorMessage: msg.errorPasswordWeak,
    },
  },
};

module.exports = {
  registrationSchema,
};
