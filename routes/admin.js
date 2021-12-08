var express = require("express")
var admin = require("../includes/admin")
var users = require('./../includes/users')
var menus = require('./../includes/menus')
var reservations = require('./../includes/reservations')
var contacts = require('./../includes/contacts')
var emails = require('./../includes/emails')
var moment = require('moment')//para formatar a data
var router = express.Router()

//Especificar o idioma da data formatada com o moment
moment.locale('pt-BR')

//Middleware = controle da área restrita (login de admin)
router.use(function(req, res, next){

    if(['/login'].indexOf(req.url) = -1 && !req.session.user){
        res.redirect('/admin/login')
    }else{
        next() //função que vai para o próximo
    }
})

router.use(function(req, res, next){

    req.menus = admin.getMenus(req)

    next() //próximo middleware ou próxima rota
})

//HOME
router.get('/', function(req, res, next){

    admin.dashboard().then(data=>{

        res.render('admin/index', admin.getParams(req, {
            data
        }))
    }).catch(err =>{

        console.log(err)
    })
})

//LOGOUT
router.get('/logout', function(req, res, next){
    
    delete req.session.user

    res.redirect('/admin/login')
})

//LOGIN
router.get('/login', function(req, res, next){

    /*if(!req.session.views) req.session.views = 0
    console.log(req.session.views++)*/

    users.render(req, res, null)
})
router.post('/login', function(req, res, next){
    if(!req.body.email){
        users.render(req, res, 'Preencha com um e-mail')
    }else if(!req.body.password){
        users.render(req, res, 'Preencha o campo da senha')
    }else{
        users.login(req.body.email, req.body.password).then(user=>{

            req.session.user = user
            
            res.redirect('/admin')

        }).catch(err=>{
            users.render(req, res, err.message || err)
        })
    }
})

//CONTATOS
router.get('/contacts', function(req, res, next){

    contacts.getContacts().then(data =>{

        res.render('admin/contacts', admin.getParams(req, {
            data
        }))
    }) 
})

router.delete('/contacts:id', function(req, res, next){

    contacts.delete(req.params.id).then(results =>{
        res.send(results)
    }).catch(err =>{
        res.send(err)
    })
})

//EMAILS
router.get('/emails', function(req, res, next){

    emails.getEmails().then(data =>{

        res.render('admin/emails', admin.getParams(req, {
            data
        }))

    })
})
router.delete('/emails/:id', function(req, res, next){

    emails.delete(req.params.id).then(results =>{
    
        res.send(results)
    
    }).catch(err=>{
        res.send(err)
    })
})

//MENUS DOS PRATOS
router.get('/menus', function(req, res, next){

    menus.getMenus().then(data=>{

        res.render('admin/menus', admin.getParams(req, {
            data
        }))
    })
})

router.post('/menus', function(req, res, next){
    menus.save(req.fields, req.files).then(results=>{
        
        res.send(results)
    
    }).catch(err =>{
        res.send(err)
    })
})

router.delete('/menus/:id', function(req, res, next){

    menus.delete(req.params.id).then(results =>{        
        res.send(results)
    }).catch(err =>{
        res.send(err)
    })
})

//RESERVAS
router.get('/reservations', function(req, res, next){

    let start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD')
    let end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD')

    reservations.getReservations(req).then(pag =>{

        res.render('admin/reservations', admin.getParams(req, {
            date: {
                start,
                end
            },
            data: pag.data,
            moment, //usado no row.date
            links: pag.links
        }))
    })
})

router.post('/reservations', function(req, res, next){
    reservations.save(req.fields, req.files).then(results=>{
        
        res.send(results)
    
    }).catch(err =>{
        res.send(err)
    })
})

router.delete('/reservations/:id', function(req, res, next){

    reservations.delete(req.params.id).then(results =>{        
        res.send(results)
    }).catch(err =>{
        res.send(err)
    })
})

router.get('/reservations/chart', function(req, res, next){

    req.query.start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD')
    req.query.end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD')

    reservations.chart(req).then(chartData =>{
        res.send(chartData)
    })
})

//USUÁRIOS
router.get('/users', function(req, res, next){

    users.getUsers().then(data=>{

        res.render('admin/users', admin.getParams(req, {
            data
        }))
    })
})

router.post('/users', function(req, res, next){

    users.send(req.fields).then(results =>{
        res.send(results)
    }).catch(err=>{
        res.send(err)
    })
})

router.post('/users/password-change', function(req, res, next){

    users.changePassword(req).then(results =>{
        res.send(results)
    }).catch(err=>{
        res.send({
            error: err
        })
    })
})

router.delete('/users/:id', function(req, res, next){

    users.delete(req.params.id).then(results =>{
        res.send(results)
    }).catch(err=>{
        res.send(err)
    })
})

module.exports = router