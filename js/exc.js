const respGet = () => JSON.parse(localStorage.getItem('registro')) ?? []
const respSet = (obj) => localStorage.setItem('registro',JSON.stringify(obj))

function deletar(index) {
    const del = respGet()
    del.splice(index,1)
    localStorage.clear()
    vetor = respGet()

    for(var i = 0; i<del.length; i++){
        vetor.push(del[i])
    }

    respSet(vetor)
    mensagem(index)
}

mensagem = (index) => {
    const mensg = document.createElement("p")
    mensg.innerHTML = "O registro que possui o 'id' de número "+index+" foi excluído"
    mensg.style.margin = '50px 0'
    mensg.style.fontWeight = '700'
    document.getElementById("resp").appendChild(mensg)
}

if(window.location.href.split("?")[1]=="exc"){
    deletar(window.location.href.split("?")[2])
}