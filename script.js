// Main class to encapsulate all calculator logic
class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.memory = 0; 
        this.clear();
    }

    // Clears the calculator state and display
    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.isResult = false; 
        this.updateDisplay();
    }

    // Deletes the last character from the current operand
    delete() {
        if (this.isResult) {
            this.clear();
            return;
        }
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        this.updateDisplay();
    }

    // Appends a number or the '%' symbol
    appendNumber(number) {
        if (this.isResult) {
            this.currentOperand = '';
            this.previousOperand = ''; 
            this.isResult = false;
        }
        this.currentOperand += number;
        this.updateDisplay();
    }

    // Appends an operator to the expression
    chooseOperation(operation) {
        if (this.isResult) {
            this.previousOperand = ''; 
            this.isResult = false;
        }

        if (this.currentOperand === '' && operation === '-') {
            this.currentOperand = '-';
            this.updateDisplay();
            return;
        }

        if (this.currentOperand === '' || this.currentOperand === '-') return;

        // Prevent stacking operators (e.g., '5++') by replacing the last one
        const lastChar = this.currentOperand.slice(-1);
        if (['+', '×', '÷', '-'].includes(lastChar)) {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }

        this.currentOperand += operation;
        this.updateDisplay();
    }

    // Core calculation engine; follows BODMAS.
    evaluate() {
        let expression = this.currentOperand.replace(/×/g, '*').replace(/÷/g, '/');
        
        let safeExpression = expression.replace(/(\d+\.?\d*)%/g, '($1/100)');
        
        try {
            let result = new Function('return ' + safeExpression)();
            if (!isFinite(result)) throw new Error("Division by zero");

            result = parseFloat(result.toPrecision(12));
            return result;
        } catch (error) {
            if (error.message === "Division by zero") throw error;
            throw new Error("Invalid Expression");
        }
    }

    // Computes the final result when '=' is pressed
    compute() {
        if (this.currentOperand === '') return;
        try {
            let result;
            // Fix: Check for special square root "prefix" mode (e.g., √9)
            if (this.operation === '√') {
                const number = parseFloat(this.currentOperand);
                if (number < 0) throw new Error("Invalid input for √");
                result = Math.sqrt(number);
                this.previousOperand = `√(${this.currentOperand}) =`; // Show full operation
            } else {
                result = this.evaluate();
                this.previousOperand = `${this.currentOperand} =`;
            }

            this.currentOperand = result.toString();
            this.isResult = true; 
            this.operation = undefined; 
            this.updateDisplay();

        } catch (error) {
            this.handleError(error);
        }
    }

    // Handles the dual-mode square root button
    chooseRootOperation() {   
        if (this.currentOperand !== '' && !this.isResult) {
            this.handleSpecialOperation('sqrt');
        } else {
            this.clear();
            this.operation = '√'; 
            this.previousOperand = '√(';
            this.updateDisplay();
        }
    }

    // Handles immediate special operations 
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

    // Central function for displaying errors gracefully on the screen
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

    // Memory Functions (Optional Feature) 
    memoryClear() {
        this.memory = 0;
    }

    memoryRecall() {
        this.currentOperand = this.memory.toString();
        this.previousOperand = '';
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

    // Updates the two-line display after any action
    updateDisplay(isError = false) {
        if (this.isResult && !isError) {
            const number = parseFloat(this.currentOperand);
            if (!isNaN(number)) {
                this.currentOperandTextElement.innerText = number.toLocaleString('en-IN', { maximumFractionDigits: 20 });
            } else {
                this.currentOperandTextElement.innerText = this.currentOperand;
            }
        } else {
            this.currentOperandTextElement.innerText = this.currentOperand;
        }

        if (this.operation === '√') {
            this.previousOperandTextElement.innerText = `√(${this.currentOperand})`;
        } else {
            this.previousOperandTextElement.innerText = this.previousOperand;
        }

        // Handle red error message styling
        if (isError) {
            this.currentOperandTextElement.classList.add('error-message');
        } else {
            this.currentOperandTextElement.classList.remove('error-message');
        }
    }
}

//  DOM Element Selection 
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

// Create a new instance of our Calculator class
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Event Listeners 
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

// Special buttons
sqrtButton.addEventListener('click', function() {
    calculator.chooseRootOperation(); 
});

percentButton.addEventListener('click', function() {
    calculator.appendNumber('%'); 
});

toggleSignButton.addEventListener('click', function() {
    calculator.handleSpecialOperation('toggleSign');
});

// Memory buttons
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

//  FINAL FEATURE: Keyboard Input 
window.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.shiftKey || event.metaKey || event.altKey) {
        return;
    }

    const key = event.key;
    let button; 

    if (key >= 0 && key <= 9) {
        button = Array.from(numberButtons).find(btn => btn.innerText === key);
    } else if (key === '.') {
        button = document.querySelector('[data-number="."]');
    } else if (key === '+') {
        button = Array.from(operationButtons).find(btn => btn.innerText === '+');
    } else if (key === '-') {
        button = Array.from(operationButtons).find(btn => btn.innerText === '-');
    } else if (key === '*') {
        button = Array.from(operationButtons).find(btn => btn.innerText === '×');
    } else if (key === '/') {
        button = Array.from(operationButtons).find(btn => btn.innerText === '÷');
    } else if (key === '%') {
        button = percentButton;
    } else if (key === 'Enter' || key === '=') {
        button = equalsButton;
    } else if (key === 'Backspace') {
        button = deleteButton;
    } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        button = allClearButton;
    } else if (key.toLowerCase() === 'r') {
        button = sqrtButton;
    } else if (key.toLowerCase() === 'n') {
        button = toggleSignButton; 
    }

    // If a matching button was found,click it
    if (button) {
        event.preventDefault(); 
        button.click();
    }
});