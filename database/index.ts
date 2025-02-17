import mariadb from 'mariadb';

const pool = mariadb.createPool({
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: 5,       
});

export const getConnection = async () => {
  try {
    return await pool.getConnection();
  } catch (error) {
    console.error('DB 연결 에러:', error);
    throw error;
  }
};
