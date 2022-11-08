import Canvas from "./canvas.js";

export default class QueueLinkedListView extends Canvas {
  queueLinkedListEl;

  constructor(value) {
    super();
  }

  insert(data) {
    const { value } = data.insert;

    if (!this.queueLinkedListEl) {
      this.setQueueLinkedListMarkup(value);
      this.insertMarkup();
      this.setQueueLinkedListEl();
      return;
    }

    this.revealAllLines();
    this.removeTail();

    const markupEl = `
    <div class="data-container" data-value="${value}">
          <div class="content-linked-list tail">
            <span>${value}</span>
          </div>
          <hr class="line hidden-line">
          <div class="head-tail-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><line x1="128" y1="216" x2="128" y2="40" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><polyline points="56 112 128 40 200 112" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline></svg>
        <span class="type-span">Tail</span>
      </div>
        </div>`;

    this.queueLinkedListEl.insertAdjacentHTML("beforeend", markupEl);
  }

  remove(data) {
    const { value } = data.remove;

    const [...dataContainersArr] = document.querySelectorAll(".data-container");

    if (dataContainersArr.length === 1) {
      this.queueLinkedListEl.remove();
      this.queueLinkedListEl = undefined;
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

  removeTail() {
    const [...contentElArr] = document.querySelectorAll(".content-linked-list");
    contentElArr.forEach((contentEl) => contentEl.classList.remove("tail"));

    const [...labelElArr] = document.querySelectorAll(".head-tail-label");
    labelElArr.forEach((labelEl, i) => {
      if (i === 0) return;

      labelEl.classList.add("hidden");
    });
  }

  setHead(dataContainerEl) {
    const currConetntEl = dataContainerEl.querySelector(".content-linked-list");
    const headLabelEl = dataContainerEl.querySelector(".head-tail-label");
    const headSpanEl = headLabelEl.querySelector(".type-span");
    console.log(headSpanEl);
    currConetntEl.classList.add("head");
    currConetntEl.classList.remove("tail");
    headLabelEl.classList.remove("hidden");
    headSpanEl.textContent = "Head";
  }

  setQueueLinkedListEl() {
    this.queueLinkedListEl = document.querySelector(".queue-linked-list");
  }

  setQueueLinkedListMarkup(value) {
    this.setMarkup(`
    <section class="visualization queue-linked-list">
        <div class="data-container" data-value="${value}">
          <div class="content-linked-list head">
            <span>${value}</span>
          </div>
          <hr class="line hidden-line">
          <div class="head-tail-label">
            <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><line x1="128" y1="216" x2="128" y2="40" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><polyline points="56 112 128 40 200 112" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline></svg>
          <span class="type-span">Head</span>
          </div>
        </div>
      </section>
    `);
  }
}
