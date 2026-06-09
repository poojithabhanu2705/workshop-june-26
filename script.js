// ── Get references to HTML elements ──────────────────────────────────────
const canvas      = document.getElementById("drawing-canvas");
const ctx         = canvas.getContext("2d");       // 2D drawing context
const btnPencil   = document.getElementById("btn-pencil");
const btnEraser   = document.getElementById("btn-eraser");
const colorPicker = document.getElementById("color-picker");

// ── App state ─────────────────────────────────────────────────────────────
let isDrawing    = false;   // is the mouse button currently held down?
let currentTool  = "pencil"; // which tool is active: "pencil" or "eraser"
let drawingColor = "#000000"; // current pen color (updated by color picker)

// ── Canvas sizing ─────────────────────────────────────────────────────────
// Make the canvas fill the full browser window.
// We must set canvas.width/height in pixels (not via CSS) so drawing works correctly.
function resizeCanvas() {
  // Save whatever is drawn before resizing
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  // Restore the drawing after resizing
  ctx.putImageData(imageData, 0, 0);
}

// Run once on load, and again if the window is resized
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// ── Tool selection ─────────────────────────────────────────────────────────
// Switch to pencil mode
btnPencil.addEventListener("click", function () {
  currentTool = "pencil";
  btnPencil.classList.add("active");
  btnEraser.classList.remove("active");
});

// Switch to eraser mode
btnEraser.addEventListener("click", function () {
  currentTool = "eraser";
  btnEraser.classList.add("active");
  btnPencil.classList.remove("active");
});

// Update the drawing color whenever the user picks a new one
colorPicker.addEventListener("input", function () {
  drawingColor = colorPicker.value;
});

// ── Drawing logic ──────────────────────────────────────────────────────────
// Called when the user presses the mouse button down on the canvas
canvas.addEventListener("mousedown", function (event) {
  isDrawing = true;

  // Lock in the drawing settings at the START of each stroke.
  // This ensures the correct color is applied from the very first pixel,
  // even right after the user changes the color picker value.
  if (currentTool === "pencil") {
    ctx.strokeStyle = drawingColor; // use the currently chosen color
    ctx.lineWidth   = 3;
  } else {
    ctx.strokeStyle = "#ffffff";    // eraser paints white
    ctx.lineWidth   = 20;
  }
  ctx.lineCap  = "round";
  ctx.lineJoin = "round";

  // Start a fresh path at the click position
  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);
});

// Called repeatedly as the mouse moves across the canvas
canvas.addEventListener("mousemove", function (event) {
  if (!isDrawing) return; // only draw when mouse button is held

  // Draw a line to the current mouse position
  ctx.lineTo(event.offsetX, event.offsetY);
  ctx.stroke();

  // ── Key fix: reset the path after each stroke().
  // Without this, the path keeps growing and ctx.stroke() redraws the
  // entire path every frame, which can cause color/style bleed.
  // Starting a new sub-path from the current point keeps each segment
  // independent and ensures settings applied in mousedown stay active.
  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);
});

// Stop drawing when the mouse button is released
canvas.addEventListener("mouseup", function () {
  isDrawing = false;
});

// Also stop drawing if the cursor leaves the canvas area
canvas.addEventListener("mouseleave", function () {
  isDrawing = false;
});
