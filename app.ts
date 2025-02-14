import express from "express"
import router from "./routes"

const app = express();

app.use("/api", router); // 모든 라우트에 /api prefix 추가

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});


module.exports = app;
