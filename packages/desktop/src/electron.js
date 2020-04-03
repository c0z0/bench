const {
  app,
  BrowserWindow,
  ipcMain: ipc,
  session,
  screen,
  systemPreferences,
} = require('electron');
const path = require('path');
const Store = require('electron-store');
const log = require('electron-log');

const Apps = require('./lib/apps');

const store = new Store();

const PRED_APPS = require('../apps.json');
// const SIDEBAR_WIDTH = 200;
// const TITLEBAR_HEIGHT = 37;
const SIDEBAR_WIDTH = 70;
const VERSION = app.getVersion();
const TITLEBAR_HEIGHT = 37;
const WIDE_TITLEBAR = true;
const WINDOWS = process.platform !== 'darwin';
const SYSTEM_COLOR =
  process.platform !== 'linux'
    ? `#${systemPreferences.getAccentColor().slice(0, 6)}`
    : false;

const STARTUP =
  process.platform !== 'linux' ? app.getLoginItemSettings().openAtLogin : false;

let USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36';

if (process.platform === 'win32')
  USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36';
if (process.platform === 'linux')
  USER_AGENT =
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36';

global.CONSTS = {
  SIDEBAR_WIDTH,
  TITLEBAR_HEIGHT,
  WIDE_TITLEBAR,
  PRED_APPS,
  WINDOWS,
  VERSION,
  SYSTEM_COLOR,
  MUTED: store.get(Apps.MUTE_KEY) || 'on',
  STARTUP,
  USER_AGENT,
};

let mainWindow;
let aboutWindow;
let watcher;
let apps;

const ABOUT_SIZE = {
  width: 300,
  height: 500,
};

log.info({
  VERSION,
  USER_AGENT,
  CACHE: app.getPath('cache'),
  LOGS: app.getPath('logs'),
  APPDATA: app.getPath('appData'),
  USERDATA: app.getPath('userData'),
});

function createAbout() {
  aboutWindow = new BrowserWindow({
    ...ABOUT_SIZE,
    transparent: true,
    backgroundColor: '#00FFFFFF',
    frame: false,
    movable: false,
    resizable: false,
    useContentSize: true,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  aboutWindow.loadURL(
    `file://${path.join(__dirname, '../public/index.html?p=about')}`,
  );

  aboutWindow.on('blur', () => aboutWindow.hide());

  const handleRedirect = (e, rUrl) => {
    e.preventDefault();
    require('electron').shell.openExternal(rUrl);
  };

  aboutWindow.webContents.on('new-window', handleRedirect);
}

function toggleAbout() {
  if (aboutWindow.isVisible()) {
    aboutWindow.hide();
  } else {
    const pointerPos = screen.getCursorScreenPoint();
    const windowBounds = mainWindow.getBounds();

    const x = Math.round(
      windowBounds.x + windowBounds.width / 2 - ABOUT_SIZE.width / 2,
    );
    const y = Math.round(
      windowBounds.y + windowBounds.height / 2 - ABOUT_SIZE.height / 2,
    );

    aboutWindow.setPosition(x, y, false);
    aboutWindow.show();
    aboutWindow.focus();
  }
}

function createWindow() {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['User-Agent'] = USER_AGENT;
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });
  const mode = process.env.NODE_ENV;

  mainWindow = new BrowserWindow({
    width: 1300,
    height: 840,
    minWidth: 800,
    minHeight: 800,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#333333',
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  apps = new Apps(mainWindow, store, global.CONSTS);

  mainWindow.loadURL(`file://${path.join(__dirname, '../public/index.html')}`);

  mainWindow.on('closed', () => {
    if (watcher) {
      watcher.close();
    }
    mainWindow = null;
  });

  ipc.on('refresh', (e, id) => apps.refresh(id));
  ipc.on('backward', (e, id) => apps.backward(id));
  ipc.on('forward', (e, id) => apps.forward(id));
  ipc.on('focus', (e, id) => apps.focusView(id));
  ipc.on('hide', (e, id) => apps.hideView());
  ipc.on('create', (e, app) => apps.addApp(app));
  ipc.on('about', () => toggleAbout());
  ipc.on('update-apps', (e, updatedApps) => apps.updateApps(updatedApps));
  ipc.on('update-theme', (e, theme) =>
    mainWindow.webContents.send('update-theme', theme),
  );
  ipc.on('startup', (e, openAtLogin) =>
    app.setLoginItemSettings({ openAtLogin }),
  );
  ipc.on('mute', (e, muted) => apps.changeMute(muted));

  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.send('update-apps', apps.getApps());
  });

  if (mode === 'development') {
    watcher = require('chokidar').watch(path.join(__dirname, '../public'), {
      ignoreInitial: true,
    });
    watcher.on('change', () => {
      mainWindow.reload();
      aboutWindow.reload();
    });
  }

  mainWindow.on('maximize', () => mainWindow.webContents.send('max'));
  mainWindow.on('unmaximize', () => mainWindow.webContents.send('max'));

  mainWindow.on('blur', () => apps.changeMute());
  mainWindow.on('focus', () => apps.changeMute());
  aboutWindow.on('blur', () => apps.changeMute());
  aboutWindow.on('focus', () => apps.changeMute());

  mainWindow.on('close', () => {
    ipc.removeAllListeners();
    aboutWindow.removeAllListeners();
    apps.close();
    aboutWindow.close();
  });
}

if (!WINDOWS) {
  app.dock.show();
}

app.on('ready', () => {
  createAbout();
  createWindow();
  require('./lib/checkUpdate')(mainWindow);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createAbout();
    createWindow();
  }
});
