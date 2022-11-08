import Canvas from "./canvas.js";

export default class TreeView extends Canvas {
  containerType;
  contentType;

  scaleHandler(lineContainer, direction, currValue, scale, side) {
    const isEdgeNode = this.isEdgeNode(lineContainer, direction);

    if (isEdgeNode === false) {
      const treeSide = !side ? this.calcTreeSide(currValue) : side;

      if (direction === treeSide)
        this.adjustMatch(lineContainer, direction, scale);

      if (direction !== treeSide)
        this.adjustOpposite(lineContainer, direction, scale);
    } else return;
  }

  reheadController(parentEl) {
    const headContent = this.getChildContentEl(parentEl);
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

  emptyLineContainerEl(container, direction, value) {
    const lineContainer = this.getLineContainerEl(container, direction, value);

    this.toggleLine(lineContainer, direction);

    const lineEl = this.getLineEl(lineContainer, direction);
    const markup = lineEl.outerHTML;

    lineContainer.innerHTML = markup;
  }

  adjustOpposite(lineContEl, currDirection, scale) {
    const oppDirection = currDirection === "left" ? "right" : "left";
    let currLineContEl = lineContEl;
    let oppLineContEl = this.getOppLineCont(currLineContEl, currDirection);

    while (oppLineContEl) {
      this.adjustParentLineContainer(oppLineContEl, scale);
      this.adjustParentLine(oppLineContEl, scale);
      this.adjustParentLineRotation(oppLineContEl, oppDirection);

      currLineContEl = this.getOppLineCont(oppLineContEl, oppDirection);

      if (!currLineContEl) break;

      oppLineContEl = this.getOppLineCont(currLineContEl, currDirection);
    }
  }

  adjustMatch(lineContEl, currDirection, scale) {
    let oppLineContEl = this.getOppLineCont(lineContEl, currDirection);
    let i = 0;
    while (oppLineContEl && i <= 2) {
      const matchLineContEl = this.getSibLineContainer(
        oppLineContEl,
        currDirection
      );

      this.adjustParentLineContainer(matchLineContEl, scale);
      this.adjustParentLine(matchLineContEl, scale);
      this.adjustParentLineRotation(matchLineContEl, currDirection);

      oppLineContEl = this.getOppLineCont(matchLineContEl, currDirection);
      i += 1;
      if (!oppLineContEl) break;
    }
  }

  adjustParentLineContainer(lineContEl, scale) {
    let widthMultiplier;
    let widthDivisor;

    const width = lineContEl.clientWidth;
    const direction = this.getContainerDirection(lineContEl);
    const lineEl = this.getLineEl(lineContEl, direction);
    const expanded = lineEl.dataset.expanded;

    if (expanded < 3) {
      widthMultiplier = 2.5;
      widthDivisor = 2.5;
    } else if (expanded < 5) {
      widthMultiplier = 1.5;
      widthDivisor = 1.5;
    } else {
      widthMultiplier = 1.15;
      widthDivisor = 1.15;
    }

    // widthMultiplier = expanded < 3 ? 2.5 : 1.5;
    // widthDivisor = expanded <= 3 ? 2.5 : 1.5;

    if (scale === "expand")
      lineContEl.style.width = `${Math.floor(width * widthMultiplier)}px`;

    if (scale === "contract")
      lineContEl.style.width = `${Math.ceil(width / widthDivisor)}px`;
  }

  adjustParentLine(lineContEl, scale) {
    const arbitraryAddWidth = 30;
    const direction = this.getContainerDirection(lineContEl);
    const lineEl = this.getLineEl(lineContEl, direction);
    const lineContWidth = lineContEl.clientWidth;
    const lineContHeight = lineContEl.clientHeight;

    const newLineWidth = this.calcLineWidth(lineContWidth, lineContHeight);
    lineEl.style.width = `${newLineWidth + arbitraryAddWidth}px`;

    if (scale === "expand") this.incrementExpanded(lineEl);

    if (scale === "contract") this.decrementExpanded(lineEl);
  }

  adjustParentLineRotation(lineContEl, direction) {
    const lineEl = this.getLineEl(lineContEl, direction);
    const width = lineContEl.clientWidth;
    const height = lineContEl.clientHeight;
    // const adjust = lineEl.dataset.expanded === "0" ? 0 : 6;
    const adjust = lineEl.dataset.expanded < 6 ? 6 : 2;

    const newRotation =
      direction === "left"
        ? -this.calcLineRotation(height, width, direction) - adjust // go down to 2 after a certain point
        : this.calcLineRotation(height, width, direction) + adjust;

    lineEl.style.transform = `rotate(${newRotation}deg)`;
  }

  calcLineRotation(height, width, direction) {
    const degreesActual = Math.atan(height / width) * (180 / Math.PI);

    return direction === "left"
      ? Math.floor(degreesActual)
      : Math.floor(degreesActual);
  }

  getOppLineCont(lineContEl, currDirection) {
    let currLineContainerEl = lineContEl;

    while (currLineContainerEl) {
      const parentLineContainer =
        this.getParentLineContainerEl(currLineContainerEl);

      if (!parentLineContainer) return;

      const parentDirection = this.getContainerDirection(parentLineContainer);

      if (currDirection !== parentDirection) return parentLineContainer;

      currLineContainerEl = parentLineContainer;
    }

    return undefined;
  }

  getSibLineContainer(lineContEl, currDirection) {
    const parentContainer = this.getContainerEl(lineContEl);
    const lineContElValue = +lineContEl.dataset.value;

    return parentContainer.querySelector(
      `.line-container-${currDirection}[data-value="${lineContElValue}"]`
    );
  }

  setLineToBaseScale(lineContainerEl, direction) {
    const lineEl = this.getLineEl(lineContainerEl, direction);

    lineEl.style.transform = `rotate(${direction === "left" ? -45 : 45}deg)`;
    lineEl.style.width = "60px";
    lineEl.dataset.expanded = "1";
    lineContainerEl.style.width = "25px";
    lineContainerEl.dataset.expanded = "1";
  }

  replaceContentHandler(currContent, replaceWithValue) {
    currContent.querySelector("span").textContent = replaceWithValue;

    const lineContLeft = this.getSibLineContainer(currContent, "left");
    const lineContRight = this.getSibLineContainer(currContent, "right");

    currContent.dataset.value = replaceWithValue;
    if (lineContLeft) lineContLeft.dataset.value = replaceWithValue;
    if (lineContRight) lineContRight.dataset.value = replaceWithValue;
  }

  getContentEl(containerEl, value) {
    return !containerEl
      ? document.querySelector(`.${this.contentType}[data-value="${value}"]`)
      : containerEl.querySelectorAll(
          `.${this.contentType}[data-value="${value}"]`
        )[1] ??
          containerEl.querySelectorAll(
            `.${this.contentType}[data-value="${value}"]`
          );
  }

  getChildContentEl(containerEl) {
    return containerEl.querySelector(`.${this.contentType}`);
  }

  getContentValue(contentEl) {
    return +contentEl.dataset.value;
  }

  getContainerEl(contentEl) {
    return contentEl.parentNode.closest(`.${this.containerType}`);
  }

  getChildContainerEl(lineContainerEl) {
    return lineContainerEl.querySelector(`.${this.containerType}`);
  }

  getLineContainerEl(containerEl, direction, value) {
    return containerEl.querySelector(
      `.line-container-${direction}[data-value="${value}"]`
    );
  }

  getParentLineContainerEl(lineContEl) {
    return lineContEl.parentNode.closest(".line-container");
  }

  getLineEl(lineContEl, direction) {
    return lineContEl.querySelector(`.line-${direction}`);
  }

  getContainerDirection(containerEl) {
    const containerClassList = [...containerEl.classList][1]?.split("-");

    if (!containerClassList) return undefined;

    return containerClassList[containerClassList.length - 1];
  }

  getRow(lineContEl) {
    return +lineContEl.dataset.linerow;
  }

  setContainerDirection(containerEl, direction) {
    containerEl.className = `${this.containerType} child-${direction}`;
  }

  removeContainerDirection(containerEl) {
    containerEl.className = `${this.containerType}`;
  }

  setRow(contentEl, value) {
    const currRow = this.getRow(contentEl) - 1;
    const container = this.getContainerEl(contentEl);
    const lineContainerLeft = this.getLineContainerEl(container, "left", value);
    const lineContainerRight = this.getLineContainerEl(
      container,
      "right",
      value
    );

    contentEl.dataset.linerow = currRow;
    lineContainerLeft.dataset.linerow = currRow;
    lineContainerRight.dataset.linerow = currRow;
  }

  toggleLine(lineContEl, direction) {
    // const directionTest = this.getContainerDirection(lineContEl);
    const lineEl = lineContEl.querySelector(`.line-${direction}`);

    lineEl.classList.toggle("hidden");
  }

  calcTreeSide(value) {
    return this.headValue > value ? "left" : "right";
  }

  calcLineWidth(height, width) {
    return Math.floor(Math.sqrt(height ** 2 + width ** 2));
  }

  incrementExpanded(lineEl) {
    lineEl.dataset.expanded = +lineEl.dataset.expanded + 1;
  }

  decrementExpanded(lineEl) {
    if (lineEl.dataset.expanded === "0") return;

    lineEl.dataset.expanded = +lineEl.dataset.expanded - 1;
  }

  isEdgeNode(lineContainerEl, direction) {
    let currLineContainer = lineContainerEl;
    let parentLineContainer;

    while (currLineContainer) {
      parentLineContainer = this.getParentLineContainerEl(currLineContainer);

      if (!parentLineContainer) return true;

      const parentDirection = this.getContainerDirection(parentLineContainer);

      if (parentDirection !== direction) return false;

      currLineContainer = parentLineContainer;
    }
  }

  hasAdditionalChildren(currContainer, direction) {
    const [...childrenArr] = currContainer.querySelectorAll(
      `.child-${direction}`
    );

    if (childrenArr.length > 0) {
      return true;
    } else return false;
  }

  setContainerType(containerName) {
    this.containerType = containerName;
  }

  setContentType(contentName) {
    this.contentType = contentName;
  }
}
