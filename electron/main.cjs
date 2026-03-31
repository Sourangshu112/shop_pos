const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let pythonProcess;
let isAppQuitting = false; // <--- NEW: Track if the user is closing the app

function startPythonBackend() {
  if (app.isPackaged) {
    const pythonExePath = path.join(process.resourcesPath, 'backend-dist', 'app.exe');
    pythonProcess = spawn(pythonExePath);
  } else {
    // 1. Verify the exact path being targeted
    const pythonScriptPath = path.join(__dirname, '../backend/app.py');
    console.log('Attempting to start Python script at:', pythonScriptPath);

    const backendDirectory = path.join(__dirname, '../backend');
    pythonProcess = spawn('python', [pythonScriptPath], { cwd: backendDirectory });
  }

  // --- NEW: CATCH OUTPUT AND ERRORS ---
  pythonProcess.stdout.on('data', (data) => {
    console.log(`[Python Output]: ${data.toString()}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`[Python Error]: ${data.toString()}`);
  });

  pythonProcess.on('error', (err) => {
    console.error('Failed to spawn Python process. Is Python in your PATH?', err);
  });

  // --- YOUR EXISTING AUTO-RESTART LOGIC ---
  pythonProcess.on('close', (code) => {
    console.log(`Python backend exited with code ${code}`);
    
    if (!isAppQuitting) {
      console.log('Restarting Python backend in 2 seconds...');
      setTimeout(() => {
        startPythonBackend();
      }, 2000);
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'public/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    mainWindow.loadURL('http://localhost:4231');
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.on('ready', () => {
  startPythonBackend();
  createWindow();
});

// --- UPDATED: SET FLAG BEFORE KILLING ---
app.on('will-quit', () => {
  isAppQuitting = true; // Tell the auto-restart logic to stop
  if (pythonProcess) {
    pythonProcess.kill();
  }
});