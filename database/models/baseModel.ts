// models/BaseModel.ts
import { Model, ModelAttributes, ModelOptions, Sequelize, SyncOptions } from "sequelize";
 
export abstract class BaseModel extends Model {

  public static modelAttributes: ModelAttributes;
  public static modelOptions: ModelOptions;

  static initialize(sequelize: Sequelize) {
    if (!this.modelAttributes) {
      throw new Error(`${this.name} modelAttributes가 정의되지 않았습니다.`);
    }

    (this as any).init(this.modelAttributes, { ...this.modelOptions, sequelize });
    console.log(`[BaseModel] ${this.name} 초기화 완료`);
  }
  
  static async sync(options?: SyncOptions): Promise<any> {
    const model = await super.sync(options);
    return model;
  }
}
