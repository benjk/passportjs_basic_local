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
        message += "<a href='/login'>Connectez-vous</a> ou <a href='/register'>inscrivez-vous</a>."
    }
    data.pageTitle = infoMSg.profilePage.pageTitle
    data.text = message
    return data;
}

module.exports = {
    getProfilePageData
  };