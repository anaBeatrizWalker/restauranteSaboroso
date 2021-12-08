//Prototype
//Adicionando um método ao objeto do DOM  de formulários
//e adicionando um recurso de envio via ajax

const { config } = require("process")

HTMLFormElement.prototype.save = function(config){

    let form = this

    form.addEventListener('submit', e=>{
        e.preventDefault()

        let formData = new FormData(formCreate) //método de manipulação de dados de formulário

        fetch(form.action, {
            method: form.method,
            body: formData
        })
            .then(response => response.json()) //json faz o parse
            .then(json =>{

                if(json.error){

                    if(typeof config.failure === 'function') config.failure(json.error)
                
                }else{

                    if(typeof config.success === 'function') config.success(json)

                }                
            }).catch(err =>{
                reject(err)
            })
    })
}