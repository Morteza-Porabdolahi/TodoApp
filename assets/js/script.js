const $ = document;

class Todo {
	constructor(todoTitle) {
		this.id = Math.floor(Math.random() * 10 ** 5);
		this.title = todoTitle;
		this.completed = false;
		this.createdAt = Date.now();
	}
}

class Todos {
	constructor(todosContainer) {
		this.todos = this.getAllTodos();
		this.todosContainer = todosContainer;
		this.todoTiteInputElem = $.querySelector(".add-todo-input");
		this.selectElement = $.querySelector(".filter-select");
		this.setEventsForElems();
		this.render(this.todos, "");
	}

	render(todos = [], filter) {
		let todoNode = null;
		const filteredTodos = this.filterTodos(todos, filter);
		const template = $.createElement("template");

		this.todosContainer.innerHTML = "";

		filteredTodos.forEach(todo => {
			todoNode = `
		  <div class="w-100 opacity-anim rounded shadow p-2 row bg-white align-items-center">
			  <div class="col-1">
				  <input type="checkbox" ${todo.completed
						? "checked"
						: ""} class="form-check-input check-done" data-id="${todo.id}"/>
			  </div>
			  <div class="col-7 mt-3">
				  <p class="fs-4" style="text-decoration:${todo.completed
						? "line-through"
						: "none"}">${todo.title}</p>
			  </div>
			  <div class="col-4 d-flex flex-column align-items-end">
				  <div class="d-flex gap-2 fs-5 align-items-center">
					<div class="align-items-center d-flex gap-2 text-primary" role="button">
				  <input placeholder='New Title...' type='text' class="opacity-anim form-control shadow-none d-none" data-id="${todo.id}" >
					 <label role='button' class='edit-btn' data-id="${todo.id}">
			  <i class="bi bi-pen edit-icon"></i>
			  </label>
			  </div>
					<div role="button" class="remove-btn" data-id="${todo.id}">
						 <i class="bi bi-trash text-danger remove-icon"></i>
					</div>
				  </div>
				  <div class='date mt-2'>
					 <i class="bi bi-info-circle"></i>
					 <span>created At : ${this.handleTodoCreatedDate(todo.createdAt)}</span>
				  </div> 
			  </div>
		  </div>	`;

			template.innerHTML += todoNode;
		});

		this.todosContainer.append(template.content);
	}

	getAllTodos() {
		return JSON.parse(localStorage.getItem("todos")) || [];
	}

	setEventsForElems() {
		let targetedElemClass;

		this.todoTiteInputElem.addEventListener("keypress", e => {
			if (e.key === "Enter") {
				this.createTodo();
			}
		});
		// Arrow functions auto bind this
		this.selectElement.addEventListener(
			"change",
			this.handleSelectValue.bind(this)
		);
		window.addEventListener("click", e => {
			targetedElemClass = e.target.className;

			if (targetedElemClass.includes("add-btn")) {
				this.createTodo();
			} else if (targetedElemClass.includes("remove-btn")) {
				this.deleteTodo(e);
			} else if (targetedElemClass.includes("edit-btn")) {
				this.openOrCloseEditInput(e);
			} else if (targetedElemClass.includes("delete-all")) {
				this.removeAllTodos();
			} else if (targetedElemClass.includes("check-done")) {
				this.markTodoAsDone(e);
			}
		});
	}

	handleSelectValue(e) {
		this.render(this.todos, e.target.value);
	}

	findSpecificTodo(id) {
		const todoIndex = this.todos.findIndex(todo => todo.id === id);

		return { findedTodo: { ...this.todos[todoIndex] }, todoIndex };
	}

	markTodoAsDone(e) {
		const { findedTodo, todoIndex } = this.findSpecificTodo(
			+e.target.dataset.id
		);
		const [...copyTodosArr] = this.todos;

		findedTodo.completed = !findedTodo.completed;

		copyTodosArr.splice(todoIndex, 1, findedTodo);

		this.todos = copyTodosArr;
		this.setNewTodos(copyTodosArr);
		this.render(this.todos, this.selectElement.value);
	}

	deleteTodo(e) {
		const filteredArray = this.todos.filter(
			todo => todo.id !== +e.target.dataset.id
		);

		this.todos = filteredArray;
		this.render(this.todos, this.selectElement.value);
		this.setNewTodos(filteredArray);
	}

	openOrCloseEditInput(e) {
		const inputTarget = e.target.closest("label").previousElementSibling;
		const classStatus = inputTarget.classList.toggle("d-none");

		if (!classStatus) {
			inputTarget.addEventListener("keypress", this.editTodo.bind(this));
		} else {
			inputTarget.removeEventListener("keypress", this.editTodo.bind(this));
		}
	}

	editTodo(e) {
		if (e.key === "Enter") {
			const inputValue = e.target.value;

			if (inputValue.trim()) {
				const { findedTodo, todoIndex } = this.findSpecificTodo(
					+e.target.dataset.id
				);
				const copyTodosArr = [...this.todos];

				findedTodo.title = inputValue;

				copyTodosArr.splice(todoIndex, 1, findedTodo);

				this.todos = copyTodosArr;
				this.setNewTodos(copyTodosArr);
				this.render(this.todos, this.selectElement.value);
			}
		}
	}

	removeAllTodos() {
		localStorage.removeItem("todos");

		this.todos = [];
		this.todosContainer.innerHTML = "";
	}

	createTodo() {
		const todoTitle = this.todoTiteInputElem.value;

		if (todoTitle.trim()) {
			const { ...newTodo } = new Todo(todoTitle);
			const newTodosArray = [...this.todos, newTodo];

			this.todos = newTodosArray;

			this.setNewTodos(newTodosArray);
			this.render(this.todos, this.selectElement.value);

			this.todoTiteInputElem.value = "";
		}
	}

	handleTodoCreatedDate(todoCreatedDate) {
		const todoDate = new Date(todoCreatedDate);
		const indexOfGmt = todoDate.toString().indexOf("GMT");

		return todoDate.toString().slice(0, indexOfGmt);
	}

	setNewTodos(todos = []) {
		localStorage.setItem("todos", JSON.stringify(todos));
	}

	filterTodos(todos = [], filter = "") {
		return todos.filter(
			todo =>
				filter === "completed"
					? todo.completed
					: filter === "active" ? !todo.completed : todo
		);
	}
}

new Todos($.querySelector(".todos"));
