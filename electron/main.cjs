const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process'); // <--- Import spawn

let mainWindow;
let pythonProcess; // <--- Variable to hold the python process

// FUNCTION TO START PYTHON
function startPythonBackend() {
  const pythonScriptPath = path.join(__dirname, '../backend/app.py');
  
  // "python" command assumes python is in your system PATH
  // Use "python3" if you are on Mac/Linux
  pythonProcess = spawn('python', [pythonScriptPath]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Python Output: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Python Error: ${data}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // Force port 3000 as discussed
  const startUrl = 'http://localhost:3000';
  mainWindow.loadURL(startUrl);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
  startPythonBackend(); // <--- Start Python first
  createWindow();       // <--- Then open the window
});

// KILL PYTHON WHEN APP CLOSES
app.on('will-quit', () => {
  if (pythonProcess) {
    pythonProcess.kill();
  }
});