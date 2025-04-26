# Projeto contendo o Desafio Técnico de Backend da Teddy Open Finance

API construída em NodeJS + TypeScript, usando NestJS como framework, banco de dados PostgreSQL e Docker, com objetivo principal de encurtar URLs. 

#### Tecnologias

- Node.js versão 22.15.0 (Última versão estável)
- NestJS versão 11.0.7
- PostgreSQL versão 13
- TypeScript
- Docker
- Class Validator / Transformer
- Bcrypt
- TypeORM
- JSON WEB Token
- Passport JWT (JSON WEB Token)
- Jest
- Swagger

#### Como rodar localmente

1. Clone o repositório
```
git clone https://github.com/pedrogarcia8/teddyopenfinance-backend-challenge.git
cd teddyopenfinance-backend-challenge
```

2. Adicione o arquivo .env na raiz do projeto, seguindo o exemplo:
```
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=teddyopenfinance
JWT_SECRET=secret
```

3. Construa e rode a aplicação com docker-compose
```
docker-compose up --build
```
- A API ficará disponível em http://localhost:8080

4. Caso queria executar os testes, instale as dependências antes de rodá-los
```
npm install
```

#### Rodando os testes automatizados

Rodar todos os teste
```
npm run test
```

Rodar testes em modo de observação (watch mode)
```
npm run test:watch
```

Gerar relatório de cobertura de testes
```
npm run test:cov
```
- O relatório de cobertura será gerado em ./coverage (pasta "coverage" na raiz do projeto)

#### Documentação

É possível acessar a documentação Swagger da API em http://localhost:8080/docs, nela contém a documentação das rotas detalhadamente.

##### GET /:code
- Recebe o código da URL encurtada.
- Valida se o código existe no banco de dados.
- Redireciona o usuário para a URL original.

##### POST /url/shorten
- Autenticação Opcional
- Recebe a URL original
- Retorna a URL encurtada

##### GET /url/user
- Autenticação Obrigatória
- Retorna a listagem dos dados da URL de um usuário

##### PATCH /url/user/{id}
- Autenticação Obrigatória
- Atualiza a URL original de uma URL encurtada

##### DELETE /url/user/{id}
- Autenticação Obrigatória
- Realiza um "soft delete" na URL encurtada

##### POST /user
- Cria um novo usuário
- Retorna um token de autenticação

##### POST /user/auth
- Autentica um usuário
- Retorna um token de autenticação

#### Pontos de Melhoria e Desafios para Escalabilidade Horizontal

Ao escalar uma aplicação horizontalmente, há diversos pontos que precisam ser considerados para garantir o bom funcionamento:

- Gerenciamento de Sessões: Utilizar soluções como Redis para gerenciar sessões de forma distribuída, evitando problemas ao acessar diferentes instâncias.

- Balanceamento de Carga: Usar balanceadores de carga para distribuir as requisições entre as instâncias de forma eficiente e evitar sobrecarga em algumas delas.

- Banco de Dados: Implementar replicação de banco de dados para distribuir as leituras e garantir desempenho, além de considerar o sharding para escalabilidade maior.

- Orquestração e Monitoramento: Ferramentas como Kubernetes e Prometheus são essenciais para gerenciar a infraestrutura e monitorar a saúde das instâncias.

- Dependências Externas: Utilizar circuit breakers e timeouts para evitar falhas em serviços externos afetarem o sistema. Também é importante usar filas para processar tarefas assíncronas.

- Escalabilidade de API: Implementar API Gateway para gerenciar o tráfego e distribuir as requisições adequadamente entre as instâncias.

Desafios:

- Manter a consistência de dados entre as instâncias, gerenciar sessões de usuários e implementar um monitoramento eficaz.

Essas melhorias garantirão que a aplicação escale de maneira eficiente, suportando maior carga de usuários e mantendo a performance.