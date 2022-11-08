import DataStructureUtils from "./dataStructureUtils.js";

class Node extends DataStructureUtils {
  value;
  layer;
  prevNode;
  nextNode;
  upNode;
  downNode;

  constructor(value, i = 0, prevNode = undefined, nextNode = undefined) {
    super();
    this.value = value;
    this.setPrevNode(prevNode);
    this.setNextNode(nextNode);
    this.setLayer(i);
  }

  setPrevNode(prevNode) {
    this.prevNode = prevNode;
  }

  setNextNode(nextNode) {
    this.nextNode = nextNode;
  }

  setUpNode(upNode) {
    this.upNode = upNode;
  }

  setDownNode(downNode) {
    this.downNode = downNode;
  }

  setLayer(i) {
    this.layer = i;
  }

  getNextNode() {
    return this.nextNode;
  }

  getPrevNode() {
    return this.prevNode;
  }

  getUpNode() {
    return this.upNode;
  }

  getDownNode() {
    return this.downNode;
  }

  getValue() {
    return this.value;
  }
}

export default class SkipList extends Node {
  headLayer0;
  headLayer1;
  headLayer2;
  headLayer3;
  layers = 4;
  lastSeenNode = {
    nodeLayer3: undefined,
    nodeLayer2: undefined,
    nodeLayer1: undefined,
  };
  dataOutput = {};
  currNumLayers = 0;
  maxRandomValue = 30;

  constructor() {
    super();
  }

  insert(value) {
    let initNewNode;

    if (!this.getHeadLayer0()) {
      initNewNode = new Node(value, 0);
      this.setHeadLayer0(initNewNode);
      this.buildLayer(initNewNode);
      this.setDataOutput(initNewNode);

      return this.dataOutput;
    }

    let currNode = this.traverseSkipList(value);

    while (true) {
      if (currNode && value === currNode.value) {
        if (currNode.getPrevNode()) {
          initNewNode = new Node(value, 0, currNode.getPrevNode(), currNode);

          this.setCurrValue(initNewNode);
          currNode.getPrevNode().setNextNode(initNewNode);
          currNode.setPrevNode(initNewNode);
        } else {
          initNewNode = new Node(value, 0, currNode, currNode.getNextNode());

          this.setCurrValue(initNewNode);
          currNode?.getNextNode()?.setPrevNode(initNewNode);
          currNode.setNextNode(initNewNode);
        }

        break;
      }

      if (currNode && value < currNode.value) {
        if (!currNode.getPrevNode()) {
          initNewNode = new Node(value, 0, undefined, currNode);
          currNode.setPrevNode(initNewNode);

          this.setCurrValue(initNewNode);
          this.setHeadLayer0(initNewNode);
          this.buildLayer(initNewNode);
          break;
        }

        if (currNode.getPrevNode()) {
          if (value >= currNode.getPrevNode().value) {
            initNewNode = new Node(value, 0, currNode.getPrevNode(), currNode);

            currNode.getPrevNode().setNextNode(initNewNode);
            currNode.setPrevNode(initNewNode);

            this.setCurrValue(initNewNode);
            this.buildLayer(initNewNode);
            break;
          }

          if (value < currNode.getPrevNode().value) {
            currNode = currNode.getPrevNode();
            continue;
          }
        }
      }

      if (currNode && value > currNode.value) {
        if (!currNode.getNextNode()) {
          initNewNode = new Node(value, 0, currNode, undefined);
          currNode.setNextNode(initNewNode);

          this.setCurrValue(initNewNode);
          this.buildLayer(initNewNode);
          break;
        }

        if (currNode.getNextNode()) {
          if (value <= currNode.getNextNode().value) {
            initNewNode = new Node(value, 0, currNode, currNode.getNextNode());

            currNode.getNextNode().setPrevNode(initNewNode);
            currNode.setNextNode(initNewNode);

            this.setCurrValue(initNewNode);
            this.buildLayer(initNewNode);
            break;
          }

          if (value > currNode.getNextNode().value) {
            currNode = currNode.getNextNode();
            continue;
          }
        }
      }
    }

    this.setDataOutput(initNewNode);
    return this.dataOutput;
  }

  remove(value) {
    let currNode = this.traverseSkipList(value);
    let rootNode;

    while (true) {
      if (value === currNode.value) {
        rootNode = currNode;

        let layer = 0;
        while (currNode) {
          currNode?.getPrevNode()?.setNextNode(currNode.getNextNode());
          currNode?.getNextNode()?.setPrevNode(currNode.getPrevNode());

          if (currNode === this.getHeadLayerGeneric(layer))
            this[`headLayer${layer}`] = currNode.getNextNode();

          currNode = currNode.getUpNode();
          layer++;
        }
        break;
      }

      if (value !== currNode.value) {
        if (value < currNode.value) {
          if (value > currNode.getPrevNode().value || !currNode.getPrevNode())
            break;

          currNode = currNode.getPrevNode();
          continue;
        }

        if (value > currNode.value) {
          if (value < currNode.getNextNode().value || !currNode.getNextNode())
            break;

          currNode = currNode.getNextNode();
          continue;
        }
      }
    }
    this.setDataOutput(rootNode);
    return this.dataOutput;
  }

