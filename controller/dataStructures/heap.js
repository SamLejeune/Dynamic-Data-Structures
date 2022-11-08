export default class Heap {
  heap = [];
  dataOutput = {
    insert: {},
    remove: {},
    replace: [],
    rotate: [],
  };

  constructor(value) {
    // this.heap.push(value);
    // this.formatDataOutputInsert(value, undefined);
  }

  insert(node) {
    this.clearDataOutput();

    if (this.getHeapLength() === 0) {
      this.heap[0] = node;
      this.formatDataOutputInsert(node, undefined);
      return;
    }

    this.heap.push(node);

    let i = this.getHeapLength() - 1;
    let currIndex = i;
    let parentIndex = Math.floor((i - 1) / 2);

    this.formatDataOutputInsert(node, i);

    while (i > 0) {
      if (node < this.getParent(i)) {
        this.formatDataOutputReplace(
          this.heap[parentIndex],
          this.heap[currIndex]
        );

        [this.heap[currIndex], this.heap[parentIndex]] = [
          this.heap[parentIndex],
          this.heap[currIndex],
        ];
        i = Math.floor((i - 1) / 2);
        currIndex = i;
        parentIndex = Math.floor((i - 1) / 2);
      } else break;
    }
  }

  remove() {
    this.clearDataOutput();

    if (this.getHeapLength() === 0) return;

    if (this.getHeapLength() === 1) return;

    const min = this.heap.shift();
    this.heap.unshift(this.heap.pop());

    let i = 0;
    let currNode = this.heap[0];

    this.formatDataOutputRemove(min, currNode);

    while (currNode > this.getLeftNode(i) || currNode > this.getRightNode(i)) {
      if (this.getLeftNode(i) < this.getRightNode(i) || !this.getRightNode(i)) {
        this.formatDataOutputReplace(this.heap[i], this.heap[this.getLeft(i)]);

        [this.heap[i], this.heap[this.getLeft(i)]] = [
          this.heap[this.getLeft(i)],
          this.heap[i],
        ];
        i = this.getLeft(i);
        // currNode = this.getLeftNode(i);
        continue;
      }

      if (this.getRightNode(i) < this.getLeftNode(i) || !this.getLeftNode(i)) {
        this.formatDataOutputReplace(this.heap[i], this.heap[this.getRight(i)]);

        [this.heap[i], this.heap[this.getRight(i)]] = [
          this.heap[this.getRight(i)],
          this.heap[i],
        ];
        i = this.getRight(i);
        // currNode = this.getRightNode(i);
        continue;
      }

      break;
    }

    return this.dataOutput;
  }

  getMin() {
    return this.heap[0];
  }

  getHeap() {
    return this.heap;
  }

  getHeapLength() {
    return this.heap.length;
  }

  getParent(i) {
    return this.heap[Math.floor((i - 1) / 2)];
  }

  getLeft(i) {
    return i * 2 + 1;
  }

  getRight(i) {
    return i * 2 + 2;
  }

  getLeftNode(i) {
    return this.heap[this.getLeft(i)];
  }

  getRightNode(i) {
    return this.heap[this.getRight(i)];
  }

  calcTreeSide(i) {
    if (i <= 4) return "left";

    let currIndex = i % 2 === 0 ? i : i + 1;

    while (true) {
      const dividedIndex = Math.floor(currIndex / 2);

      if (dividedIndex === 2) return "left";

      if (dividedIndex === 3) return "right";

      currIndex = dividedIndex;
    }
  }

  formatDataOutputInsert(value, i) {
    const insertObj = {};
    insertObj.value = value;

    if (i) {
      insertObj.parentValue = this.getParent(i);
      insertObj.direction = i % 2 !== 0 ? "left" : "right";
      insertObj.treeSide = this.calcTreeSide(i);
    }

    this.dataOutput.insert = insertObj;
  }

  formatDataOutputReplace(replace, replaceWith) {
    const replaceObj = {};
    replaceObj.replace = replace;
    replaceObj.replaceWith = replaceWith;

    this.dataOutput.replace.push(replaceObj);
  }

  formatDataOutputRemove(min, replaceWith) {
    const removeObj = {};
    removeObj.value = min;
    removeObj.replaceWith = replaceWith;
    removeObj.treeSide = this.calcTreeSide(this.getHeapLength());

    this.dataOutput.remove = removeObj;
  }

  clearDataOutput() {
    this.dataOutput = {
      insert: {},
      remove: {},
      replace: [],
      rotate: [],
    };
  }
}
