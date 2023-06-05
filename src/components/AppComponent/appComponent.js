import { $, generateRandomId, validateInputValue } from "../../utils/utils.js";
import { TodoService } from "../../services/todoServices.js";

const appTemplate = $.createElement("template");

appTemplate.innerHTML = `
<style>
	@import url('/src/components/AppComponent/appComponent.css');
	@import url('/css/bootstrap.min.css');
</style>
<div class="container py-5">
<div class="d-flex gap-3 display-4 justify-content-center align-items-center">
  <div class="text-white rounded bg-primary">
	<i class="bi bi-check"></i>
  </div>
  <h2 class="text-primary display-4">My-Todos</h2>
</div>
<div class="mt-4 d-flex gap-4 flex-column">
  <div class="d-flex gap-3 rounded shadow p-4 bg-white">
	<div class="row w-100">
	  <div class="col-9">
		<input type="text" placeholder="Title..." class="fs-5 shadow-none add-todo-input border-0 form-control" />
	  </div>
	  <div class="col-1">
		<button class="add-btn shadow w-100 btn btn-primary">Add</button>
	  </div>
	  <div class="col-2">
		<button class="delete-all shadow w-100 btn btn-danger">
		  Delete Todos
		</button>
	  </div>
	</div>
  </div>
  <div class="rounded w-100 bg-white" style="height: 2px"></div>
  <div>
	<div class="px-5 d-flex flex-column gap-3 todos mt-5"></div>
  </div>
</div>
</div>
`;

export class AppComponent extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({ mode: "open" }).append(
			appTemplate.content.cloneNode(true)
		);

		this.todos = TodoService.initializeState();
		this.todoTitleInput = this.shadowRoot.querySelector(".add-todo-input");
		this.todosContainer = this.shadowRoot.querySelector(".todos");
		this.addTodoBtn = this.shadowRoot.querySelector(".add-btn");
	}

	connectedCallback() {
		this.addTodoBtn.addEventListener("click", e => this.addTodoItem(e));
		this.todoTitleInput.addEventListener("keypress", e => this.addTodoItem(e));

		this.render();
	}

	render() {
		let newTodoElement = $.createElement("todo-element");

		this.todos.forEach(todo => {
			newTodoElement = newTodoElement.cloneNode(true);

			newTodoElement.id = todo.id;
			this.todosContainer.append(newTodoElement);
		});
	}

	addTodoItem(e) {
		if ((e.type === "keypress" && e.key === "Enter") || e.type === "click") {
			const todoTitle = this.todoTitleInput.value;

			if (validateInputValue(todoTitle)) {
				const newTodoElement = $.createElement("todo-element");
				let newId = generateRandomId();

				newTodoElement.id = newId;
				TodoService.addTodoItem(todoTitle, newId);

				this.todosContainer.append(newTodoElement);
			}

			this.todoTitleInput.value = "";
		}
	}
}
