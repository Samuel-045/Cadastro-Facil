document.getElementById("atualizar").disabled = true
document.getElementById("endereco").disabled = true

function limparCampos(){
    campos = document.querySelectorAll('.campo')
    campos.forEach(campos => campos.value='')
    
    document.getElementById('clientes').value = "$" // retorna para a opção 'Selecione'

    document.getElementById("retorno").innerHTML = ''
    document.getElementById("cadastrar").disabled = false
    document .getElementById("atualizar").disabled = true
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
    let cidade = document.getElementById('cidade').value.trim()
    let cep = document.getElementById('cep').value.trim()
    let numero = document.getElementById('numero').value.trim()
    let tpCliente = document.getElementById('clientes').value.trim()

    const Rxnome = /[\w]/
    let condNome = Rxnome.test(nome)
    let condSobre = Rxnome.test(sobrenome)
    let condCliente = Rxnome.test(tpCliente)//reutilizando o regex do nome para o tipo de cliente

    const Rxdata = /(\d{4})(-)(\d{2})(-)(\d{2})/
    let condData = Rxdata.test(dataNasc)

    const RxCity = /[\W{ã,â,á,à,ú,ù,ó,ô,õ,ç,é,è}]/
    let condCity = RxCity.test(cidade)

    const Rxcep = /^(\d{5})[-]{1}?(\d{3})$/
    let condCep = Rxcep.test(cep)

    const Rxnum = /\d{1,5}/
    let condNum = Rxnum.test(numero)

    if(!condNome||!condSobre||!condData||!condCity||!condCep||!condNum||!condCliente){
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
                Obcidade: cidade,
                Obcep: cep,
                Obendereco: retorno,
                Obnumero: numero,
                Obcliente:tpCliente
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
    let url = `http://viacep.com.br/ws/${cep}/json/`;
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

const criarLinha = (client,index) => {
    const estrutura = document.createElement('tr')
    estrutura.innerHTML=`
        <td class="centro">${client.Obnome}</td>
        <td class="centro">${client.Obdatanascimento}</td>
        <td class="centro">${client.Obcidade}</td>
        <td class="centro">${client.Obendereco}</td>
        <td class="imgs" id="imgs">
            <img src="../img/editar.png" id="Editar-${index}" title="Editar" alt="Editar">
            <img src="../img/bin.png" id="Excluir-${index}" title="Excluir" alt="Excluir">    
        </td>
        `
    document.querySelector("#table>tbody").appendChild(estrutura)
}
const desfazerLinha = () => {
    const linhas = document.querySelectorAll("#table>tbody tr")
    linhas.forEach(linha => linha.parentNode.removeChild(linha))
}

function tabela(){
    const tab = bdCliente()
    desfazerLinha()
    tab.forEach(criarLinha)
    acao()
}

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
    let cidade = document.getElementById('cidade').value
    let cep = document.getElementById('cep').value 
    let numero = document.getElementById('numero').value 
    let tpCliente = document.getElementById('clientes').value

    const Rxnome = /[\w]/
    let condNome = Rxnome.test(nome)
    let condSobre = Rxnome.test(sobrenome)
    let condCliente = Rxnome.test(tpCliente)//reutilizando o regex do nome para o tipo de cliente

    const Rxdata = /(\d{4})(-)(\d{2})(-)(\d{2})/
    let condData = Rxdata.test(dataNasc)

    const RxCity = /[\W{ã,â,á,à,ú,ù,ó,ô,õ,ç,é,è}]/
    let condCity = RxCity.test(cidade)

    const Rxcep = /^(\d{5})[-]{1}?(\d{3})$/
    let condCep = Rxcep.test(cep)

    const Rxnum = /\d{1,5}/
    let condNum = Rxnum.test(numero)
    
    if(!condNome||!condSobre||!condData||!condCity||!condCep||!condNum||!condCliente){
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
                Obcidade : cidade,
                Obcep : cep,
                Obendereco : retorno,
                Obnumero : numero,
                Obcliente : tpCliente
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

const editDelete = (event) =>{//Função que vai receber o id e discernir qual ação será seguida
    const [acao , indice] = event.target.id.split('-')

    if(acao=='Editar'){
        preencheCampos(indice)
        document.getElementById("cadastrar").disabled = true
        document.getElementById("atualizar").disabled = false
    }else{
        deletar(indice)
    }
}

function acao(){//Função que roda a tabela e adiciona os eventos de click
    const linhaEvento = document.querySelectorAll("#table tbody tr img")
    linhaEvento.forEach(linha => {
        linha.addEventListener('click', editDelete)
    })
}

tabela()

const opcoesCli = ['Bronze','Prata','Ouro','Platina','Diamante']
opcoesCli.forEach(valSelection)
function valSelection(opcao){
    const valor = document.createElement('option')
    valor.innerHTML =`<option value=${opcao}>${opcao}</option>`
     
    document.querySelector('form .caixaSup .dir #clientes').appendChild(valor)
}