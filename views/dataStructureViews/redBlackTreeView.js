import TreeView from "./treeView.js";

export default class RedBlackTreeView extends TreeView {
  redBlackTreeEl;
  headValue;
  rotatorEl;
  rotatedEl;
  preservedChildEl;

  constructor(data) {
    super();

    this.setContainerType("container-red-black-tree");
    this.setContentType("content-red-black-tree");
  }

  insert(data) {
    console.log(this.headValue);

    const { value } = data.insert;
    const { parentValue } = data.insert;

    if (!this.headValue) {
      this.setRedBlackTreeMarkup(value);
      this.insertMarkup();
      this.setRedBlackTreeEl();
      this.setHeadValue(value);
      return;
    }

    this.insertNode(value, parentValue);

    if (data.rotate.length > 0) this.rotate(data.rotate);

    if (data.correctColor.length > 0) this.correctColor(data.correctColor);

    this.reheadController(this.redBlackTreeEl);
    this.rescaleController();
    this.clearRotateFields();
  }

  remove(data) {
    console.log(data);
    if (data === undefined) {
      this.resetCanvas();
      this.setHeadValue(undefined);
      return;
    }

    this.replaceTree(data.replace);

    // Remove:
    const dir = data.remove.direction;
    const parValue = data.remove.parentValue;
    const parContent = this.getContentEl(undefined, parValue);
    const parContainer = this.getContainerEl(parContent);

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

    this.rescaleController();

    if (childMarkup) this.simulateInsertion(childMarkup, parValue, dir);

    //   // Correct color:
    if (data.correctColor.length > 0) this.correctColor(data.correctColor);

    // Rotate:
    if (data.rotate.length > 0) this.rotate(data.rotate);

    this.reheadController(this.redBlackTreeEl);
    this.rescaleController();
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

  correctColor(correctColorArr) {
    correctColorArr.forEach((el) => {
      if (el.value === null) return;

      const nodeContent = this.getContentEl(null, el.value);

      nodeContent.className = `content-red-black-tree node-${el.color}`;
    });
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
          ? this.redBlackTreeEl
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
  }

  simulateInsertion(markup, parentValue, direction) {
    let parentLineContainer = this.getLineContainerEl(
      this.redBlackTreeEl,
      direction,
      parentValue
    );

    this.toggleLine(parentLineContainer, direction);
    parentLineContainer.insertAdjacentHTML("beforeend", markup);
  }

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

  setRedBlackTreeEl() {
    this.redBlackTreeEl = document.querySelector(".red-black-tree");
  }

  setHeadValue(value) {
    this.headValue = value;
  }

  setRedBlackTreeMarkup(value) {
    this.setMarkup(`
    <section class="visualization red-black-tree">
      <div class="container-red-black-tree">
        <div class="content-red-black-tree node-black" data-value="${value}" data-linerow="${1}">
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

  getInsertMarkup(value, direction, lineRow) {
    return `
    <div class="container-red-black-tree child-${direction}">
      <div class="content-red-black-tree node-red " data-value="${value}" data-linerow="${lineRow}">
        <span>${value}</span>
      </div>
      <div class="line-container line-container-left" data-value="${value}" data-linerow="${lineRow}" data-expanded="1">
        <div class="line-left hidden" data-expanded="0"></div>
      </div>
      <div class="line-container line-container-right" data-value="${value}" data-linerow="${lineRow}" data-expanded="1">
        <div class="line-right hidden" data-expanded="0"></div>
      </div>
    </div>
    `;
  }
}
