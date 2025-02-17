import { Sequelize } from 'sequelize';
import mysql from 'mysql2';

const DB_NAME = process.env.DB_NAME || 'test';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '1234';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || '3306');


// 커넥션만 먼저 확인
const sequelize = new Sequelize('', DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  logging: false
});

async function connectWithSequelize(): Promise<Sequelize> {
  try {
    await sequelize.authenticate();
    console.log('디비 서버에 성공적으로 접속했습니다.');
    return sequelize
  } catch (error) {
    console.error('데이터베이스 접속 실패:', error);
  }
}

export async function initializeDatabase() {
  const sequelize = await connectWithSequelize();

  const [results] = await sequelize.query(
    `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${DB_NAME}'`
  );

  try {
    if (results.length === 0) {
      console.log(`${DB_NAME} 스키마가 존재하지 않습니다. 생성 중...`);
      await sequelize.query(`CREATE DATABASE ${DB_NAME}`);
      console.log("스키마 생성 완료.");
      await resetConnection(sequelize)
    } else {
      throw { message: 'database exists' }
    }
  } catch (error) {
    if (error.message.includes("database exists")) {
      console.log("스키마가 이미 존재합니다.");
    } else {
      console.error("커넥션 및 스키마 확인 중 오류 발생:", error);
      throw error;
    }
  }


}

/**
 * 
 * @param sequelize 종료할 sequelize
 * @returns sequelize
 */
export async function resetConnection(sequelize: Sequelize): Promise<Sequelize> {
  try {
    // 기존 연결 종료
    await sequelize.close();
    console.log("기존 연결 종료됨.");

    const newSequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      dialect: 'mysql',
      logging: false
    });

    // 새 연결 테스트
    await newSequelize.authenticate();
    console.log("새로운 연결이 성공적으로 생성되었습니다.");

    // 이후 newSequelize를 사용해 작업을 진행합니다.
    return newSequelize;
  } catch (error) {
    console.error("연결 재설정 중 오류 발생:", error);
    throw error;
  }
}
