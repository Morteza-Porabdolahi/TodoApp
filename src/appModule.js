import { TodoComponentElement } from "./components/todoComponent/todoComponent.js";
import { AppComponent } from "./components/AppComponent/appComponent.js";

export class AppModule {
	static defineElements() {
		window.customElements.define("todo-element", TodoComponentElement);
		window.customElements.define("app-container", AppComponent);
	}
}
