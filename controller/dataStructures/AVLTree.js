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

export default class AVLTree extends Node {
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

    // this.formatDataOutputInsert(initNewNode);
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

    this.formatDataOutputInsert(initNewNode);
    this.checkBalance(initNewNode);

    return this.dataOutput;
  }

  remove(value) {
    this.clearDataOutput();

    if (value === this.head.value) return this.removeHead();

    const node = this.findNode(value);
    const direction = node.getDirection();

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
        let compareNode = maxNode.getRightNode();

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
        let compareNode = maxNode.getRightNode();

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

    this.checkBalance(node);
    console.log(this.head);
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

      this.formatDataOutputRemove(maxNode);

      if (maxNode.getParentNode() !== this.head) {
        maxNode.getParentNode().setRightNode(maxNode.getLeftNode());
        maxNode?.getLeftNode()?.setParentNode(maxNode.getParentNode());
      } else {
        maxNode?.getLeftNode()?.setParentNode(this.head);
        this.head.setLeftNode(maxNode?.getLeftNode());
      }

      this.checkBalance(maxNode);

      console.log(this.head);

      return this.dataOutput;
    }
  }

  checkBalance(node) {
    let currNode = node;

    if (
      this.getHeight(node.getLeftNode()) - this.getHeight(node.getRightNode()) >
        1 ||
      this.getHeight(node.getLeftNode()) - this.getHeight(node.getRightNode()) <
        -1
    )
      currNode = this.rebalance(node);

    if (!currNode?.getParentNode()) return;

    this.checkBalance(currNode.getParentNode());
  }

  rebalance(node) {
    let currNode = node;
    if (
      this.getHeight(node.getLeftNode()) - this.getHeight(node.getRightNode()) >
      1
    ) {
      if (
        this.getHeight(node.getLeftNode().getLeftNode()) >
        this.getHeight(node.getLeftNode().getRightNode())
      ) {
        currNode = this.rightRotation(currNode);
      } else {
        currNode = this.leftRightRotation(currNode);
      }
    } else {
      if (
        this.getHeight(node.getRightNode().getRightNode()) >
        this.getHeight(node.getRightNode().getLeftNode())
      ) {
        currNode = this.leftRotation(currNode);
      } else {
        currNode = this.rightLeftRotation(currNode);
      }
    }

    return currNode;
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
        ? temp.getLeftNode().setDirection("left")
        : temp.getRightNode().setDirection("right");

      this.formatDataOutputRotate(temp, "right");

      return;
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

      return temp.getParentNode();
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
        ? temp.getLeftNode().setDirection("left")
        : temp.getRightNode().setDirection("right");

      this.formatDataOutputRotate(temp, "left");

      return;
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

      return temp.getParentNode();
    }
  }

  rightLeftRotation(node) {
    let currNode;

    currNode = this.rightRotation(node.getRightNode());
    currNode = this.leftRotation(currNode);
    return currNode;
  }

  leftRightRotation(node) {
    let currNode;

    currNode = this.leftRotation(node.getLeftNode());
    currNode = this.rightRotation(currNode);
    return currNode;
  }

  findNode(value) {
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

  getHeight(node) {
    if (node === undefined) return 0;

    return (
      1 +
      Math.max(
        this.getHeight(node?.getLeftNode()),
        this.getHeight(node?.getRightNode())
      )
    );
  }

  setHead(node) {
    this.head = node;
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
    removeObj.direction = node.getDirection();

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
}
