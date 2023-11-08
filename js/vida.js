function limparCampos(){
    campos = document.querySelectorAll('.campo')
    campos.forEach(campos => campos.value='')
    document.getElementById("cadastrar").disabled = false
    document .getElementById("atualizar").disabled = true
}

document.getElementById('limpar').addEventListener('click', event => {
    event.preventDefault()
    limparCampos()
})

const respGet = () => JSON.parse(localStorage.getItem('registro')) ?? []
const respSet = (obj) => localStorage.setItem('registro',JSON.stringify(obj));
function cadastrar() {
    var cont = 0
    let nome = document.getElementById('nome').value.trim()
    let sobrenome = document.getElementById('sobrenome').value.trim()
    let dataNasc = document.getElementById('dataNasc').value.trim()
    let cidade = document.getElementById('cidade').value.trim()
    let cep = document.getElementById('cep').value.trim()
    let endereco = document.getElementById('endereco').value.trim()
    let numero = document.getElementById('numero').value.trim()

    if(nome==''||sobrenome==''||dataNasc==''||cidade==''||cep==''||endereco==''||numero==''){
        document.getElementById("retorno").innerHTML = '<br><br> <p>Preencha os campos corretamente!!</p>'
    }else{
        cont++;
        obj = {
            Obnome: nome,
            Obsobrenome: sobrenome,
            Obdatanascimento: dataNasc,
            Obcidade: cidade,
            Obcep: cep,
            Obendereco: endereco,
            Obnumero: numero
        }
        const vetor = respGet()
        vetor.push(obj)
        respSet(vetor)
        limparCampos()
        tabela()
        acao()
        document.getElementById("retorno").innerHTML = '<br><br> <p>Cadastro realizado!</p>'+nome

    }
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
    
    document.getElementById("atualizar").addEventListener('click', event=>{
        event.preventDefault()
        atualizar(index)
    })
}
function atualizar(index){
    const edit = bdCliente()
    
    let nome = document.getElementById('nome').value
    let sobrenome = document.getElementById('sobrenome').value 
    let dataNasc = document.getElementById('dataNasc').value 
    let cidade = document.getElementById('cidade').value
    let cep = document.getElementById('cep').value 
    let endereco = document.getElementById('endereco').value
    let numero = document.getElementById('numero').value 
    
    let objNovo = {
        Obnome : nome,
        Obsobrenome : sobrenome,
        Obdatanascimento : dataNasc,
        Obcidade : cidade,
        Obcep : cep,
        Obendereco : endereco,
        Obnumero : numero
    }
   
    edit[index] = objNovo
    respSet(edit)
    limparCampos()
    tabela()
    document.getElementById("cadastrar").disabled = false
    document.getElementById("atualizar").disabled = true
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
document.getElementById("atualizar").disabled = true