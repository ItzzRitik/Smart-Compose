const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: "Smart Text Suggestion",
    themeColor: "#962CFF"
  },
  chainWebpack: config => {
	config
		.plugin('html')
		.tap(args => {
			args[0].title = 'Smart Text Suggestion'
			return args
		})
	}
})
