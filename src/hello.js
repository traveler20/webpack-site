export class Hello {
	name;

	constructor(name) {
		this.name = name;
	}

	greet() {
		console.log(`Hello, ${this.name}!`);
	}
}
