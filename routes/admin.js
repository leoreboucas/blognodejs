const express = require('express');
const mongoose = require('mongoose')
const Category = require("../models/Category")
const Post = require('../models/Post')
const { isAdmin } = require('../helpers/isAdmin')

const router = express.Router();

router.get('/', isAdmin, (req, res) => {
    res.render('admin/index')
})

router.get('/categories', isAdmin, (req, res) => {
    Category.find().sort({date: 'desc'}).lean().then((categories)=> {
        res.render("admin/categories", {
            categories: categories
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect('/admin/categories') 
    })
})

router.get('/categories/add', isAdmin, (req,res) => {
    res.render('admin/addcategories')
})

router.post('/categories/new', isAdmin, (req, res) => {
    var errors = []
    const nameValidator = !req.body.name || typeof !req.body.name === undefined || req.body.name === null
    const slugValidator = !req.body.slug || typeof !req.body.slug === undefined || req.body.slug === null
    if (nameValidator){
        errors.push({text: "Nome inválido"})
    }

    if (slugValidator) {
        errors.push({ text: "Slug inválido" })
    }

    if (errors.length > 0){
        res.render("admin/addcategories", {errors: errors})
    } else {
        const newCategory = {
            name: req.body.name,
            slug: req.body.slug
        }
        new Category(newCategory).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso!");
            res.redirect('/admin/categories');
        }
        ).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar categoria")
            res.redirect('/admin/categories');
        })
    }
})

router.get(('/categories/edit/:id'), isAdmin, (req, res) => {
    Category.findById(req.params.id).lean().then((data) => {
        res.render("admin/editcategories", {
            category: data
        })
    }).catch(err => {
        req.flash("error_msg", "Esta categoria não existe")
        res.redirect("/admin/categories")
    })  
})

router.post(('/categories/edit'), isAdmin, (req, res) => {
    Category.findByIdAndUpdate(req.body.id, {
        name: req.body.name,
        slug: req.body.slug
    }).then(() => {
        req.flash("success_msg", "Categoria editada com sucesso!");
        res.redirect('/admin/categories');
    }).catch(err => {
        req.flash("error_msg", "Houve um erro ao editar categoria")
        res.redirect('/admin/categories');
    })
})

router.get(('/categories/delete/:id'), isAdmin, (res, req) => {
    Category.findByIdAndDelete(res.params.id).then(() =>{
        req.redirect('/admin/categories')
    }).catch((err) => {
        res.redirect('/admin/categories');
    })
})

router.get('/posts', isAdmin, (req, res) => {
    Post.find().sort({ date: 'desc' }).populate('category').lean().then(posts => {
        res.render("admin/posts", {
            posts: posts
        })
    }).catch(err => {
        req.flash("error_msg", "Houve um erro ao listar as postagens")
        res.redirect('/admin')
    })
    
})

router.get('/posts/add', isAdmin, (req, res) => {
    Category.find().sort({ date: 'desc' }).lean().then((categories) => {
        res.render("admin/addposts", {
            categories: categories
        })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect('/admin/posts')
    })
})

router.post('/posts/new', isAdmin, (req, res) => {
    var errors = []
    const titleValidator = !req.body.title || typeof !req.body.title === undefined || req.body.title === null
    const slugValidator = !req.body.slug || typeof !req.body.slug === undefined || req.body.slug === null
    const descriptionValidator = !req.body.description || typeof !req.body.description === undefined || req.body.description === null
    const contentValidator = !req.body.content || typeof !req.body.content === undefined || req.body.content === null
    const categoryValidator = req.body.category == "0"
    if (titleValidator) {
        errors.push({ text: "Título inválido" })
    }

    if (slugValidator) {
        errors.push({ text: "Slug inválido" })
    }
    if (descriptionValidator) {
        errors.push({ text: "Descrição inválida" })
    }
    if (contentValidator) {
        errors.push({ text: "Conteúdo inválido" })
    }
    if (categoryValidator) {
        errors.push({ text: "Sem categoria definida" })
    }

    if (errors.length > 0) {
        res.render("admin/addposts", { errors: errors })
    } else {
        const newPost = {
            title: req.body.title,
            slug: req.body.slug,
            description: req.body.description,
            content: req.body.content,
            category: req.body.category    
        }
        new Post(newPost).save().then(() => {
            req.flash("success_msg", "Postagem criado com sucesso!");
            res.redirect('/admin/posts');
        }
        ).catch((err) => {
            req.flash("error_msg", "Houve um erro ao salvar postagem")
            res.redirect('/admin/posts');
        })
    }
})

router.get(('/posts/edit/:id'), isAdmin, (req, res) => {
    Post.findById(req.params.id).lean().then((data) => {
        Category.find().lean().then((category) => {
            res.render("admin/editposts", {
                post: data,
                category: category
            })
        })
    }).catch(err => {
        req.flash("error_msg", "Erro ao carregar postagens")
        res.redirect("/admin/posts")
    })
})


router.post(('/posts/edit'), isAdmin, (req, res) => {
    Post.findByIdAndUpdate(req.body.id, {
        title: req.body.title,
        slug: req.body.slug,
        description: req.body.description,
        content: req.body.content,
        category: req.body.category
    }).then(() => {
        req.flash("success_msg", "Postagem editada com sucesso!");
        res.redirect('/admin/posts');
    }).catch(err => {
        req.flash("error_msg", "Houve um erro ao editar postagem")
        res.redirect('/admin/posts');
    })
})

router.get(('/posts/delete/:id'), isAdmin, (res, req) => {
    Post.findByIdAndDelete(res.params.id).then(() => {
        req.redirect('/admin/posts')
    }).catch((err) => {
        res.redirect('/admin/posts');
    })
})


module.exports = router;