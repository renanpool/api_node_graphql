const { ApolloServer, gql } = require('apollo-server');

let tasks = [
  { id: '1', title: 'Fazer compras', completed: false, userId: '1' },
  { id: '2', title: 'Estudar PHP', completed: true, userId: '2' },
];

let users = [
  { id: '1', name: 'Renan' },
  { id: '2', name: 'Rommel' },
];

const typeDefs = gql`
  type Query {
    tasks: [Task]
    task(id: ID!): Task
    completedTasks: [Task]
    pendingTasks: [Task]
    users: [User]
  }

  type Mutation {
    createTask(title: String!, userId: ID!): Task
    markTaskAsCompleted(id: ID!): Task
    updateTask(id: ID!, title: String!): Task
    deleteTask(id: ID!): ID
  }

  type Task {
    id: ID!
    title: String!
    completed: Boolean!
    user: User!
  }

  type User {
    id: ID!
    name: String!
    tasks: [Task]
  }
`;

const resolvers = {
  Query: {
    tasks: () => tasks,
    task: (parent, { id }) => tasks.find(task => task.id === id),
    completedTasks: () => tasks.filter(task => task.completed),
    pendingTasks: () => tasks.filter(task => !task.completed),
    users: () => users,
  },
  Mutation: {
    createTask: (parent, { title, userId }) => {
      const newTask = { id: String(tasks.length + 1), title, completed: false, userId };
      tasks.push(newTask);
      return newTask;
    },
    markTaskAsCompleted: (parent, { id }) => {
      const taskIndex = tasks.findIndex(task => task.id === id);
      if (taskIndex === -1) throw new Error('Task not found');
      tasks[taskIndex].completed = true;
      return tasks[taskIndex];
    },
    updateTask: (parent, { id, title }) => {
      const taskIndex = tasks.findIndex(task => task.id === id);
      if (taskIndex === -1) throw new Error('Task not found');
      tasks[taskIndex].title = title;
      return tasks[taskIndex];
    },
    deleteTask: (parent, { id }) => {
      const taskIndex = tasks.findIndex(task => task.id === id);
      if (taskIndex === -1) throw new Error('Task not found');
      tasks.splice(taskIndex, 1);
      return id;
    },
  },
  Task: {
    user: (parent) => users.find(user => user.id === parent.userId),
  },
  User: {
    tasks: (parent) => tasks.filter(task => task.userId === parent.id),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});