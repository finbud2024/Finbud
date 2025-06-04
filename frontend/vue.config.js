export default {
  devServer: {
    proxy: {
      "/multiplier-simulator": {
        target: "http://localhost:8889",
        changeOrigin: true,
      },
      "/auth": {
        target: "http://localhost:8889",
        changeOrigin: true,
      },
    },
  },
};
