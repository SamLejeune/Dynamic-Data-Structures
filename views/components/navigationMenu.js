export default class NavigationMenu {
  navMenu = document.querySelector(".navigation-menu");
  scaleBtn = document.querySelector(".scale-container");
  currScale = 1;
  dataStructure;

  constructor(handlerDataStruct, handlerSetScale) {
    this.addHanlderDropdownMenu(handlerDataStruct);
    this.addHandlerScaleButton(handlerSetScale);
  }

  // addHandlerNavigationButton() {
  //   document.addEventListener("click", (e) => {
  //     const dropDownEl = e.target.closest(".navigation-button");

  //     if (!dropDownEl) return;
  //   });
  // }

  addHanlderDropdownMenu(handler) {
    this.navMenu.addEventListener("click", (e) => {
      const optionEl = e.target.closest(".select-button");

      if (!optionEl) return;

      this.hideAllDropdownMenuBtn();
      this.setDropdownMenuBtnActive(optionEl);
      this.setDataStrucutre(optionEl.textContent);

      handler();
    });
  }

  addHandlerScaleButton(handler) {
    this.scaleBtn.addEventListener("click", (e) => {
      const scaleBtn = e.target.closest(".scale-button");
      const scaleType = scaleBtn.classList[1];

      handler(scaleType, this.currScale);

      this.setCurrScale(scaleType);
    });
  }

  hideAllDropdownMenuBtn() {
    const [...dropdownMenuElArr] = document.querySelectorAll(".select-button");

    dropdownMenuElArr.forEach((el) =>
      el.classList.remove("select-button-active")
    );
  }

  setDropdownMenuBtnActive(el) {
    el.classList.add("select-button-active");
  }

  setCurrScale(type) {
    if (type === "minus" && this.currScale > 0.5) this.currScale -= 0.05;

    if (type === "plus" && this.currScale < 1) this.currScale += 0.05;
  }

  setDataStrucutre(dataStructureName) {
    this.dataStructure = dataStructureName.toLowerCase();
  }

  getDataStructure() {
    return this.dataStructure;
  }
}
