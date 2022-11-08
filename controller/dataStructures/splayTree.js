import DataStructureUtils from "./dataStructureUtils.js";

class Node extends DataStructureUtils {
  value;
  leftNode;
  rightNode;
  parentNode;
  direction;

  constructor(value, parent = undefined, direction = undefined) {
    super();
    this.value = value;
    this.setParentNode(parent);
    this.setDirection(direction);
  }

  setLeftNode(node) {
    this.leftNode = node;
  }

  setRightNode(node) {
    this.rightNode = node;
  }

  setParentNode(node) {
    this.parentNode = node;
  }

  setDirection(direction) {
    this.direction = direction;
  }

  getLeftNode() {
    return this.leftNode;
  }

  getRightNode() {
    return this.rightNode;
  }

  getParentNode() {
    return this.parentNode;
  }

  getDirection() {
    return this.direction;
  }
}

export default class SplayTree extends Node {
  head;
  dataOutput = {
    insert: {},
    remove: {},
    replace: [],
    rotate: [],
  };

  constructor(value) {
    super();
    // const initNewNode = new Node(value);
    // this.setHead(initNewNode);
    // this.formatDataOutput(initNewNode, "input");
  }

  insert(value) {
    this.clearDataOutput();

    let initNewNode;

    if (!this.head) {
      initNewNode = new Node(value);

      this.setHead(initNewNode);
      this.formatDataOutputInsert(initNewNode);
      return this.dataOutput;
    }

    let currNode = this.head;

    while (currNode) {
      if (value < currNode.value) {
        if (!currNode.getLeftNode()) {
          initNewNode = new Node(value, currNode, "left");
          currNode.setLeftNode(initNewNode);
          break;
        }
        currNode = currNode.getLeftNode();
        continue;
      }

      if (value > currNode.value) {
        if (!currNode.getRightNode()) {
          initNewNode = new Node(value, currNode, "right");
          currNode.setRightNode(initNewNode);
          break;
        }
        currNode = currNode.getRightNode();
        continue;
      }
    }

    // this.formatDataOutput(initNewNode, "input");
    this.formatDataOutputInsert(initNewNode);
    this.splay(initNewNode);

    console.log(this.head);
    return this.dataOutput;
  }

  remove(value) {
    this.clearDataOutput();

    if (value === this.head.value) return this.removeHead();

    const node = this.findNode(value);

    const splayNode = node.getParentNode();
    const direction = node.getDirection();
    let replaceObj = {};

    if (direction === "left") {
      if (!node.getLeftNode() && !node.getRightNode()) {
        this.formatDataOutputRemove(node);

        node.getParentNode().setLeftNode(undefined);
      } else if (node.getLeftNode() && !node.getRightNode()) {
        this.formatDataOutputRemove(node);

        node.getLeftNode().setParentNode(node.getParentNode());
        node.getParentNode().setLeftNode(node.getLeftNode());
        node.getParentNode().getLeftNode().setDirection(node.getDirection());
      } else if (!node.getLeftNode() && node.getRightNode()) {
        this.formatDataOutputRemove(node);

        node.getRightNode().setParentNode(node.getParentNode());
        node.getParentNode().setLeftNode(node.getRightNode());
        node.getParentNode().getLeftNode().setDirection(node.getDirection());
      } else {
        let maxNode = node.getLeftNode();
        let compareNode = maxNode?.getRightNode();

        while (compareNode) {
          if (compareNode.value > maxNode.value) maxNode = compareNode;
          compareNode = compareNode?.getRightNode();
        }

        this.formatDataOutputReplace(node.value, maxNode.value);

        node.value = maxNode.value;

        maxNode.getDirection() === "left"
          ? maxNode?.getLeftNode()?.setParentNode(maxNode?.getParentNode())
          : maxNode?.getRightNode()?.setParentNode(maxNode?.getParentNode());

        maxNode.getDirection() === "left"
          ? maxNode.getParentNode().setLeftNode(maxNode?.getLeftNode())
          : maxNode.getParentNode().setRightNode(maxNode?.getRightNode());

        this.formatDataOutputRemove(maxNode);
      }
    } else {
      if (!node.getLeftNode() && !node.getRightNode()) {
        this.formatDataOutputRemove(node);

        node.getParentNode().setRightNode(undefined);
      } else if (node.getLeftNode() && !node.getRightNode()) {
        this.formatDataOutputRemove(node);

        node.getLeftNode().setParentNode(node.getParentNode());
        node.getParentNode().setRightNode(node.getLeftNode());
        node.getParentNode().getRightNode().setDirection(node.getDirection());
      } else if (!node.getLeftNode() && node.getRightNode()) {
        this.formatDataOutputRemove(node);

        node.getRightNode().setParentNode(node.getParentNode());
        node.getParentNode().setRightNode(node.getRightNode());
        node.getParentNode().getRightNode().setDirection(node.getDirection());
      } else {
        let maxNode = node.getLeftNode();
        let compareNode = maxNode?.getRightNode();

        while (compareNode) {
          if (compareNode.value > maxNode.value) maxNode = compareNode;
          compareNode = compareNode?.getRightNode();
        }

        this.formatDataOutputReplace(node.value, maxNode.value);

        node.value = maxNode.value;

        maxNode.getDirection() === "left"
          ? maxNode?.getLeftNode()?.setParentNode(maxNode?.getParentNode())
          : maxNode?.getRightNode()?.setParentNode(maxNode?.getParentNode());

        maxNode.getDirection() === "left"
          ? maxNode.getParentNode().setLeftNode(maxNode?.getLeftNode())
          : maxNode.getParentNode().setRightNode(maxNode?.getRightNode());

        this.formatDataOutputRemove(maxNode);
      }
    }

    this.splay(splayNode);

    return this.dataOutput;
  }

