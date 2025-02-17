import 'dotenv/config'
import express from "express"
import router from "./routes"
import { initializeDatabase } from './database/sequelize';
// import sequelize from "./database/sequelize";

const app = express();

app.use("/api", router); // 모든 라우트에 /api prefix 추가



// async function startDB() {
//   try {
//     await sequelize.authenticate();
//     console.log('데이터베이스 연결 성공');
//   } catch (error: any) {
//     console.error('데이터베이스 연결 실패:', error);
//     process.exit(1);
//   }

// }

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
  
  await initializeDatabase();
  startServer(initialPort);
}

main();



module.exports = app;
