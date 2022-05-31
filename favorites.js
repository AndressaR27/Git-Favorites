import { githubUser } from "./githubUser.js"

// classe que vai conter toda a lógica dos dados (como os dados serão estruturados)
export class favorite{
    constructor(root){
        this.root = document.querySelector(root)
        this.load()        
    }

load() {
    //array que irá receber os dados que estão no LocalStorage.
    // Como estão em formato de String, transformar para array com .parse
    this.entries = JSON.parse(localStorage.getItem('@github-Favorites:')) || []
}

save (){
    //salvar os dados vindo do github no LocalStorage. Os dados que vem do github está em formato de array.
    // O localStorage funciona com chave:valor, onde o valor deve ser uma string. 
    // a chave utilizada será '@github-Favorites:', e o valor será o array vindo do API github. 
    localStorage.setItem('@github-Favorites:', JSON.stringify(this.entries))
}

async add (username){
        //1. Ver se o usuário já existe
        try {
            const userExists = this.entries.find(entry => entry.login === username)
            if (userExists){
                throw new Error('Usuário já cadastrado')
            }
            
            const user = await githubUser.search(username)
        // possibilidade de não encontrar o usuário no github
            if (user.login === undefined){
                throw new Error ('Usuário não encontrado')
            }

            else {this.entries = [user, ...this.entries]
                this.update()
                this.save()
            }
        }
        catch(Error){
            alert(Error.message)
        }
}

delete (user) {
    // A função filter coloca no array o que for verdadeiro, e retira o que for falso
    //filter = cria um novo array com todos os elementos que passarem no teste implementado pela função fornecida. 
    const FilteredEntries = this.entries.filter( entry => entry.login != user.login)
    // colocar o novo Array formado anteriormente no this.entries
   this.entries = FilteredEntries
   this.update()
   this.save()
}
}

// classe que vai criar a visualização e eventos do HTML

export class FavoritesView extends favorite{
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody')
        this.update()
//console.log(this.root) - deverá aparecer a div app.
        this.onadd()
    }
       

    onadd () {
        const input = this.root.querySelector('#input-search')
        const buttonClick = this.root.querySelector('.button')
        buttonClick.onclick = () => {
            this.add(input.value)
        }
    }


   creatRow(){
       //função para criar o HTML. 
       //No creatElement deve ser colocado o nome da tag. 
        const tr = document.createElement('tr')
        const content = `
            <td class="user">
                <img src="https://github.com/diego3g.png" alt="imagem de perfil"/>
                <a href="https://github.com/diego3g" target="_blank">
                <p>Diego Fernandes</p>
                <span>diego3g</span>
                </a>
            </td>
            <td class="repositories">
                48
            </td>
            <td class="followers">
                22503
            </td>
            <td>
                <button class="remove">Remover</button>
            </td> `

            tr.innerHTML = content   

            return tr
        }

    update () {
        //1. Remover todas as linhas pre-existentes
        this.removeAllTr()
        //2. PARA CADA user do array criar uma linha com as informações do Github.
        this.entries.forEach(user => {
            const row = this.creatRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

        //3. O botão de remover tbm é PARA CADA user...

            row.querySelector('.remove').onclick = () => {
                const isOk = confirm('Tem certeza que deseja deletar este usuário?')
                if (isOk){
                    this.delete(user)
                }
            }
//função append:insere um conteúdo (recebido como parâmetro) no formato HTML ao final de um controle alvo.
            this.tbody.append(row)
        })
    } 

    removeAllTr(){
        this.tbody.querySelectorAll('tr').forEach((tr) => {tr.remove()} )
        
    }

    
}