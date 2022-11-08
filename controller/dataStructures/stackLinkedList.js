import DataStructureUtils from "./dataStructureUtils.js";

class Node extends DataStructureUtils {
  value;
  nextNode;

  constructor(value, nextNode = undefined) {
    super();
    this.value = value;
    this.setNextNode(nextNode);
  }

  setNextNode(nextNode) {
    this.nextNode = nextNode;
  }
}

export default class StackLinkedList extends Node {
  head;
  dataOutput = {};

  constructor() {
    super();
  }

  insert(value) {
    this.resetDataOutput();

    const initNewNode = new Node(value, this.head);

    if (!this.head) {
      this.setHead(initNewNode);
      this.formatDataOutputInsert(value);
      return this.dataOutput;
    }

    this.setHead(initNewNode);
    this.setCurrValue(value);
    this.formatDataOutputInsert(value);

    return this.dataOutput;
  }

  remove() {
    this.resetDataOutput();

    const currHead = this.head;
    this.setHead(currHead.nextNode);
    this.formatDataOutputRemove(currHead.value);

    return this.dataOutput;
  }

  setHead(node) {
    this.head = node;
  }

  getStack() {
    return this.head;
  }

  getCurrValue() {
    return this.currValue;
  }

  setCurrValue(value) {
    this.currValue = value;
  }

  formatDataOutputInsert(value) {
    const insertObj = {};
    insertObj.value = value;

    this.dataOutput.insert = insertObj;
  }

  formatDataOutputRemove(value) {
    const removeObj = {};
    removeObj.value = value;

    this.dataOutput.remove = removeObj;
  }

  resetDataOutput() {
    this.dataOutput = {};
  }
}
