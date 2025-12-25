# Blog em Node.js

Aplicação de blog desenvolvida com Node.js, Express, MongoDB e Handlebars,
com sistema de autenticação, autorização por nível de acesso (admin) e CRUD completo.

[Link do Deploy](http://18.230.193.26:3000)


## 🚀 Tecnologias

- Node.js
- Express
- MongoDB + Mongoose
- Handlebars
- Express-session
- BcryptJS
- Connect-flash
- Bootstrap

## ✨ Funcionalidades

- Cadastro e login de usuários
- Autenticação via sessão
- CRUD de categorias
- CRUD de postagens
- Listagem de postagens por categoria
- Sistema de mensagens flash
- Interface responsiva com Bootstrap

## 📁 Estrutura do Projeto

```
├── models/
│   ├── User.js
│   ├── Post.js
│   └── Category.js
│
├── routes/
│   ├── admin.js
│   └── user.js
│
├── helpers/
│   └── isAdmin.js
│
├── views/
│   ├── layouts/
│   ├── partials/
│   ├── admin/
│   ├── users/
│   └── categories/
│
├── public/
│   └── css/
│
├── app.js
└── package.json
```


## 📌 Pré-requisitos

- Node.js (v18 ou superior)
- MongoDB instalado localmente ou Atlas
- NPM ou Yarn

## ⚙️ Como rodar o projeto

```bash
# Clone o repositório
git clone https://github.com/leoreboucas/blog-node

# Entre na pasta
cd blog-node

# Instale as dependências
npm install

# Inicie o servidor
npm run dev

```

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
env
SESSION_PASSWORD=suachave
URI=mongodb://localhost/blogapp

---
```

## 👤 Usuário Administrador

Para acessar a área administrativa:
- Crie um usuário normalmente
- No banco de dados, altere o campo `isAdmin` para `true`

## 👨‍💻 Autor

Desenvolvido por Leo Almeida inspirado no projeto do curso [BLOG DE NODE](https://www.youtube.com/playlist?list=PLJ_KhUnlXUPtbtLwaxxUxHqvcNQndmI4B)
