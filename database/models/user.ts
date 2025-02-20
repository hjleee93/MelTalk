import { DataTypes, Model } from "sequelize";
import { BaseModel } from "./baseModel";

export class User extends BaseModel {
  static override modelAttributes = {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    encrypted_token: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    encrypted_refresh_token: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    token_expires_at:{
      type: DataTypes.DATE,
      allowNull:true
    } 
  };

  // 모델 옵션도 클래스 내부에 정의합니다.
  static override modelOptions = {
    modelName: "User",
    tableName: "Users",
  };
}

export default User;
