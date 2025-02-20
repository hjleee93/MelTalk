/**
 * 모든 모델 import
 */
import { sequelize } from "..";
import Users from "./user";
;
Users.initialize(sequelize);

export { Users };