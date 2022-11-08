import Canvas from "./canvas.js";

export default class SkipListView extends Canvas {
  skipListViewEl;
  totalRows = 6;

  constructor(node) {
    super();
  }

  insert(node) {
    console.log(node);
    if (!node.prevNode && !node.nextNode) {
      this.setSkipListMarkup();
      this.insertMarkup();
      this.setSkipListEl();
    }

    const int = node.value;
    let currNode = node;
    let currColumn;
    let prevNodeEl;
    let currRowEl;
    let newNodeEl;

    for (let row = 0; row <= this.totalRows; row++) {
      prevNodeEl = node?.prevNode
        ? this.findLastCellSkipList(node, row)
        : undefined;
      currColumn = prevNodeEl ? +this.getColumnValue(prevNodeEl) : 0;
      currRowEl = document.querySelector(`[data-row="${row}"]`);

      if (currNode) {
        if (row % 2 === 0) {
          currColumn = currColumn % 2 === 0 ? currColumn : currColumn + 1;

          this.insertContentCell(int, row, currColumn, prevNodeEl);
          newNodeEl = currRowEl.querySelector(`[data-column="${currColumn}"]`);
          this.insertHorizontalLine(int, row, currColumn - 1, newNodeEl);
          this.revealHorizontalLine(row);
          this.recalcColumnValue(newNodeEl, row);
        }

        if (row % 2 !== 0) {
          currColumn = currColumn % 2 === 0 ? currColumn : currColumn + 1;

          this.insertVerticalLine(int, row, currColumn, prevNodeEl);
          newNodeEl = currRowEl.querySelector(`[data-column="${currColumn}"]`);
          this.insertEmptyCell(int, row, currColumn - 1, newNodeEl);
          this.recalcColumnValue(newNodeEl, row);
          continue;
        }
      }
      if (!currNode) {
        if (row % 2 === 0) {
          this.insertHorizontalLine(int, row, currColumn, prevNodeEl);
          newNodeEl = currRowEl.querySelector(`[data-column="${currColumn}"]`);
          this.insertHorizontalLine(int, row, currColumn - 1, newNodeEl);
          this.revealHorizontalLine(row);
          this.recalcColumnValue(newNodeEl, row);
        }

        if (row % 2 !== 0) {
          this.insertEmptyCell(int, row, currColumn, prevNodeEl);
          newNodeEl = currRowEl.querySelector(`[data-column="${currColumn}"]`);
          this.insertEmptyCell(int, row, currColumn - 1, newNodeEl);
          this.recalcColumnValue(newNodeEl, row);
        }
      }

      currNode = currNode?.upNode;
    }
  }

  remove(node) {
    let currNode = node;
    let rowEl;
    let cellElArr;

    for (let row = 0; row <= this.totalRows; row++) {
      rowEl = document.querySelector(`[data-row="${row}"]`);
      [...cellElArr] = rowEl.querySelectorAll("td");

      let currCellEl;
      let prevCellEl;
      let nextCellEl;
      let horizontalLineCellEl;

      for (let i = 0; i < cellElArr.length; i += 2) {
        currCellEl = cellElArr[i];
        prevCellEl = cellElArr?.[i - 2];
        nextCellEl = cellElArr?.[i + 2];

        const currCellElValue = +currCellEl.dataset.rootvalue;
        const prevCellElValue = +prevCellEl?.dataset?.rootvalue;
        const nextCellElValue = +nextCellEl?.dataset?.rootvalue;

        if (
          currCellElValue === currNode.value &&
          (prevCellElValue === currNode?.prevNode?.value ||
            (!prevCellEl && !currNode?.prevNode?.value)) &&
          (nextCellElValue === currNode?.nextNode?.value ||
            (!nextCellElValue && !currNode?.nextNode?.value))
        ) {
          horizontalLineCellEl = cellElArr?.[i + 1];

          break;
        }
      }

      if (currCellEl) currCellEl.remove();

      if (horizontalLineCellEl) horizontalLineCellEl.remove();

      this.hideHorizontalLine(row);
    }
  }

