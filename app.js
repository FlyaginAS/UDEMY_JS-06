//BUDGET CONTROLLER****************************************************
const budgetController = (function () {
  const Expence = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };
  Expence.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };
  Expence.prototype.getPercentage = function () {
    return this.percentage;
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
    budget: 0,
    percentage: -1,
  };
  const calculateTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach(function (current) {
      sum += +current.value;
    });
    data.totals[type] = sum;
  };

  return {
    addItem: function (type, des, val) {
      let newItem;
      let ID;

      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // Create new item based on 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expence(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }

      // Push it into our data structure
      data.allItems[type].push(newItem);

      // Return the new element
      return newItem;
    },
    deleteItem: function (type, id) {
      const ids = data.allItems[type].map(function (current) {
        return current.id;
      });
      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },
    testing: function () {
      console.log(data);
    },
    calculateBudget: function () {
      //calculate total incme and expenses
      calculateTotal('exp');
      calculateTotal('inc');
      //calc budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;
      //calc % of income
      if (data.totals > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },
    calculatePercentages: function () {
      data.allItems.exp.forEach(function (current) {
        current.calcPercentage(data.totals.inc);
      });
    },
    getPercentages: function () {
      const allPerc = data.allItems.exp.map(function (cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },
  };
})();

//UI CONTROLLER****************************************************************
const UIController = (function () {
  //Some code
  const DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month',
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
    addListItem: function (obj, type) {
      //create html string with placeholder text
      let html;
      let newHtml;
      let element;
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;

        html = `<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>`;
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;

        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      //repalace placeholder actual data
      newHtml = html
        .replace('%id%', obj.id)
        .replace('%description%', obj.description)
        .replace('%value%', obj.value);
      //inset hmtl into DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
    deleteListItem: function (selectorID) {
      const el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },
    clearFields: function () {
      let fields;

      fields = document.querySelectorAll(
        `${DOMstrings.inputDescription}, ${DOMstrings.inputValue}`
      );
      fieldsArr = Array.prototype.slice.call(fields); //call
      fieldsArr.forEach(function (current, index, array) {
        current.value = '';
      });
      fieldsArr[0].focus();
    },
    displayBudget: function (obj) {
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
      document.querySelector(DOMstrings.expensesLabel).textContent =
        obj.totalExp;

      if (obj.percentage > 0) {
        document.querySelector(
          DOMstrings.percentageLabel
        ).textContent = `${obj.percentage}%`;
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = '---';
      }
    },
  };
})();

//GLOBAL APP CONTROLLER**********************************************************
const controller = (function (budgetCtrl, UICtrl) {
  const setupEventListeners = function () {
    const DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.container)
      .addEventListener('click', ctrlDeleteItem);
  };

  const updateBudget = function () {
    //1)calculate the budget
    budgetCtrl.calculateBudget();
    //2) return the budget
    const budget = budgetCtrl.getBudget();
    //3) display the budget
    UICtrl.displayBudget(budget);
  };
  const updatePercentages = function () {
    //1) calculate percentages
    budgetCtrl.calculatePercentages();
    //2)read percentages from the budget contorller
    const percentages = budgetCtrl.getPercentages();
    //3)update the UI
    console.log(percentages);
  };
  const ctrlAddItem = function () {
    let input;
    let newItem;
    //1) get the field input data
    input = UICtrl.getInput();
    //2) add the item to the budget conroller
    if (!input.description || !input.value) {
      return;
    }
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);
    //3)add the item to the UI
    UICtrl.addListItem(newItem, input.type);
    //4)clear fields
    UICtrl.clearFields();
    //5) calculate and update the budget
    updateBudget();
    //6)update percentages
    updatePercentages();
  };

  let ctrlDeleteItem = function (event) {
    let itemID;
    let splitID;
    let type;
    let ID;
    itemID = event.target.closest('.item').id;
    if (itemID) {
      //inc-1
      splitID = itemID.split('-');
      type = splitID[0];
      ID = +splitID[1];
      //1)delete the item form the data structure
      budgetCtrl.deleteItem(type, ID);
      //2)delete the item from the UI
      UICtrl.deleteListItem(itemID);
      //3)update and show the new budget
      updateBudget();
      //4)calculate and update percentages
      updatePercentages();
    }
  };

  return {
    init: function () {
      console.log('app has started');
      setupEventListeners();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: 0,
      });
    },
  };
})(budgetController, UIController);

controller.init();
