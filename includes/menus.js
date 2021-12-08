let conn = require('./db')
let path = require('path')
const { rejects } = require('assert')

module.exports = {
    getMenus(){
        return new Promise((resolve, reject)=>{
            conn.query('SELECT * FROM tb_menus ORDER BY title', (err, results) =>{
                if(err){
                    reject(err)
                }
                resolve(results)
                })
            }) 
    },

    save(fields, files){

        return new Promise((resolve, reject)=>{

            fields.photo = `images/${path.parse(files.photo.path)}`

            let query, queryPhoto = '', params = [
                fields.title,
                fields.description,
                fields.price
            ]

            if(files.photo.name){ //name retorna o conteúdo do campo photo

                queryPhoto = ',photo = ?'
                params.push(fields.photo)
            }
            
            //Se tem um id faz Update
            if(parseInt(fields.id) > 0){
                
                params.push(fields.id)

                query = `
                    UPDATE tb_menus
                    SET title = ?,
                        description = ?,
                        price = ?,
                        ${queryPhoto}
                    WHERE id = ?
                `

            //Se não tem um id faz Insert
            }else{
                if(!files.photo.name){
                    reject('Envie uma foto do prato.')
                }
                
                query = `
                    INSERT INTO tb_menus (title, description, price, photo)
                    VALUES(?, ?, ?, ?)
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

    delete(id){

        return new Promise((resolve, reject)=>{

            conn.query(`
                DELETE FROM tb_menus WHERE id = ?
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