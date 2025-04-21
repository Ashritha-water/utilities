import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { BaseModel, BaseAttributes } from './base.model';
import ConnectionType from './connection-type.model';

interface ConnectionAttributes extends BaseAttributes {
  connectionId: string;
  consumerId: string;
  connectionNumber: string;
  connectionType: string;
  pipeSize?: string;
  serviceStartDate?: Date;
  serviceEndDate?: Date;
  status?: string;
  billingCycle?: string;
  attributes?: any;
}

class Connection extends BaseModel<ConnectionAttributes> implements ConnectionAttributes {
  public connectionId!: string;
  public consumerId!: string;
  public connectionNumber!: string;
  public connectionType!: string;
  public pipeSize?: string;
  public serviceStartDate?: Date;
  public serviceEndDate?: Date;
  public status?: string;
  public billingCycle?: string;
  public attributes?: any;
}

Connection.init(
  {
    connectionId: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    consumerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'consumers',
        key: 'consumerId',
      },
    },
    connectionNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    connectionType: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: ConnectionType,
        key: 'typeCode',
      },
    },
    pipeSize: {
      type: DataTypes.STRING(10),
    },
    serviceStartDate: {
      type: DataTypes.DATEONLY,
    },
    serviceEndDate: {
      type: DataTypes.DATEONLY,
    },
    status: {
      type: DataTypes.STRING(50),
    },
    billingCycle: {
      type: DataTypes.STRING(20),
    },
    attributes: {
      type: DataTypes.JSONB,
    },
  },
  {
    sequelize,
    tableName: 'connections',
    timestamps: true,
    paranoid: true,
  }
);

// Import this after model definition to avoid circular dependency
import Consumer from './consumer.model';

// Add association after import
Connection.belongsTo(Consumer, {
  foreignKey: 'consumerId',
  as: 'consumer',
});

export default Connection;
