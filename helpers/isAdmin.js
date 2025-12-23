const User = require('../models/User')

module.exports = {
    isAdmin: (req, res, next) => {
        if (!req.session.userId) {
            req.flash("error_msg", "Faça login para continuar")
            return res.redirect("/users/login")
        }

        User.findById(req.session.userId)
            .then(user => {
                if (!user || !user.isAdmin) {
                    req.flash("error_msg", "Você deve ser um administrador para acessar essa área")
                    return res.redirect("/")
                }

                req.user = user
                next()
            })
            .catch(() => {
                req.flash("error_msg", "Erro interno")
                res.redirect("/")
            })
    }
}
