function limpar(){
    document.getElementById('nome').value=''
    document.getElementById('sobrenome').value=''
    document.getElementById('dataNasc').value=''
    document.getElementById('cidade').value=''
    document.getElementById('cep').value=''
    document.getElementById('endereco').value=''
    document.getElementById('numero').value=''
}

document.getElementById('limpar').addEventListener('click', event => {
    event.preventDefault()
    limpar()
})