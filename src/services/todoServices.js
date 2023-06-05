export class TodoService {
	static state = [];

	static initializeState() {
		this.state = this.getTodos();
		return this.state;
	}

	static deleteTodoFromStore(id) {
		const filteredTodos = this.state.filter(todo => todo.id !== id);

		this.state = filteredTodos;
		this.setTodos(filteredTodos);
	}

	static editTodoFromStore(id, newTitle) {
		const [...copyState] = this.state;
		const findedTodoIndex = this.state.findIndex(todo => todo.id === id);

		copyState[findedTodoIndex].title = newTitle;

		copyState.splice(findedTodoIndex, 1, copyState[findedTodoIndex]);

		this.state = copyState;
		this.setTodos(copyState);
	}

	static getTodo(id) {
		return this.state.find(todo => todo.id === id);
	}

	static handleTodoState(id, completed) {
		const [...copyState] = this.state;
		const findedTodoIndex = this.state.findIndex(todo => todo.id === id);

		copyState[findedTodoIndex].completed = completed;

		copyState.splice(findedTodoIndex, 1, copyState[findedTodoIndex]);

		this.state = copyState;
		this.setTodos(copyState);
	}

	static addTodoItem(todoTitle, id) {
		this.state.push({
			title: todoTitle,
			id,
			completed: false,
			createdAt: Date.now()
		});
		this.setTodos(this.state);
	}

	static getTodos() {
		return JSON.parse(localStorage.getItem("todos")) || [];
	}

	static setTodos(todos) {
		localStorage.setItem("todos", JSON.stringify(todos));
	}
}
