import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { BaseModel, BaseAttributes } from './base.model';
import Utility from './utility.model';

interface ValidationRuleAttributes extends BaseAttributes {
  ruleId: string;
  transitionType: string;
  condition: any;
  errorMessage: string;
  utilityId: string;
}

class ValidationRule extends BaseModel<ValidationRuleAttributes> implements ValidationRuleAttributes {
  public ruleId!: string;
  public transitionType!: string;
  public condition!: any;
  public errorMessage!: string;
  public utilityId!: string;
}

ValidationRule.init(
  {
    ruleId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    transitionType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    condition: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    utilityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Utility,
        key: 'utilityId',
      },
    },
  },
  {
    sequelize,
    tableName: 'validation_rules',
    timestamps: true,
  }
);

export default ValidationRule;
