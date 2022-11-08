import DataStructureUtils from "./dataStructureUtils.js";

export default class Stack extends DataStructureUtils {
  stack = [];
  dataOutput = {};

  constructor() {
    super();
  }

  insert(value) {
    this.resetDataOutput();

    this.stack.unshift(value);
    this.formatDataOutputInsert(value);

    return this.dataOutput;
  }

  remove() {
    this.resetDataOutput();

    const removeValue = this.stack.shift();
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
