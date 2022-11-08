import Canvas from "./canvas.js";

export default class QueueView extends Canvas {
  queueEl;
  queueLength = 0;

  constructor(value) {
    super();
  }

  insert(data) {
    const { value } = data.insert;

    if (!this.queueEl) {
      this.setQueueMarkup(value);
      this.insertMarkup();
      this.setQueueEl();
      this.incrementQueueLength();
      return;
    }

    this.revealTail();

    const markupEl = `
        <div class="content-queue" data-value="${value}">
        <span>${value}</span>
        </div>  
    `;

    const queueContainer = this.queueEl.querySelector(".data-container-queue");
    queueContainer.insertAdjacentHTML("beforeend", markupEl);
    this.incrementQueueLength();
  }

  remove(data) {
    const { value } = data.remove;

    const currHead = document.querySelector(`[data-value="${value}"]`);

    if (this.queueLength === 2) this.hideTail();

    if (this.queueLength === 1) {
      this.queueEl.remove();
      this.queueEl = undefined;
      this.decrementQueueLength();
      return;
    }

    currHead.remove();

    this.decrementQueueLength();
  }

  incrementQueueLength() {
    this.queueLength += 1;
  }

  decrementQueueLength() {
    this.queueLength -= 1;
  }

  revealTail() {
    const tailEl = document.querySelector(".tail-queue");

    tailEl.classList.remove("hidden");
  }

  hideTail() {
    const tailEl = document.querySelector(".tail-queue");

    tailEl.classList.add("hidden");
  }

  setQueueEl() {
    this.queueEl = document.querySelector(".queue");
  }

  setQueueMarkup(value) {
    this.setMarkup(
      `<section class="visualization queue">
      <svg class="open-bracket" xmlns="http://www.w3.org/2000/svg" fill="#000000"
        viewBox="0 0 180 256">
        <polyline points="80 40 40 40 40 216 80 216" fill="none" stroke="#000000" stroke-linecap="round"
          stroke-linejoin="round" stroke-width="16"></polyline>
      </svg>
      <div class="data-container-queue" >
        <div class="content-queue" data-value="${value}">
          <span>${value}</span>
        </div>
      </div>
      <svg class="close-bracket" xmlns="http://www.w3.org/2000/svg" fill="#000000"
        viewBox="160 0 256 256">
        <polyline points="176 40 216 40 216 216 176 216" fill="none" stroke="#000000" stroke-linecap="round"
          stroke-linejoin="round" stroke-width="16"></polyline>
      </svg>
      <div class="head-queue-label">
        <div class="head-queue">
          <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><line x1="128" y1="216" x2="128" y2="40" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><polyline points="56 112 128 40 200 112" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline></svg>
          <span class="head-span-bracket">Head</span>
        </div>
        <div class="tail-queue hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="#000000" viewBox="0 0 256 256"><line x1="128" y1="216" x2="128" y2="40" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><polyline points="56 112 128 40 200 112" fill="none" stroke="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></polyline></svg>
        <span class="tail-span">Tail</span>
      </div>
      </div>
    </div>
  </section>`
    );
  }
}
