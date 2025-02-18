import { sequelize } from '.';
import './models/index'

export const initDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("모든 모델의 테이블 동기화 완료");
  } catch (error) {
    console.error("DB 초기화 중 에러 발생:", error);
  }
};


export default initDB;
