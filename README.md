# Master Auth

Este projeto é uma aplicação simples de autenticação utilizando o Amazon Cognito. Ele permite que os usuários façam login fornecendo um e-mail e uma senha diretamente no terminal.

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js (versão 18 ou superior)
- npm ou yarn

## Como executar

1. Clone este repositório:

    ```bash
    git clone https://github.com/seu-usuario/master_auth.git
    cd master_auth
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

    ou

    ```bash
    yarn
    ```

3. Configure as variáveis de ambiente no arquivo `.env`:

    ```plaintext
    AWS_REGION=sa-east-1
    COGNITO_USER_POOL_ID=seu_user_pool_id
    COGNITO_CLIENT_ID=seu_client_id
    ```

4. Execute o projeto:

    ```bash
    npm start
    ```

    ou

    ```bash
    yarn start
    ```

5. Insira seu e-mail e senha quando solicitado no terminal.
