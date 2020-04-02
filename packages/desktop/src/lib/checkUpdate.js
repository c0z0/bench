const { dialog, app, shell } = require('electron');
const fetch = require('node-fetch');
const { download } = require('electron-dl');
const fs = require('fs');
const path = require('path');
const log = require('electron-log');

let platform = 'dmg';

if (process.platform === 'win32') platform = 'exe';
if (process.platform === 'linux') platform = 'deb';

const DOWNLOAD_DIR = path.join(app.getPath('temp'));
const FILE_NAME = `install-bench.${platform}`;
const FULL_PATH = path.join(DOWNLOAD_DIR, FILE_NAME);

module.exports = async function(win) {
  log.info('Checking update');
  try {
    log.info('Deleting old update');
    await fs.promises.unlink(FULL_PATH);
    log.info('Old update deleted');
  } finally {
    const version = 'v' + app.getVersion();

    log.info('Fetching new version info');
    const res = await fetch(
      `https://hazel.bench.cserdean.com/update/${platform}/${version}`,
    );

    log.info(`New version fetched`);

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

    log.info(`Dialog response ${dialogRes}`);

    if (dialogRes !== 1) return;

    log.info(`Making new directory ${DOWNLOAD_DIR}`);

    await fs.promises.mkdir(DOWNLOAD_DIR, { recursive: true });

    log.info(`New directory made`);

    const downloadPromise = download(win, url, {
      filename: FILE_NAME,
      directory: DOWNLOAD_DIR,
    });

    log.info('Downloading update');

    await dialog.showMessageBox(win, {
      message:
        "The installer is downloading in the background. It will be opened automatically when it's ready.",
      buttons: ['Ok'],
    });

    await downloadPromise;

    log.info(`Opening installer`);

    const opened = shell.openItem(FULL_PATH);

    if (opened) app.quit();
  }
};
