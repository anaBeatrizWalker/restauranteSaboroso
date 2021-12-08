var conn = require('./db')
const Pagination = require('./Pagination')
var moment = require('moment')

module.exports = {
    render(req, res, error, success){
        res.render('services', {
            title: 'Serviços - Restaurante Saboroso',
            background: '',
            h1: 'É um prazer poder servir!',
            body: req.body,
            error,
            success
        })
    },

    save(fields){

        return new Promise((resolve, reject)=>{

            if(fields.date.indexOf('/') > -1){ //não achou uma barra na data, então..

                //arruma a data para subir no banco de dados corretamente
                let date = fields.date.split('/')
                fields.date = `${date[2]}-${date[1]}-${date[0]}`
            }
            let query, params = [
                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time
            ]

            //UPDATE
            if(parseInt(fields.id) > 0){

                query = `
                    UPDATE tb_reservations
                    SET
                        name = ?,
                        email = ?,
                        people = ?,
                        date = ?,
                        time = ?
                    WHERE id = ?
                `
                params.push(fields.id)

            //INSERT
            }else{

                query = `
                    INSERT INTRO tb_reservations (name, email, people, date, time)
                    VALUE (?,?,?,?,?)
                `
            }

            conn.query(query, params, (err, results)=>{
           
                if(err){
                    reject(err)
                }else{
                    resolve(results)
                }
            })
        })
    },

    getReservations(req){

        return new Promise((resolve, reject)=>{

            let page = req.query.page
            let dtstart = req.query.dtstart
            let dtend = req.query.dtend

            if(!page) page = 1

            let params = []
    
            if(dtstart && dtend) params.push(dtstart, dtend)
    
            let pag = new Pagination(
    
                `SELECT SQL_CALC_FOUND_ROWS * 
                FROM tb_reservations 
                ${(dtstart && dtend) ? 'WHERE date BETWEEN ? AND ?' : ''}
                ORDER BY name LIMIT ?, ?`,

                params
                //3º params = itens por página (10)           
            )
            
            pag.getPage(page).then(data =>{
                resolve({
                    data,
                    links: pag.getNavigation(req.query)
                })
            })
        })

        /* ANTES DE PAGINATION
        return new Promise((resolve, reject)=>{
            conn.query('SELECT * FROM tb_reservations ORDER BY date DESC', (err, results) =>{
                if(err){
                    reject(err)
                }
                resolve(results)
                })
            })*/ 
    }, 

    delete(id){

        return new Promise((resolve, reject)=>{

            conn.query(`
                DELETE FROM tb_reservations WHERE id = ?
            `, [
                id
            ], (err, results)=>{
                if(err){
                    reject(err)
                }else{
                    resolve(results)
                }
            })
        })
    },

    chart(req){

        return new Promise((resolve, reject)=>{

            conn.query(`

            `, [
                req.query.start,
                req.query.end
            ], (err, results)=>{
                if(err){
                    reject()
                }else{
                    let months = []
                    let values = []

                    results.forEach(row =>{
                        months.push(moment(row.date).format('MMM YYYY'))
                        values.push(row.total)
                    })

                    resolve({
                        months,
                        values
                    })
                }
            })
        })
    }
}