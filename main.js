document.addEventListener('DOMContentLoaded', () => {

  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const uncompletedList = document.getElementById('uncompleted-todo-list');
  const completedList = document.getElementById('completed-todo-list');

  // ローカルストレージからTODOを取得
  const getTodos = () => {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
  };

  // ローカルストレージにTODOを保存
  const saveTodos = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  // TODOアイテムのHTMLを作成する
  const createTodoCard = (text, completed, id) => {
    const todoCard = document.createElement('div');
    todoCard.classList.add('todo-card');

    if (completed) {
      todoCard.classList.add('todo-completed');
    }

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = completed;
    checkbox.addEventListener('change', () => toggleTodoCompletion(id));

    const todoText = document.createElement('span');
    todoText.classList.add('todo-text');
    todoText.textContent = text;  // 改行を反映させるためにtextContentを使う
    todoText.dataset.id = id;
    todoText.setAttribute('contenteditable', 'true');  // 編集可能にする
    todoText.style.whiteSpace = 'pre-wrap';  // このスタイルで改行を表示

    // 編集が終了した際に内容を保存
    todoText.addEventListener('blur', () => saveEditedTodoText(id, todoText.textContent));

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.addEventListener('click', () => deleteTodo(id));

    todoCard.appendChild(checkbox);
    todoCard.appendChild(todoText);
    todoCard.appendChild(deleteBtn);

    return todoCard;
  };

  // TODOの完了状態を切り替え
  const toggleTodoCompletion = (id) => {
    const todos = getTodos();
    const todo = todos.find(todo => todo.id === id);

    if (todo) {
      todo.completed = !todo.completed;
      saveTodos(todos);
      renderTodos();
    }
  };

  // TODOを削除
  const deleteTodo = (id) => {
    if (confirm('このTODOを削除してもよろしいですか？')) {
      const todos = getTodos();
      const updatedTodos = todos.filter(todo => todo.id !== id);
      saveTodos(updatedTodos);
      renderTodos();
    }
  };

  // 編集後、TODOの内容を保存
  const saveEditedTodoText = (id, newText) => {
    const todos = getTodos();
    const todo = todos.find(todo => todo.id === id);

    if (todo) {
      todo.text = newText;  // 編集後の内容を保存
      saveTodos(todos);
    }
  };

  // ページ読み込み時にTODOを表示
  const renderTodos = () => {
    const todos = getTodos();
    uncompletedList.innerHTML = '';
    completedList.innerHTML = '';

    todos.forEach(todo => {
      const todoCard = createTodoCard(todo.text, todo.completed, todo.id);

      if (todo.completed) {
        completedList.appendChild(todoCard);
      } else {
        uncompletedList.appendChild(todoCard);
      }
    });
  };

  // 新しいTODOを追加
  todoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const todoText = todoInput.value.trim();

    if (todoText) {
      const newTodo = {
        text: todoText,
        completed: false,
        id: Date.now().toString()  // unique ID for each todo
      };

      const todos = getTodos();
      todos.push(newTodo);
      saveTodos(todos);

      // 新しいTODOをDOMに追加
      const newTodoCard = createTodoCard(todoText, false, newTodo.id);
      uncompletedList.appendChild(newTodoCard);

      // 入力欄をリセット
      todoInput.value = '';
    }
  });

  // ページ読み込み時にTODOリストを描画
  renderTodos();

});

