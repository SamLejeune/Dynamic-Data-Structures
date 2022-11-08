import DataStructureUtils from "./dataStructureUtils.js";

class Node extends DataStructureUtils {
  value;
  leftNode;
  rightNode;

  constructor(value) {
    super();
    this.value = value;
  }

  setLeftNode(node) {
    this.leftNode = node;
  }

  setRightNode(node) {
    this.rightNode = node;
  }

  getLeftNode() {
    return this.leftNode;
  }

  getRightNode() {
    return this.rightNode;
  }
}

export default class BinarySearchTree extends Node {
  head;
  dataOutput = {
    insert: {},
    remove: {},
    replace: [],
  };

  constructor(value) {
    super();

    // const initNewNode = new Node(value);
    // this.setHead(initNewNode);
    // this.setCurrValue(value);
  }

  insert(value) {
    this.clearDataOutput();

    const initNewNode = new Node(value);

    if (!this.head) {
      this.setHead(initNewNode);
      this.formatDataOutputInsert(value, undefined, undefined);
      return;
    }

    let currNode = this.head;
    let direction;

    while (currNode) {
      if (value < currNode.value) {
        if (!currNode.getLeftNode()) {
          currNode.setLeftNode(initNewNode);
          direction = "left";
          break;
        }
        currNode = currNode.getLeftNode();
        continue;
      }

      if (value >= currNode.value) {
        if (!currNode.getRightNode()) {
          currNode.setRightNode(initNewNode);
          direction = "right";
          break;
        }
        currNode = currNode.getRightNode();
        continue;
      }
    }

    this.formatDataOutputInsert(value, currNode.value, direction);

    return this.dataOutput;
  }

  remove(removeValue) {
    this.clearDataOutput();

    let value = removeValue;

    if (value === this.head.value) {
      const result = this.removeHead();

      if (isNaN(result)) return result;

      value = result;
    }

    let currNode = this.head;

    while (currNode) {
      if (
        currNode?.getLeftNode()?.value === value ||
        currNode?.getRightNode()?.value === value
      ) {
        if (currNode?.getLeftNode()?.value === value) {
          // If left and right leaf are null:
          if (
            !currNode?.getLeftNode()?.getLeftNode() &&
            !currNode?.getLeftNode()?.getRightNode()
          ) {
            // removeData.remove = currNode.getLeftNode().value;
            this.formatDataOutputRemove(currNode.getLeftNode());
            currNode.setLeftNode(undefined);
            break;
          }
          // If has left leaf only:
          if (
            currNode?.getLeftNode()?.getLeftNode() &&
            !currNode?.getLeftNode()?.getRightNode()
          ) {
            this.formatDataOutputRemove(
              currNode.getLeftNode(),
              currNode.getLeftNode().getLeftNode(),
              "left"
            );

            currNode.setLeftNode(currNode.getLeftNode().getLeftNode());
            break;
          }
          // If has right leaf only
          if (
            !currNode?.getLeftNode()?.getLeftNode() &&
            currNode?.getLeftNode()?.getRightNode()
          ) {
            this.formatDataOutputRemove(
              currNode.getLeftNode(),
              currNode.getLeftNode().getRightNode(),
              "left"
            );

            currNode.setLeftNode(currNode.getLeftNode().getRightNode());
            break;
          }
          // If has both right and left
          if (
            currNode?.getLeftNode()?.getLeftNode() &&
            currNode?.getLeftNode()?.getRightNode()
          ) {
            let maxNode = currNode.getLeftNode().getLeftNode();
            let comparisonNode = maxNode?.getRightNode();

            while (comparisonNode) {
              if (comparisonNode.value > maxNode.value)
                maxNode = comparisonNode;
              comparisonNode = comparisonNode?.getRightNode();
            }

            this.formatDataOutputReplace(currNode.getLeftNode(), maxNode);

            currNode.getLeftNode().value = maxNode.value;
            currNode = currNode.getLeftNode();
            value = maxNode.value;
            continue;
          }
        }

        if (currNode?.getRightNode()?.value === value) {
          if (
            !currNode?.getRightNode()?.getLeftNode() &&
            !currNode?.getRightNode()?.getRightNode()
          ) {
            // removeData.remove = currNode.getRightNode().value;
            this.formatDataOutputRemove(currNode.getRightNode());
            currNode.setRightNode(undefined);
            break;
          }

          if (
            currNode?.getRightNode()?.getLeftNode() &&
            !currNode?.getRightNode()?.getRightNode()
          ) {
            this.formatDataOutputRemove(
              currNode.getRightNode(),
              currNode.getRightNode().getLeftNode(),
              "right"
            );

            currNode.setRightNode(currNode.getRightNode().getLeftNode());
            break;
          }

          if (
            !currNode?.getRightNode()?.getLeftNode() &&
            currNode?.getRightNode()?.getRightNode()
          ) {
            this.formatDataOutputRemove(
              currNode.getRightNode(),
              currNode.getRightNode().getRightNode(),
              "right"
            );

            currNode.setRightNode(currNode.getRightNode().getRightNode());
            break;
          }

          if (
            currNode?.getRightNode()?.getLeftNode() &&
            currNode?.getRightNode()?.getRightNode()
          ) {
            let minNode = currNode.getRightNode().getLeftNode();
            let comparisonNode = minNode.getRightNode();

            while (comparisonNode) {
              if (comparisonNode.value > minNode.value)
                minNode = comparisonNode;
              comparisonNode = comparisonNode?.getRightNode();
            }

            this.formatDataOutputReplace(currNode.getRightNode(), minNode);

            currNode.getRightNode().value = minNode.value;
            currNode = currNode.getRightNode();
            value = minNode.value;

            continue;
          }
        }
      }
      if (value <= currNode.value) {
        currNode = currNode.getLeftNode();
      } else {
        currNode = currNode.getRightNode();
      }
    }

    return this.dataOutput;
  }

