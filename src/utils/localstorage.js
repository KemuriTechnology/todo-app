const STORAGE_KEY = 'todos-vuejs-2.0';

export function fetch () {
  var todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  return todos;
}

export function save (todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// visibility filters

export function all (todos) {
  return todos;
}

export function active (todos) {
  return todos.filter(function (todo) {
    return !todo.completed;
  });
}

export function completed (todos) {
  return todos.filter(function (todo) {
    return todo.completed;
  });
}

export default {
  fetch,
  save,
  all,
  active,
  completed
};
