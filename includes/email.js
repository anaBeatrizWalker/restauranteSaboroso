var conn = require('./db') //conexão com o banco de dados

module.exports = {
    render(req, res, error, success){
        res.render('emails', {
            title: 'E-mails - Restaurante Saboroso',
            background: '',
            h1: 'Diga um oi!',
            body: req.body,
            error,
            success
        })
    },

    getEmails(){
        return new Promise((resolve, reject)=>{
            conn.query('SELECT * FROM tb_emails ORDER BY email', (err, results) =>{
                if(err){
                    reject(err)
                }
                resolve(results)
                })
            }) 
    },

    save(fields){
        return new Promise((resolve, reject)=>{

            if(!req.fields.email){

                reject('Preencha o e-mail.')

            }else{

                conn.query(`
                    INSERT INTO tb_emails (email)
                    VALUES (?,?)
                `, [
                    req.fields.email
    
                ], (err, results)=>{
                    if(err){
                        reject(err.message)
                    }else{
                        resolve(results)
                    }
                })
            }
        })
    },

    delete(id){
        return new Promise((resolve, reject)=>{

            conn.query(`
                DELETE FROM tb_emails WHERE id = ?
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
    }
}