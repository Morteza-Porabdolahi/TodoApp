const $ = document;

function validateInputValue(value = "") {
	return value.trim();
}

function generateRandomId() {
	return Math.random().toString(32);
}

export { $, validateInputValue, generateRandomId };
