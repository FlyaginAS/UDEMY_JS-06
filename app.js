//BUDGET CONTROLLER
const budgetController = (function () {
  //some code
})();

//UI CONTROLLER
const UIController = (function () {
  //Some code
})();

//GLOBAL APP CONTROLLER
const controller = (function (budgetCtrl, UICtrl) {
  const ctrlAddItem = function () {
    //1) get the field input data
    //2) add the item to the budget conroller
    //3)add the item to the UI
    //4) calculate the budget
    //5) display the budget on the UI
    console.log('it works');
  };
  //some code
  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

  document.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      ctrlAddItem();
    }
  });
})(budgetController, UIController);