  insertContentCell(int, currRow, currCol, prevNode) {
    const contentCellMarkup = this.getSkipListContentMarkup(int, currCol);

    if (!prevNode) {
      const rowToBuildOn = document.querySelector(`[data-row="${currRow}"]`);
      rowToBuildOn.insertAdjacentHTML("afterbegin", contentCellMarkup);
    }

    if (prevNode) prevNode.insertAdjacentHTML("afterend", contentCellMarkup);
  }

  insertVerticalLine(int, currRow, currCol, prevNode) {
    const verticalLineMarkup = this.getSkipListVertLineMarkup(int, currCol);

    if (!prevNode) {
      const rowToBuildOn = document.querySelector(`[data-row="${currRow}"]`);
      rowToBuildOn.insertAdjacentHTML("afterbegin", verticalLineMarkup);
    }

    if (prevNode) prevNode.insertAdjacentHTML("afterend", verticalLineMarkup);
  }

  insertHorizontalLine(int, currRow, currCol, prevNode) {
    const horizontalLineMarkup = this.getSkipListHorizLineMarkup(int, currCol);

    if (!prevNode) {
      const rowToBuildOn = document.querySelector(`[data-row="${currRow}"]`);
      rowToBuildOn.insertAdjacentHTML("afterbegin", horizontalLineMarkup);
    }

    if (prevNode) prevNode.insertAdjacentHTML("afterend", horizontalLineMarkup);
  }

  insertEmptyCell(int, currRow, currCol, prevNode) {
    const emptyCellMarkup = this.getSkipListEmptyMarkup(int, currCol);

    if (!prevNode) {
      const rowToBuildOn = document.querySelector(`[data-row="${currRow}"]`);
      rowToBuildOn.insertAdjacentHTML("afterbegin", emptyCellMarkup);
    }

    if (prevNode) prevNode.insertAdjacentHTML("afterend", emptyCellMarkup);
  }

  findLastCellSkipList(node, row) {
    const rowEl = document.querySelector(`[data-row="${row}"]`);
    const [...skipListCellArr] = rowEl.querySelectorAll("td");

    const prevNodeEl = skipListCellArr.filter((cellEl) => {
      const cellValue = +cellEl.dataset.rootvalue;

      if (cellValue === node.prevNode.value) return cellEl;
    });

    if (prevNodeEl.length > 1) return prevNodeEl[prevNodeEl.length - 1];

    return prevNodeEl[0];
  }

  revealHorizontalLine(row) {
    const rowEl = document.querySelector(`[data-row="${row}"]`);
    const [...cellElArr] = rowEl.querySelectorAll("td");

    const checkIfContentCell = cellElArr.some((cellEl, i) => {
      const contentCellEl = cellEl.querySelector(".content-skip-list");

      if (i !== 0 && contentCellEl) return true;
    });
    if (checkIfContentCell === false) return;

    const firstContentCell = this.findFirstContentCell(cellElArr);
    const lastContentCell = this.findLastContentCell(cellElArr);

    const indexFirstContentCell = this.findCellElIndex(
      cellElArr,
      firstContentCell
    );
    const indexLastContentCell = this.findCellElIndex(
      cellElArr,
      lastContentCell
    );

    const cellsToUpdateArr = cellElArr.slice(
      indexFirstContentCell,
      indexLastContentCell
    );

    cellsToUpdateArr.forEach((cellEl) => {
      const horizontalLineEl = cellEl.querySelector(
        ".skip-list-horizontal-line-hidden"
      );

      if (!horizontalLineEl) return;

      horizontalLineEl.classList.remove("skip-list-horizontal-line-hidden");
      horizontalLineEl.classList.add("skip-list-horizontal-line");
    });
  }

