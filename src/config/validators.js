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

const loginSchema = {
  username: {
    isEmpty: {
      negated: true,
      errorMessage: msg.errorFieldEmpty,
      bail: true, // Permet de stopper la chaine de validation pour ce champ uniquement (username)
    }
  },
  password: {
    isEmpty: {
      negated: true,
      errorMessage: msg.errorFieldEmpty,
      bail: true,
    }
  },
};

module.exports = {
  registrationSchema,
  loginSchema
};
