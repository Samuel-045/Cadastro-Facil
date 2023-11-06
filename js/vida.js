function limparCampos(){
    campos = document.querySelectorAll('.campo')
    campos.forEach(campos => campos.value='')
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
}
tabela()

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
}

const editDelete = (event) =>{
    const [acao , indice] = event.target.id.split('-')

    if(acao=='Editar'){
        editar(indice)
    }else{
        deletar(indice)
    }
}

const linhaEvento = document.querySelectorAll("#table tbody tr")
linhaEvento.forEach(linha => {
    linha.addEventListener('click', editDelete)
})
