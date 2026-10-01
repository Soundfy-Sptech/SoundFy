# Fluxo de Desenvolvimento

Este documento define o padrão de desenvolvimento e integração utilizado no projeto.

O objetivo é garantir um fluxo organizado, com **branches individuais**, **Pull Requests** e **revisão de código** antes das alterações chegarem às branches principais.

---

## **Branches**

O projeto utiliza duas branches principais:

### `main`

```text
Versão estável do projeto
```

Utilizada para versões finalizadas e aprovadas.

> **Não realizar commits ou pushes diretamente na `main`.**

### `development`

```text
Ambiente de desenvolvimento e testes
```

Utilizada para integrar e testar as funcionalidades antes de chegarem à `main`.

> **Não realizar commits ou pushes diretamente na `development`.**

---

## **Branches de Tarefa**

Cada integrante deve criar uma branch própria para sua tarefa.

### **Novas funcionalidades**

```text
feature/nome-da-tarefa
```

Exemplo:

```text
feature/tela-login
```

### **Correções**

```text
bugfix/nome-do-problema
```

Exemplo:

```text
bugfix/correcao-login
```

---

## **1. Atualizar a `development`**

Antes de iniciar uma nova tarefa:

```bash
git checkout development
git pull origin development
```

Isso garante que a nova branch seja criada a partir da versão mais atualizada.

---

## **2. Criar sua Branch**

Crie a branch a partir da `development`:

```bash
git checkout -b feature/nome-da-tarefa
```

Exemplo:

```bash
git checkout -b feature/tela-login
```

Para correções:

```bash
git checkout -b bugfix/correcao-login
```

---

## **3. Desenvolver e fazer Commits**

Realize o desenvolvimento normalmente dentro da sua branch.

Para salvar suas alterações:

```bash
git add .
git commit -m "tipo: descrição da alteração"
```

Exemplos:

```text
feat: adiciona tela de login
```

```text
fix: corrige validação do login
```

```text
docs: atualiza documentação
```

---

## **4. Verificar sua Branch**

Antes do `push`, confirme que está na branch correta:

```bash
git branch
```

Exemplo:

```text
  development
* feature/tela-login
  main
```

Também verifique as alterações:

```bash
git status
```

> **Sempre confirme a branch antes de realizar o `push`.**

---

## **5. Enviar a Branch para o GitHub**

Envie **somente sua branch de tarefa**:

```bash
git push origin feature/nome-da-tarefa
```

Exemplo:

```bash
git push origin feature/tela-login
```

Não faça:

```bash
git push origin development
```

```bash
git push origin main
```

---

## **6. Criar a Pull Request**

Após o `push`, acesse o repositório no GitHub e abra uma Pull Request.

A configuração deve ser:

```text
base: development

compare: feature/tela-login
```

Ou seja:

```text
feature/tela-login → development
```

A Pull Request deve informar:

* **O que foi desenvolvido**
* **O que foi alterado**
* **Testes realizados**
* **Pontos importantes para revisão**

---

## **7. Revisão**

A Pull Request deve ser revisada por **outro integrante do grupo**.

O revisor deve verificar:

```text
Código
Funcionamento
Requisitos da tarefa
Testes
Possíveis erros
Alterações desnecessárias
```

Após a aprovação:

```text
Approve → Merge
```

A branch será integrada à:

```text
development
```

---

## **8. Ajustes Solicitados**

Se forem solicitadas alterações durante a revisão, continue utilizando **a mesma branch**.

Faça as alterações e envie novamente:

```bash
git add .
git commit -m "fix: ajusta validação do login"
git push origin feature/tela-login
```

A Pull Request será atualizada automaticamente.

> **Não crie uma nova Pull Request para os ajustes.**

---

## **9. `development` → `main`**

Após as funcionalidades serem integradas e testadas na `development`, poderá ser criada uma Pull Request para a `main`:

```text
development → main
```

Essa Pull Request também deve passar por revisão antes do merge.

---

# **Comandos Essenciais**

### Atualizar a `development`

```bash
git checkout development
git pull origin development
```

### Criar uma branch

```bash
git checkout -b feature/nome-da-tarefa
```

### Verificar a branch atual

```bash
git branch
```

### Verificar alterações

```bash
git status
```

### Criar um commit

```bash
git add .
git commit -m "tipo: descrição"
```

### Enviar sua branch

```bash
git push origin feature/nome-da-tarefa
```

---

# **Padrão de Commits**

| Tipo       | Utilização          | Exemplo                           |
| ---------- | ------------------- | --------------------------------- |
| `feat`     | Nova funcionalidade | `feat: adiciona tela de login`    |
| `fix`      | Correção            | `fix: corrige validação do login` |
| `docs`     | Documentação        | `docs: atualiza README`           |
| `refactor` | Refatoração         | `refactor: reorganiza serviço`    |
| `test`     | Testes              | `test: adiciona testes de login`  |

---

# **Regras**

```text
1. Não realizar commits diretamente na main.

2. Não realizar commits diretamente na development.

3. Cada tarefa deve possuir sua própria branch.

4. Criar branches sempre a partir da development.

5. Toda alteração deve passar por Pull Request.

6. A Pull Request deve ser revisada por outro integrante.

7. Ajustes solicitados devem ser feitos na mesma branch.

8. Não utilizar force push nas branches compartilhadas.

9. Verificar a branch atual antes de realizar um push.

10. Testar a aplicação antes de abrir uma Pull Request.
```
