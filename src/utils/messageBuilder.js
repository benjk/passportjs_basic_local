const infoMSg = require("./infoMsg.json")

function getProfilePageData(isAuth, user){
    let data = {};
    let message = "";
    if (isAuth){
        data.title = infoMSg.profilePage.can.title
        message = `Bonjour <strong>${ user.username }</strong>, tu es actuellement connecté.`
        if (user.admin) {
            message += "<br>Tu es un administrateur."
        } else {
            message += "<br>Tu n'es pas un administrateur."
        }
    } else {
        data.title = infoMSg.profilePage.cant.title
        message += "<p>Vous devez être un membre pour accéder ici !<br><a href='/login'>Connectez-vous</a> ou <a href='/register'>inscrivez-vous</a>.</p>"
    }
    data.pageTitle = infoMSg.profilePage.pageTitle
    data.text = message
    return data;
}

function getAdminPageData(isAdmin, user){
  let data = {};
  let message = "";
  if (isAdmin){
      data.title = infoMSg.adminPage.can.title
      message = `Bonjour <strong>${ user.username }</strong>, tu es administrateur.`
  } else {
      data.title = infoMSg.adminPage.cant.title
      message += infoMSg.adminPage.cant.text
  }
  data.pageTitle = infoMSg.adminPage.pageTitle
  data.text = message
  return data;
}

function getLoginSuccessData(user){
    let data = {};
    data.pageTitle = infoMSg.loginSuccessPage.pageTitle
    data.title = infoMSg.loginSuccessPage.title
    data.text = "<p><a href='/protected-route'>Voir mon profil</a>.</p>"
    return data;
  }

module.exports = {
    getProfilePageData,
    getAdminPageData,
    getLoginSuccessData
  };
