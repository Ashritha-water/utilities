import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface ConsumerStatusAttributes {
  statusCode: string;
  description?: string;
}

class ConsumerStatus extends Model<ConsumerStatusAttributes> implements ConsumerStatusAttributes {
  public statusCode!: string;
  public description?: string;
}

ConsumerStatus.init(
  {
    statusCode: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: 'consumer_status_master',
    timestamps: false, // Disable timestamps since this is a master table
  }
);

export default ConsumerStatus;
