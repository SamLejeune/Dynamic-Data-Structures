import DataStructureUtils from "./dataStructureUtils.js";

export default class Queue extends DataStructureUtils {
  queue = [];
  dataOutput = {};

  constructor() {
    super();
  }

  insert(value) {
    this.resetDataOutput();

    this.formatDataOutputInsert(value);
    this.queue.push(value);

    return this.dataOutput;
  }

  remove() {
    this.resetDataOutput();

    const removeValue = this.queue.shift();
    this.formatDataOutputRemove(removeValue);

    return this.dataOutput;
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
