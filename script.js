document.addEventListener("DOMContentLoaded", () => {
    const todoInput = document.getElementById("todoInput");
    const addBtn = document.getElementById("addBtn");
    const todoList = document.getElementById("todoList");
    const filterBtns = document.querySelectorAll(".filter-btn");
  
    let todos = JSON.parse(localStorage.getItem("todos")) || [];
    let currentFilter = "all";
  
    // Render todos
    function renderTodos() {
      todoList.innerHTML = "";
      const filteredTodos = todos.filter((todo) => {
        if (currentFilter === "active") return !todo.completed;
        if (currentFilter === "completed") return todo.completed;
        return true;
      });
  
      filteredTodos.forEach((todo, index) => {
        const li = document.createElement("li");
        li.className = `todo-item ${todo.completed ? "completed" : ""}`;
  
        li.innerHTML = `
                  <input type="checkbox" class="todo-checkbox" ${
                    todo.completed ? "checked" : ""
                  }>
                  <span class="todo-text">${todo.text}</span>
                  <div class="todo-actions">
                      <button class="edit-btn"><i class="fas fa-edit"></i></button>
                      <button class="delete-btn"><i class="fas fa-trash"></i></button>
                  </div>
              `;
  
        // Add event listeners
        const checkbox = li.querySelector(".todo-checkbox");
        const editBtn = li.querySelector(".edit-btn");
        const deleteBtn = li.querySelector(".delete-btn");
        const todoText = li.querySelector(".todo-text");
  
        checkbox.addEventListener("change", () => {
          todos[index].completed = checkbox.checked;
          saveTodos();
          renderTodos();
        });
  
        editBtn.addEventListener("click", () => {
          const currentText = todoText.textContent;
          const input = document.createElement("input");
          input.type = "text";
          input.className = "edit-input";
          input.value = currentText;
  
          todoText.replaceWith(input);
          input.focus();
  
          const saveEdit = () => {
            const newText = input.value.trim();
            if (newText) {
              todos[index].text = newText;
              saveTodos();
              renderTodos();
            } else {
              renderTodos();
            }
          };
  
          input.addEventListener("blur", saveEdit);
          input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") {
              saveEdit();
            }
          });
        });
  
        deleteBtn.addEventListener("click", () => {
          todos.splice(index, 1);
          saveTodos();
          renderTodos();
        });
  
        todoList.appendChild(li);
      });
    }
  
    // Save todos to localStorage
    function saveTodos() {
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  
    // Add new todo
    function addTodo() {
      const text = todoInput.value.trim();
      if (text) {
        todos.push({
          text,
          completed: false,
        });
        saveTodos();
        todoInput.value = "";
        renderTodos();
      }
    }
  
    // Event listeners
    addBtn.addEventListener("click", addTodo);
    todoInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addTodo();
      }
    });
  
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderTodos();
      });
    });
  
    // Initial render
    renderTodos();
  });