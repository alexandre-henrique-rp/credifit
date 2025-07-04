## **Estrutura da API RESTful (Pseudo-rotas)**

### Nota sobre Autenticação
O desafio especifica que a autenticação não será avaliada. Portanto, para os endpoints abaixo, assumiremos que o `id` do funcionário é passado diretamente na rota ou no corpo da requisição para identificar o usuário.

---

### Recurso: `/users`

Este recurso seria para gerenciar usuários, mas como o cadastro está fora do escopo, vamos usá-lo apenas para obter informações necessárias para o fluxo de empréstimo.

#### `GET /users/:userId/loan-summary`
- **Funcionalidade:** Fornece um resumo rápido para o frontend, incluindo o valor máximo que o usuário pode solicitar.
- **Método HTTP:** `GET`
- **Endpoint:** `/users/:userId/loan-summary`
- **Corpo da Requisição:** N/A
- **Resposta de Sucesso (200 OK):**
  ```json
  {
    "userId": "uuid-do-funcionario-123",
    "maxLoanAmount": 2800.00, // Exemplo: 35% do salário de R$ 8.000,00
    "installmentsOptions": [
      { "numberOfInstallments": 1, "installmentValue": 2800.00 },
      { "numberOfInstallments": 2, "installmentValue": 1400.00 },
      { "numberOfInstallments": 3, "installmentValue": 933.33 },
      { "numberOfInstallments": 4, "installmentValue": 700.00 }
    ]
  }
  ```
- **Regras de Negócio:**
  1. Busca o salário do funcionário com o `:userId`.
  2. Calcula a margem disponível (`salario * 0.35`).
  3. Calcula as opções de parcelamento com base no valor máximo.

---

### Recurso: `/loans`

Recurso principal para gerenciar as solicitações de empréstimo.

#### `POST /loans`
- **Funcionalidade:** Cria uma nova solicitação de empréstimo.
- **Método HTTP:** `POST`
- **Endpoint:** `/loans`
- **Corpo da Requisição:**
  ```json
  {
    "userId": "uuid-do-funcionario-123",
    "amount": 5000.00,
    "installments": 4
  }
  ```
- **Resposta de Sucesso (201 Created):**
  ```json
  {
    "loanId": "uuid-do-emprestimo-456",
    "userId": "uuid-do-funcionario-123",
    "amount": 5000.00,
    "installments": 4,
    "status": "APROVADO", // ou "REJEITADO"
    "dueDates": [
      "2025-08-03",
      "2025-09-03",
      "2025-10-03",
      "2025-11-03"
    ]
  }
  ```
- **Resposta de Erro (400 Bad Request):**
  ```json
  {
    "statusCode": 400,
    "message": "O valor solicitado excede a margem consignável de R$ 2800.00.",
    "error": "Bad Request"
  }
  ```
- **Regras de Negócio:**
  1.  **Validação de Margem:** Verifica se `amount` é <= 35% do salário do `userId`.
  2.  **Consulta de Score:** Chama o mock de score: `https://mocki.io/v1/f7b3627c-444a-4d65-b76b-d94a6c63bdcf`.
  3.  **Regra de Aprovação:** Aplica a lógica de aprovação com base no salário e no score obtido.
  4.  **Cálculo de Vencimentos:** Calcula as datas de vencimento (primeira parcela 1 mês após a solicitação).
  5.  **Gateway de Pagamento:** Se aprovado, chama o mock do gateway: `https://mocki.io/v1/386c594b-d42f-4d14-8036-508a0cf1264c`.
  6.  Salva o empréstimo no banco de dados com o status final.

#### `GET /loans/user/:userId`
- **Funcionalidade:** Lista todos os empréstimos (aprovados e rejeitados) de um funcionário específico.
- **Método HTTP:** `GET`
- **Endpoint:** `/loans/user/:userId`
- **Corpo da Requisição:** N/A
- **Resposta de Sucesso (200 OK):**
  ```json
  [
    {
      "loanId": "uuid-do-emprestimo-456",
      "amount": 5000.00,
      "installments": 4,
      "status": "APROVADO",
      "requestDate": "2025-07-03T10:00:00Z"
    },
    {
      "loanId": "uuid-do-emprestimo-789",
      "amount": 1000.00,
      "installments": 2,
      "status": "REJEITADO",
      "requestDate": "2025-06-15T14:30:00Z"
    }
  ]
  ```
- **Regras de Negócio:**
  1. Busca no banco de dados todos os empréstimos associados ao `:userId`.
  2. Retorna a lista ordenada pela data de solicitação (mais recente primeiro).