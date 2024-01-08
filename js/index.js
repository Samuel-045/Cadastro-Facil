document.getElementById("atualizar").disabled = true
const endereco = document.getElementById("endereco")
endereco.disabled = true

function limparCampos(){
    campos = document.querySelectorAll('.campo')
    campos.forEach(campos => campos.value='')
    
    document.getElementById('clientes').value = "$" // retorna para a opção 'Selecione'

    document.getElementById("retorno").innerHTML = ''
    document.getElementById("cadastrar").disabled = false
    document .getElementById("atualizar").disabled = true
    estilButton()
}

document.getElementById('limpar').addEventListener('click', event => {
    event.preventDefault()
    limparCampos()
})

const respGet = () => JSON.parse(localStorage.getItem('registro')) ?? []
const respSet = (obj) => localStorage.setItem('registro',JSON.stringify(obj));
async function cadastrar() {
    let nome = document.getElementById('nome').value.trim()
    let sobrenome = document.getElementById('sobrenome').value.trim()
    let dataNasc = document.getElementById('dataNasc').value.trim()
    let cep = document.getElementById('cep').value.trim()
    let numero = document.getElementById('numero').value.trim()
    let tpestado = document.getElementById('clientes').value.trim()

    const Rxnome = /[\w]/
    let condNome = Rxnome.test(nome)
    let condSobre = Rxnome.test(sobrenome)
    let condCliente = Rxnome.test(tpestado)//reutilizando o regex do nome para o tipo de cliente

    const Rxdata = /(\d{4})(-)(\d{2})(-)(\d{2})/
    let condData = Rxdata.test(dataNasc)

    const Rxcep = /^(\d{5})[-]{1}?(\d{3})$/
    let condCep = Rxcep.test(cep)

    const Rxnum = /\d{1,5}/
    let condNum = Rxnum.test(numero)

    if(!condNome||!condSobre||!condData||!condCep||!condNum||!condCliente){
        document.getElementById("retorno").innerHTML = '<p>Preencha os campos corretamente!!</p>'
    }else{
        var cepEdit = cep.replace("-","")//tiro o traço para buscar na API
        var retorno = await buscaCep(cepEdit)//irá retornar se o cep é válido

        if(retorno != 'erro'){
            document.getElementById("retorno").innerHTML = ''
            obj = {
                Obnome: nome,
                Obsobrenome: sobrenome,
                Obdatanascimento: dataNasc,
                Obcep: cep,
                Obendereco: retorno,
                Obnumero: numero,
                Obestado:tpestado
            }
            
            
            const vetor = respGet()
            vetor.push(obj)
            respSet(vetor)
            limparCampos()
            
        }
    }
}

async function buscaCep(cep){
    let url = `https://viacep.com.br/ws/${cep}/json/`;
    let dados = await fetch(url)
    let enderecoApi = await dados.json()
    if(enderecoApi.hasOwnProperty('erro')){
        document.getElementById("endereco").value="Local não encontrado"
        return 'erro'
    }else{
        preencheEnde(enderecoApi)
        var endereco = enderecoApi.logradouro
        return  endereco
    }
}
function preencheEnde(enderecoApi){
    document.getElementById('endereco').value = enderecoApi.logradouro
}

//constante usada para resgatar os dados no banco
const bdCliente = () => localStorage.length==0 ? [] : JSON.parse(localStorage.getItem("registro"))

document.getElementById("cadastrar").addEventListener('click', event =>{
    event.preventDefault();
    cadastrar();
})

function preencheCampos(index){
    const cliente = bdCliente()[index]  

    document.getElementById('nome').value = cliente.Obnome
    document.getElementById('sobrenome').value = cliente.Obsobrenome
    document.getElementById('dataNasc').value = cliente.Obdatanascimento
    document.getElementById('cep').value = cliente.Obcep
    document.getElementById('endereco').value = cliente.Obendereco
    document.getElementById('numero').value = cliente.Obnumero
    document.getElementById('clientes').value = cliente.Obestado
    
    document.getElementById("atualizar").addEventListener('click', event=>{
        event.preventDefault()
        atualizar(index)
    })
}
async function atualizar(index){
    const edit = bdCliente()
    
    let nome = document.getElementById('nome').value
    let sobrenome = document.getElementById('sobrenome').value 
    let dataNasc = document.getElementById('dataNasc').value 
    let cep = document.getElementById('cep').value 
    let numero = document.getElementById('numero').value 
    let tpestado = document.getElementById('clientes').value

    const Rxnome = /[\w]/
    let condNome = Rxnome.test(nome)
    let condSobre = Rxnome.test(sobrenome)
    let condCliente = Rxnome.test(tpestado)//reutilizando o regex do nome para o estado de cliente

    const Rxdata = /(\d{4})(-)(\d{2})(-)(\d{2})/
    let condData = Rxdata.test(dataNasc)

    const Rxcep = /^(\d{5})[-]{1}?(\d{3})$/
    let condCep = Rxcep.test(cep)

    const Rxnum = /\d{1,5}/
    let condNum = Rxnum.test(numero)
    
    if(!condNome||!condSobre||!condData||!condCep||!condNum||!condCliente){
        document.getElementById("retorno").innerHTML = '<br><br> <p>Preencha os campos corretamente!!</p>'
    }else{
        var cepEdit = cep.replace("-","")//tiro o traço para buscar na API
        var retorno = await buscaCep(cepEdit)//irá retornar se o cep é válido
        if(retorno!='erro'){
            document.getElementById("retorno").innerHTML = ''
            let objNovo = {
                Obnome : nome,
                Obsobrenome : sobrenome,
                Obdatanascimento : dataNasc,
                Obcep : cep,
                Obendereco : retorno,
                Obnumero : numero,
                Obestado : tpestado
            }
        
            edit[index] = objNovo
            respSet(edit)
            limparCampos()
            document.getElementById("cadastrar").disabled = false
            document.getElementById("atualizar").disabled = true

        }
    }    
}

