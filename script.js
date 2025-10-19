class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.memory = 0;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.isResult = false;
        this.updateDisplay();
    }

    delete() {
        if (this.isResult) {
            this.clear();
            return;
        }
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.isResult) {
            this.currentOperand = '';
            this.previousOperand = ''; // <-- THIS IS THE FIX
            this.isResult = false;
        }
        this.currentOperand += number;
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.isResult) {
            this.previousOperand = ''; // <-- THIS IS THE FIX
            this.isResult = false;
        }

        if (this.currentOperand === '' && operation === '-') {
            this.currentOperand = '-';
            this.updateDisplay();
            return;
        }

        if (this.currentOperand === '' || this.currentOperand === '-') return;

        const lastChar = this.currentOperand.slice(-1);
        if (['+', '×', '÷', '-'].includes(lastChar)) {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }

        this.currentOperand += operation;
        this.updateDisplay();
    }

    evaluate() {
        // First, handle standard operator replacement
        let expression = this.currentOperand.replace(/×/g, '*').replace(/÷/g, '/');
        
        // This line finds any number followed by '%' and replaces it with its decimal equivalent
        let safeExpression = expression.replace(/(\d+\.?\d*)%/g, '($1/100)');
        
        try {
            let result = new Function('return ' + safeExpression)();
            if (!isFinite(result)) throw new Error("Division by zero");

            // === THIS IS THE FIX ===
            // This line rounds the result to 12 significant digits.
            // It is the standard and correct way to eliminate the tiny,
            // bizarre floating-point errors you are seeing.
            result = parseFloat(result.toPrecision(12));

            return result;
        } catch (error) {
            if (error.message === "Division by zero") throw error;
            throw new Error("Invalid Expression");
        }
    }

    compute() {
        if (this.currentOperand === '') return;
        try {
            const result = this.evaluate();
            this.previousOperand = `${this.currentOperand} =`;
            this.currentOperand = result.toString();
            this.isResult = true;
            this.updateDisplay();
        } catch (error) {
            this.handleError(error);
        }
    }

    handleSpecialOperation(type) {
        if (this.currentOperand === '') return;
        try {
            const result = this.evaluate();
            let newResult;

            switch (type) {
                case 'sqrt':
                    if (result < 0) throw new Error("Invalid input for √");
                    this.previousOperand = `√( ${this.currentOperand} )`;
                    newResult = Math.sqrt(result);
                    break;
                // 'percent' case is now removed
                case 'toggleSign':
                    this.previousOperand = `negate( ${this.currentOperand} )`;
                    newResult = result * -1;
                    break;
            }
            this.currentOperand = newResult.toString();
            this.isResult = true;
            this.updateDisplay();
        } catch (error) {
            this.handleError(error);
        }
    }

    handleError(error) {
        this.previousOperand = "Error";
        if (error.message === "Division by zero") {
            this.currentOperand = "Cannot divide by 0";
        } else if (error.message === "Invalid input for √") {
            this.currentOperand = "Invalid input for √";
        } else {
            this.currentOperand = "Invalid Expression";
        }
        this.isResult = true;
        this.updateDisplay(true);
    }

    memoryClear() {
        this.memory = 0;
    }

    memoryRecall() {
        // This function now correctly replaces the current operand and sets the
        // isResult flag to true. This tells the calculator that the next
        // number press should clear the display and start a new number.
        this.currentOperand = this.memory.toString();
        this.isResult = true;
        this.updateDisplay();
    }

    memoryAdd() {
        try { this.memory += this.evaluate(); } 
        catch (e) { this.handleError(e); }
    }

    memorySubtract() {
        try { this.memory -= this.evaluate(); }
        catch (e) { this.handleError(e); }
    }

    updateDisplay(isError = false) {
        // Handle the main display (current operand)
        if (this.isResult && !isError) {
            const number = parseFloat(this.currentOperand);
            if (!isNaN(number)) {
                // Use 'en-IN' for Indian numbering system
                this.currentOperandTextElement.innerText = number.toLocaleString('en-IN', { maximumFractionDigits: 20 });
            } else {
                this.currentOperandTextElement.innerText = this.currentOperand;
            }
        } else {
            // Show the expression as it's being typed
            this.currentOperandTextElement.innerText = this.currentOperand;
        }

        // Handle the top display (previous operand)
        this.previousOperandTextElement.innerText = this.previousOperand;

        // Handle error styling
        if (isError) {
            this.currentOperandTextElement.classList.add('error-message');
        } else {
            this.currentOperandTextElement.classList.remove('error-message');
        }
    }
}

// --- DOM Element Selection ---
const previousOperandTextElement = document.querySelector('[data-previous-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const equalsButton = document.querySelector('[data-equals]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const sqrtButton = document.querySelector('[data-sqrt]');
const percentButton = document.querySelector('[data-percent]');
const toggleSignButton = document.querySelector('[data-toggle-sign]');
const memoryClearButton = document.querySelector('[data-memory-clear]');
const memoryRecallButton = document.querySelector('[data-memory-recall]');
const memoryAddButton = document.querySelector('[data-memory-add]');
const memorySubtractButton = document.querySelector('[data-memory-subtract]');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// --- Event Listeners (Old Way) ---
numberButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        calculator.appendNumber(button.innerText);
    });
});

operationButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        calculator.chooseOperation(button.innerText);
    });
});

equalsButton.addEventListener('click', function() {
    calculator.compute();
});

allClearButton.addEventListener('click', function() {
    calculator.clear();
});

deleteButton.addEventListener('click', function() {
    calculator.delete();
});

sqrtButton.addEventListener('click', function() {
    calculator.handleSpecialOperation('sqrt');
});

percentButton.addEventListener('click', function() {
    // The percent button now just adds the '%' symbol to the expression.
    calculator.appendNumber('%');
});

toggleSignButton.addEventListener('click', function() {
    calculator.handleSpecialOperation('toggleSign');
});

memoryClearButton.addEventListener('click', function() {
    calculator.memoryClear();
});

memoryRecallButton.addEventListener('click', function() {
    calculator.memoryRecall();
});

memoryAddButton.addEventListener('click', function() {
    calculator.memoryAdd();
});

memorySubtractButton.addEventListener('click', function() {
    calculator.memorySubtract();
});