import DataStructureUtils from "./dataStructureUtils.js";

class Node extends DataStructureUtils {
  value;
  leftNode;
  rightNode;
  parentNode;
  color;
  direction;
  isDoubleBlack = false;

  constructor(
    value,
    parent = undefined,
    color,
    direction = undefined,
    isDoubleBlack = false
  ) {
    super();
    this.setValue(value);
    this.setParentNode(parent);
    this.setColor(color);
    this.setDirection(direction);
    this.setIsDoubleBlack(isDoubleBlack);
  }

  setValue(value) {
    this.value = value;
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

  setColor(color) {
    this.color = color;
  }

  setDirection(direction) {
    this.direction = direction;
  }

  setIsDoubleBlack(bool) {
    this.isDoubleBlack = bool;
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

  getColor() {
    return this.color;
  }

  getDirection() {
    return this.direction;
  }

  getNode() {
    return this;
  }
}

export default class RedBlackTree extends Node {
  head;
  // maxRandomValue = 30;
  dataOutput = {
    insert: {},
    remove: {},
    replace: [],
    rotate: [],
    correctColor: [],
  };

  constructor(value) {
    super();
    // const initNewNode = new Node(value, undefined, "black", undefined);
    // this.head = initNewNode;

    // this.formatDataOutputInsert(initNewNode);
  }

  insert(value) {
    this.clearDataOutput();

    let initNewNode;

    if (!this.head) {
      initNewNode = new Node(value, undefined, "black", undefined);

      this.setHead(initNewNode);
      this.formatDataOutputInsert(initNewNode);
      return this.dataOutput;
    }

    let currNode = this.head;

    while (currNode) {
      if (value < currNode.value) {
        if (!currNode.getLeftNode()) {
          initNewNode = new Node(value, currNode, "red", "left");
          currNode.setLeftNode(initNewNode);
          break;
        }
        currNode = currNode.getLeftNode();
        continue;
      }

      if (value > currNode.value) {
        if (!currNode.getRightNode()) {
          initNewNode = new Node(value, currNode, "red", "right");
          currNode.setRightNode(initNewNode);
          break;
        }
        currNode = currNode.getRightNode();
        continue;
      }
    }
    this.formatDataOutputInsert(initNewNode);
    this.checkColor(initNewNode);

    return this.dataOutput;
  }

  remove(value) {
    this.clearDataOutput();

    if (!this.head.getLeftNode() && !this.head.getRightNode()) {
      this.head = undefined;
      return undefined;
    }

    const node = value === this.head.value ? this.head : this.findNode(value);
    const removeNode = this.binarySearchTreeRemoval(node);
    const removeNodePar = removeNode.getParentNode();
    const dir = removeNode.getDirection();

    // If removeNode is red leaf node remove it and return:
    if (
      removeNode.getColor() === "red" &&
      !removeNode.getLeftNode() &&
      !removeNode.getRightNode()
    ) {
      dir === "left"
        ? removeNode.getParentNode().setLeftNode(null)
        : removeNode.getParentNode().setRightNode(null);

      this.formatDataOutputRemove(removeNode);
      return this.dataOutput;
    }

    // If remove has a child...
    if (removeNode.getLeftNode() || removeNode.getRightNode()) {
      if (removeNode.getLeftNode()) {
        const temp = removeNode.getLeftNode();
        temp.setParentNode(removeNode.getLeftNode());

        removeNode.getParentNode().setLeftNode(removeNode.getLeftNode());
        removeNode.getLeftNode().setParentNode(removeNode.getParentNode());
        removeNode.getLeftNode().setColor("black");

        this.formatDataOutputRemove(removeNode);
        this.formatDataOutputCorrectColor();
      }

      if (removeNode.getRightNode()) {
        const temp = removeNode.getRightNode();
        temp.startParentNode(removeNode.getRightNode());

        removeNode.getParentNode().setRightNode(removeNode.getRightNode());
        removeNode.getLeftNode().setParentNode(removeNode.getParentNode());
        removeNode.getRightNode().setColor("black");

        this.formatDataOutputRemove(removeNode);
        this.formatDataOutputCorrectColor();
      }
      return this.dataOutput;
    }

    this.formatDataOutputRemove(removeNode);

    // If black node insert doubleblack node and call db corrector:
    const dbNode = new Node(null, removeNodePar, null, dir, true);
    dir === "left"
      ? dbNode.getParentNode().setLeftNode(dbNode)
      : dbNode.getParentNode().setRightNode(dbNode);

    this.doubleBlackCorrector(dbNode);
    console.log(this.head);
    return this.dataOutput;
  }

  doubleBlackCorrector(dbNode) {
    const dir = dbNode.getDirection();
    const dbParent = dbNode.getParentNode();
    const dbSibling =
      dir === "left"
        ? dbNode.getParentNode()?.getRightNode()
        : dbNode.getParentNode()?.getLeftNode();

    // (2) if db is head:
    if (dbNode === this.head) {
      console.log("case 2");

      // set isDB to false and head to black
      this.head.setIsDoubleBlack(false);
      this.head.setColor("black");
      return;
    }

    // (3) If db sibling is black and its children are black:
    if (
      (!dbSibling || dbSibling.getColor() === "black") &&
      (!dbSibling?.getLeftNode() ||
        dbSibling?.getLeftNode()?.getColor() === "black") &&
      (!dbSibling?.getRightNode() ||
        dbSibling?.getRightNode()?.getColor() === "black")
    ) {
      console.log("case 3");

      // if db node is null -> remove | else flip isDB to false
      if (dbNode.value === null) {
        dir === "left"
          ? dbNode.getParentNode().setLeftNode(null)
          : dbNode.getParentNode().setRightNode(null);
      } else {
        dir === "left"
          ? dbNode.getParentNode().getLeftNode().setIsDoubleBlack(false)
          : dbNode.getParentNode().getRightNode().setIsDoubleBlack(false);
      }

      // if db parent is black -> set to db and call again | else set to red
      if (dbNode.getParentNode().getColor() === "black") {
        dbNode.getParentNode().setIsDoubleBlack(true);
        this.removeColorCase3(dbNode, dir);

        return this.doubleBlackCorrector(dbNode.getParentNode());
      } else {
        console.log("hello");
        console.log(this.head);
        return this.removeColorCase3(dbNode, dir);
      }
    }

    // (4) If db sibling is red:
    if (dbSibling?.getColor() === "red") {
      console.log("case 4");

      this.removeColorCase4(dbNode, dir);

      // rotate in direction of db node
      if (dir === "left") this.leftRotation(dbParent);
      if (dir === "right") this.rightRotation(dbParent);

      return this.doubleBlackCorrector(dbNode);
    }

    // If db sibling is black...
    if (dbSibling?.getColor() === "black") {
      // 5a) left side
      if (
        dbSibling?.getColor() === "black" &&
        dir === "left" &&
        dbSibling?.getLeftNode()?.getColor() === "red" &&
        (!dbSibling.getRightNode() ||
          dbSibling.getRightNode().getColor() === "black")
      ) {
        console.log("case 5a");

        this.removeColorCase5(dbSibling, dir);

        this.rightRotation(dbSibling);

        return this.doubleBlackCorrector(dbNode);
      }

      // 5b) right side
      if (
        dbSibling?.getColor() === "black" &&
        dir === "right" &&
        dbSibling?.getRightNode()?.getColor() === "red" &&
        (!dbSibling.getLeftNode() ||
          dbSibling.getLeftNode().getColor() === "black")
      ) {
        console.log("case 5b");

        this.removeColorCase5(dbSibling, dir);

        this.leftRotation(dbSibling);

        return this.doubleBlackCorrector(dbNode);
      }

      // 6a) left side
      if (
        dbSibling?.getColor() === "black" &&
        dir === "left" &&
        dbSibling?.getRightNode()?.getColor() === "red"
      ) {
        console.log("case 6a");

        this.removeColorCase6(dbParent, dir);
        const node = this.leftRotation(dbParent);
        // this.removeColorCase6(node, dir);

        if (node.getLeftNode().getLeftNode().value === null) {
          node.getLeftNode().setLeftNode(undefined);
        } else {
          node?.getLeftNode().getLeftNode().setIsDoubleBlack(false);
        }
      }

      // 6b) right side
      if (
        dbSibling?.getColor() === "black" &&
        dir === "right" &&
        dbSibling?.getLeftNode()?.getColor() === "red"
      ) {
        console.log("case 6b");

        this.removeColorCase6(dbParent, dir);
        const node = this.rightRotation(dbParent);
        // this.removeColorCase6(node, dir);

        if (node.getRightNode().getRightNode().value === null) {
          node.getRightNode().setRightNode(undefined);
        } else {
          node.getRightNode().getRightNode().setIsDoubleBlack(false);
        }
      }
    }
  }

  binarySearchTreeRemoval(node) {
    const direction = node.getDirection();
    let removeNode;

    if (direction === "left") {
      if (!node.getLeftNode() && !node.getRightNode()) {
        removeNode = node;
      } else if (node.getLeftNode() && !node.getRightNode()) {
        this.formatDataOutputReplace(node.value, node.getLeftNode().value);

        node.value = node.getLeftNode().value;
        removeNode = node.getLeftNode();
      } else if (!node.getLeftNode() && node.getRightNode()) {
        this.formatDataOutputReplace(node.value, node.getRightNode().value);

        node.value = node.getRightNode().value;
        removeNode = node.getRightNode();
      } else {
        let maxNode = node.getLeftNode();
        let compareNode = maxNode.getRightNode();

        while (compareNode) {
          if (compareNode.value > maxNode.value) maxNode = compareNode;
          compareNode = compareNode?.getRightNode();
        }

        this.formatDataOutputReplace(node.value, maxNode.value);

        node.value = maxNode.value;
        removeNode = maxNode;
      }
    } else {
      if (!node.getLeftNode() && !node.getRightNode()) {
        removeNode = node;
      } else if (node.getLeftNode() && !node.getRightNode()) {
        this.formatDataOutputReplace(node.value, node.getLeftNode().value);

        node.value = node.getLeftNode().value;
        removeNode = node.getLeftNode();
      } else if (!node.getLeftNode() && node.getRightNode()) {
        this.formatDataOutputReplace(node.value, node.getRightNode().value);

        node.value = node.getRightNode().value;
        removeNode = node.getRightNode();
      } else {
        let maxNode = node.getLeftNode();
        let compareNode = maxNode.getRightNode();

        while (compareNode) {
          if (compareNode.value > maxNode.value) maxNode = compareNode;
          compareNode = compareNode?.getRightNode();
        }

        this.formatDataOutputReplace(node.value, maxNode.value);

        node.value = maxNode.value;
        removeNode = maxNode;
      }
    }

    return removeNode;
  }

  checkColor(node) {
    if (!node?.getParentNode()) return;

    if (node.getColor() === "red" && node.getParentNode().getColor() === "red")
      this.correctTree(node);

    this.checkColor(node.getParentNode());
  }

  correctTree(node) {
    const parent = node.getParentNode();
    const grandParent = parent?.getParentNode();
    const aunt =
      parent?.getDirection() === "left"
        ? grandParent?.getRightNode()
        : grandParent?.getLeftNode();

    if (aunt?.getColor() === "red") {
      // Color flip:
      this.colorFlip(node);
    } else {
      // Rotation:
      if (node.getDirection() === "left" && parent.getDirection() === "left") {
        this.rightRotation(grandParent);
        this.correctColorAfterRotation(node);
        return;
      }

      if (
        node.getDirection() === "right" &&
        parent.getDirection() === "right"
      ) {
        this.leftRotation(grandParent);
        this.correctColorAfterRotation(node);
        return;
      }

      if (parent.getDirection() === "left" && node.getDirection() === "right") {
        this.leftRightRotation(grandParent);
        this.correctColorAfterRotation(node.getRightNode());
        return;
      }

      if (parent.getDirection() === "right" && node.getDirection() === "left") {
        this.rightLeftRotation(grandParent);
        this.correctColorAfterRotation(node.getLeftNode());
        return;
      }
    }
  }

  colorFlip(node) {
    const direction = node.getParentNode().getDirection();
    node.getParentNode().setColor("black");

    direction === "left"
      ? node?.getParentNode().getParentNode().getRightNode().setColor("black")
      : node.getParentNode().getParentNode().getLeftNode().setColor("black");

    if (node.getParentNode().getParentNode() !== this.head)
      node.getParentNode().getParentNode().setColor("red");

    this.formatDataOutputCorrectColor();
  }

  correctColorAfterRotation(node) {
    const direction = node.getDirection();

    node?.getParentNode()?.setColor("black");
    node.setColor("red");
    direction === "left"
      ? node.getParentNode()?.getRightNode()?.setColor("red")
      : node.getParentNode()?.getLeftNode()?.setColor("red");

    this.formatDataOutputCorrectColor();
  }

  removeColorCase3(node, direction) {
    direction === "left"
      ? node?.getParentNode()?.getRightNode()?.setColor("red")
      : node?.getParentNode()?.getLeftNode()?.setColor("red");

    node.getParentNode().setColor("black");

    this.formatDataOutputCorrectColor();
  }

  removeColorCase4(node, direction) {
    direction === "left"
      ? node.getParentNode().getRightNode().setColor("black")
      : node.getParentNode().getLeftNode().setColor("black");

    node.getParentNode().setColor("red");

    this.formatDataOutputCorrectColor();
  }

  removeColorCase5(node, direction) {
    direction === "left"
      ? node.getParentNode().getLeftNode().setColor("red")
      : node.getParentNode().getRightNode().setColor("red");

    direction === "left"
      ? node?.getParentNode()?.getLeftNode()?.getRightNode()?.setColor("black")
      : node?.getParentNode()?.getRightNode()?.getLeftNode()?.setColor("black");

    this.formatDataOutputCorrectColor();
  }

  removeColorCase6(node, direction) {
    if (node === this.head) {
      console.log(direction);
      console.log("hello");
      direction === "left"
        ? node?.getRightNode()?.getRightNode()?.setColor("black")
        : node?.getLeftNode()?.getLeftNode()?.setColor("black");
    } else {
      const parentColor = node.getColor();
      const sibColor =
        direction === "left"
          ? node?.getRightNode()?.getColor()
          : node?.getLeftNode()?.getColor();

      node.setColor(sibColor);
      direction === "left"
        ? node?.getRightNode()?.setColor(parentColor)
        : node?.getLeftNode()?.setColor(parentColor);

      direction === "left"
        ? node?.getRightNode()?.getRightNode()?.setColor("black")
        : node?.getLeftNode()?.getLeftNode()?.setColor("black");
    }
    this.formatDataOutputCorrectColor();
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

  leftRightRotation(node) {
    this.leftRotation(node.getLeftNode());
    this.rightRotation(node);
  }

  rightLeftRotation(node) {
    this.rightRotation(node.getRightNode());
    this.leftRotation(node);
  }

  formatDataOutputInsert(node) {
    const insertObj = {};

    insertObj.value = node.value;
    insertObj.parentValue = node?.getParentNode()?.value;
    insertObj.color = node.getColor();

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

  formatDataOutputCorrectColor(node = this.head) {
    if (node.value === null) return;

    this.dataOutput.correctColor.push({
      value: node.value,
      color: node.getColor(),
    });

    if (node?.getLeftNode())
      this.formatDataOutputCorrectColor(node.getLeftNode());

    if (node?.getRightNode())
      this.formatDataOutputCorrectColor(node.getRightNode());
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

  clearDataOutput() {
    this.dataOutput = {
      insert: {},
      remove: {},
      replace: [],
      rotate: [],
      correctColor: [],
    };
  }

  setHead(node) {
    this.head = node;
  }

  getHead() {
    return this.head;
  }
}
