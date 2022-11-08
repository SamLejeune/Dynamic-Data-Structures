export default class Canvas {
  canvasEl = document.querySelector(".canvas");
  markup;

  insertMarkup() {
    this.canvasEl.innerHTML = this.markup;
  }

  setMarkup(markup) {
    this.markup = markup;
  }

  setScale(scaleType, currScale) {
    const canvasEl = document.querySelector(".canvas");

    if (scaleType === "minus" && currScale > 0.5)
      canvasEl.style.transform = `scale(${currScale - 0.05})`;

    if (scaleType === "plus" && currScale < 1)
      canvasEl.style.transform = `scale(${currScale + 0.05})`;
  }

  resetCanvas() {
    this.canvasEl.innerHTML = "";
  }
}
