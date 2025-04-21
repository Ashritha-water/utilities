import { DataTypes } from 'sequelize';
import sequelize from '../config/database';
import { BaseModel, BaseAttributes } from './base.model';
import Utility from './utility.model';

interface OrganizationUnitAttributes extends BaseAttributes {
  unitId: string;
  utilityId: string;
  name: string;
  code: string;
  type: string;  // e.g., 'circle', 'division', 'subdivision', 'section', 'docket'
  parentId?: string;  // Reference to parent unit
  level: number;  // Numeric level in hierarchy (1 for circle, 2 for division, etc.)
  attributes?: any;
}

class OrganizationUnit extends BaseModel<OrganizationUnitAttributes> implements OrganizationUnitAttributes {
  public unitId!: string;
  public utilityId!: string;
  public name!: string;
  public code!: string;
  public type!: string;
  public parentId?: string;
  public level!: number;
  public attributes?: any;
}

OrganizationUnit.init(
  {
    unitId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    utilityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Utility,
        key: 'utilityId',
      },
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    parentId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'organization_units',
        key: 'unitId',
      },
    },
    level: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    attributes: {
      type: DataTypes.TEXT,
      get() {
        const rawValue = this.getDataValue('attributes');
        return rawValue ? JSON.parse(rawValue) : null;
      },
      set(value: any) {
        this.setDataValue('attributes', value ? JSON.stringify(value) : null);
      }
    },
  },
  {
    sequelize,
    tableName: 'organization_units',
    timestamps: true,
    paranoid: true,
  }
);

// Self-referential relationship for hierarchy
OrganizationUnit.hasMany(OrganizationUnit, {
  foreignKey: 'parentId',
  as: 'children',
});

OrganizationUnit.belongsTo(OrganizationUnit, {
  foreignKey: 'parentId',
  as: 'parent',
});

export default OrganizationUnit;