  removeHead() {
    if (!this.head.getLeftNode() && !this.head.getRightNode()) {
      this.head = undefined;
      return undefined;
    }

    if (this.head.getLeftNode() && !this.head.getRightNode()) {
      this.formatDataOutputRemove(this.head);

      this.head = this.head.getLeftNode();
      this.head.setParentNode(undefined);
      this.head.setDirection(undefined);

      return this.dataOutput;
    }

    if (!this.head.getLeftNode() && this.head.getRightNode()) {
      this.formatDataOutputRemove(this.head);

      this.head = this.head.getRightNode();
      this.head.setParentNode(undefined);
      this.head.setDirection(undefined);

      return this.dataOutput;
    }

    if (this.head.getLeftNode() && this.head.getRightNode()) {
      let maxNode = this.head.getLeftNode();
      let compareNode = maxNode?.getRightNode();

      while (compareNode) {
        if (compareNode.value > maxNode.value) maxNode = compareNode;
        compareNode = compareNode?.getRightNode();
      }

      this.formatDataOutputReplace(this.head.value, maxNode.value);

      this.head.value = maxNode.value;

      this.formatDataOutputRemove(maxNode, maxNode.getDirection());

      if (maxNode.getParentNode() !== this.head) {
        maxNode.getParentNode().setRightNode(maxNode.getLeftNode());
        maxNode?.getLeftNode()?.setParentNode(maxNode.getParentNode());
      } else {
        this.head.setLeftNode(maxNode?.getLeftNode());
        maxNode?.getLeftNode()?.setParentNode(this.head);
      }

      return this.dataOutput;
    }
  }

  splay(node) {
    let currNode;

    if (node === this.head) return;

    if (!node.getParentNode()?.getParentNode()) {
      if (node.getDirection() === "left")
        currNode = this.rightRotation(node.getParentNode());
      if (node.getDirection() === "right")
        currNode = this.leftRotation(node.getParentNode());
    } else {
      if (
        node.getDirection() === "left" &&
        node.getParentNode().getDirection() === "left"
      )
        currNode = this.rightRightRotation(
          node.getParentNode().getParentNode()
        );
      if (
        node.getDirection() === "right" &&
        node.getParentNode().getDirection() === "right"
      )
        currNode = this.leftLeftRotation(node.getParentNode().getParentNode());

      if (
        node.getDirection() === "left" &&
        node.getParentNode().getDirection() === "right"
      ) {
        currNode = this.rightLeftRotation(node.getParentNode());
      }

      if (
        node.getDirection() === "right" &&
        node.getParentNode().getDirection() === "left"
      ) {
        currNode = this.leftRightRotation(node.getParentNode());
      }
    }

    if (currNode === this.head) return;

    this.splay(currNode);
  }

