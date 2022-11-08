import Canvas from "./canvas.js";
import TreeView from "./treeView.js";

export default class BinarySearchTreeView extends TreeView {
  binarySearchTreeEl;
  headValue;

  constructor(int) {
    super();

    // this.setBinarySearchTreeMarkup(int);
    // this.insertMarkup();
    // this.setBinarySearchTreeEl();
    // this.setHeadValue(int);

    this.setContainerType("container-binary-search-tree");
    this.setContentType("content-binary-search-tree");
  }

  insert(data) {
    const { value, parentValue, direction } = data.insert;

    if (!this.headValue) {
      this.setBinarySearchTreeMarkup(value);
      this.insertMarkup();
      this.setBinarySearchTreeEl();
      this.setHeadValue(value);
      return;
    }

    const parentContent = this.getContentEl(undefined, parentValue);
    const parContain = this.getContainerEl(parentContent);
    const parLineContain = this.getLineContainerEl(
      parContain,
      direction,
      parentValue
    );

    this.toggleLine(parLineContain, direction);
    parLineContain.insertAdjacentHTML(
      "beforeend",
      this.getInsertMarkup(value, direction)
    );

    this.reheadController();
    this.rescaleController();
  }

  remove(data) {
    console.log(data);
    let container;
    let parentLineContainer;
    let childMarkup;

    if (data === undefined) {
      this.resetCanvas();
      this.setHeadValue(undefined);
      return;
    }

    if (data.remove.remove === this.headValue) return this.removeHead(data);

    if (data.replace.length > 0) container = this.replaceHandler(data.replace);

    if (data.remove.child)
      childMarkup = this.childMarkupHandler(
        data.remove.child,
        data.remove.direction
      );

    if (data.remove)
      parentLineContainer = this.removeHandler(container, data.remove.remove);

    if (childMarkup) {
      parentLineContainer.insertAdjacentHTML("beforeend", childMarkup);
      this.toggleLine(parentLineContainer, data.remove.direction);
    }

    this.reheadController();
    this.rescaleController();
  }

  replaceHandler(replaceArr) {
    let container;
    replaceArr.forEach((el) => {
      const { replace, replaceWith } = el;
      const replaceContent = this.getContentEl(container, replace);
      this.replaceContentHandler(replaceContent, replaceWith);

      if (replace === this.headValue) this.setHeadValue(replaceWith);

      container = this.getContainerEl(replaceContent);
    });

    return container;
  }

  removeHandler(container, removeValue) {
    const removeContent = this.getContentEl(container, removeValue);
    const removeContainer = this.getContainerEl(removeContent);
    const direction = this.getContainerDirection(removeContainer);

    const parLineContain = this.getParentLineContainerEl(removeContainer);

    this.scaleHandler(parLineContain, direction, removeValue, "contract");
    this.toggleLine(parLineContain, direction);

    const lineEl = this.getLineEl(parLineContain, direction);
    const markup = lineEl.outerHTML;
    parLineContain.innerHTML = markup;

    return parLineContain;
  }

  removeHead(data) {
    const { remove, child, direction } = data.remove;

    const newHeadContent = this.getContentEl(undefined, child);
    const newHeadContainer = this.getContainerEl(newHeadContent);
    const newHeadMarkup = newHeadContainer.outerHTML;

    this.binarySearchTreeEl.innerHTML = newHeadMarkup;
    this.reheadController();
    this.rescaleController();
  }

  childMarkupHandler(childValue, direction) {
    const childContent = this.getContentEl(undefined, childValue);
    const childContainer = this.getContainerEl(childContent);

    this.setContainerDirection(childContainer, direction);

    return childContainer.outerHTML;
  }

  reheadController() {
    const headContent = this.getChildContentEl(this.binarySearchTreeEl);
    const headContainer = this.getContainerEl(headContent);
    const newHeadValue = this.getContentValue(headContent);

    this.setHeadValue(newHeadValue);
    this.removeContainerDirection(headContainer);
  }

  rescaleController() {
    const headContent = this.getContentEl(undefined, this.headValue);
    const headContainer = this.getContainerEl(headContent);

    this.resetScale(headContainer, undefined);
    this.setScale(headContainer, undefined, "expand");
  }

  setScale(container, direction, scale) {
    let content = this.getChildContentEl(container);
    let value = this.getContentValue(content);
    let parentLineContainer;

    if (direction) {
      parentLineContainer = this.getParentLineContainerEl(container);
      this.scaleHandler(parentLineContainer, direction, value, scale);
    }

    const lineContainLeft = this.getLineContainerEl(container, "left", value);
    const lineContainRight = this.getLineContainerEl(container, "right", value);
    const containerLeft = this.getChildContainerEl(lineContainLeft);
    const containerRight = this.getChildContainerEl(lineContainRight);

    if (containerLeft) this.setScale(containerLeft, "left", scale);

    if (containerRight) this.setScale(containerRight, "right", scale);
  }

  resetScale(container, direction) {
    let content = this.getChildContentEl(container);
    let value = this.getContentValue(content);

    if (direction) {
      let parentLineContainer = this.getParentLineContainerEl(container);

      this.setLineToBaseScale(parentLineContainer, direction);
    }

    const lineContainLeft = this.getLineContainerEl(container, "left", value);
    const lineContainRight = this.getLineContainerEl(container, "right", value);
    const containerLeft = this.getChildContainerEl(lineContainLeft);
    const containerRight = this.getChildContainerEl(lineContainRight);

    if (containerLeft) this.resetScale(containerLeft, "left");

    if (containerRight) this.resetScale(containerRight, "right");
  }

  setHeadValue(value) {
    this.headValue = value;
  }

  setBinarySearchTreeEl() {
    this.binarySearchTreeEl = document.querySelector(".binary-search-tree");
  }

  setBinarySearchTreeMarkup(value) {
    this.setMarkup(`
    <section class="visualization binary-search-tree">
      <div class="container-binary-search-tree">
        <div class="content-binary-search-tree" data-value="${value}">
          <span>${value}</span>
        </div>
        <div class="line-container line-container-left" data-value="${value}">
          <div class="line-left hidden" data-expanded="0"></div>
        </div>
        <div class="line-container line-container-right" data-value="${value}">
          <div class="line-right hidden" data-expanded="0"></div>
        </div>
      </div>
    </section>
    `);
  }

  getInsertMarkup(value, direction) {
    return `
    <div class="container-binary-search-tree child-${direction}">
      <div class="content-binary-search-tree" data-value="${value}">
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
}
