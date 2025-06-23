const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
const PORT = process.env.PORT;

/// == USER SERVICE ==
app.use(
  "/user-service",
  createProxyMiddleware({
    target: "http://user-service:8001",
    changeOrigin: true,
    pathRewrite: {
      "^/user-service": "",
    },
  })
);

// == RECIPE SERVICE ==
app.use(
  "/recipe-service",
  createProxyMiddleware({
    target: "http://recipe-service:8002",
    changeOrigin: true,
    pathRewrite: {
      "^/recipe-service": "",
    },
  })
);

// == REVIEW SERVICE ==
app.use(
  "/review-service",
  createProxyMiddleware({
    target: "http://review-service:8003",
    changeOrigin: true,
    pathRewrite: {
      "^/review-service": "",
    },
  })
);

app.listen(PORT, () => {
  console.log(`API Gateway berjalan pada port ${PORT}`);
});
