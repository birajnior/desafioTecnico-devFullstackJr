# Desafio Técnico - Desenvolvedor Fullstack Júnior

Repositório referente ao desafio técnico proposto pela LogsUp.

## 👤 Usuário inicial
- **Email:** admin@logsup.com  
- **Senha:** admin#123  

## 🚀 Tecnologias utilizadas
- Node.js
- Express.js
- SQLite
- EJS

## ⚙️ Requisitos
- Node.js 18+  
- NPM  
- SQLite instalado

## 📦 Instalação
```bash
git clone https://github.com/birajnior/desafioTecnico-devFullstackJr.git
cd desafioTecnico-devFullstackJr
npm install
```

## ▶️ Execução
```bash
node app.js
```

Acesse em: [http://localhost:3000](http://localhost:3000)

## 🔑 Perfis de acesso
| Papel        | Permissões |
|--------------|------------|
| **Admin**    | Criar, listar, editar e excluir produtos |
| **Supervisor** | Criar, listar, editar e excluir produtos |
| **Analista** | Criar e listar produtos |

## 📡 API de Produtos
- **Endpoint:** `/api/produtos`  
- **Método:** GET  
- **Retorno:** JSON com os produtos cadastrados  
- **Autenticação:** Obrigatória (somente usuários logados podem acessar)

Exemplo de resposta:
```json
{
  "success": true,
  "total": 5,
  "produtos": [
    {
      "id": 10,
      "nome": "Bola de Futebol",
      "descricao": "Bola oficial tamanho 5",
      "preco": 120,
      "quantidade": 50,
      "dataCriacao": "2025-09-22T20:21:55.899Z",
      "usuario": { "nome": "admin", "email": "admin@logsup.com" }
    }
  ]
}
```
