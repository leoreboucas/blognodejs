// Carregando modulos

const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')
const Posts = require('./models/Post')
const Category = require('./models/Category');
const User = require('./models/User');
const auth = require('./middlewares/auth')
require('dotenv').config()


const app = express();


// Imports da routes

const admin = require('./routes/admin');
const user = require('./routes/user');

// Configurações
    // Sessão
    app.use(session({
        secret: process.env.SESSION_PASSWORD,
        resave: true,
        saveUninitialized: true
    }));
    app.use(flash());
    // Middlewares
    app.use((req, res, next) => {
        if (req.session.userId) {
            User.findById(req.session.userId)
                .lean()
                .then(user => {
                    res.locals.user = user
                    next()
                })
                .catch(() => {
                    res.locals.user = null
                    next()
                })
        } else {
            res.locals.user = null
            next()
        }
    })
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next();
    })

    // Body Parser
        app.use(express.json())
        app.use(express.urlencoded({extended: true}))

    // HandleBars
        app.engine('handlebars', handlebars.engine({ defaultLayout: 'main' }))

        app.set('view engine', 'handlebars')

    // Mongoose
        mongoose.Promise = global.Promise
        const URI = "mongodb://localhost/blogapp"
        mongoose.connect(URI).then(()=> {
            console.log("Conectado ao banco de dados")
        }).catch((err) => {
            console.error("Erro detectado: " + err)
        })
    // Public
    app.use(express.static(path.join(__dirname, 'public')))


// Rotas
    app.get('/', (req, res) => {
        Posts.find().populate('category').lean().then((post) => {
            res.render('index', {
                post: post
            })
        }).catch(err => {
            req.flash("error_msg", "Houve um erro interno")
            res.redirect("/404")
        })
    })
    app.get('/post/:slug', (req, res) => {

        Posts.findOne({slug: req.params.slug}).populate('category').lean().then(post => {
            if(post){
                res.render('post/index', {
                    post: post
                })
            } else {
                req.flash("error_msg", "Esta postagem não existe")
                res.redirect("/")
            }
        }).catch(err => {
            req.flash('error_msg', "Houve um erro interno")
            req.redirect("/")
        })
    }) 

    app.get('/categories', (req, res) => {
        Category.find().lean().then((category) => {
            res.render('categories/index', {
                category: category
            })
        }).catch(err => {
            req.flash('error_msg', "Houve um erro ao carregar as categorias.")
            res.redirect('/')
        })
    })

    app.get('/categories/:slug', (req, res) => {

        Posts.find().populate('category').lean().then((posts) => {
            const postsFiltered = posts.filter((post) => post.category.slug == req.params.slug)
            if(postsFiltered.length > 0){
                res.render('categories/postbycategories', {
                    posts: postsFiltered
                })  
            } else {
                req.flash('error_msg', "Não existe postagem para essa categoria")
                res.redirect('/')
            }
        }).catch(err => {
            req.flash('error_msg', "Houve um erro ao listar postagens por categoria")
            res.redirect('/')
        })
    })

    app.get('/404', (req, res) => {
        res.send('Erro 404')
    })
    app.use('/admin', auth, admin)
    app.use('/users', user)
// Outros

const PORT  = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log("Servidor rodando na porta " + PORT)
})