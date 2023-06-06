import { TodoService } from "../../services/todoServices.js";
import { $, validateInputValue } from "../../utils/utils.js";

const todoTemplate = $.createElement("template");

todoTemplate.innerHTML = `
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
<link rel="stylesheet" href="/src/components/todoComponent/todoComponent.css"/>
<link rel="stylesheet" href="/css/bootstrap.min.css"/>


<div class="w-100 opacity-anim rounded shadow p-2 row bg-white align-items-center">
    <div class="col-1">
        <input type="checkbox" class="check-done" />
    </div>
    <div class="col-7 mt-3">
        <p class="fs-4">
            <slot name="title"></slot>
        </p>
    </div>
    <div class="col-4 d-flex flex-column align-items-end">
        <div class="d-flex gap-2 fs-5 align-items-center">
          <div class="align-items-center d-flex gap-2" role="button">
	      <input placeholder='New Title...' type='text' class="edit-todo-input opacity-anim form-control shadow-none d-none">
        	 <label for='edit-check' role='button' class='edit-btn'>
             <i class="fa-solid fa-pen-fancy edit-icon"></i>
		</label>
		</div>
          <div role="button" class="remove-btn">
            <i class="fa-solid fa-trash remove-icon"></i>
          </div>
        </div>
        <div class='date mt-2'>
           <i class="bi bi-info-circle"></i>
           <span>created At : <slot name="date"></slot></span>
        </div> 
    </div>
</div>


`;

export class TodoComponentElement extends HTMLElement {
	constructor() {
		super();

		this.attachShadow({ mode: "open" }).append(
			todoTemplate.content.cloneNode(true)
		);

		this.deleteTodoBtn = this.shadowRoot.querySelector(".remove-btn");
		this.editTodoBtn = this.shadowRoot.querySelector(".edit-btn");
		this.editTodoInput = this.shadowRoot.querySelector(".edit-todo-input");
		this.todoCheckboxInput = this.shadowRoot.querySelector(".check-done");
		this.todo = null;
	}

	connectedCallback() {
		const titleSpan = $.createElement("span");
		const dateSpan = $.createElement("span");

		this.setEventsForBtns();
		this.todo = TodoService.getTodo(this.id);

		titleSpan.slot = "title";
		dateSpan.slot = "date";

		titleSpan.textContent = this.todo.title;
		dateSpan.textContent = this.handleTodoCreatedDate(this.todo.createdAt);

		this.innerHTML = "";
		this.append(titleSpan, dateSpan);

		this.todoCheckboxInput.checked = this.todo.completed;
		this.changeStyleOfTitleElem(this.todo.completed);
	}

	setEventsForBtns() {
		this.deleteTodoBtn.addEventListener("click", () => this.deleteTodo());
		this.editTodoBtn.addEventListener("click", e =>
			this.toggleEditInputClass(e)
		);
		this.todoCheckboxInput.addEventListener("change", e =>
			this.toggleTodoState(e)
		);
	}

	changeStyleOfTitleElem(completed) {
		const titleElem = this.querySelector('span[slot="title"]');

		if (completed) {
			titleElem.style.textDecoration = "line-through";
		} else {
			titleElem.style.textDecoration = "none";
		}
	}

	toggleTodoState(e) {
		this.changeStyleOfTitleElem(e.target.checked);
		TodoService.handleTodoState(this.id, e.target.checked);
	}

	toggleEditInputClass(e) {
		const isHidden = e.target
			.closest("label")
			.previousElementSibling.classList.toggle("d-none");

		if (isHidden) {
			this.editTodoInput.removeEventListener("keypress", e => this.editTodo(e));
		} else {
			this.editTodoInput.addEventListener("keypress", e => this.editTodo(e));
		}
	}

	editTodo(e) {
		const inputValue = e.target.value;
		if (e.key === "Enter") {
			if (validateInputValue(inputValue)) {
				this.querySelector('span[slot="title"]').textContent = inputValue;

				TodoService.editTodoFromStore(this.id, inputValue);
				e.target.classList.add("d-none");
			}
		}
	}

	deleteTodo() {
		this.remove();
	}

	removeEvents() {
		this.deleteTodoBtn.removeEventListener("click", () => this.deleteTodo());
		this.editTodoBtn.removeEventListener("click", e =>
			this.toggleEditInputClass(e)
		);
		this.todoCheckboxInput.removeEventListener("change", e =>
			this.toggleTodoState(e)
		);
	}

	disconnectedCallback() {
		TodoService.deleteTodoFromStore(this.id);
		this.removeEvents();
	}

	handleTodoCreatedDate(todoCreatedDate) {
		let todoDate = new Date(todoCreatedDate);
		let indexOfGmt = todoDate.toString().indexOf("GMT");

		return todoDate.toString().slice(0, indexOfGmt);
	}
}
