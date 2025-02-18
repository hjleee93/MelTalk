import { DataTypes, Model } from "sequelize";
import { BaseModel } from "./baseModel";

export class Users extends BaseModel {
  static override modelAttributes = {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  };

  // 모델 옵션도 클래스 내부에 정의합니다.
  static override modelOptions = {
    modelName: "Users",
    tableName: "Users",
  };

}

export default Users;
