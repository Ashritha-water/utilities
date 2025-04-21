import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Policy from './policy.model';

interface PipeSizeAttributes {
  id: number;
  policyId: number;
  size: string;
  rate: number;
}

class PipeSize extends Model<PipeSizeAttributes> implements PipeSizeAttributes {
  public id!: number;
  public policyId!: number;
  public size!: string;
  public rate!: number;
}

PipeSize.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    policyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Policy,
        key: 'id',
      },
    },
    size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rate: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'pipe_sizes',
  }
);

// Define relationship
Policy.hasMany(PipeSize, { foreignKey: 'policyId' });
PipeSize.belongsTo(Policy, { foreignKey: 'policyId' });

export default PipeSize; 