  // Traversing along layer 1 - 3 to find node on bottom linked list to begin with:
  traverseSkipList(value) {
    let currNode = this.getHeadLayer3();
    let currLayer = 3;

    while (true) {
      if (currLayer === 0) break;

      if (currNode && value < currNode.value) {
        if (!currNode.getPrevNode() && currLayer > 0) {
          this.setLastSeenNode(currLayer, currNode);
          currNode = currNode.getDownNode();
          currLayer--;
          continue;
        }

        if (currNode.getPrevNode() && currLayer > 0) {
          if (value < currNode.getPrevNode().value) {
            currNode = currNode.getPrevNode();
            continue;
          }

          if (value >= currNode.getPrevNode().value) {
            this.setLastSeenNode(currLayer, currNode);
            currNode = currNode.getDownNode();
            currLayer--;
            continue;
          }
        }
      }

      if (currNode && value > currNode.value) {
        if (!currNode.getNextNode() && currLayer > 0) {
          this.setLastSeenNode(currLayer, currNode);
          currNode = currNode.getDownNode();
          currLayer--;
          continue;
        }

        if (currNode.getNextNode() && currLayer > 0) {
          if (value > currNode.getNextNode().value) {
            currNode = currNode.getNextNode();
            continue;
          }

          if (value <= currNode.getNextNode().value) {
            this.setLastSeenNode(currLayer, currNode);
            currNode = currNode.getDownNode();
            currLayer--;
            continue;
          }
        }
      }

      if (currNode && value === currNode.value) {
        this.setLastSeenNode(currLayer, currNode);
        currNode = currNode.getDownNode();
        currLayer--;
        continue;
      }

      if (!currNode) {
        currLayer--;
        currNode = this.getHeadLayerGeneric(currLayer);
      }
    }

    return currNode;
  }

  buildLayer(node) {
    this.resetCurrNumLayers();
    let currNode = node;
    let currLayer = 1;
    let lastSeenNode = this.getLastSeenNode(currLayer);
    let coinFlip = this.flipCoin();

    while (coinFlip > 0 && currLayer < 4) {
      const initNewNode = new Node(currNode.value, currLayer);

      if (!lastSeenNode) {
        this[`headLayer${currLayer}`] = initNewNode;
        this[`headLayer${currLayer}`].setDownNode(currNode);
        currNode.setUpNode(initNewNode);
      }

      if (lastSeenNode) {
        if (initNewNode.value <= lastSeenNode.value) {
          initNewNode.setNextNode(lastSeenNode);
          initNewNode.setPrevNode(lastSeenNode?.getPrevNode());
          initNewNode.setDownNode(currNode);
          currNode.setUpNode(initNewNode);

          lastSeenNode?.getPrevNode()?.setNextNode(initNewNode);
          lastSeenNode.setPrevNode(initNewNode);

          if (lastSeenNode === this.getHeadLayerGeneric(currLayer))
            this[`headLayer${currLayer}`] = initNewNode;
        }

        if (initNewNode.value > lastSeenNode.value) {
          initNewNode.setNextNode(lastSeenNode?.getNextNode());
          initNewNode.setPrevNode(lastSeenNode);
          initNewNode.setDownNode(currNode);
          currNode.setUpNode(initNewNode);

          lastSeenNode?.getNextNode()?.setPrevNode(initNewNode);
          lastSeenNode.setNextNode(initNewNode);
        }
      }

      currNode = initNewNode;
      currLayer++;
      lastSeenNode = this.getLastSeenNode(currLayer);
      coinFlip = this.flipCoin();
      this.incrementCurrNumLayers();
    }
  }

  flipCoin() {
    // returns 0 or 1
    return Math.floor(Math.random() * 2);
  }

  incrementCurrNumLayers() {
    this.currNumLayers += 1;
  }

  resetCurrNumLayers() {
    this.currNumLayers = 0;
  }

  getCurrNumLayers() {
    return this.currNumLayers;
  }

  setCurrValue(randomValue) {
    this.currValue = randomValue;
  }

  setHeadLayer0(node) {
    this.headLayer0 = node;
  }

  getHeadLayer0() {
    return this.headLayer0;
  }

  getHeadLayer1() {
    return this.headLayer1;
  }

  getHeadLayer2() {
    return this.headLayer2;
  }

  getHeadLayer3() {
    return this.headLayer3;
  }

  getHeadLayerGeneric(layer) {
    return this?.[`headLayer${layer}`];
  }

  setLastSeenNode(layer, node) {
    this.lastSeenNode[`nodeLayer${layer}`] = node;
  }

  getLastSeenNode(layer) {
    return this.lastSeenNode?.[`nodeLayer${layer}`];
  }

  setDataOutput(node) {
    this.dataOutput = node;
  }
}
