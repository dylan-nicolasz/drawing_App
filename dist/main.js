"use strict";
const canvas = document.querySelector("#drawingCanvas");
const context = canvas.getContext("2d");
// CLASS
class DrawingTool {
    size;
    color;
    constructor(size, color) {
        this.size = size;
        this.color = color;
    }
}
const brush = new DrawingTool(5, "black");
let isDrawing = false;
let isEraser = false;
// LIST
const historyDrawing = [];
function saveState() {
    if (context) {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        historyDrawing.push(imageData);
    }
}
// DRAWING
canvas.addEventListener("mousedown", (event) => {
    if (context) {
        saveState();
        isDrawing = true;
        context.strokeStyle = brush.color;
        context.lineWidth = brush.size;
        context.lineCap = "round";
        context.lineJoin = "round";
        context.beginPath();
        context.moveTo(event.offsetX, event.offsetY);
    }
});
canvas.addEventListener("mousemove", (event) => {
    if (!isDrawing) {
        return;
    }
    context?.lineTo(event.offsetX, event.offsetY);
    context?.stroke();
});
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});
canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
});
// ERASER
function toggleEraser() {
    isEraser = !isEraser;
    if (context) {
        if (isEraser) {
            context.globalCompositeOperation = "destination-out";
        }
        else {
            context.globalCompositeOperation = "source-over";
        }
    }
}
const eraseButton = document.querySelector("#eraseButton");
eraseButton?.addEventListener("click", () => {
    toggleEraser();
    eraseButton.textContent = isEraser
        ? "✏️ Drawing"
        : "🧹 Eraser";
});
// CLEAR
function clearCanvas() {
    if (context) {
        saveState();
        context.clearRect(0, 0, canvas.width, canvas.height);
    }
}
const clearButton = document.querySelector("#clearButton");
clearButton?.addEventListener("click", () => {
    clearCanvas();
});
// COLOR PICKER
const colorPick = document.querySelector("#colorPicker");
colorPick.addEventListener("input", () => {
    brush.color = colorPick.value;
    isEraser = false;
    if (context) {
        context.globalCompositeOperation = "source-over";
    }
    if (eraseButton) {
        eraseButton.textContent = "🧹 Eraser";
    }
});
// BRUSH SIZE
const sizePick = document.querySelector("#sizePicker");
const sizeValue = document.querySelector("#sizeValue");
sizePick.addEventListener("input", () => {
    brush.size = Number(sizePick.value);
    if (sizeValue) {
        sizeValue.textContent = `${brush.size}px`;
    }
});
// UNDO
function undo() {
    if (context && historyDrawing.length > 0) {
        const previousState = historyDrawing.pop();
        if (previousState) {
            context.putImageData(previousState, 0, 0);
        }
    }
}
const undoButton = document.querySelector("#undoButton");
undoButton?.addEventListener("click", () => {
    undo();
});
// RECURSION
function countdown(number) {
    console.log(`Saving in ${number}...`);
    if (number <= 1) {
        return;
    }
    countdown(number - 1);
}
// ASYNCHRONOUS FUNCTION
function saveDrawing() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Drawing saved successfully!");
        }, 1000);
    });
}
// ASYNC/AWAIT + EXCEPTION HANDLING
async function handleSave() {
    const saveMessage = document.querySelector("#saveMessage");
    try {
        if (!context) {
            throw new Error("Canvas context is not available.");
        }
        countdown(3);
        const message = await saveDrawing();
        console.log(message);
        if (saveMessage) {
            saveMessage.textContent = message;
        }
    }
    catch (error) {
        console.error("Error saving drawing:", error);
        if (saveMessage) {
            saveMessage.textContent =
                "Error saving the drawing.";
        }
    }
    setTimeout(() => {
        if (saveMessage) {
            saveMessage.textContent = "";
        }
    }, 2500);
}
// SAVE BUTTON
const saveButton = document.querySelector("#saveButton");
saveButton?.addEventListener("click", () => {
    handleSave();
});
