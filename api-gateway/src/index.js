const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const app = express();
const PORT = process.env.PORT;
const { rateLimit } = require("express-rate-limit");

const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const recipeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: true,
  legacyHeaders: false,
});

const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: true,
  legacyHeaders: false,
});

/// == USER SERVICE ==
app.use(
  "/user",
  userLimiter,
  createProxyMiddleware({
    target: "http://user-service:8001/api",
    changeOrigin: true,
    pathRewrite: {
      "^/user-service/api": "",
    },
  })
);

// == RECIPE SERVICE ==
app.use(
  "/recipe",
  recipeLimiter,
  createProxyMiddleware({
    target: "http://recipe-service:8002/api",
    changeOrigin: true,
    pathRewrite: {
      "^/recipe-service/api": "",
    },
  })
);

// == REVIEW SERVICE ==
app.use(
  "/review",
  reviewLimiter,
  createProxyMiddleware({
    target: "http://review-service:8003/api",
    changeOrigin: true,
    pathRewrite: {
      "^/review-service/api": "",
    },
  })
);

app.listen(PORT, () => {
  console.log(`API Gateway berjalan pada port ${PORT}`);
});
