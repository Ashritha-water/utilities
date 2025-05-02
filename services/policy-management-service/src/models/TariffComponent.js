const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TariffComponent = sequelize.define('TariffComponent', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  tariff_plan_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tariff_plans',
      key: 'id'
    }
  },
  component_type: {
    type: DataTypes.ENUM(
      'FixedCharge',
      'VolumetricRate',
      'DemandCharge',
      'TimeOfUse',
      'Surcharge',
      'Rebate'
    )
  },
  calculation_model: {
    type: DataTypes.ENUM(
      'Stepped',
      'Blocked',
      'Seasonal',
      'TimeOfDay',
      'CapacityBased'
    )
  },
  parameters: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  precedence: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'tariff_components',
  timestamps: false
});

module.exports = TariffComponent; 