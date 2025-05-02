const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RuleGroup = sequelize.define('RuleGroup', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  policy_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'policies',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  evaluation_order: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  logical_operator: {
    type: DataTypes.ENUM('AND', 'OR')
  },
  status: {
    type: DataTypes.ENUM('Active', 'Inactive'),
    allowNull: false
  }
}, {
  tableName: 'rule_groups',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = RuleGroup; 