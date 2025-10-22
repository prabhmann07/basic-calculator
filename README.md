# Modern Web Calculator

This is a web-based calculator developed as a project for the Unified Mentor online internship. It is built with modern frontend technologies and includes a robust calculation engine that supports standard arithmetic, the mathematical order of operations (BODMAS), and a variety of advanced functions.

---

## Live Demo

**[Live Demo](https://prabhmann07.github.io/basic-calculator/)**

---

## Features Implemented

### Core Functionality
- **BODMAS Compliance:** The calculation engine correctly follows the order of operations (e.g., `5 + 3 * 2` correctly evaluates to `11`).
- **Standard Arithmetic:** Supports Addition (`+`), Subtraction (`-`), Multiplication (`×`), and Division (`÷`).
- **Full Expression Display:** Users can see the entire mathematical expression on screen as they type it.
- **Two-Line Display:** The top line shows the full equation that was just solved, while the main display shows the current input or the result.
- **Input Management:** Includes `AC` (All Clear) to completely reset the calculator and `⌫` (Backspace) to delete the last character entered.

### Advanced & Optional Features
- **Square Root:** Calculates the square root of the entire current expression.
- **Percentage:** Can be used as part of a larger calculation (e.g., `50 + 25%` correctly evaluates to `62.5`).
- **Toggle Sign:** Flips the sign of the entire current expression from positive to negative or vice versa.
- **Memory Functions:**
    - **MC:** Clears the number stored in memory.
    - **MR:** Recalls the number from memory to the display.
    - **M+:** Adds the current expression's result to the number in memory.
    - **M-:** Subtracts the current expression's result from the number in memory.

### User Interface & Experience
- **Modern Design:** A sleek, dark-themed UI with a vibrant gradient background and neon button accents.
- **Indian Numbering System:** All final results are formatted with commas according to the Indian system (lakhs, crores) for better readability.
- **Graceful Error Handling:** Displays clear, user-friendly error messages like "Cannot divide by 0" or "Invalid input for √" on the screen instead of crashing or showing a browser alert.

---

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript (ES6)

---

## How to Set Up and Run the Project

This project requires no special setup. To run it locally, follow these steps:

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/prabhmann07/basic-calculator.git](https://github.com/prabhmann07/basic-calculator.git)
    ```

2.  **Navigate to the Project Directory**
    ```bash
    cd basic-calculator
    ```

3.  **Run the Website**
    -   Simply open the `index.html` file in your web browser.

---

## Project Evaluation Notes

-   **Code Structure:** The core application logic is encapsulated within a `Calculator` class in `script.js`. The code is organized into methods for each feature for clarity and maintainability.
-   **Requirements Fulfillment:** This project successfully implements all "Hard" difficulty requirements (BODMAS, Error Handling) and all "Optional Challenges" as specified in the project document.
