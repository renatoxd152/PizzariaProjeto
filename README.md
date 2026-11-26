# 🍕 Pizzaria

Sistema de pedidos de pizzaria feito com **arquitetura de microsserviços**. O cliente monta o pedido (pizzas e bebidas), paga e acompanha o andamento. O administrador cadastra os produtos e atualiza o status dos pedidos.

## Visão geral

O projeto é dividido em quatro microsserviços Java (Spring Boot) e um front-end em React. Cada serviço tem o seu próprio banco MongoDB, e os serviços de **pedidos** e **pagamentos** se comunicam por mensagens no **Kafka**.

```
                        ┌──────────────────────┐
                        │  Front-end (React)   │
                        │   Vite · porta 5173  │
                        └──────────┬───────────┘
                                   │ HTTP + JWT
        ┌──────────────┬───────────┴──┬────────────────┐
        ▼              ▼              ▼                ▼
  ┌──────────┐   ┌──────────┐   ┌──────────┐    ┌────────────┐
  │ usuarios │   │  pizzas  │   │ pedidos  │    │ pagamentos │
  │  :8080   │   │  :8081   │   │  :8082   │    │   :8083    │
  └────┬─────┘   └────┬─────┘   └──┬────▲──┘    └──┬────▲────┘
       │              │            │    │          │    │
    Mongo 27018   Mongo 27020   Mongo 27019        Mongo 27021
                                   │    │          │    │
                                   ▼    │          ▼    │
                              ┌─────────┴──────────────┴───┐
                              │   Kafka (porta 9092)       │
                              │ pedidos-realizados ──────► │
                              │ ◄────── pagamentos-aprovados│
                              └────────────────────────────┘
```

### Fluxo de um pedido

1. O cliente finaliza o carrinho e o serviço **pedidos** grava o pedido e publica no tópico `pedidos-realizados`.
2. O serviço **pagamentos** consome esse tópico e registra o pagamento.
3. Quando o pagamento é aprovado, ele publica no tópico `pagamentos-aprovados`.
4. O serviço **pedidos** consome esse tópico e atualiza o status do pedido.
5. O administrador segue alterando o status (em preparo, saiu para entrega, entregue...) e o cliente acompanha pela tela de pedidos.

## Serviços

| Serviço | Porta | Banco (Mongo) | Responsabilidade |
|---|---|---|---|
| `usuarios` | 8080 | 27018 | Cadastro, login (JWT) e dados dos usuários |
| `pizzas` | 8081 | 27020 | Cadastro de pizzas e bebidas, com upload de imagens |
| `pedidos` | 8082 | 27019 | Criação e acompanhamento de pedidos |
| `pagamentos` | 8083 | 27021 | Registro e consulta de pagamentos |
| `pizzaria-frontend` | 5173 | — | Interface web para clientes e administradores |

Cada serviço expõe a documentação **Swagger** em `http://localhost:<porta>/swagger-ui.html`.

## Tecnologias

**Back-end**
- Java 26 e Spring Boot 4.1
- Spring Web MVC, Spring Security (autenticação com JWT) e Spring Validation
- Spring Data MongoDB
- Spring Kafka
- Spring Cloud OpenFeign (comunicação entre serviços)
- MapStruct e Lombok
- springdoc-openapi (Swagger)
- Maven

**Front-end**
- React 19 e TypeScript
- Vite
- React Router
- React Hook Form e Zod (formulários e validação)
- Axios
- Bootstrap e Bootstrap Icons
- `qrcode.react` (pagamento via Pix)

**Infraestrutura**
- Docker Compose (MongoDB 7 e Kafka 3.8)

## Pré-requisitos

