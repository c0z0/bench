const { BrowserView, BrowserWindow } = require('electron');
const uniqid = require('uniqid');
const urlModule = require('url');

module.exports = class Apps {
  static STORE_KEY = 'urls';
  static MUTE_KEY = 'mute';

  constructor(win, store, consts) {
    this.win = win;
    this.consts = consts;
    this.mute = store.get(this);
    this.views = [];
    this.focusedViewId = null;
    this.store = store;
    this.STORE_KEY = Apps.STORE_KEY;
    this.MUTE_KEY = Apps.MUTE_KEY;

    const urls = this.getApps();

    urls.forEach(({ url, id }) => this.createView(url, id));

    if (this.views.length) {
      this.focusView(this.views[0].id);
    }
  }

  isMuted() {
    return this.store.get(this.MUTE_KEY) || 'on';
  }

  setMuted(view, muted) {
    view.webContents.audioMuted = muted;
  }

  changeMute(muted) {
    if (muted) this.store.set(this.MUTE_KEY, muted);
    else muted = this.isMuted();

    if (muted === 'on') {
      this.toggleMute(false);
    } else if (muted === 'mute') {
      this.toggleMute(true);
    } else if (muted === 'blur') {
      this.toggleMute(!BrowserWindow.getFocusedWindow() && true);
    }
  }

  toggleMute(muted) {
    this.views.forEach(v => this.setMuted(v.view, muted));
  }

  getApps() {
    return this.store.get(this.STORE_KEY) || [];
  }

  addApp({ url, favicon }) {
    const urls = this.getApps();

    const id = uniqid();

    urls.push({
      url,
      id,
      title: urlModule.parse(url.replace('www.', '')).hostname,
      favicon,
    });

    this.store.set(this.STORE_KEY, urls);

    this.createView(url, id);
    this.focusView(id);

    this.win.webContents.send('app-created', this.getApps());
  }

  updateUrl(id) {
    return (_, url) => {
      const urls = this.getApps().map(u => (u.id === id ? { ...u, url } : u));
      this.store.set(this.STORE_KEY, urls);
    };
  }

  createView(url, id) {
    const view = new BrowserView({
      webPreferences: {
        plugins: true,
        partition: `persist:${id}`,
        userAgent: this.consts.USER_AGENT,
      },
      backgroundColor: '#333',
    });

    view.webContents.loadURL(url, { userAgent: this.consts.USER_AGENT });

    const handleRedirect = (e, rUrl) => {
      const appHost = new URL(url).href;
      const urlHost = new URL(rUrl).href;

      if (!urlHost.includes(appHost)) {
        e.preventDefault();
        require('electron').shell.openExternal(rUrl);
      }
    };

    view.webContents.on('did-navigate', this.updateUrl(id));
    view.webContents.on('new-window', handleRedirect);

    this.views.push({ view, id });

    this.changeMute();
  }

  focusView(id) {
    const { view } = this.getView(id);

    this.win.setBrowserView(view);

    const [width, height] = this.win.getSize();

    const xOffset = this.consts.SIDEBAR_WIDTH;
    const yOffset = this.consts.WIDE_TITLEBAR ? this.consts.TITLEBAR_HEIGHT : 0;

    view.setBounds({
      x: this.consts.SIDEBAR_WIDTH,
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

    this.views = this.views
      .map(v => {
        if (!apps.find(a => a.id === v.id)) {
          v.view.destroy();
          return null;
        }

        return v;
      })
      .filter(v => v !== null);

    this.store.set(this.STORE_KEY, apps);
  }

  close() {
    this.views.forEach(v => v.view.destroy());
  }
};
