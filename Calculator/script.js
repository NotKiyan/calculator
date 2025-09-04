  let currentMode = 'calculator';
    
    const calcToggle = document.getElementById('calc-toggle');
    const stringToggle = document.getElementById('string-toggle');
    const calculatorSection = document.getElementById('calculator-section');
    const stringToolsSection = document.getElementById('string-tools-section');
    const legend = document.querySelector('.legend');

    function switchMode(mode) {
      if (mode === 'calculator') {
        calcToggle.classList.add('active');
        stringToggle.classList.remove('active');
        calculatorSection.style.display = 'flex';
        stringToolsSection.classList.remove('active');
        legend.style.display = 'block';
        currentMode = 'calculator';
      } else {
        stringToggle.classList.add('active');
        calcToggle.classList.remove('active');
        calculatorSection.style.display = 'none';
        stringToolsSection.classList.add('active');
        legend.style.display = 'none';
        currentMode = 'string';
      }
    }

    calcToggle.addEventListener('click', () => switchMode('calculator'));
    stringToggle.addEventListener('click', () => switchMode('string'));

    // String Tools functionality
    const firstStringInput = document.getElementById('first-string');
    const secondStringInput = document.getElementById('second-string');
    const separatorInput = document.getElementById('separator');
    const resultTextarea = document.getElementById('result');
    const concatenateBtn = document.getElementById('concatenate-btn');
    const clearStringsBtn = document.getElementById('clear-strings-btn');
    const separatorButtons = document.querySelectorAll('.separator-btn');

    function concatenateStrings() {
      const firstString = firstStringInput.value;
      const secondString = secondStringInput.value;
      const separator = separatorInput.value;
      
      if (firstString || secondString) {
        const result = firstString + separator + secondString;
        resultTextarea.value = result;
      } else {
        resultTextarea.value = '';
      }
    }

    function clearAllStrings() {
      firstStringInput.value = '';
      secondStringInput.value = '';
      separatorInput.value = '';
      resultTextarea.value = '';
    }

    concatenateBtn.addEventListener('click', concatenateStrings);
    clearStringsBtn.addEventListener('click', clearAllStrings);

    // Quick separator buttons
    separatorButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const separator = btn.getAttribute('data-separator');
        separatorInput.value = separator;
      });
    });

    // Auto-concatenate on input change
    [firstStringInput, secondStringInput, separatorInput].forEach(input => {
      input.addEventListener('input', concatenateStrings);
    });

    // Calculator JavaScript (your original code with scientific functions)
    let numX = null;
    let numY = null;
    let operator = null;
    let disabledButtons = [];
    const validOperators = ["add", "subtract", "multiply", "divide"];
    const validFunctions = ["clear", "pos-neg", "percent", "operate", "backspace", "sin", "cos", "tan", "pi", "sqrt", "square", "cube", "log"];

    const calcDisplay = document.querySelector("#calc-num");
    const calcSavedNum = document.querySelector("#calc-num-saved");
    const calcOperator = document.querySelector("#calc-operator");
    const prevCalcDisplay = document.querySelector("#prev-calc");
    const buttonContainer = document.querySelector(".calc-buttons");
    const buttons = buttonContainer.querySelectorAll("button");
    
    for (const btn of buttons) {
      btn.addEventListener("click", () => useButton(btn));
    }

    const operations = {
      add: function getSum(x, y) {
        return x + y;
      },
      subtract: function getDifference(x, y) {
        return x - y;
      },
      multiply: function getProduct(x, y) {
        return x * y;
      },
      divide: function getQuotient(x, y) {
        return x / y;
      },
    };

    const operationSigns = new Map([
      ["add", "+"],
      ["subtract", "-"],
      ["multiply", "*"],
      ["divide", "/"],
    ]);

    const scientificFunctions = {
      sin: function(x) {
        return Math.sin(x);
      },
      cos: function(x) {
        return Math.cos(x);
      },
      tan: function(x) {
        return Math.tan(x);
      },
      sqrt: function(x) {
        if (x < 0) throw new Error("Cannot calculate square root of negative number");
        return Math.sqrt(x);
      },
      square: function(x) {
        return x * x;
      },
      cube: function(x) {
        return x * x * x;
      },
      log: function(x) {
        if (x <= 0) throw new Error("Cannot calculate logarithm of non-positive number");
        return Math.log10(x);
      }
    };

    function operate(x, y, op) {
      let operation = operations[op];
      return operation(x, y);
    }

    function useButton(btn) {
      let id;
      btn.id ? (id = btn.id) : (id = null);
      let value;
      
      if (id === null || id === "decimal") {
        if (id === "decimal") {
          btn.disabled = true;
          disabledButtons.push(btn);
        }
        value = btn.textContent;
        
        calcDisplay.textContent === "0"
          ? (calcDisplay.textContent = value)
          : (calcDisplay.textContent += value);
        return;
      }

      if (validFunctions.includes(id)) {
        switch (id) {
          case "clear":
            clearCalc();
            break;
          case "operate":
            getNum();
            break;
          case "pos-neg":
            updateValue(id);
            break;
          case "percent":
            updateValue(id);
            break;
          case "backspace":
            let str = calcDisplay.textContent;
            str = str.slice(0, -1);
            if (!str.includes(".")) {
              enableButtons(disabledButtons);
            }
            str.length === 0
              ? (calcDisplay.textContent = "0")
              : (calcDisplay.textContent = str);
            break;
          case "pi":
            calcDisplay.textContent = Math.PI.toString();
            enableButtons(disabledButtons);
            break;
          case "sin":
          case "cos":
          case "tan":
          case "sqrt":
          case "square":
          case "cube":
          case "log":
            applyScientificFunction(id);
            break;
        }
      }
      
      if (validOperators.includes(id)) {
        getNum();
        operator = id;
        calcOperator.textContent = operationSigns.get(operator);
      }
    }

    function applyScientificFunction(funcName) {
      try {
        let currentValue = parseFloat(calcDisplay.textContent);
        let result = scientificFunctions[funcName](currentValue);
        
        let functionSymbol = getFunctionSymbol(funcName);
        prevCalcDisplay.textContent = `${functionSymbol}(${currentValue}) = `;
        
        calcDisplay.textContent = parseFloat(result.toFixed(8));
        enableButtons(disabledButtons);
        
      } catch (error) {
        clearCalc();
        calcDisplay.textContent = "Math Error";
        
        for (const btn of buttons) {
          btn.classList.add("flicker");
          setTimeout(() => {
            btn.classList.remove("flicker");
          }, 3000);
        }
        
        setTimeout(() => {
          clearCalc();
        }, 3000);
      }
    }

    function getFunctionSymbol(funcName) {
      const symbols = {
        sin: "sin",
        cos: "cos", 
        tan: "tan",
        sqrt: "√",
        square: "x²",
        cube: "x³",
        log: "log"
      };
      return symbols[funcName] || funcName;
    }

    function clearCalc() {
      calcDisplay.textContent = "0";
      calcSavedNum.textContent = "";
      prevCalcDisplay.textContent = "";
      calcOperator.textContent = "";
      numX = null;
      numY = null;
      operator = null;
      enableButtons(disabledButtons);
    }

    function getNum() {
      if (numX === null) {
        numX = Number(calcDisplay.textContent);
        calcSavedNum.textContent = numX;
        calcDisplay.textContent = "";
        enableButtons(disabledButtons);
        return;
      }

      if (calcDisplay.textContent !== "" && operator && numX != null) {
        numY = Number(calcDisplay.textContent);
        if (operator === "divide" && numY === 0) {
          clearCalc();
          calcDisplay.textContent = "can't divide by zero doofus";

          for (const btn of buttons) {
            btn.classList.add("flicker");
            setTimeout(() => {
              btn.classList.remove("flicker");
            }, 6000);
          }
          enableButtons(disabledButtons);
          setTimeout(() => {
            clearCalc();
          }, 6000);
          return;
        }
        
        let total = operate(numX, numY, operator);
        prevCalcDisplay.textContent = `${numX} ${operationSigns.get(operator)} ${numY} = `;

        numX = parseFloat(total.toFixed(8));
        calcSavedNum.textContent = numX;
        calcDisplay.textContent = "0";
        operator = null;
        numY = null;
      }
      calcOperator.textContent = "";
      enableButtons(disabledButtons);
    }

    function updateValue(id) {
      let origValue = Number(calcDisplay.textContent);
      let newValue = null;
      if (id === "pos-neg") {
        newValue = origValue * -1;
        calcDisplay.textContent = newValue;
      }
      if (id === "percent") {
        newValue = origValue / 100;
        calcDisplay.textContent = newValue;
      }
    }

    function enableButtons(arr) {
      for (const btn of arr) {
        btn.disabled = false;
      }
    }

    document.addEventListener("keydown", (e) => {
      if (currentMode !== 'calculator') return;
      
      const key = e.key;
      const code = e.code;
      const str = calcDisplay.textContent;
      const value = key.valueOf();

      if (value >= 0 || value <= 9) {
        calcDisplay.textContent === "0"
          ? (calcDisplay.textContent = value)
          : (calcDisplay.textContent += value);
        return;
      }

      const keyToOperation = {
        "+": "add",
        "-": "subtract",
        "*": "multiply",
        "/": "divide",
        Enter: "operate",
        "=": "operate",
        Backspace: "backspace",
        Escape: "clear",
        ".": "decimal",
        "%": "percent",
      };

      if (str.includes(".")) {
        if (code === "NumpadDecimal" || code === "Period") {
          return false;
        }
      }

      if (keyToOperation[key]) {
        const btn = document.querySelector(`#${keyToOperation[key]}`);
        if (btn) useButton(btn);
      }
    });