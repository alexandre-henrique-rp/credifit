# Desafio Técnico Credifit

<p align="center">
  <img src="https://www.credifit.com.br/images/logo-credifit.svg" width="150" alt="Alexandre Henrique R Araujo"/>
</p>

<p align="center">
  Desenvolvido por: <strong>Alexandre Henrique R Araujo</strong>
</p>

<p align="center">
  <a href="https://github.com/alexandre-henrique-rp" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
  </a>
  <a href="https://www.linkedin.com/in/alexandre-henrique-rp/" target="_blank">
    <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
  </a>
</p>

---

## 📝 Sobre o Projeto

Este projeto é uma solução para o desafio técnico proposto pela **Credifit**. O objetivo é desenvolver uma plataforma para solicitação de empréstimo consignado, implementando um fluxo de aprovação automática com base em regras de negócio pré-definidas.

A aplicação consiste em uma API RESTful construída com **NestJS** e um frontend desenvolvido em **React.JS**.

---

## ✨ Funcionalidades Principais

- **Solicitação de Empréstimo:** Permite que funcionários de empresas conveniadas solicitem empréstimos.
- **Validação de Margem:** Calcula e valida a margem consignável do funcionário (até 35% do salário).
- **Aprovação Automática:** Aprova ou rejeita empréstimos automaticamente com base no score de crédito e no salário do solicitante.
- **Opções de Parcelamento:** Oferece opções de parcelamento de 1 a 4 vezes.
- **Listagem de Empréstimos:** Exibe o histórico de empréstimos solicitados pelo usuário.

---

## 🚀 Tecnologias Utilizadas

- **Backend:** NestJS
- **Frontend:** React.JS
- **Controle de Versão:** Git

---

## ⚙️ Como Executar o Projeto

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/) ou [NPM](https://www.npmjs.com/)

### Rodando o Backend (API)

```bash
# Clone este repositório
$ git clone https://github.com/alexandre-henrique-rp/credifit

# Acesse a pasta do projeto no terminal/cmd
$ cd credifit/backend

# Instale as dependências
$ npm install

# Execute a aplicação em modo de desenvolvimento
$ npm run start:dev

# O servidor iniciará na porta:3000 - acesse <http://localhost:3000>
```

### Rodando o Frontend

```bash
# Acesse a pasta do frontend
$ cd credifit/frontend

# Instale as dependências
$ npm install

# Execute a aplicação
$ npm run start
```

---

## STATUS

<p align="center">
  <img src="http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge"/>
</p>