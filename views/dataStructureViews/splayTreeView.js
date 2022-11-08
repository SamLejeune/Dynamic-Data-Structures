import TreeView from "./treeView.js";

export default class SplayTreeView extends TreeView {
  splayTreeEl;
  headValue;
  rotatorEl;
  rotatedEl;
  preservedChildEl;

  constructor(data) {
    super();
    // const value = data.insert.value;

    // this.setSplayTreeMarkup(value);
    // this.insertMarkup();
    // this.setSplayTreeEl();
    // this.setHeadValue(value);

    this.setContainerType("container-splay-tree");
    this.setContentType("content-splay-tree");
  }

  insert(data) {
    console.log(data);
    const { value } = data.insert;
    const { parentValue } = data.insert;

    if (!this.headValue) {
      this.setSplayTreeMarkup(value);
      this.insertMarkup();
      this.setSplayTreeEl();
      this.setHeadValue(value);
      return;
    }

    this.insertNode(value, parentValue);

    if (data.rotate.length > 0) this.rotate(data.rotate);

    this.reheadController(this.splayTreeEl);
    this.rescaleController();
    this.clearRotateFields();
  }

  remove(data) {
    // console.log(JSON.parse(JSON.stringify(data)));

    if (data === undefined) {
      this.resetCanvas();
      this.setHeadValue(undefined);
      return;
    }

    if (data.remove.value === this.headValue) return this.removeHead(data);

    this.replaceTree(data.replace);

    // Remove:
    const dir = data.remove.direction;
    const parValue = data.remove.parentValue;
    const parContent = this.getContentEl(undefined, parValue);
    const parContainer = this.getContainerEl(parContent);
    console.log(parContainer);

    // If remove node has child:
    const childVal = data.remove?.leftValue || data.remove?.rightValue;
    let childDir, childContent, childContain, childLineCont, childMarkup;
    if (childVal) {
      childDir = childVal < data.remove.value ? "left" : "right";
      childContent = this.getContentEl(undefined, childVal);
      childContain = this.getContainerEl(childContent);
      childLineCont = this.getLineContainerEl(childContain, childDir, childVal);

      this.setContainerDirection(childContain, dir);
      childMarkup = childContain.outerHTML;
    }

    this.emptyLineContainerEl(parContainer, dir, parValue);

    if (childMarkup) this.simulateInsertion(childMarkup, parValue, dir);

    // Rotate:
    if (data.rotate.length > 0) this.rotate(data.rotate);

    // Rescale tree
    this.reheadController(this.splayTreeEl);
    this.rescaleController();
  }

  replaceTree(replaceArr) {
    let container;

    replaceArr.forEach((el) => {
      const { replace, replaceWith } = el;

      if (replace === this.headValue) this.setHeadValue(replaceWith);

      const replaceContent = this.getContentEl(container, replace);
      container = this.getContainerEl(replaceContent);
      this.replaceContentHandler(replaceContent, replaceWith);
    });
  }

  insertNode(value, parentValue) {
    const direction = parentValue > value ? "left" : "right";
    const parentContent = this.getContentEl(undefined, parentValue);
    const parentContainer = this.getContainerEl(parentContent);
    const parentRow = this.getRow(parentContent);
    const parentLineContain = this.getLineContainerEl(
      parentContainer,
      direction,
      parentValue
    );

    this.toggleLine(parentLineContain, direction);
    parentLineContain.insertAdjacentHTML(
      "beforeend",
      this.getInsertMarkup(value, direction, parentRow + 1)
    );
  }

  removeHead(data) {
    const { value, leftValue, rightValue, parentValue, direction } =
      data.remove;

    const newHeadValue = leftValue || rightValue;
    const newHeadContent = this.getContentEl(undefined, newHeadValue);
    const newHeadContainer = this.getContainerEl(newHeadContent);
    const newHeadMarkup = newHeadContainer.outerHTML;

    this.splayTreeEl.innerHTML = newHeadMarkup;
    this.reheadController(this.splayTreeEl);
    this.rescaleController();
  }

