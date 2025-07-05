# Checklist Detalhado - Desafio Técnico Credifit/LinkPJ

Aqui está um checklist detalhado em formato Markdown para a execução do desafio técnico, com base no documento fornecido.

### **Fase 0: Planejamento e Configuração do Projeto**

-   [x] **Configuração do Repositório:**
    -   [x] Criar um novo repositório Git.
    -   [x] Estruturar o repositório com pastas separadas para `**backend**` e `**frontend**`.
    -   [x] Criar um arquivo `README.md` inicial para documentar o projeto.

-   [x] **Definições de Arquitetura e Tecnologia:**
    -   [x] Escolher o framework do Frontend: React.js.
    -   [x] Planejar a arquitetura da API RESTFul no Backend (NestJS).
    -   [x] Planejar a estratégia de modelagem de dados.
    -   [x] Planejar a estratégia de tratamento de erros para a API e integrações.

### **Fase 1: Desenvolvimento do Backend (NestJS)**

-   [ ] **Modelagem de Dados (Entidades/Schemas):**
    -   [ ] Criar a entidade para o representante da empresa com os campos: CNPJ, Razão Social, Nome Completo, CPF, E-mail, Senha.
    -   [ ] Criar a entidade para o funcionário com os campos: Nome Completo, CPF, E-mail, Senha, Salário.
    -   [ ] Implementar a restrição de cadastro único por CPF/CNPJ ou endereço de e-mail.
    -   [ ] Criar a entidade `Loan` (Empréstimo) para armazenar valor, parcelas, status, datas de vencimento, etc.

-   [ ] **Lógica de Negócio e Serviços (Foco em SOLID, DDD):**
    -   [ ] **Serviço de Empréstimo:**
        -   [ ] Criar um método para validar que a parcela não excede 35% do salário do funcionário.
        -   [ ] Criar um método para integrar com o mock de "score de crédito" (`https://mocki.io/v1/f7b3627c-444a-4d65-b76b-d94a6c63bdcf`).
        -   [ ] Implementar a regra de aprovação automática baseada no salário e score:
            -   [ ] Salário até R$ 2.000,00 → score >= 400.
            -   [ ] Salário até R$ 4.000,00 → score >= 500.
            -   [ ] Salário até R$ 8.000,00 → score >= 600.
            -   [ ] Salário até R$ 12.000,00 → score >= 700.
        -   [ ] Criar método para calcular as datas de vencimento: a primeira um mês após a solicitação, e as subsequentes a cada mês.
        -   [ ] Integrar com o mock do gateway de pagamento (`https://mocki.io/v1/386c594b-d42f-4d14-8036-508a0cf1264c`) no caso de aprovação.
        -   [ ] Implementar tratamento de erro para a possível instabilidade do serviço de pagamento.

-   [ ] **API Endpoints (Controllers):**
    -   [ ] Criar um endpoint `POST /loans` para a solicitação de empréstimo.
        -   [ ] Validar se o solicitante é funcionário de uma empresa conveniada.
        -   [ ] Invocar os serviços para validar score, aprovar/rejeitar e salvar o empréstimo.
    -   [ ] Criar um endpoint `GET /loans` para listar os empréstimos aprovados ou rejeitados.
    -   [ ] Criar um endpoint que retorne o valor máximo solicitável e as opções de parcelamento de 1 a 4 vezes.

-   [ ] **Testes Automatizados:**
    -   [ ] Escrever testes unitários para a lógica de aprovação de empréstimo (regras de score/salário).
    -   [ ] Escrever testes unitários para o cálculo de parcelas e datas de vencimento.
    -   [ ] Escrever testes de integração para o fluxo de solicitação de empréstimo.
    -   [ ] Simular (mock) as chamadas para as APIs externas (score e gateway de pagamento) nos testes.

### **Fase 2: Desenvolvimento do Frontend (React/Vue)**

-   [ ] **Estrutura e Componentes:**
    -   [x] Configurar o projeto Frontend (React).
    -   [ ] Criar um formulário para solicitação de empréstimo (valor e seleção de parcelas de 1 a 4).
    -   [ ] Exibir para o usuário o valor máximo que ele pode solicitar.
    -   [ ] Criar uma tela/componente para listar os empréstimos já solicitados pelo usuário, com seus respectivos status (aprovado/rejeitado).
    -   [ ] Aplicar um Design System básico para consistência visual.

-   [ ] **Integração com a API:**
    -   [ ] Implementar chamadas à API do backend (NestJS).
    -   [ ] Gerenciar o estado da aplicação para armazenar dados do usuário e empréstimos.
    -   [ ] Exibir feedback ao usuário durante as chamadas de API (loading, sucesso, erro).

### **Fase 3: Finalização e Entrega**

-   [ ] **Documentação:**
    -   [ ] Finalizar e detalhar o `README.md` do repositório.
    -   [ ] Incluir instruções claras sobre como configurar e executar os projetos.
    -   [ ] Argumentar as decisões técnicas tomadas.
    -   [ ] Descrever os endpoints da API.

-   [ ] **Vídeo de Apresentação:**
    -   [ ] Preparar um roteiro para o vídeo.
    -   [ ] Gravar uma demonstração da plataforma funcionando.
    -   [ ] Na gravação, comentar sobre:
        -   [ ] As escolhas de implementação e decisões técnicas.
        -   [ ] Os requisitos que foram cumpridos.
        -   [ ] O que ficou pendente e por quê.
        -   [ ] Os desafios enfrentados durante o desenvolvimento.

-   [ ] **Revisão e Envio:**
    -   [ ] Revisar todo o código em busca de limpeza e manutenibilidade.
    -   [ ] Garantir que todos os testes automatizados estão passando.
    -   [ ] Verificar se os itens "O que não será avaliado" (Cadastro de funcionários/empresas e Autenticação) não foram implementados.
    -   [ ] Enviar o link do repositório Git e o vídeo da solução para o e-mail informado.