const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
const port = 8000;

//  API Gateway for user service
app.use(
  "/user-service",
  createProxyMiddleware({
    target: "http://localhost:8001",
    changeOrigin: true,
    pathRewrite: {
      "^/user-service": "",
    },
  })
);

//  API Gateway for recipe service
app.use(
  "/recipe-service",
  createProxyMiddleware({
    target: "http://localhost:8002",
    changeOrigin: true,
    pathRewrite: {
      "^/recipe-service": "",
    },
  })
);

//  API Gateway for recipe service
app.use(
  "/review-service",
  createProxyMiddleware({
    target: "http://localhost:8003",
    changeOrigin: true,
    pathRewrite: {
      "^/review-service": "",
    },
  })
);

app.listen(port, () => {
  console.log(`API Gateway berjalan pada port ${port}`);
});
