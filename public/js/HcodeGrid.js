const e = require("express")
const { config } = require("process")

//PARAMETRIZANDO O CÓDIGO DE ANTES
class HcodeGrid{

    constructor(configs){

        configs.listeners = Object.assign({

            afterUpdateClick: (e)=>{
                $('#modal-update').modal('show')
            },

            afterDeleteClick: (e)=>{
                window.location.reload()//força uma atualização
            },

            afterFormCreate: (e)=>{
                window.location.reload()
            },

            afterFormUpdate: (e)=>{
                window.location.reload()
            },
            
            afterFormCreateError: (e)=>{
                alert('Não foi possível enviar o formulário.')
            },

            afterFormUpdateError: (e)=>{
                alert('Não foi possível enviar o formulário.')
            }

        }, configs.listeners)

        //Todos as personalizações passam para dentro de options, para poderem serem acessadas aqui
        this.options = Object.assign({}, {
            //Informações padrões (que são iguais em várias páginas)
            formCreate: '#modal-create form',
            formUpdate: '#modal-update form',
            btnUpdate: 'btn-update',
            btnDelete: '.btn-delete',
            //Configs.listener sobscreve o listener para que seu objeto seja acessado, permitidindo também sempre ser personalizado
            onUpdateLoad: (form, name. data) => {

                let input = form.querySelector('[name='+name+']')
                if(input) input.value = data[name]
            },

        }, configs)

        this.rows = [...document.querySelectorAll('table tbody tr')]

        this.initForms()
        this.initButtons()
    }

    initForms(){

        //CRIANDO UMA RESERVA
        this.formCreate = document.querySelector(this.options.formCreate)

        if(this.formCreate){//em telas que não tiver formulários para serem criados (contacts), verifica-se existe um form

            this.formCreate.save({
                success: ()=>{
                    this.fireEvents('afterFormCreate')
                },
                failure: ()=>{
                    this.fireEvents('afterFormCreateError')
            })
        }

        //ATUALIZANDO UMA RESERVA
        this.formUpdate = document.querySelector(this.options.formUpdate)

        if(this.formUpdate){//em telas que não tiver formulários para serem criados (contacts), verifica-se existe um form

            formUpdate.save({
                success: ()=>{
                    this.fireEvents('afterFormUpdate')
                },
                failure: ()=>{
                    this.fireEvents('afterFormUpdateError')
                })
            }
        }

    initButtons(){

        //Procurando os botões de ação
        this.rows.forEach(row =>{
            [...row.querySelectorAll('.btn')].forEach(btn =>{

                btn.addEventListener('click', e =>{

                    if(e.target.classList.contains(this.options.btnUpdate)){
                        
                        this.btnUpdateClick(e)

                    }else if(e.target.classList.contains(this.options.btnUpdate)){

                        this.btnDeleteClick(e)
                    }else{

                        this.fireEvents('buttonClick', [e.target, this.getTrData(e), e])
                    }
                })
            })
        })

        //ATUALIZAR UMA RESERVA
        [...document.querySelectorAll(this.options.btnUpdate)].forEach(btn =>{
            btn.addEventListener('click', e =>{

                //Assim que foi clicado
                this.fireEvents('beforeUpdateClick', [e])

                let data = this.getTrData(e)

                for(let name in data){

                    //Trata as exceções dos switch 
                    this.options.onUpdateLoad(this.formUpdate, name, data)

                }
                //Assim que terminar o click
                this.fireEvents('afterUpdateClick', [e])
            })
        })

        //EXCLUIR UMA RESERVA
        [...document.querySelectorAll(this.options.btnDelete)].forEach(btn =>{
            btn.addEventListener('click', e=>{

                this.fireEvents('beforeDeleteClick')

                let data = this.getTrData(e)

                if(confirm(eval('`' + this.options.deleteMessage + '`'))){ //eval entende o template string

                    fetch(eval('`' + this.options.deleteURL + '`'), {
                    
                        method:'DELETE'
                    
                    })
                    .then(response => response.json())
                    .then(json =>{ 

                        //Depois de clicar em excluir
                        this.fireEvents('afterDeleteClick')
                    })
                }
            })
        })
    }

    fireEvents(name, args){

        if(typeof this.options.listeners[name] === 'function') this.options.listeners[name].apply(this, args)
    }

    //Pega os dados de uma linha
    getTrData(e){

        let tr = e.patch.find(el=>{
            return (el.tagName.toUpperCase() === 'TR')
        })

        return JSON.parse(tr.dataset.row)
    }

    btnUpdateClick(e){

        //Assim que foi clicado
        this.fireEvents('beforeUpdateClick', [e])

        let data = this.getTrData(e)

        for(let name in data){

            //Trata as exceções dos switch 
            this.options.onUpdateLoad(this.formUpdate, name, data)

        }
        //Assim que terminar o click
        this.fireEvents('afterUpdateClick', [e])

    }

    btnDeleteClick(e){
        this.fireEvents('beforeDeleteClick')

        let data = this.getTrData(e)

        if(confirm(eval('`' + this.options.deleteMessage + '`'))){ //eval entende o template string

            fetch(eval('`' + this.options.deleteURL + '`'), {
            
                method:'DELETE'
            
            })
            .then(response => response.json())
            .then(json =>{ 

                //Depois de clicar em excluir
                this.fireEvents('afterDeleteClick')
            })
        }
    }
}