  hideHorizontalLine(row) {
    const rowEl = document.querySelector(`[data-row="${row}"]`);
    const [...cellElArr] = rowEl.querySelectorAll("td");

    for (let i = cellElArr.length - 1; i >= 0; i--) {
      const cellEl = cellElArr[i];

      const horizontalLineEl = cellEl.querySelector(
        ".skip-list-horizontal-line"
      );

      const contentCellEl = cellEl.querySelector(".content-skip-list");

      if (contentCellEl) break;

      if (horizontalLineEl) {
        horizontalLineEl.classList.remove("skip-list-horizontal-line");
        horizontalLineEl.classList.add("skip-list-horizontal-line-hidden");
      }
    }

    for (let i = 0; i < cellElArr.length; i++) {
      const cellEl = cellElArr[i];

      const horizontalLineEl = cellEl.querySelector(
        ".skip-list-horizontal-line"
      );

      const contentCellEl = cellEl.querySelector(".content-skip-list");

      if (contentCellEl) break;

      if (horizontalLineEl) {
        horizontalLineEl.classList.remove("skip-list-horizontal-line");
        horizontalLineEl.classList.add("skip-list-horizontal-line-hidden");
      }
    }
  }

  recalcColumnValue(nodeEl, row) {
    const rowEl = document.querySelector(`[data-row="${row}"]`);
    const [...cellElArr] = rowEl.querySelectorAll("td");

    const nodeElIndex = cellElArr.findIndex((cellEl) => cellEl === nodeEl);

    const cellsToUpdateArr = cellElArr.slice(
      nodeElIndex + 1,
      nodeElIndex.length
    );

    if (cellsToUpdateArr.length < 1) return;

    cellsToUpdateArr.forEach((cellEl) => {
      const updatedColValue = +cellEl.dataset.column + 2;
      cellEl.setAttribute("data-column", `${updatedColValue}`);
    });
  }

  findFirstContentCell(cellElArr) {
    return cellElArr.find((cellEl) =>
      cellEl.querySelector(".content-skip-list")
    );
  }

  findLastContentCell(cellElArr) {
    let cellEl;
    let lastContentCell;
    for (let i = cellElArr.length - 1; i > 0; i--) {
      cellEl = cellElArr[i];
      const isContentCell = cellEl.querySelector(".content-skip-list");

      if (isContentCell) {
        lastContentCell = cellEl;
        break;
      }
    }

    return lastContentCell;
  }

  findCellElIndex(cellElArr, targetCellEl) {
    return cellElArr.findIndex((cellEl) => cellEl === targetCellEl);
  }

  getColumnValue(nodeEl) {
    return +nodeEl.dataset.column;
  }

  getSkipListContentMarkup(int, columnNum) {
    return `
    <td class="skip-list-cell" data-column="${columnNum}" data-rootValue="${int}">
      <div class="content-skip-list">
        <span>${int}</span>
      </div>
    </td>
    `;
  }

  getSkipListHorizLineMarkup(int, columnNum) {
    return `
    <td class="skip-list-cell" data-column="${columnNum}" data-rootValue="${int}">
      <div class="skip-list-horizontal-line-hidden"></div>
    </td>
    `;
  }

  getSkipListVertLineMarkup(int, columnNum) {
    return `
    <td class="skip-list-cell" data-column="${columnNum}" data-rootValue="${int}">
      <div class="skip-list-vertical-line"></div>
    </td>
    `;
  }

  getSkipListEmptyMarkup(int, columnNum) {
    return `
    <td class="empty-cell" data-column="${columnNum}" data-rootValue="${int}"></td>
    `;
  }

  setSkipListMarkup() {
    this.setMarkup(`
    <table class="skip-list skip-list-table">
      <tr class="skip-list-row" data-row="6">
      </tr>
      <tr class="skip-list-row" data-row="5">
      </tr>
      <tr class="skip-list-row" data-row="4">
      </tr>
      <tr class="skip-list-row" data-row="3">
      </tr>
      <tr class="skip-list-row" data-row="2">
      </tr>
      <tr class="skip-list-row" data-row="1">
      </tr>
      <tr class="skip-list-row" data-row="0">
      </tr>
  </table>
    `);
  }

  setSkipListEl() {
    this.skipListViewEl = document.querySelector(".skip-list");
  }
}
