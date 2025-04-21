import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Consumer from './consumer.model';

interface ConsumerEventAttributes {
  eventId: string;
  consumerId: string;
  eventType: string;
  eventDescription?: string;
  eventTimestamp: Date;
  performedBy: string;
  oldValues?: any;
  newValues?: any;
}

class ConsumerEvent extends Model<ConsumerEventAttributes> implements ConsumerEventAttributes {
  public eventId!: string;
  public consumerId!: string;
  public eventType!: string;
  public eventDescription?: string;
  public eventTimestamp!: Date;
  public performedBy!: string;
  public oldValues?: any;
  public newValues?: any;
}

ConsumerEvent.init(
  {
    eventId: {
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
    eventType: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    eventDescription: {
      type: DataTypes.TEXT,
    },
    eventTimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    performedBy: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    oldValues: {
      type: DataTypes.JSONB,
    },
    newValues: {
      type: DataTypes.JSONB,
    },
  },
  {
    sequelize,
    tableName: 'consumer_events',
    timestamps: false, // Using eventTimestamp instead of created_at/updated_at
  }
);

export default ConsumerEvent;