const estado = ['SP-São Paulo','RJ-Rio de Janeiro','MG-Minas Gerais','ES-Espírito Santo','RS-Rio Grande do Sul']
estado.forEach(valSelection)
function valSelection(opcao){
    const valor = document.createElement('option')
    valor.innerHTML =`<option value=${opcao}>${opcao}</option>`
     
    document.querySelector('form .caixaSup .dir #clientes').appendChild(valor)
}

function estilButton(){//função para estilizar os botões, diferenciando os botões habilitados e desabilitados
    var buttons = document.querySelectorAll('.bttnPadrao')
    
    buttons.forEach(botao => {
        if(!botao.disabled){        
            botao.style.background = 'black'
            botao.style.color = 'white'
            botao.style.transition = '0.5s'
        }else{
            botao.style.background = 'transparent'
            botao.style.color = 'gray' 
        }
    })
}

if(window.location.href.split("?")[1]== 'alt'){
    preencheCampos(window.location.href.split("?")[2])
    document.getElementById("cadastrar").disabled = true
    document.getElementById("atualizar").disabled = false
    estilButton()
}
estilButton()

// códigos para a tela mobile -> ação do pop-up de opções 
const pop = document.getElementById("popup")
const body = document.querySelector('*')
const header = document.querySelector('header')
const caixaSup = document.querySelector('.caixaSup')
const inputs = document.querySelectorAll("input[class*='campo']")
const select = document.querySelector('select')
var condPop = false

function fundoEsc(){
    //linhas para deixar o fundo escuro quando algum pop-up ativar
    body.style.background = "rgba(0,0,0,0.5)"
    header.style.background = "rgba(0,0,0,0.5)"
    caixaSup.style.background = "rgba(0,0,0,0.4)"
    inputs.forEach( input => {
        input.style.background = "rgba(0,0,0,0.2)"
    });
    select.style.background = "rgba(0,0,0,0.2)"
}
function fundoClr(){
    //linhas para deixar o fundo claro quando o pop-up descer
    body.style.background = "#FFF"
    header.style.background = "#A8A8A8"
    caixaSup.style.background = "#A8A8A8"
    inputs.forEach( input => {
        input.style.background = "#dbdbdb"
    });
    select.style.background = "#dbdbdb"
}
const opcoes = document.getElementById("opcoes")
opcoes.addEventListener('click', event => {
    event.preventDefault()
    pop.style.animationDuration = '0.6s'
    pop.style.animationName = 'abreOpcoes' // ativação da animação criada no css
    fundoEsc()
    pop.style.top = '30%'
    condPop=true
})

function fecharOpc(){
    pop.style.animationDuration = '1.2s'
    pop.style.animationName = 'fechaOpcoes' // ativação da animação criada no css
    fundoClr()
    pop.style.top = '-200%'
}

document.getElementById("voltar").addEventListener('click', event => {
    event.preventDefault()
    fecharOpc()
})

header.addEventListener('click', event => {
    if(condPop){
        fecharOpc()
        condPop=false
    }
})

caixaSup.addEventListener('click', event => {
    if(condPop){
        fecharOpc()
        condPop=false
    }
})

// códigos para a verificação de usuário -> ação do pop-up de verificação
const estd = document.getElementById("clientes")
estd.disabled = true
opcoes.disabled = true
var campos = document.querySelectorAll("input")
campos.forEach( campo=> {
    campo.disabled = true
});
fundoEsc()

var login = document.getElementById('login')
var bttnS = document.getElementById('verifiS')
var bttnN = document.getElementById('verifiN')
function verificador(){
    login.style.animationDuration = '1.2s'
    login.style.animationName = 'abreVerificador'
    login.style.right = '0'
}
verificador()

var camposLogin = document.querySelectorAll(".login input[class*='lg']")
bttnS.addEventListener('click', event => {
    camposLogin.forEach(campo => {
        campo.disabled = false
        campo.style.background = "#dbdbdb"
    })
    camposLogin[2].style.background = 'black'
})

bttnN.addEventListener('click' , event => {
    login.style.animationDuration = '1.2s'
    login.style.animationName = "fecharVerificador"
    login.style.display = 'none'
    fundoClr()
    estd.disabled = false
    opcoes.disabled = false
    campos.forEach( campo=> {
        campo.disabled = false  
    });
    endereco.disabled=true
})

document.getElementById("confirmLogin").addEventListener('click',event => {
    event.preventDefault()
    if(camposLogin[0].value=='usuario' && camposLogin[1].value=='1023'){
        login.style.animationDuration = '1.2s'
        login.style.animationName = "fecharVerificador"
        login.style.display = 'none'
        fundoClr()
        estd.disabled = false
        opcoes.disabled = false
        campos.forEach( campo=> {
            campo.disabled = false  
        });
        endereco.disabled=true
        document.getElementById("PagTabela").style.display = 'initial'
        document.getElementById('retornoLg').innerHTML = ''
    }else{
        document.getElementById('retornoLg').innerHTML = '<p> Administrador não cadastrado </p>'
    }
})
