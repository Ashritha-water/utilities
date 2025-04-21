import { Model } from 'sequelize';

export interface BaseAttributes {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class BaseModel<T extends BaseAttributes> extends Model<T> {
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt?: Date;
}
