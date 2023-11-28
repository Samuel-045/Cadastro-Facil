document.getElementById("atualizar").disabled = true
document.getElementById("endereco").disabled = true

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
    let tpUF = document.getElementById('clientes').value.trim()

    const Rxnome = /[\w]/
    let condNome = Rxnome.test(nome)
    let condSobre = Rxnome.test(sobrenome)
    let condCliente = Rxnome.test(tpUF)//reutilizando o regex do nome para o tipo de cliente

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

        if(retorno != 'erro'){
            document.getElementById("retorno").innerHTML = ''
            obj = {
                Obnome: nome,
                Obsobrenome: sobrenome,
                Obdatanascimento: dataNasc,
                Obcep: cep,
                Obendereco: retorno,
                Obnumero: numero,
                ObUF:tpUF
            }
            
            
            const vetor = respGet()
            vetor.push(obj)
            respSet(vetor)
            limparCampos()
            tabela()
            acao()
            
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

function deletar(index) {
    const del = respGet()
    del.splice(index,1)
    localStorage.clear()
    vetor = respGet()

    for(var i = 0; i<del.length; i++){
        vetor.push(del[i])
    }

    respSet(vetor)
    tabela()
    acao()
}

function preencheCampos(index){
    const cliente = bdCliente()[index]  

    document.getElementById('nome').value = cliente.Obnome
    document.getElementById('sobrenome').value = cliente.Obsobrenome
    document.getElementById('dataNasc').value = cliente.Obdatanascimento
    document.getElementById('cidade').value = cliente.Obcidade
    document.getElementById('cep').value = cliente.Obcep
    document.getElementById('endereco').value = cliente.Obendereco
    document.getElementById('numero').value = cliente.Obnumero
    document.getElementById('clientes').value = cliente.Obcliente
    
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
    let tpUF = document.getElementById('clientes').value

    const Rxnome = /[\w]/
    let condNome = Rxnome.test(nome)
    let condSobre = Rxnome.test(sobrenome)
    let condCliente = Rxnome.test(tpUF)//reutilizando o regex do nome para o tipo de cliente

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
                ObUF : tpUF
            }
        
            edit[index] = objNovo
            respSet(edit)
            limparCampos()
            tabela()
            document.getElementById("cadastrar").disabled = false
            document.getElementById("atualizar").disabled = true

        }
    }    
}


const uf = ['SP-São Paulo','RJ-Rio de Janeiro','MG-Minas Gerais','ES-Espírito Santo','RS-Rio Grande do Sul']
uf.forEach(valSelection)
function valSelection(opcao){
    const valor = document.createElement('option')
    valor.innerHTML =`<option value=${opcao}>${opcao}</option>`
     
    document.querySelector('form .caixaSup .dir #clientes').appendChild(valor)
}

function estilButton(){//função para estilizar os botões, diferenciando os botões habilitados e desabilitados
    var buttons = document.querySelectorAll('button')
    var link = document.querySelector('#PagTabela')
    link.style.background = 'black'
    link.style.color = 'white'
    link.style.text_decoration = 'none'
    
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
estilButton()