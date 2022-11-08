import state from "../model/state.js";
import view from "../views/view.js";

import NavigationMenu from "../views/components/navigationMenu.js";
import MediaMenu from "../views/components/mediaMenu.js";
import Canvas from "../views/dataStructureViews/canvas.js";

import queue from "./dataStructures/queue.js";
import queueView from "../views/dataStructureViews/queueView.js";
import stack from "./dataStructures/stack.js";
import stackVeiw from "../views/dataStructureViews/stackView.js";
import stackLinkedList from "./dataStructures/stackLinkedList.js";
import stackLinkedListView from "../views/dataStructureViews/stackLinkedListView.js";
import queueLinkedList from "./dataStructures/queueLinkedList.js";
import queueLinkedListView from "../views/dataStructureViews/queueLinkedListView.js";
import skipList from "./dataStructures/skipList.js";
import SkipListView from "../views/dataStructureViews/skipListView.js";
import binarySearchTree from "./dataStructures/binarySearchTree.js";
import BinarySearchTreeView from "../views/dataStructureViews/binarySearchTreeView.js";
import RedBlackTree from "./dataStructures/redBlackTree.js";
import RedBlackTreeView from "../views/dataStructureViews/redBlackTreeView.js";
import AVLTree from "./dataStructures/AVLTree.js";
import AVLTreeView from "../views/dataStructureViews/AVLTreeView.js";
import SplayTree from "./dataStructures/splayTree.js";
import SplayTreeView from "./../views/dataStructureViews/splayTreeView.js";
import Heap from "./dataStructures/heap.js";
import HeapView from "./../views/dataStructureViews/heapView.js";

const controlInsert = function (value) {
  const currDataStruct = state.dataStructure;
  const currDataStructView = view.currDataStructureView;

  if (!value) return;

  if (!currDataStruct) return;

  currDataStruct.insert(value);
  currDataStructView.insert(currDataStruct.dataOutput);
};

const controlRemove = function (value) {
  const currDataStruct = state.dataStructure;
  const currDataStructView = view.currDataStructureView;

  if (!currDataStruct) return;

  const removeValue = currDataStruct.remove(value);
  currDataStructView.remove(removeValue);

  return removeValue;
};

const controlGetAndSetDataStructure = function () {
  const userInputDataStructure = navMenu.getDataStructure();

  let currDataStruct;
  let currCanvasView;

  mediaMenu.resetStrArr();

  if (userInputDataStructure === "queue linked list") {
    currDataStruct = new queueLinkedList();
    state.setDataStructure(currDataStruct);

    currCanvasView = new queueLinkedListView();
    view.setCurrDataStructureView(currCanvasView);
    mediaMenu.setIsFree(false);
  }

  if (userInputDataStructure === "stack linked list") {
    currDataStruct = new stackLinkedList();
    state.setDataStructure(currDataStruct);

    currCanvasView = new stackLinkedListView();
    view.setCurrDataStructureView(currCanvasView);
    mediaMenu.setIsFree(false);
  }

  if (userInputDataStructure === "stack") {
    currDataStruct = new stack();
    state.setDataStructure(currDataStruct);

    currCanvasView = new stackVeiw();
    view.setCurrDataStructureView(currCanvasView);
    mediaMenu.setIsFree(false);
  }

  if (userInputDataStructure === "queue") {
    currDataStruct = new queue();
    state.setDataStructure(currDataStruct);

    currCanvasView = new queueView();
    view.setCurrDataStructureView(currCanvasView);
    mediaMenu.setIsFree(false);
  }

  if (userInputDataStructure === "skip list") {
    currDataStruct = new skipList();
    state.setDataStructure(currDataStruct);

    currCanvasView = new SkipListView();
    view.setCurrDataStructureView(currCanvasView);
    mediaMenu.setIsFree(true);
  }

  if (userInputDataStructure === "binary search tree") {
    currDataStruct = new binarySearchTree();
    state.setDataStructure(currDataStruct);

    currCanvasView = new BinarySearchTreeView(currDataStruct.getCurrValue());
    view.setCurrDataStructureView(currCanvasView);
    mediaMenu.setIsFree(true);
  }

  if (userInputDataStructure === "red black tree") {
    currDataStruct = new RedBlackTree();
    state.setDataStructure(currDataStruct);

    currCanvasView = new RedBlackTreeView(currDataStruct.dataOutput);
    view.setCurrDataStructureView(currCanvasView);
    mediaMenu.setIsFree(true);
  }

  if (userInputDataStructure === "avl tree") {
    currDataStruct = new AVLTree();
    state.setDataStructure(currDataStruct);

    currCanvasView = new AVLTreeView(currDataStruct.dataOutput);
    view.setCurrDataStructureView(currCanvasView);
    mediaMenu.setIsFree(true);
  }

  if (userInputDataStructure === "splay tree") {
    currDataStruct = new SplayTree();
    state.setDataStructure(currDataStruct);

    currCanvasView = new SplayTreeView(currDataStruct.dataOutput);
    view.setCurrDataStructureView(currCanvasView);
    mediaMenu.setIsFree(true);
  }

  if (userInputDataStructure === "min heap") {
    currDataStruct = new Heap();
    state.setDataStructure(currDataStruct);

    currCanvasView = new HeapView(currDataStruct.dataOutput);
    view.setCurrDataStructureView(currCanvasView);
    mediaMenu.setIsFree(false);
  }

  mediaMenu.preRenderListener(controlInsert);
  mediaMenu.inputListener(controlInsert, controlRemove);
};

// IFFE and Init views:
const canvas = new Canvas();
const mediaMenu = new MediaMenu();
const navMenu = new NavigationMenu(
  controlGetAndSetDataStructure,
  canvas.setScale
);

(function () {
  // navMenu.addHandlerNavigationButton();
  mediaMenu.clickListener();
  mediaMenu.removeBtnListener(controlRemove);
})();
