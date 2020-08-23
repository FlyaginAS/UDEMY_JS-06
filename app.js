//BUDGET CONTROLLER
const budgetController = (function () {
  const Expence = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  const Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  const data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
  };

  return {
    addItem: function (type, des, val) {
      let newItem;
      let ID = 0;
      //create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id;
      } else {
        ID = 0;
      }

      //create new Item based on 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expence(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }
      //push it into our data structure
      data.allItems[type].push(newItem);
      return newItem;
    },
    testing: function () {
      console.log(data);
    },
  };
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
    let input;
    let newItem;
    //1) get the field input data
    input = UICtrl.getInput();
    //2) add the item to the budget conroller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
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
