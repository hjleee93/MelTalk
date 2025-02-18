import { Sequelize } from "sequelize";

const DB_NAME = process.env.DB_NAME || 'test';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '1234';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || '3306');

class SequelizeManager {
  private static instance: Sequelize;

  // DB 연결
  private static createConnection(database: string): Sequelize {
    return new Sequelize(database, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: 'mysql',
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    });
  }

  public static async getInstance(): Promise<Sequelize> {
    if (!this.instance) {
      this.instance = await this.initializeDatabase();
    }
    return this.instance;
  }

  // 커넥션만 먼저 확인하는 함수
  private static async validateConnection(): Promise<Sequelize> {
    const sequelize = this.createConnection('');
    try {
      await sequelize.authenticate();
      console.log('디비 서버에 성공적으로 접속했습니다.');
      return sequelize;
    } catch (error) {
      console.error('데이터베이스 접속 실패:', error);
      throw error;
    }
  }

  public static async initializeDatabase(): Promise<Sequelize> {
    const sequelize = await this.validateConnection();

    const [results] = await sequelize.query(
      `SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = '${DB_NAME}'`
    );
    if (results.length === 0) {
      console.log(`${DB_NAME} 스키마가 존재하지 않습니다. 생성 중...`);
      await sequelize.query(`CREATE DATABASE ${DB_NAME}`);
      console.log("스키마 생성 완료.");
    } else {
      console.log("스키마가 이미 존재합니다.");
    }
    return await this.getNewConnection(sequelize);

  }

  /**
   * 
   * @param sequelize 종료할 sequelize
   * @returns sequelize
   */
  public static async getNewConnection(sequelize: Sequelize): Promise<Sequelize> {
    const newSequelize = this.createConnection(DB_NAME);

    try {
      await newSequelize.authenticate();
      console.log("새로운 연결이 성공적으로 생성되었습니다.");
    } catch (error) {
      console.error("새로운 연결 생성 실패:", error);
      throw error;
    }

    try {
      await sequelize.close();
      console.log("기존 연결 종료됨.");
    } catch (error) {
      console.warn("기존 연결 종료 중 오류 발생:", error);
    }

    return newSequelize;
  }

}
export default SequelizeManager;