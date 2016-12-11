var electronInstaller = require('electron-winstaller');

resultPromise = electronInstaller.createWindowsInstaller({
    appDirectory: '/Users/bobby/Projects/song2stream/build/song2stream-win32-x64',
    outputDirectory: '/Users/bobby/Projects/song2stream/build/song2stream-win32-x64/standalone',
    authors: 'Bobby LaPorte',
    loadingGif: '/Users/bobby/Projects/song2stream/loading.gif'
  });

resultPromise.then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
