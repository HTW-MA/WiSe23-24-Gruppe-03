const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: '/service-worker.js',
    }
  }
})

// module.exports = {
//   pwa: {
//     name: 'My App',
//     themeColor: '#4DBA87',
//     msTileColor: '#000000',
//     appleMobileWebAppCapable: 'yes',
//     appleMobileWebAppStatusBarStyle: 'black',
//
//     // configure the workbox plugin
//     workboxPluginMode: 'InjectManifest',
//     workboxOptions: {
//       // swSrc is required in InjectManifest mode.
//       swSrc: './service-worker.js',
//       // ...other Workbox options...
//     }
//   }
// }
