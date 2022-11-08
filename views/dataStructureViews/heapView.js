import TreeView from "./treeView.js";

export default class HeapView extends TreeView {
  heapArrEl;
  // currValue;
  headValue;

  constructor(data) {
    super();

    this.setContainerType("container-heap-tree");
    this.setContentType("content-heap-tree");
  }

  insert(data) {
    console.log(this.headValue);
    const { value, parentValue, direction, treeSide } = data.insert;

    if (!this.headValue) {
      this.setHeapMarkup(value);
      this.insertMarkup();
      this.setHeapEl();
      this.setHeadValue(value);
      return;
    }

    this.insertArray(value);
    this.insertTree(value, parentValue, direction, treeSide);

    if (value < this.headValue) this.setHeadValue(value);

    if (data.replace.length > 0) {
      this.replaceArray(data.replace);
      this.replaceTree(data.replace);
    }
  }

  remove(data) {
    console.log(data);

    if (data === undefined) {
      this.resetCanvas();
      this.setHeadValue(undefined);
      return;
    }

    const { value, replaceWith, treeSide } = data.remove;

    this.removeArray(value, replaceWith);
    this.replaceArray(data.replace);

    this.removeTree(value, replaceWith, treeSide);
    this.replaceTree(data.replace);
  }

  insertArray(value) {
    const heapContainer = this.heapArrEl.querySelector(".data-container-heap");
    const heapArrayMarkup = this.insertArrayMarkup(value);

    heapContainer.insertAdjacentHTML("beforeend", heapArrayMarkup);
  }

  insertTree(value, parentValue, direction, treeSide) {
    const parentContent = this.getContentEl(undefined, parentValue);
    const parentContainer = this.getContainerEl(parentContent);
    const parentLineContain = this.getLineContainerEl(
      parentContainer,
      direction,
      parentValue
    );

    this.toggleLine(parentLineContain, direction);
    parentLineContain.insertAdjacentHTML(
      "beforeend",
      this.insertTreeMarkup(value, direction)
    );

    this.scaleHandler(parentLineContain, direction, value, "expand", treeSide);
  }

  removeArray(min, replaceWith, remove) {
    // Remove last
    const removeEl = this.heapArrEl.querySelector(
      `[data-value="${replaceWith}"]`
    );
    removeEl.remove();

    // Replace first
    const minEl = this.heapArrEl.querySelector(`[data-value="${min}"]`);
    minEl.querySelector("span").innerHTML = replaceWith;
    minEl.dataset.value = replaceWith;
  }

  removeTree(min, remove, treeSide) {
    // Remove last
    const removeContent = this.getContentEl(undefined, remove);
    const removeContainer = this.getContainerEl(removeContent);
    const direction = this.getContainerDirection(removeContainer);

    const parLineContain = this.getParentLineContainerEl(removeContainer);

    this.scaleHandler(parLineContain, direction, remove, "contract", treeSide);
    this.toggleLine(parLineContain, direction);

    const lineEl = this.getLineEl(parLineContain, direction);
    const markup = lineEl.outerHTML;
    parLineContain.innerHTML = markup;

    // Replace first
    const minContent = this.getContentEl(undefined, min);
    this.replaceContentHandler(minContent, remove);
  }

  replaceArray(replaceArr) {
    replaceArr.forEach((el) => {
      const { replace, replaceWith } = el;

      const replaceEl = this.heapArrEl.querySelector(
        `[data-value="${replace}"]`
      );
      const replaceWithEl = this.heapArrEl.querySelector(
        `[data-value="${replaceWith}"]`
      );

      replaceEl.querySelector("span").innerHTML = replaceWith;
      replaceWithEl.querySelector("span").innerHTML = replace;

      replaceEl.dataset.value = replaceWith;
      replaceWithEl.dataset.value = replace;
    });
  }

  replaceTree(replaceArr) {
    replaceArr.forEach((el) => {
      const { replace, replaceWith } = el;
      const replaceContent = this.getContentEl(undefined, replace);
      const replaceWithContent = this.getContentEl(undefined, replaceWith);

      this.replaceContentHandler(replaceContent, replaceWith);
      this.replaceContentHandler(replaceWithContent, replace);
    });
  }

  setHeapEl() {
    this.heapArrEl = document.querySelector(".heap-array");
  }

  setHeadValue(value) {
    this.headValue = value;
  }

  insertArrayMarkup(value) {
    return `
    <div class="content-stack" data-value="${value}">
          <span>${value}</span>
        </div>
    `;
  }

  insertTreeMarkup(value, direction) {
    return `
    <div class="container-heap-tree child-${direction}">
      <div class="content-heap-tree" data-value="${value}">
        <span>${value}</span>
      </div>
      <div class="line-container line-container-left" data-value="${value}" data-expanded="0">
        <div class="line-left hidden" data-expanded="0"></div>
      </div>
      <div class="line-container line-container-right" data-value="${value}" data-expanded="0">
        <div class="line-right hidden" data-expanded="0"></div>
      </div>
    </div>
    `;
  }

  setHeapMarkup(value) {
    this.setMarkup(
      `
      <section class="visualization-heap array-tree-visualization">
        <section class="heap-array">
          <svg class="open-bracket" xmlns="http://www.w3.org/2000/svg"  fill="#000000"
            viewBox="0 0 180 256">
            <polyline points="80 40 40 40 40 216 80 216" fill="none" stroke="#000000" stroke-linecap="round"
              stroke-linejoin="round" stroke-width="16"></polyline>
          </svg>
          <div class="data-container-heap" >
            <div class="content-heap" data-value="${value}">
              <span>${value}</span>
              <span class="hidden">,</span>
            </div>
          </div>
          <svg class="close-bracket" xmlns="http://www.w3.org/2000/svg"  fill="#000000"
            viewBox="160 0 256 256">
            <polyline points="176 40 216 40 216 216 176 216" fill="none" stroke="#000000" stroke-linecap="round"
              stroke-linejoin="round" stroke-width="16"></polyline>
          </svg>
        </div>
      </section> 
      <section class="heap-tree">
        <div class="container-heap-tree">
          <div class="content-heap-tree" data-value="${value}">
            <span>${value}</span>
          </div>
          <div class="line-container line-container-left" data-value="${value}" data-expanded="0">
            <div class="line-left hidden" data-expanded="0"></div>
          </div>
          <div class="line-container line-container-right" data-value="${value}" data-expanded="0">
            <div class="line-right hidden" data-expanded="0"></div>
          </div>
        </div>
      </section>
    </section>
      `
    );
  }
}
