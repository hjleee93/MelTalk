import 'dotenv/config'
import express from "express"
import router from './routes/index';
import initDB from './database/database';

const app = express();

app.use("/api", router); // 모든 라우트에 /api prefix 추가


function startServer(port: number): void {
  const server = app.listen(port, () => {
    console.log(`서버가 ${process.env.URL}:${port}에서 실행 중입니다.`);
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      console.warn(`포트 ${port}가 이미 사용 중입니다. 포트 ${port + 1}로 재시도합니다.`);
      startServer(port + 1);
    } else {
      console.error(`서버 시작 중 오류 발생: ${error.message}`);
    }
  });
}

const initialPort = Number(process.env.SERVER_PORT) || 3000;

async function main() {
  await initDB();
  startServer(initialPort);
}

main();



module.exports = app;
