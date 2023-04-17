const msg = require("./data.json").messages;

const registrationSchema = {
  username: {
    isEmail: {
      errorMessage: msg.errorEmailFormat,
    },
    isEmpty: {
      negated: true,
      errorMessage: msg.errorFieldEmpty,
    },
    bail: true // Permet de stopper la validation si cette règle n'est pas respectée
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
