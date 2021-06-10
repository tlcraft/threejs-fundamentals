const container: HTMLElement | any = document.getElementById("app");

const world = 'world';

function hello(str: string = world): string {
  return `Hello ${str}! `;
}

function printHello(): void {
  container.innerHTML += hello();
}

printHello();