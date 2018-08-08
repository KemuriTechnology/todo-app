<template>
  <div>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo"
             autofocus autocomplete="off"
             placeholder="What needs to be done?"
             v-model="newTodo"
             @keyup.enter="addTodo">
    </header>
    <section class="main" v-show="todos.length" v-cloak>
      <input class="toggle-all" type="checkbox" v-model="allDone">
      <ul class="todo-list">
        <li v-for="todo in filteredTodos"
            class="todo"
            :key="todo.id"
            :class="{ completed: todo.completed, editing: todo === editedTodo }">
          <div class="view">
            <input class="toggle" type="checkbox" v-model="todo.completed">
            <label @dblclick="editTodo(todo)">{{ todo.title }}</label>
            <button class="destroy" @click="removeTodo(todo)"></button>
          </div>
          <input class="edit" type="text"
                 v-model="todo.title"
                 v-todo-focus="todo == editedTodo"
                 @blur="doneEdit(todo)"
                 @keyup.enter="doneEdit(todo)"
                 @keyup.esc="cancelEdit(todo)">
        </li>
      </ul>
    </section>
    <footer class="footer" v-show="todos.length" v-cloak>
        <span class="todo-count">
          <strong>{{ remaining }}</strong> {{ remaining | pluralize }} left
        </span>
      <ul class="filters">
        <li><a  :class=" visibility === 'all'? 'selected' : ''" @click="visibility = 'all'">All</a></li>
        <li><a  :class=" visibility === 'active'? 'selected' : ''" @click="visibility = 'active'">Active</a></li>
        <li><a  :class=" visibility === 'completed'? 'selected' : ''" @click="visibility = 'completed'">Completed</a></li>
      </ul>
      <button class="clear-completed" @click="removeCompleted" v-show="todos.length > remaining">
        Clear completed
      </button>
    </footer>
  </section>
  </div>
</template>

<script>
import localStorage from '../utils/localstorage.js';

export default {
  name: 'todo',

  data () {
    return {
      todos: localStorage.fetch(),
      newTodo: '',
      editedTodo: null,
      visibility: 'all'
    };
  },

  // watch todos change for localStorage persistence
  watch: {
    todos (todos) {
      localStorage.save(todos);
    }
  },

  // computed properties
  // https://vuejs.org/guide/computed.html
  computed: {
    filteredTodos () {
      return localStorage[this.visibility](this.todos);
    },
    remaining () {
      return localStorage.active(this.todos).length;
    },
    allDone: {
      get: function () {
        return this.remaining === 0;
      },
      set (value) {
        this.todos.forEach(function (todo) {
          todo.completed = value;
        });
      }
    }
  },

  filters: {
    pluralize (n) {
      return n === 1 ? 'item' : 'items';
    }
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    addTodo () {
      var value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }
      this.todos.push({
        id: localStorage.uid++,
        title: value,
        completed: false
      });
      this.newTodo = '';
    },

    removeTodo (todo) {
      this.todos.splice(this.todos.indexOf(todo), 1);
    },

    editTodo (todo) {
      this.beforeEditCache = todo.title;
      this.editedTodo = todo;
    },

    doneEdit (todo) {
      if (!this.editedTodo) {
        return;
      }
      this.editedTodo = null;
      todo.title = todo.title.trim();
      if (!todo.title) {
        this.removeTodo(todo);
      }
    },

    cancelEdit (todo) {
      this.editedTodo = null;
      todo.title = this.beforeEditCache;
    },

    removeCompleted () {
      this.todos = localStorage.active(this.todos);
    }
  },

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // https://vuejs.org/guide/custom-directive.html
  directives: {
    'todo-focus': function (el, binding) {
      if (binding.value) {
        el.focus();
      }
    }
  }
};
</script>

<style>

</style>
