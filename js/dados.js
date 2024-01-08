const banco = () => localStorage.length == 0 ? [] : JSON.parse(localStorage.getItem('registro'))

const desfazerLinha = () => {
    const linhas = document.querySelectorAll("#table>tbody tr")
    linhas.forEach(linha => linha.parentNode.removeChild(linha))
}
const criarLinha = (client,index) => {
    const estrutura = document.createElement('tr')
    estrutura.innerHTML=`
        <td class="centro">${client.Obnome}</td>
        <td class="centro">${client.Obdatanascimento}</td>
        <td class="centro">${client.Obestado}</td>
        <td class="centro">${client.Obendereco}</td>
        <td class="imgs" id="imgs">
            <img src="../img/editar.png" id="Editar-${index}" title="Editar" alt="Editar">
            <img src="../img/bin.png" id="Excluir-${index}" title="Excluir" alt="Excluir">    
        </td>
        `
    document.querySelector("#table>tbody").appendChild(estrutura)
}
function acao(){//Função que roda a tabela e adiciona os eventos de click
    const linhaEvento = document.querySelectorAll("#table tbody tr img")
    linhaEvento.forEach(linha => {
        linha.addEventListener('click', editDelete)
    })
}

function tabela(){
    const tab = banco()
    desfazerLinha()
    tab.forEach(criarLinha)
    acao()
}

const editDelete = (event) =>{//Função que vai receber o id e discernir qual ação será seguida
    const [acao , indice] = event.target.id.split('-')

    if(acao=='Editar'){
        window.open("index.html?alt?"+indice+"?90" , '_self')
    }else{
        window.open("del.html?exc?"+indice+"?90",'_self')
    }
}

tabela()