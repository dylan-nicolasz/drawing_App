"use strict";
const canvas = document.querySelector("#drawingCanvas");
const context = canvas.getContext("2d");
const appState = {
    isDrawing: false,
    isEraser: false,
    brushSize: 5,
    brushColor: "black"
};
class drawingTool {
    size;
    color;
    constructor(size, color) {
        this.size = size;
        this.color = color;
    }
}
const brush = new drawingTool(1, "black");
brush.size;
brush.color;
let isEraser = false;
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
let isDrawing = false;
console.log("Canvas:", canvas);
canvas.addEventListener("mousedown", (event) => {
    isDrawing = true;
    if (context) {
        saveState();
        isDrawing = true;
        context.strokeStyle = brush.color;
        context.lineWidth = brush.size;
        context?.beginPath();
        context?.moveTo(event.offsetX, event.offsetY);
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
// Create the button for the eraser
const eraseButton = document.querySelector("#eraseButton");
//DOM
eraseButton?.addEventListener("click", () => {
    toggleEraser();
});
// Function to clear the canvas. clearReact method requires4 values (xPoint, yPoint, widht, height)
function clearCanvas() {
    context?.clearRect(0, 0, canvas.width, canvas.height);
}
const clearButton = document.querySelector("#clearButton");
clearButton?.addEventListener("click", () => {
    clearCanvas();
});
// color button, the user picks the color
const colorPick = document.querySelector("#colorPicker");
colorPick.addEventListener("input", () => {
    brush.color = colorPick.value;
});
// brush size, input
const sizePick = document.querySelector("#sizePicker");
console.log("Size picker:", sizePick);
sizePick.addEventListener("input", () => {
    brush.size = Number(sizePick.value);
});
//Undo
const historyDrawing = [];
function saveState() {
    if (context) {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        historyDrawing.push(imageData);
    }
}
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
// async/await function
function saveDrawing() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve("Drawing saved succedfully");
        }, 1000);
    });
}
async function handleSave() {
    const message = await saveDrawing();
    const saveMessage = document.querySelector("#saveMessage");
    saveMessage.textContent = message;
    setTimeout(() => {
        saveMessage.textContent = "";
    }, 2500);
}
const saveButton = document.querySelector("#saveButton");
saveButton?.addEventListener("click", () => {
    handleSave();
});