  rotate(rotateArr) {
    rotateArr.forEach((el) => {
      const direction = el.direction;
      const oppDirection = direction === "left" ? "right" : "left";

      // Set target elements:
      this.setRotatorEl(el.value);
      this.setRotatedEl(el.rotateValue);
      this.setPreservedChildEl(el.value, direction); // optional data

      // Set parent element of rotated
      const rotatedParentEl =
        el.rotateValue === this.headValue
          ? this.splayTreeEl
          : this.getParentLineContainerEl(this.rotatedEl);

      // Remove rotatedEl from document flow
      this.rotatedEl.remove();

      // Reset container directions
      const parentDirection = this.getContainerDirection(this.rotatedEl);
      if (parentDirection === direction)
        this.setContainerDirection(this.rotatorEl, parentDirection);
      if (this.preservedChildEl)
        this.setContainerDirection(this.preservedChildEl, oppDirection);
      this.setContainerDirection(this.rotatedEl, direction);

      // Emptry line containers to execute rotation:
      this.emptyLineContainerEl(this.rotatedEl, oppDirection, el.rotateValue);
      if (this.preservedChildEl) {
        this.emptyLineContainerEl(this.rotatorEl, direction, el.value);
      }

      // If optional child, insert it into rotated markup
      if (this.preservedChildEl) {
        const preserveChildMarkup = this.preservedChildEl?.outerHTML;
        const rotatedLineCont = this.getLineContainerEl(
          this.rotatedEl,
          oppDirection,
          el.rotateValue
        );
        this.toggleLine(rotatedLineCont, oppDirection);
        rotatedLineCont.insertAdjacentHTML("beforeend", preserveChildMarkup);
      }

      // Get markup of target elements (this must come AFTER all of the manipulation above)
      const rotatorMarkup = this.rotatorEl.outerHTML;
      const rotatedMarkup = this.rotatedEl.outerHTML;

      if (el.rotateValue === this.headValue) this.setHeadValue(el.value);

      // Insert rotatedEl
      rotatedParentEl.insertAdjacentHTML("beforeend", rotatorMarkup);
      this.simulateInsertion(rotatedMarkup, el.value, direction);
    });

    // this.reheadController();
    // this.rescaleController();
  }

  simulateInsertion(markup, parentValue, direction) {
    let parentLineContainer = this.getLineContainerEl(
      this.splayTreeEl,
      direction,
      parentValue
    );

    this.toggleLine(parentLineContainer, direction);
    parentLineContainer.insertAdjacentHTML("beforeend", markup);
  }

  // reheadController() {
  //   const headContent = this.getContentEl(undefined, this.headValue);
  //   const headContainer = this.getContainerEl(headContent);

  //   this.removeContainerDirection(headContainer);
  // }

  // rescaleController() {
  //   const headContent = this.getContentEl(undefined, this.headValue);
  //   const headContainer = this.getContainerEl(headContent);

  //   this.resetScale(headContainer, undefined);
  //   this.setScale(headContainer, undefined, "expand");
  // }

  setRotatorEl(value) {
    const content = this.getContentEl(null, value);

    this.rotatorEl = this.getContainerEl(content);
  }

  setRotatedEl(value) {
    const content = this.getContentEl(null, value);

    this.rotatedEl = this.getContainerEl(content);
  }

  setPreservedChildEl(value, direction) {
    const preservedChildLineCont = this.getLineContainerEl(
      this.rotatorEl,
      direction,
      value
    );

    this.preservedChildEl = this.getChildContainerEl(preservedChildLineCont);
  }

  clearRotateFields() {
    this.rotatorEl = undefined;
    this.rotatedEl = undefined;
    this.preservedChildEl = undefined;
  }

  setHeadValue(value) {
    this.headValue = value;
  }

  setSplayTreeEl() {
    this.splayTreeEl = document.querySelector(".splay-tree");
  }

  setSplayTreeMarkup(value) {
    this.setMarkup(`
    <section class="visualization splay-tree">
      <div class="container-splay-tree">
        <div class="content-splay-tree" data-value="${value}" data-linerow="${1}">
          <span>${value}</span>
        </div>
        <div class="line-container line-container-left" data-value="${value}" data-linerow="${1}">
          <div class="line-left hidden" data-expanded="0"></div>
        </div>
        <div class="line-container line-container-right" data-value="${value}" data-linerow="${1}">
          <div class="line-right hidden" data-expanded="0"></div>
        </div>
      </div>
    </section>
    `);
  }

  getInsertMarkup(int, direction, lineRow) {
    return `
    <div class="container-splay-tree child-${direction}">
      <div class="content-splay-tree" data-value="${int}" data-linerow="${lineRow}">
        <span>${int}</span>
      </div>
      <div class="line-container line-container-left" data-value="${int}" data-linerow="${lineRow}" data-expanded="1">
        <div class="line-left hidden" data-expanded="0"></div>
      </div>
      <div class="line-container line-container-right" data-value="${int}" data-linerow="${lineRow}" data-expanded="1">
        <div class="line-right hidden" data-expanded="0"></div>
      </div>
    </div>
    `;
  }
}
