//BUDGET CONTROLLER
const budgetController = (function () {
  //some code
})();

//UI CONTROLLER
const UIController = (function () {
  //Some code
  const DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, //inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: document.querySelector(DOMstrings.inputValue).value,
      };
    },
    getDOMstrings: function () {
      return DOMstrings;
    },
  };
})();

//GLOBAL APP CONTROLLER
const controller = (function (budgetCtrl, UICtrl) {
  const setupEventListeners = function () {
    const DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        ctrlAddItem();
      }
    });
  };

  const ctrlAddItem = function () {
    //1) get the field input data
    const input = UIController.getInput();
    //2) add the item to the budget conroller
    //3)add the item to the UI
    //4) calculate the budget
    //5) display the budget on the UI
  };
  return {
    init: function () {
      console.log('app has started');
      setupEventListeners();
    },
  };
})(budgetController, UIController);

controller.init();
