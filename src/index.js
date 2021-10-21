const express = require('express');
const cors = require('cors');

 const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {

  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).json({ error: "Conta não existente!" })
  }

  request.user = user;

  return next();

}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const userExists = users.some(
    (user) => user.username === username
  );

  if (userExists) {
    return response.status(400).json({ error: "Usuário já existe" })
  }

  users.push({
    name,
    username,
    id: uuidv4(),
    todos: []
  });

  return response.status(201).send();

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const { user } = request;

  const todosOperation = {
    title,
    deadline: new Date(deadline),
    done: false,
    created_at: new Date(),
    id: uuidv4()
  }

  user.todos.push(todosOperation);

  return response.status(201).send();
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { title, deadline } = request.body;

  const { user } = request;

  const id = request.params.id;
  console.log(id);

  const todo = user.todos.find((todo) => todo.id = id);

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(200).send();
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  const id = request.params.id;

  const todo = user.todos.find((todo) => todo.id = id);
  todo.done = true;

  return response.status(200).send();
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  const id = request.params.id;

  const todos = user.todos.filter((todo) => todo.id != id);

  user.todos = todos;

  return response.status(200).send();
});

module.exports = app;