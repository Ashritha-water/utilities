import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface ConnectionTypeAttributes {
  typeCode: string;
  description?: string;
}

class ConnectionType extends Model<ConnectionTypeAttributes> implements ConnectionTypeAttributes {
  public typeCode!: string;
  public description?: string;
}

ConnectionType.init(
  {
    typeCode: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: 'connection_types',
    timestamps: false, // Disable timestamps since this is a master table
  }
);

export default ConnectionType;
