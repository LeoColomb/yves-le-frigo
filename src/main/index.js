'use strict'

import { app, screen, BrowserWindow } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let remoteWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  let displays = screen.getAllDisplays()
  let externalDisplay = displays.find((display) =>
    display.bounds.x !== 0 || display.bounds.y !== 0
  )

  if (externalDisplay) {
    remoteWindow = new BrowserWindow({
      x: externalDisplay.bounds.x,
      y: externalDisplay.bounds.y,
      frame: false,
      fullscreen: true,
      movable: false,
      resizable: false,
      minimizable: false,
      alwaysOnTop: process.env.NODE_ENV !== 'development'
    })
    remoteWindow.loadURL(`${winURL}#/features`)
  }

  mainWindow = new BrowserWindow({
    height: 600,
    useContentSize: true,
    width: 1200,
    frame: true,
    modal: true,
    minimizable: false,
    autoHideMenuBar: true,
    parent: remoteWindow
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
    remoteWindow.close()
    remoteWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
