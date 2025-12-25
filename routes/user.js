const express = require('express')
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs')


router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', (req, res) => {
    var errors = []
    const nameValidator = !req.body.name 
    const emailValidator = !req.body.email
    const passwordValidator = !req.body.password || req.body.password !== req.body.password2 
    const passwordLengthValidator = (req.body.password).length < 4

    if (nameValidator) {
        errors.push({ text: "Nome inválido" })
    }

    if (emailValidator) {
        errors.push({ text: "Email inválido" })
    }
    if (passwordValidator) {
        errors.push({ text: "Senhas diferentes ou inválida" })
    }
    if(passwordLengthValidator) {
        errors.push({ text: "Senha deve conter mais de 4 caracteres"})
    }


    if (errors.length > 0) {
       res.render("users/register", { errors: errors })
    } else {
        User.findOne({email: req.body.email}).lean().then((user)=> {
            if(user) {
                req.flash('error_msg', "Já existe uma conta com este email cadastrado no sistema")
                res.redirect('/users/register')
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                })
 
                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(newUser.password, salt, (error, hash) => {
                        if(error) {
                            req.flash("error_msg", "Houve um erro interno relacionado a senha")
                            return res.redirect('/')
                        } 
                        newUser.password = hash
                        newUser.save().then((user) => {
                            req.flash('success_msg', "Conta registrada com sucesso")
                            res.redirect('/')
                        }).catch(err => {
                            req.flash('error_msg', "Houve um erro ao registrar novo usuário")
                            res.redirect('/users/register')
                        })
                    })
                })
            }
        }).catch(err => {
            req.flash('error_msg', "Houve um erro ao verificar se existe email cadastrado")
            res.redirect("/")
        })
    }
})

router.get('/login', (req, res) =>{
    res.render("users/login")
})

router.post('/login', (req, res) => {
    User.findOne({email: req.body.email}).then((user) => {
        if(user) {
            bcrypt.compare(req.body.password, user.password).then((exists) => {
                if(exists) {
                    req.session.userId = user._id
                    req.flash("success_msg", "Conta logada com sucesso!")
                    return res.redirect('/')
                } else {
                    req.flash("error_msg", "Email ou Senha inválidos")
                    return res.redirect("/users/login")
                }
            }).catch(err => {
                req.flash("error_msg", "Houve um erro interno")
                return res.redirect("/")
            })
        } else {
            req.flash("error_msg", "Email não cadastrado!")
            return res.redirect("/users/login")
        }
    }).catch(err => {
        req.flash("error_msg", "Houve um erro interno")
        return res.redirect("/")
    })
})

router.get('/logout', (req, res) => {
    req.session.userId = null
    req.flash("success_msg", "Conta deslogada com sucesso!")
    return res.redirect('/')
})

module.exports = router