- [Java 26](https://jdk.java.net/) (JDK)
- [Node.js](https://nodejs.org/) 20 ou superior
- [Docker](https://www.docker.com/) e Docker Compose

O Maven não precisa ser instalado: cada serviço já traz o `mvnw` (Maven Wrapper).

## Como rodar

### 1. Clone o repositório

```bash
git clone https://github.com/renatoxd152/PizzariaProjeto.git
cd PizzariaProjeto
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na **raiz** do projeto:

```env
MONGO_USERNAME=seu_usuario
MONGO_PASSWORD=sua_senha
JWT_SECRET=chave_base64_com_pelo_menos_32_bytes
```

> O `JWT_SECRET` precisa estar em **Base64**, e o mesmo valor deve ser usado por todos os serviços, porque eles validam o mesmo token.

Cada serviço que usa banco também lê o nome do banco em `MONGO_DATABASE`. Crie um `.env` dentro de cada pasta (`usuarios`, `pizzas`, `pedidos`, `pagamentos`) com o nome do banco daquele serviço:

```env
MONGO_DATABASE=pedidos
```

No front-end, crie `pizzaria-frontend/.env`:

```env
VITE_SERVICO_PIZZA_URL=http://localhost:8081
```

### 3. Suba os bancos e o Kafka

Na raiz do projeto:

```bash
docker compose up -d
```

Isso inicia quatro instâncias do MongoDB (portas 27018 a 27021) e o Kafka (porta 9092).

### 4. Inicie os microsserviços

Em um terminal para cada serviço:

```bash
cd usuarios    && ./mvnw spring-boot:run
cd pizzas      && ./mvnw spring-boot:run
cd pedidos     && ./mvnw spring-boot:run
cd pagamentos  && ./mvnw spring-boot:run
```

No Windows, use `mvnw.cmd` no lugar de `./mvnw`. Também é possível iniciar cada serviço direto pela IDE (IntelliJ).

### 5. Inicie o front-end

```bash
cd pizzaria-frontend
npm install
npm run dev
```

Acesse **http://localhost:5173**.

## Perfis de usuário

O acesso é controlado por perfis (roles) dentro do token JWT.

| Perfil | O que pode fazer |
|---|---|
| `CLIENTE` | Ver pizzas e bebidas, montar o carrinho, fazer pedidos, pagar e acompanhar o status dos seus pedidos |
| `ADMIN` | Cadastrar, editar e excluir pizzas e bebidas, listar todos os pedidos e alterar o status |

## Telas do front-end

**Públicas**

| Rota | Tela |
|---|---|
| `/usuarios/cadastro` | Cadastro de usuário |
| `/login` | Login |

**Cliente**

| Rota | Tela |
|---|---|
| `/pizzas` | Cardápio de pizzas |
| `/bebidas` | Cardápio de bebidas |
| `/carrinho` | Carrinho |
| `/checkout/:id` | Pagamento do pedido |
| `/pedido/confirmado/:id` | Confirmação do pedido |
| `/pedidos` | Acompanhamento dos pedidos |

**Administrador**

| Rota | Tela |
|---|---|
| `/listar/pedidos` | Todos os pedidos, com alteração de status |
| `/cadastro/pizzas` | Cadastro de pizzas |
| `/cadastro/bebidas` | Cadastro de bebidas |
| `/listar/pizzas` | Pizzas cadastradas |
| `/editar/pizza/:id` | Edição de pizza |

## Principais endpoints

### Usuários (`:8080`)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/usuarios` | Cadastra um usuário |
| `POST` | `/usuarios/login` | Faz login e retorna o token JWT |
| `GET` | `/usuarios` | Lista usuários (ADMIN) |
| `GET` | `/usuarios/{id}/pedidos` | Lista os pedidos de um usuário |
| `PUT` | `/usuarios/{cpf}` | Atualiza um usuário |
| `DELETE` | `/usuarios/{cpf}` | Exclui um usuário |

### Pizzas e bebidas (`:8081`)

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/pizzas` | Lista as pizzas |
| `POST` | `/pizzas` | Cadastra uma pizza (com imagem) |
| `PUT` | `/pizzas/{id}` | Atualiza uma pizza |
| `DELETE` | `/pizzas/{id}` | Exclui uma pizza |
| `GET` | `/bebidas` | Lista as bebidas |
| `POST` | `/bebidas` | Cadastra uma bebida (com imagem) |

### Pedidos (`:8082`)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/pedidos` | Cria um pedido |
| `GET` | `/pedidos` | Lista os pedidos |
| `GET` | `/pedidos/{id}` | Busca um pedido |
| `GET` | `/pedidos/clientes/{id}` | Lista os pedidos de um cliente |
| `PATCH` | `/pedidos/{id}/status` | Atualiza o status do pedido |

### Pagamentos (`:8083`)

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/pagamentos` | Registra um pagamento |
| `GET` | `/pagamentos/{cpf}` | Lista os pagamentos de um cliente |
| `GET` | `/pagamentos/pedido/{id}` | Busca o pagamento de um pedido |

Formas de pagamento aceitas: `PIX`, `CARTAO_CREDITO` e `DINHEIRO`.

## Status do pedido

```
PENDENTE → AGUARDANDO_PAGAMENTO → FATURADO → EM_PREPARO
        → PREPARANDO_ENVIO → SAIU_PARA_ENTREGA → ENTREGUE
```

Também existem os status `REALIZADO`, `ERRO_PAGAMENTO` e `CANCELADO`, que ficam fora do fluxo normal.

## Estrutura do projeto

```
PizzariaProjeto/
├── docker-compose.yml     # MongoDB (x4) e Kafka
├── usuarios/              # Microsserviço de usuários e autenticação
├── pizzas/                # Microsserviço de pizzas e bebidas
├── pedidos/               # Microsserviço de pedidos
├── pagamentos/            # Microsserviço de pagamentos
├── pizzaria-frontend/     # Aplicação React
└── uploads/               # Imagens enviadas no cadastro de produtos
```

Os serviços Java seguem a mesma organização em camadas: `controller`, `service`, `repository`, `model`, `configs` e, quando necessário, `publisher`/`subscriber` (Kafka) e `client` (Feign).

## Testes

Em cada microsserviço:

```bash
./mvnw test
```

Os serviços `pedidos` e `pagamentos` têm testes de controller e de service.

## Autor

Desenvolvido por [renatoxd152](https://github.com/renatoxd152).
