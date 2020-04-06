(async function() {
  const { remote } = require('electron');

  const webContents = remote.getCurrentWebContents();
  const apps = remote.getGlobal('apps');

  const [{ value: id }] = await webContents.session.cookies.get({
    url: 'https://bench.cserdean.com',
    name: 'BENCH_ID',
  });

  function checkAllowNotifications() {
    return apps.allowNotifications(id);
  }

  const handler = {
    construct(target, args) {
      if (!checkAllowNotifications()) return;

      return new target(...args);
    },
  };

  const ProxiedNotification = new Proxy(Notification, handler);

  window.Notification = ProxiedNotification;
})();
