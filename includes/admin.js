//Menu
var conn = require('./db')

module.exports = {

    dashboard(){

        return new Promise((resolve, reject)=>{

            conn.query(`QUERRY DO SQL`
            
            , (err, results)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(results[0])
                }
            })
        })

    },

    //Pra deixar o código mais inteligente na hora de adicionar valores nos objetos da routa do admin :p
    getParams(req, params){

        return Object.assign({}, {
            menus: req.menus,
            user: req.session.user
        }, params)
    },

    getMenus(req){

        let menus = [
            {
                text: 'Tela Inicial',
                href: '/admin/',
                icon: 'home',
                active: false
            },
            {
                text: 'Menu',
                href: '/admin/menus',
                icon: 'cutlery',
                active: false
            },
            {
                text: 'Reservas',
                href: '/admin/reservations',
                icon: 'calendar-check-o',
                active: false
            }, 
            {
                text: 'Contatos',
                href: '/admin/contacts',
                icon: 'comments',
                active: false
            },
            {
                text: 'Usuários',
                href: '/admin/users',
                icon: 'users',
                active: false
            },
            {
                text: 'E-mails',
                href: '/admin/emails',
                icon: 'envelope',
                active: false
            }
        ]

        //verifica se o requisição é igual ao href
        menus.map(menu =>{

            if(menu.href === `/admin${req.url}`) menu.active = true //URL ativa no momento
        })

        return menus
    }
}