  rightRotation(node) {
    const direction = node.getDirection();
    const temp = node.getLeftNode();

    node.setLeftNode(temp?.getRightNode());
    node?.getLeftNode()?.setDirection("left");
    temp?.getRightNode()?.setParentNode(node);

    temp.setRightNode(node);
    temp.getRightNode().setDirection("right");

    if (node === this.head) {
      node.setParentNode(temp);
      temp.setParentNode(undefined);
      temp.setDirection(undefined);
      this.setHead(temp);

      direction === "left"
        ? temp?.getLeftNode()?.setDirection("left")
        : temp?.getRightNode()?.setDirection("right");

      this.formatDataOutputRotate(temp, "right");
      return temp;
    } else {
      temp.setParentNode(node.getParentNode());

      direction === "left"
        ? node.getParentNode().setLeftNode(temp)
        : node.getParentNode().setRightNode(temp);
      direction === "left"
        ? node.getParentNode().getLeftNode().setDirection("left")
        : node.getParentNode().getRightNode().setDirection("right");

      temp.getRightNode().setParentNode(temp);

      this.formatDataOutputRotate(temp, "right");
      return temp;
    }
  }

  leftRotation(node) {
    const direction = node.getDirection();
    const temp = node.getRightNode();

    node.setRightNode(temp.getLeftNode());
    node?.getRightNode()?.setDirection("right");
    temp?.getLeftNode()?.setParentNode(node);

    temp.setLeftNode(node);
    temp.getLeftNode().setDirection("left");

    if (node === this.head) {
      node.setParentNode(temp);
      temp.setParentNode(undefined);
      temp.setDirection(undefined);
      this.setHead(temp);

      direction === "left"
        ? temp?.getLeftNode()?.setDirection("left")
        : temp?.getRightNode()?.setDirection("right");

      this.formatDataOutputRotate(temp, "left");
      return temp;
    } else {
      temp.setParentNode(node.getParentNode());

      direction === "left"
        ? node.getParentNode().setLeftNode(temp)
        : node.getParentNode().setRightNode(temp);
      direction === "left"
        ? node.getParentNode().getLeftNode().setDirection("left")
        : node.getParentNode().getRightNode().setDirection("right");

      temp.getLeftNode().setParentNode(temp);

      this.formatDataOutputRotate(temp, "left");
      return temp;
    }
  }

  rightRightRotation(node) {
    let currNode;

    currNode = this.rightRotation(node);
    currNode = this.rightRotation(currNode);
    return currNode;
  }

  rightLeftRotation(node) {
    let currNode;

    currNode = this.rightRotation(node);
    currNode = this.leftRotation(currNode.getParentNode());

    return currNode;
  }

  leftLeftRotation(node) {
    let currNode;

    currNode = this.leftRotation(node);
    currNode = this.leftRotation(currNode);
    return currNode;
  }

  leftRightRotation(node) {
    let currNode;

    currNode = this.leftRotation(node);
    currNode = this.rightRotation(currNode.getParentNode());
    return currNode;
  }

  setHead(node) {
    this.head = node;
  }

  setHeadValue(value) {
    this.head.value = value;

    return this.head;
  }

  findNode(value) {
    if (value == this.head.value) return this.head;

    let currNode = this.head;

    while (currNode) {
      if (currNode.value === value) {
        return currNode;
      }

      if (currNode.value > value) currNode = currNode?.getLeftNode();

      if (currNode.value < value) currNode = currNode?.getRightNode();
    }

    return undefined;
  }

  formatDataOutputInsert(node) {
    const insertObj = {};
    insertObj.value = node.value;
    insertObj.parentValue = node?.getParentNode()?.value;

    this.dataOutput.insert = insertObj;
  }

  formatDataOutputRemove(node) {
    const removeObj = {};
    removeObj.value = node.value;
    removeObj.parentValue = node?.getParentNode()?.value;
    removeObj.direction = node?.getDirection();

    if (node.getLeftNode()) removeObj.leftValue = node.getLeftNode().value;
    if (node.getRightNode()) removeObj.rightValue = node.getRightNode().value;
    this.dataOutput.remove = removeObj;
  }

  formatDataOutputReplace(replace, replaceWith) {
    const replaceObj = {};
    replaceObj.replace = replace;
    replaceObj.replaceWith = replaceWith;

    this.dataOutput.replace.push(replaceObj);
  }

  formatDataOutputRotate(node, direction) {
    const rotateObj = {};
    rotateObj.value = node.value;

    if (direction === "left") rotateObj.rotateValue = node.getLeftNode().value;

    if (direction === "right")
      rotateObj.rotateValue = node.getRightNode().value;

    rotateObj.direction = direction;

    this.dataOutput.rotate.push(rotateObj);
  }

  clearDataOutput() {
    this.dataOutput = {
      insert: {},
      remove: {},
      replace: [],
      rotate: [],
    };
  }

  clearDataRemoveAndReplace() {
    this.dataOutput = {
      remove: {},
      replace: [],
    };
  }
}
