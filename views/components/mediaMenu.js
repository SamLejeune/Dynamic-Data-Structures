export default class MediaMenu {
  inputEl;
  removeBtnEl;
  stringArr = [];
  isFree = true;

  constructor() {
    this.setInputEl();
    this.setRemoveBtnEl();

    // this.clickListener();
    // this.inputEl.onkeydown = this.cancelLetters();
    // this.inputEl.onkeydown = this.cancelBackspace;
  }

  inputListener(insertHandler, removeHandler) {
    this.inputEl.addEventListener("keyup", (e) => {
      const character = e.key;

      if (this.isFree) {
        if (character !== " " && character !== "Backspace" && isNaN(+character))
          return;

        const inputContent = this.getInputContent();
        const inputArr = this.setInputContentToArr(inputContent);
        const inputArrDupesRemoved = this.removeDuplicates(inputArr);

        this.compare(inputArrDupesRemoved, insertHandler, removeHandler);
      }

      if (!this.isFree) {
        if (character !== " ") return;

        const inputContent = this.getInputContent();
        const inputArr = this.setInputContentToArr(inputContent);
        const inputArrDupesRemoved = this.removeDuplicates(inputArr);
        const i = inputArrDupesRemoved.length - 1;

        this.insertStrArr(i, inputArrDupesRemoved, insertHandler);
      }
    });
  }

  removeBtnListener(removeHandler) {
    this.removeBtnEl.addEventListener("click", (e) => {
      const { value } = removeHandler().remove;

      const inputContent = this.getInputContent();
      const inputArr = this.setInputContentToArr(inputContent);

      // Remove from this.string
      const removeStrArrIndex = this.findIndexOfValInStrArr(value);
      this.removeStrArr(removeStrArrIndex, inputArr);

      // Remove value in input
      const removedInputArr = this.removeInputArr(inputArr, value);
      const removedInputStr = this.setInputContentToStr(removedInputArr);

      this.setInputConent(removedInputStr);
    });
  }

  preRenderListener(insertHandler) {
    const inputContent = this.getInputContent();

    if (inputContent.length === 0) return;

    const inputArr = this.setInputContentToArr(inputContent);
    const inputArrDupesRemoved = this.removeDuplicates(inputArr);

    inputArrDupesRemoved.forEach((num, i) =>
      this.insertStrArr(i, inputArrDupesRemoved, insertHandler)
    );
  }

  clickListener() {
    this.inputEl.addEventListener("click", (e) => {
      const end = this.inputEl.value.length;

      if (this.isFree === true) return;

      this.inputEl.setSelectionRange(end, end);
      this.inputEl.focus();
    });
  }

  compare(inputArr, insertHandler, removeHandler) {
    if (inputArr[0] === "") {
      const removeArr = this.stringArr;
      removeArr.forEach((num) => removeHandler(+num));

      this.stringArr = [];
      return;
    }

    if (this.getLength() > 0)
      for (let i = 0; i < this.getLength(); i++) {
        const num = this.stringArr[i];
        const inputNum = inputArr[i];

        if (num === inputNum) continue;

        if (this.getLength() === inputArr.length && num !== inputNum)
          this.replaceStrArr(i, inputArr, insertHandler, removeHandler);

        if (this.getLength() > inputArr.length && num !== inputNum)
          this.removeStrArr(i, inputArr, insertHandler, removeHandler);

        if (this.getLength() < inputArr.length && num !== inputNum)
          this.insertStrArr(i, inputArr, insertHandler);
      }

    if (this.getLength() === inputArr.length) return;

    const lastInput = inputArr[inputArr.length - 1];

    if (this.checkDuplicates(+lastInput) === false && +lastInput) {
      insertHandler(+lastInput);
      this.stringArr.push(lastInput);
    }
  }

  insertStrArr(i, inputArr, insertHandler) {
    const inputNum = inputArr[i];

    if (this.checkDuplicates(+inputNum) === false) {
      this.stringArr.splice(i, 0, inputNum);
      insertHandler(+inputNum);
    }
  }

  removeStrArr(i, inputArr, insertHandler, removeHandler) {
    let spliceAdd = isNaN(+inputArr[i]) ? 0 : 1;

    const difference =
      Math.abs(this.getLength() - inputArr.length) === 0
        ? 1
        : Math.abs(this.getLength() - inputArr.length);

    //  + spliceAdd
    const removeArr = this.stringArr.splice(i, difference);

    if (removeHandler) removeArr.forEach((num) => removeHandler(+num));

    if (insertHandler && !isNaN(+inputArr[i]))
      this.insertStrArr(i, inputArr, insertHandler);
  }

  replaceStrArr(i, inputArr, insertHandler, removeHandler) {
    const num = this.stringArr[i];
    const inputNum = inputArr[i];

    removeHandler(+num);

    if (this.checkDuplicates(+inputNum) === false) {
      this.stringArr[i] = inputNum;
      insertHandler(+inputNum);
      return;
    } else {
      this.stringArr.splice(i, 1);
      return;
    }
  }

  findIndexOfValInStrArr(value) {
    return this.stringArr.findIndex((num) => +num === value);
  }

  removeInputArr(inputArr, removeValue) {
    let updatedInputArr = [];

    for (let i = 0; i < inputArr.length; i++) {
      const num = inputArr[i];
      if (+num !== removeValue) updatedInputArr.push(num);
    }

    return updatedInputArr;
  }

  checkDuplicates(inputNum) {
    const isDuplicate = this.stringArr.find((num) => +num === +inputNum);

    return !isDuplicate ? false : true;
  }

  removeDuplicates(arr) {
    const hashMap = new Map();

    let i = 0;
    while (i < arr.length) {
      const num = arr[i];

      if (hashMap.get(num) === undefined) {
        hashMap.set(num, i);
        i++;
        continue;
      }

      arr.splice(i, 1);
    }
    return arr;
  }

  cancelLetters(e) {
    const character = e.key;

    if (isNaN(+character) && character !== "Backspace") e.preventDefault();
  }

  cancelBackspace(e) {
    const character = e.key;

    if (character === "Backspace") e.preventDefault();
  }

  setInputEl() {
    this.inputEl = document.querySelector(".media-input");
  }

  setRemoveBtnEl() {
    this.removeBtnEl = document.querySelector(".remove");
  }

  setIsFree(bool) {
    this.isFree = bool;

    this.setKeyDown();
    this.toggleShrinkInput();
  }

  setKeyDown() {
    if (this.isFree === false) {
      this.inputEl.onkeydown = this.cancelBackspace;
    } else {
      this.inputEl.onkeydown = null;
    }
  }

  toggleShrinkInput() {
    if (this.isFree === true) {
      this.inputEl.classList.remove("media-input-shrink");
      this.removeBtnEl.classList.add("hidden");
    }

    if (this.isFree === false) {
      this.inputEl.classList.add("media-input-shrink");
      this.removeBtnEl.classList.remove("hidden");
    }
  }

  setInputContentToArr(inputContent) {
    return inputContent.split(" ");
  }

  setInputContentToStr(inputArr) {
    return inputArr.join(" ");
  }

  getLength() {
    return this.stringArr.length;
  }

  resetStrArr() {
    this.stringArr = [];
  }

  setInputConent(inputStr) {
    this.inputEl.value = inputStr;
  }

  getInputContent() {
    return this.inputEl.value.replace(/\s+/g, " ").trim();
  }
}
