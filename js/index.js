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
    campos.forEach(campo => {
        campo.style.border = 'transparent'
    })
    document.getElementById('clientes').style.border = 'transparent'
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
    let estado = document.getElementById('clientes').value.trim()

    const Rxnome = /^([A-Za-z{ÃãàÀÁáÇçèÈÉéÍíÜüÓóÒò}]{1,})[\s]?([A-Za-z{ÃãàÀÁáÇçèÈÉéÍíÜüÓóÒò}]{1,}?)[\s]?$/
    let condNome = Rxnome.test(nome)

    const Rxsbnome = /^([A-Za-z{ÃãàÀÁáÇçèÈÉéÍíÜüÓóÒò}]{1,})[\s]?$/
    let condSobre = Rxsbnome.test(sobrenome)

    const Rxdata = /^(\d{4})(-)(\d{2})(-)(\d{2})$/
    let condData = Rxdata.test(dataNasc)

    if(condData){ //se a data digitada estiver no formato correto, a verificação de idade é realizada abaixo
        let dataAtual = dataFormatada()
        let datainput = dataFormatada_Inp(dataNasc)      
        
        let difInMls = new Date(dataAtual) - new Date(datainput)
        let tempDia = 1000 * 60 * 60 * 24 //tempo existente em 1 dia
        var difInDays = difInMls / tempDia 
        //a diferença em dias deve ser no mínimo de 6.574 dias (contando com os dias bisextos)
    }

    const Rxcep = /^(\d{5})[-]{1}?(\d{3})$/
    let condCep = Rxcep.test(cep)

    const Rxnum = /^\d{1,5}$/
    let condNum = Rxnum.test(numero)

    const RxEstd = /^[A-Z]{2}[-]?[\s]{1}[A-Za-z{ÃãàÀÁáÇçèÈÉéí}]{1,}$/
    let condCliente = RxEstd.test(estado)

    if(!condNome||!condSobre||!condData||difInDays<6754||!condCep||!condNum||!condCliente){
        document.getElementById("retorno").innerHTML = '<p>Preencha os campos corretamente!!</p>'
        campoEspfc(condNome,condSobre,condData,difInDays,condCep,condNum,condCliente)
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
                Obestado:estado
            }
            
            const vetor = respGet()
            vetor.push(obj)
            respSet(vetor)
            limparCampos()
            campoEspfc(condNome,condSobre,condData,difInDays,condCep,condNum,condCliente)
            
        }
    }
}
function dataFormatada(){//puxa a data atual e 'formata'
    let data = new Date()
    return `${data.getFullYear()}-${(data.getMonth())+1}-${data.getDate()}`
}
function dataFormatada_Inp(data){//puxa a data inserida no input e formata para inserir no Date
    var [ano,mes,dia]= data.split('-').map(Number)
    return `${ano}-${mes}-${dia}`
}

