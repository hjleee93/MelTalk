/**
 * 모든 모델 import
 */
import { sequelize } from "..";
import Users from "./users";
;
Users.initialize(sequelize);

export { Users };