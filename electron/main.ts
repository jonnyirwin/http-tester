import { app, BrowserWindow, ipcMain, dialog } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import Store from 'electron-store'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const store = new Store()

let mainWindow: BrowserWindow | null = null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#1e1e1e',
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// HTTP Request Handler
ipcMain.handle('send-http-request', async (_event, config: {
  method: string
  url: string
  headers: Record<string, string>
  body?: string
  timeout?: number
}) => {
  const startTime = Date.now()

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), config.timeout || 30000)

    const response = await fetch(config.url, {
      method: config.method,
      headers: config.headers,
      body: config.body,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const endTime = Date.now()
    const duration = endTime - startTime

    const responseHeaders: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })

    const cookies = responseHeaders['set-cookie'] || ''
    const bodyText = await response.text()

    return {
      success: true,
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      cookies: cookies,
      body: bodyText,
      duration,
      size: new TextEncoder().encode(bodyText).length,
    }
  } catch (error) {
    const endTime = Date.now()
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: endTime - startTime,
    }
  }
})

// Collections Storage
ipcMain.handle('get-collections', () => {
  return store.get('collections', [])
})

ipcMain.handle('save-collections', (_event, collections) => {
  store.set('collections', collections)
  return true
})

// Environments Storage
ipcMain.handle('get-environments', () => {
  return store.get('environments', [])
})

ipcMain.handle('save-environments', (_event, environments) => {
  store.set('environments', environments)
  return true
})

ipcMain.handle('get-active-environment', () => {
  return store.get('activeEnvironment', null)
})

ipcMain.handle('save-active-environment', (_event, envId) => {
  store.set('activeEnvironment', envId)
  return true
})

// History Storage
ipcMain.handle('get-history', () => {
  return store.get('history', [])
})

ipcMain.handle('save-history', (_event, history) => {
  store.set('history', history)
  return true
})

// Export Collection
ipcMain.handle('export-collection', async (_event, collection) => {
  const result = await dialog.showSaveDialog(mainWindow!, {
    title: 'Export Collection',
    defaultPath: `${collection.name}.json`,
    filters: [{ name: 'JSON', extensions: ['json'] }],
  })

  if (!result.canceled && result.filePath) {
    const exportData = {
      name: collection.name,
      description: collection.description,
      version: '1.0',
      exportedAt: new Date().toISOString(),
      requests: collection.requests,
    }
    fs.writeFileSync(result.filePath, JSON.stringify(exportData, null, 2))
    return { success: true, path: result.filePath }
  }
  return { success: false }
})

// Import Collection
ipcMain.handle('import-collection', async () => {
  const result = await dialog.showOpenDialog(mainWindow!, {
    title: 'Import Collection',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile'],
  })

  if (!result.canceled && result.filePaths.length > 0) {
    try {
      const content = fs.readFileSync(result.filePaths[0], 'utf-8')
      const data = JSON.parse(content)
      return { success: true, data }
    } catch {
      return { success: false, error: 'Invalid JSON file' }
    }
  }
  return { success: false }
})
