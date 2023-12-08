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

if(window.location.href.split("?")[2]=="exc"){
}