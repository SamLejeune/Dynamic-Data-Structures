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

export default class QueueLinkedList extends Node {
  head;
  tail;
  dataOutput = {};

  constructor() {
    super();
  }

  insert(value) {
    this.resetDataOutput();

    const initNewNode = new Node(value);

    if (!this.head && !this.tail) {
      this.setHead(initNewNode);
      this.setTail(initNewNode);
      this.formatDataOutputInsert(value);
      return this.dataOutput;
    }

    this.setTailNextNode(initNewNode);
    this.setTail(initNewNode);
    this.formatDataOutputInsert(value);
    return this.dataOutput;
  }

  remove() {
    this.resetDataOutput();

    const currHead = this.head;
    this.setHead(this.head.nextNode);
    this.formatDataOutputRemove(currHead.value);

    return this.dataOutput;
  }

  setHead(node) {
    this.head = node;
  }

  setTail(node) {
    this.tail = node;
  }

  setTailNextNode(node) {
    this.tail.setNextNode(node);
  }

  getHead() {
    return this.head;
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
