import Canvas from "./canvas.js";

export default class StackLinkedListView extends Canvas {
  stackLinkedListEl;

  constructor(value) {
    super();
    // this.setStackLinkedListMarkup(value);
    // this.insertMarkup();
    // this.setStackLinkedListEl();
  }

  insert(data) {
    const { value } = data.insert;

    if (!this.stackLinkedListEl) {
      this.setStackLinkedListMarkup(value);
      this.insertMarkup();
      this.setStackLinkedListEl();
      return;
    }

    this.removeHead();

    const markupEl = `
    <div class="data-container" data-value="${value}">
          <div class="content-linked-list head">
            <span>${value}</span>
          </div>
          <hr class="line">
          <div class="head-tail-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><line x1="128" y1="216" x2="128" y2="40" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><polyline points="56 112 128 40 200 112" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline></svg>
            <span class="head-span">Head</span>
          </div>
    `;

    this.stackLinkedListEl.insertAdjacentHTML("afterbegin", markupEl);
  }

  remove(data) {
    console.log(data);
    const { value } = data.remove;

    const [...dataContainersArr] = document.querySelectorAll(".data-container");

    if (dataContainersArr.length === 1) {
      this.stackLinkedListEl.remove();
      this.stackLinkedListEl = undefined;
      return;
    }

    const currHead = document.querySelector(`[data-value="${value}"]`);
    const newHead = dataContainersArr[1];

    currHead.remove();
    this.setHead(newHead);
  }

  revealAllLines() {
    const [...lineElArr] = document.querySelectorAll(".line");

    lineElArr.forEach((lineEl) => lineEl.classList.remove("hidden-line"));
  }

  setHead(dataContainerEl) {
    const currConetntEl = dataContainerEl.querySelector(".content-linked-list");
    const headLabelEl = dataContainerEl.querySelector(".head-tail-label");

    currConetntEl.classList.add("head");
    headLabelEl.classList.remove("hidden");
  }

  removeHead() {
    const [...contentElArr] = document.querySelectorAll(".content-linked-list");
    contentElArr.forEach((contentEl) => contentEl.classList.remove("head"));

    const [...labelElArr] = document.querySelectorAll(".head-tail-label");
    labelElArr.forEach((labelEl) => labelEl.classList.add("hidden"));
  }

  setStackLinkedListEl() {
    this.stackLinkedListEl = document.querySelector(".stacked-linked-list");
  }

  setStackLinkedListMarkup(value) {
    this.setMarkup(`
    <section class="visualization stacked-linked-list">
        <div class="data-container" data-value="${value}">
          <div class="content-linked-list head">
            <span>${value}</span>
          </div>
          <hr class="line hidden-line">
          <div class="head-tail-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><line x1="128" y1="216" x2="128" y2="40" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><polyline points="56 112 128 40 200 112" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline></svg>
            <span class="head-span">Head</span>
          </div>
        </div>
        </section>
    `);
  }
}
