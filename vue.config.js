module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true
    }
  }
};
