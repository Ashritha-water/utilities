import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { BaseModel, BaseAttributes } from './base.model';
import Consumer from './consumer.model';

// Latest Attributes
interface ConsumerAttributeLatestAttributes extends BaseAttributes {
  consumerId: string;
  attributeName: string;
  value: string;
}

class ConsumerAttributeLatest extends BaseModel<ConsumerAttributeLatestAttributes> implements ConsumerAttributeLatestAttributes {
  public consumerId!: string;
  public attributeName!: string;
  public value!: string;
}

ConsumerAttributeLatest.init(
  {
    consumerId: {
      type: DataTypes.UUID,
      primaryKey: true,
      references: {
        model: Consumer,
        key: 'consumerId',
      },
    },
    attributeName: {
      type: DataTypes.STRING(100),
      primaryKey: true,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'consumer_attributes_latest',
    timestamps: true,
  }
);

// Attribute History
interface ConsumerAttributeHistoryAttributes extends BaseAttributes {
  historyId: string;
  consumerId: string;
  attributeName: string;
  oldValue?: string;
  newValue: string;
  changedBy: string;
  changedAt: Date;
}

class ConsumerAttributeHistory extends BaseModel<ConsumerAttributeHistoryAttributes> implements ConsumerAttributeHistoryAttributes {
  public historyId!: string;
  public consumerId!: string;
  public attributeName!: string;
  public oldValue?: string;
  public newValue!: string;
  public changedBy!: string;
  public changedAt!: Date;
}

ConsumerAttributeHistory.init(
  {
    historyId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    consumerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Consumer,
        key: 'consumerId',
      },
    },
    attributeName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    oldValue: {
      type: DataTypes.TEXT,
    },
    newValue: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    changedBy: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    changedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'consumer_attributes_history',
    timestamps: true,
  }
);

export { ConsumerAttributeLatest, ConsumerAttributeHistory };
