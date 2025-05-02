const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RuleException = sequelize.define('RuleException', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  rule_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'rules',
      key: 'id'
    }
  },
  condition: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  override_action: {
    type: DataTypes.JSONB
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'rule_exceptions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = RuleException; 