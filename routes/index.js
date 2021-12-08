var conn = require('./../includes/db')
var express = require('express')
var menus = require('./../includes/menus')
var reservations = require('./../includes/reservations')
var contacts = require('./../includes/contacts')
var emails = require('./../includes/emails')
var router = express.Router()


/*GET home page */
router.get('/', function(req,res,next){

    menus.getMenus().then(results=>{

        //Mescla os dados com o html
        res.render('index', {
            title: 'Restaurante Saboroso',
            menus: results,
            isHome: true
        })
    })
})

router.get('/contacts', function(req,res,next){
    
    contacts.render(req, res)
})

router.post('/contacts', function(req,res,next){

    if(!req.body.name){
        contacts.render(req, res, 'Digite o nome')
    }else if(!req.body.email){
        contacts.render(req, res, 'Digite o e-mail')
    }else if(!req.body.message){
        contacts.render(req, res, 'Digite a mensagem')
    }else{ //se todos os campos foram preenchidos, envia pro banco de dados
        contacts.save(req.body).then(results=>{

            req.body = {}

            contacts.render(req, res, null, 'Mensagem enviada com sucesso')
        
        }).catch(err=>{
            contacts.render(req, res, error.message)
        })
    }

})

router.get('/menus', function(req,res,next){

    menus.getMenus().then(results =>{
        res.render('menus', {
            title: 'Menu - Restaurante Saboroso',
            background: '',
            h1: 'Saboreie nosso menu!',
            menus: results
        })
    })
})

router.get('/reservations', function(req,res,next){

    reservations.render(req, res)
})

router.post('/reservations', function(req,res,next){

    //Validações
    if(!req.body.name){
        reservations.render(req, res, 'Digite um nome')
        
    }else if(!req.body.email){
        reservations.render(req, res, 'Digite o e-mail')
        
    }else if(!req.body.people){
        reservations.render(req, res, 'Selecione o número de pessoas')
        
    }else if(!req.body.date){
        reservations.render(req, res, 'Selecione a data')
        
    }else if(!req.body.time){
        reservations.render(req, res, 'Selecione a hora')
        
    }else{  //se tá tudo certo, envia pro banco de dados
        reservations.save(req.body).then(results=>{

            req.body = {} //zera o objeto após completar todos os campos e enviar
            
            reservations.render(req, res, null, 'Reserva realizada com sucesso!')
        
        }).catch(err=>{
            reservations.render(req, res, err.message) //passa a mensagem de erro
        })
    }
})

router.get('/services', function(req,res,next){
    res.render('services', {
        title: 'Serviços - Restaurante Saboroso',
        background: '',
        h1: 'É um prazer poder servir!'
    })
})

router.post('/subscribe', function(req, res, next){

    emails.save(req).then(results =>{

        res.send(results)
    
    }).catch(err =>{
        res.send(err)
    })
})

module.exports = router