import { app, BrowserWindow,ipcMain } from 'electron'
import path from 'node:path'

const fs = require('node:fs')
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win = null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function readFromFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8')
}

function writeToFile(filePath, content) {
  console.log(content)
  return fs.writeFileSync(filePath, content, 'utf-8')
}

function createWindow() {
  win = new BrowserWindow({
    // icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    resizable: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      sandbox: false,
    },
  })

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    // win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  win.webContents.openDevTools()

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }

  ipcMain.handle('readFile', (event, filePath) => {//读取文件
    let fp = !app.isPackaged?path.join(__dirname, '../public', filePath):path.join(__dirname, "../dist", filePath)
    return readFromFile(fp)
  })

  ipcMain.handle('writeFile', (event, filePath, content) => {//写入文件
    let fp = !app.isPackaged?path.join(__dirname, '../public', filePath):path.join(__dirname, "../dist", filePath)
    return writeToFile(fp, content)
  })

  ipcMain.handle('exit', (event) => {
    app.quit()
  })

  ipcMain.handle('join', (event, ...args) => {
    console.log(path.join(__dirname, ...args))
    return path.join(__dirname, ...args)
  })
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.whenReady().then(createWindow)
