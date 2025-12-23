const User = require('../models/User')

module.exports = function (req, res, next) {
    if (!req.session.userId) {
        req.flash("error_msg", "Faça login para continuar")
        return res.redirect("/users/login")
    }

    User.findById(req.session.userId)
        .then(user => {
            if (!user) {
                req.session.destroy()
                return res.redirect("/users/login")
            }

            req.user = user
            next()
        })
        .catch(() => {
            res.redirect("/users/login")
        })
}