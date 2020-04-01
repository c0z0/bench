const {
  app,
  BrowserWindow,
  BrowserView,
  ipcMain: ipc,
  session,
  screen,
} = require('electron');
const path = require('path');
const uniqid = require('uniqid');
const Store = require('electron-store');
const urlModule = require('url');

const store = new Store();

const PRED_APPS = require('../apps.json');
// const SIDEBAR_WIDTH = 200;
// const TITLEBAR_HEIGHT = 37;
const SIDEBAR_WIDTH = 70;
const TITLEBAR_HEIGHT = 37;
const WIDE_TITLEBAR = true;
const WINDOWS = process.platform !== 'darwin';
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36';

global.CONSTS = {
  SIDEBAR_WIDTH,
  TITLEBAR_HEIGHT,
  WIDE_TITLEBAR,
  PRED_APPS,
  WINDOWS,
};

let mainWindow;
let aboutWindow;
let watcher;
let apps;

class Apps {
  STORE_KEY = 'urls';

  constructor(win) {
    this.win = win;
    this.views = [];
    this.focusedViewId = null;

    const urls = this.getApps();

    urls.forEach(({ url, id }) => this.createView(url, id));

    if (this.views.length) {
      this.focusView(this.views[0].id);
    }
  }

  getApps() {
    return store.get(this.STORE_KEY) || [];
  }

  addApp({ url, favicon }) {
    const urls = this.getApps();

    const id = uniqid();

    urls.push({ url, id, title: urlModule.parse(url).hostname, favicon });

    store.set(this.STORE_KEY, urls);

    this.createView(url, id);
    this.focusView(id);

    this.win.webContents.send('app-created', apps.getApps());
  }

  createView(url, id) {
    const view = new BrowserView({ webPreferences: { plugins: true } });
    view.webContents.loadURL(url, { userAgent: USER_AGENT });

    const handleRedirect = (e, rUrl) => {
      const appHost = new URL(url).href;
      const urlHost = new URL(rUrl).href;

      if (!urlHost.includes(appHost)) {
        e.preventDefault();
        require('electron').shell.openExternal(rUrl);
      }
    };

    // view.webContents.on('will-navigate', handleRedirect);
    view.webContents.on('new-window', handleRedirect);
    this.views.push({ view, id });
  }

  focusView(id) {
    const { view } = this.getView(id);

    this.win.setBrowserView(view);

    const [width, height] = this.win.getSize();

    const xOffset = SIDEBAR_WIDTH;
    const yOffset = WIDE_TITLEBAR ? TITLEBAR_HEIGHT : 0;

    view.setBounds({
      x: SIDEBAR_WIDTH,
      y: yOffset,
      width: width - xOffset,
      height: height - yOffset,
    });
    view.setAutoResize({ width: true, height: true });

    this.focusedViewId = id;

    // view.webContents.openDevTools({ mode: 'detach' });
  }

  hideView() {
    if (this.focusedViewId === null) return;

    this.win.removeBrowserView(this.getView(this.focusedViewId).view);

    this.focusedViewId = null;
  }

  getView(id) {
    return this.views.find(v => v.id === id);
  }

  refresh(id) {
    const { view } = this.getView(id);

    view.webContents.reload();
  }

  forward(id) {
    const { view } = this.getView(id);

    if (view.webContents.canGoForward()) view.webContents.goForward();
  }

  backward(id) {
    const { view } = this.getView(id);

    if (view.webContents.canGoBack()) view.webContents.goBack();
  }

  updateApps(apps) {
    this.urls = apps;

    store.set(this.STORE_KEY, apps);
  }
}

const ABOUT_SIZE = {
  width: 300,
  height: 230,
};

function createAbout() {
  aboutWindow = new BrowserWindow({
    ...ABOUT_SIZE,
    transparent: true,
    backgroundColor: '#00FFFFFF',
    frame: false,
    movable: false,
    resizable: false,
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

  createAbout();

  mainWindow = new BrowserWindow({
    width: 1300,
    height: 840,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#333333',
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  apps = new Apps(mainWindow);

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
}

if (!WINDOWS) {
  app.dock.show();
}

app.on('ready', () => {
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
    createWindow();
  }
});
