import Canvas from "./canvas.js";

export default class StackView extends Canvas {
  stackEl;

  constructor(value) {
    super();
  }

  insert(data) {
    console.log(data);
    const { value } = data.insert;

    if (!this.stackEl) {
      this.setStackMarkup(value);
      this.insertMarkup();
      this.setStackEl();
      return;
    }

    const markupEl = `
        <div class="content-stack" data-value="${value}">
          <span>${value}</span>
        </div>
    `;

    const stackContainer = this.stackEl.querySelector(".data-container-stack");
    stackContainer.insertAdjacentHTML("afterbegin", markupEl);
  }

  remove(data) {
    const { value } = data.remove;

    const currHead = document.querySelector(`[data-value="${value}"]`);

    if (!currHead) return;

    if (this.checkStackLength() === 1) {
      this.stackEl.remove();
      this.stackEl = undefined;
      return;
    }

    currHead.remove();
  }

  setStackEl() {
    this.stackEl = document.querySelector(".stack");
  }

  checkStackLength() {
    const stackContentArr = document.querySelectorAll(".content-stack");

    return stackContentArr.length;
  }

  setStackMarkup(value) {
    this.setMarkup(
      `
        <section class="visualization stack">
          <svg class="open-bracket" xmlns="http://www.w3.org/2000/svg"  fill="#000000"
            viewBox="0 0 180 256">
            <polyline points="80 40 40 40 40 216 80 216" fill="none" stroke="#000000" stroke-linecap="round"
              stroke-linejoin="round" stroke-width="16"></polyline>
          </svg>
          <div class="data-container-stack" >
            <div class="content-stack" data-value="${value}">
              <span>${value}</span>
              <span class="hidden">,</span>
            </div>
          </div>
          <svg class="close-bracket" xmlns="http://www.w3.org/2000/svg"  fill="#000000"
            viewBox="160 0 256 256">
            <polyline points="176 40 216 40 216 216 176 216" fill="none" stroke="#000000" stroke-linecap="round"
              stroke-linejoin="round" stroke-width="16"></polyline>
          </svg>
          <div class="head-stack-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><line x1="128" y1="216" x2="128" y2="40" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><polyline points="56 112 128 40 200 112" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline></svg>
            <span class="head-span-bracket">Head</span>
          </div>
        </div>
      </section>
      `
    );
  }
}