//função anônima que retorna em qual campo está a informação incorreta
const campoEspfc = (condNome,condSobre,condData,difInDays,condCep,condNum,condCliente) => {
    if(condNome==false){
        document.getElementById('nome').style.border = 'solid 1px red'
    }else{
        document.getElementById('nome').style.border = 'solid 1px transparent'
    }

    if(condSobre==false){
        document.getElementById('sobrenome').style.border = 'solid 1px red'
    }else{
        document.getElementById('sobrenome').style.border = 'solid 1px transparent'
    }

    if(condData==false){
        document.getElementById('dataNasc').style.border = 'solid 1px red'
    }else{
        document.getElementById('dataNasc').style.border = 'solid 1px transparent'
    }

    if(difInDays<6754 || difInDays == undefined){
        document.getElementById('dataNasc').style.border = 'solid 1px red'
    }else{
        document.getElementById('dataNasc').style.border = 'solid 1px transparent'
    }

    if(condCep==false){
        document.getElementById('cep').style.border = 'solid 1px red'
    }else{
        document.getElementById('cep').style.border = 'solid 1px transparent'
    }

    if(condNum==false){
        document.getElementById('numero').style.border = 'solid 1px red'
    }else{
        document.getElementById('numero').style.border = 'solid 1px transparent'
    }

    if(condCliente==false){
        document.getElementById('clientes').style.border = 'solid 1px red'
    }else{
        document.getElementById('clientes').style.border = 'solid 1px transparent'
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
    let estado = document.getElementById('clientes').value

    const Rxnome = /^([A-Za-z{ÃãàÀÁáÇçèÈÉéÍíÜüÓóÒò}]{1,})[\s]?([A-Za-z{ÃãàÀÁáÇçèÈÉéÍíÜüÓóÒò}]{1,}?)[\s]?$/
    let condNome = Rxnome.test(nome)
    
    const Rxsbnome = /^([A-Za-z{ÃãàÀÁáÇçèÈÉéÍíÜüÓóÒò}]{1,})[\s]?$/
    let condSobre = Rxsbnome.test(sobrenome)

    const Rxdata = /^(\d{4})(-)(\d{2})(-)(\d{2})$/
    let condData = Rxdata.test(dataNasc)

    if(condData){ //se a data digitada estiver no formato correto, a verificação de idade é realizada abaixo
        let dataAtual = dataFormatada()
        let datainput = dataFormatada_Inp(dataNasc)      
        
        let difInMls = new Date(dataAtual) - new Date(datainput)
        let tempDia = 1000 * 60 * 60 * 24 //tempo existente em 1 dia
        var difInDays = difInMls / tempDia 
        //a diferença em dias deve ser no mínimo de 6.574 dias (contando com os dias bisextos)
    }

    const Rxcep = /^(\d{5})[-]{1}?(\d{3})$/
    let condCep = Rxcep.test(cep)

    const Rxnum = /^\d{1,5}$/
    let condNum = Rxnum.test(numero)

    const RxEstd = /^[A-Z]{2}[-]{1}[\sA-Za-z{ÃãàÀÁáÇçèÈÉéÍí}]{1,}$/
    let condCliente = RxEstd.test(estado)
    
    if(!condNome||!condSobre||!condData||difInDays<6574||!condCep||!condNum||!condCliente){
        document.getElementById("retorno").innerHTML = '<br><br> <p>Preencha os campos corretamente!!</p>'
        campoEspfc(condNome,condSobre,condData,difInDays,condCep,condNum,condCliente)
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
                Obestado : estado
            }
            
            edit[index] = objNovo
            respSet(edit)
            limparCampos()
            document.getElementById("cadastrar").disabled = false
            document.getElementById("atualizar").disabled = true
            campoEspfc(condNome,condSobre,condData,difInDays,condCep,condNum,condCliente)
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

//criação de variáveis para escurecer a tela
const opcoes = document.getElementById("opcoes")
const body = document.querySelector('*')
const header = document.querySelector('header')
const caixaSup = document.querySelector('.caixaSup')
const inputs = document.querySelectorAll("input[class*='campo']")
const select = document.querySelector('select')

function fundoEsc(){
    //linhas para deixar o fundo escuro quando algum pop-up ativar
    body.style.background = "rgba(0,0,0,0.5)"
    header.style.background = "rgba(0,0,0,0.5)"
    caixaSup.style.background = "rgba(0,0,0,0.4)"
    opcoes.style.background = "rgba(78,78,78,1)"
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
    opcoes.style.background = "#A8A8A8"
    inputs.forEach( input => {
        input.style.background = "#dbdbdb"
    });
    select.style.background = "#dbdbdb"
}

// códigos para a verificação de usuário -> ação do pop-up de verificação
const estd = document.getElementById("clientes")
estd.disabled = true
var campos = document.querySelectorAll("input")
campos.forEach( campo=> {
    campo.disabled = true
});
fundoEsc()

const login = document.querySelector('section')
var bttnS = document.getElementById('verifiS')
var bttnN = document.getElementById('verifiN')
function verificador(){
    login.style.animationDuration = '1.2s'
    login.style.animationName = 'abreVerificador'
    login.style.left = '0'
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
    event.preventDefault()
    login.style.animationDuration = '0.6s'
    login.style.animationName = 'fechaVerificador'
    login.style.left='-200%'
    fundoClr()
    estd.disabled = false
    campos.forEach( campo=> {
        campo.disabled = false  
    });
    endereco.disabled=true
})

document.getElementById("confirmLogin").addEventListener('click',event => {
    event.preventDefault()
    if(camposLogin[0].value=='usuario' && camposLogin[1].value=='1023'){
        login.style.animationDuration = '0.6s'
        login.style.animationName = "fechaVerificador"
        login.style.left ='-200%'
        fundoClr()
        estd.disabled = false
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
