# TaskManager API
___

- Esse projeto foi produzido para a conclusão de um desafio proposto na formção fullStack da [Rocketseat](https://www.rocketseat.com.br/formacao/fullstack);
- O projeto consiste em criar uma api em ***NODE.JS*** para o gerenciamento de tarefas e times.
___
## Funcionalidades
##### Autenticação e autorização
- Deve ser possível criar uma conta e iniciar uma sessão
- JWT para autenticação
- Níveis de acesso:
  - Administrador: gerencia usuários e equipes
  - Membro: gerencia tarefas atribuídas
##### Gerenciamento de Times:
- Apenas o usuário admin pode criar e editar times
- Apenas o usuário admin pode adicionar ou remover membros do time

##### Tarefas
- CRUD de tarefas (criar, ler, atualizar, deletar)
- Status: "Pendente", "Em progresso", "Concluído"
- Prioridade: "Alta", "Média", "Baixa"
- Atribuição de tarefas para membros específicos.

##### Usuário Admin
- Visualizar e gerenciar todas as tarefas, usuários e times.
##### Member
- Visualiza tarefas do time
- Pode editar apenas suas tarefas
___
### Tecnologias e Recursos
- #### Back-end:
  - Framework: Express.js
  - Banco de dados: PostgreSQL
  - ORM: Prisma
- #### Testes: (Não implementado)
  - Framework de testas: N/A
- #### Outros:
  - Docker
  - Typescript
  - Zod
  - JWT
___
### Próximos passos
- [ ] Implementar Testes
- [ ] Adicionar imagens/Arquivo das requisições
- [ ] Como executar o projeto em ambiente local
- [ ] Deploy
