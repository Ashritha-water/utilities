const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TariffPlan = sequelize.define('TariffPlan', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  utility_type_id: {
    type: DataTypes.UUID
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  billing_frequency: {
    type: DataTypes.ENUM('Monthly', 'BiMonthly', 'Quarterly')
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false
  },
  tax_policy: {
    type: DataTypes.JSONB
  },
  effective_start: {
    type: DataTypes.DATE,
    allowNull: false
  },
  effective_end: {
    type: DataTypes.DATE
  },
  version_hash: {
    type: DataTypes.BLOB,
    allowNull: false
  },
  is_default: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'tariff_plans',
  timestamps: false
});

module.exports = TariffPlan; 