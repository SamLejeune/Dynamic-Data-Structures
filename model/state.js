class State {
  dataStructure;

  setDataStructure(dataStructureClassObj) {
    this.dataStructure = dataStructureClassObj;
  }

  setDataStructureType(dataStructureName) {
    this.dataStructureType = dataStructureName;
  }

  getDataStructure() {
    return this.dataStructure;
  }
}

export default new State();