  // formatDataOutputRemove(removeNode, childNode, removeDirection)

  removeHead() {
    if (!this.head.getLeftNode() && !this.head.getRightNode()) {
      this.head = undefined;
      return undefined;
    }

    if (this.head.getLeftNode() && !this.head.getRightNode()) {
      this.formatDataOutputRemove(this.head, this.head.getLeftNode(), "left");

      this.head = this.head.getLeftNode();

      return this.dataOutput;
    }

    if (!this.head.getLeftNode() && this.head.getRightNode()) {
      this.formatDataOutputRemove(this.head, this.head.getRightNode(), "right");

      this.head = this.head.getRightNode();

      return this.dataOutput;
    }

    if (this.head.getLeftNode() && this.head.getRightNode()) {
      let maxNode = this.head.getLeftNode();
      let compareNode = maxNode?.getRightNode();

      while (compareNode) {
        if (compareNode.value > maxNode.value) maxNode = compareNode;
        compareNode = compareNode?.getRightNode();
      }

      this.formatDataOutputReplace(this.head, maxNode);

      this.head.value = maxNode.value;

      return maxNode.value;
    }
  }

  setHead(node) {
    this.head = node;
  }

  setCurrValue(int) {
    this.currValue = int;
  }

  setPrevValue(int) {
    this.prevValue = int;
  }

  getCurrValue() {
    return this.currValue;
  }

  getPrevValue() {
    return this.prevValue;
  }

  getHead() {
    return this.head;
  }

  formatDataOutputInsert(value, parentValue, direction) {
    const insertObj = {};

    insertObj.value = value;
    insertObj.parentValue = parentValue;
    insertObj.direction = direction;

    this.dataOutput.insert = insertObj;
  }

  formatDataOutputReplace(replaceNode, replaceWithNode) {
    const replaceObj = {};

    replaceObj.replace = replaceNode.value;
    replaceObj.replaceWith = replaceWithNode.value;

    this.dataOutput.replace.push(replaceObj);
  }

  formatDataOutputRemove(removeNode, childNode, removeDirection) {
    const removeObj = {};

    removeObj.remove = removeNode.value;
    if (childNode) removeObj.child = childNode.value;
    if (removeDirection) removeObj.direction = removeDirection;
    this.dataOutput.remove = removeObj;
  }

  clearDataOutput() {
    this.dataOutput = {
      insert: {},
      remove: {},
      replace: [],
    };
  }
}
