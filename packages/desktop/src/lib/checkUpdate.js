const { dialog, app, shell } = require('electron');
const fetch = require('node-fetch');
const { download } = require('electron-dl');
const fs = require('fs');
const path = require('path');

let platform = 'dmg';

if (process.platform === 'win32') platform = 'exe';
if (process.platform === 'linux') platform = 'deb';

const DOWNLOAD_DIR = path.join(app.getAppPath(), 'tmp_installers');
const FILE_NAME = `install-bench.${platform}`;
const FULL_PATH = path.join(DOWNLOAD_DIR, FILE_NAME);

module.exports = async function(win) {
  try {
    await fs.promises.unlink(FULL_PATH);
  } finally {
    const version = 'v' + app.getVersion();

    const res = await fetch(
      `https://hazel.bench.cserdean.com/update/${platform}/${version}`,
    );

    if (res.status !== 200) return;

    const { name, url } = await res.json();

    const { response: dialogRes } = await dialog.showMessageBox(win, {
      type: 'question',
      defaultId: 1,
      cancelId: 0,
      message:
        'There is a new version of the app. Do you want to download it now?',
      detail: `Version ${name.slice(
        1,
      )} is available. The installed version is ${version.slice(1)}.`,
      buttons: ['No', 'Yes'],
    });

    if (dialogRes !== 1) return;

    await fs.promises.mkdir(DOWNLOAD_DIR, { recursive: true });

    const downloadPromise = download(win, url, {
      filename: FILE_NAME,
      directory: DOWNLOAD_DIR,
    });

    await dialog.showMessageBox(win, {
      message:
        "The installer is downloading in the background. It will be opened automatically when it's ready.",
      buttons: ['Ok'],
    });

    await downloadPromise;

    const opened = shell.openItem(FULL_PATH);

    if (opened) app.quit();
  }
};
