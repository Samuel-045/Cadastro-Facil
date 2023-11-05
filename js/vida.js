function limpar(){
    campos = document.querySelectorAll('.campo')
    campos.forEach(campos => campos.value='')
}

document.getElementById('limpar').addEventListener('click', event => {
    event.preventDefault()
    limpar()
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
        limpar()
        document.getElementById("retorno").innerHTML = '<br><br> <p>Cadastro realizado!</p>'+nome
    }
}

const bdCliente = () => localStorage.length==0 ? [] : JSON.parse(localStorage.getItem("registro"))


function tabela(){
    const tab = () => bdCliente()
}

document.getElementById("cadastrar").addEventListener('click', event =>{
    event.preventDefault();
    cadastrar();
})