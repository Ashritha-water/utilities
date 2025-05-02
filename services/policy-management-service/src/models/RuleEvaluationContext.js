const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RuleEvaluationContext = sequelize.define('RuleEvaluationContext', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  context_schema: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  utility_type_id: {
    type: DataTypes.UUID
  }
}, {
  tableName: 'rule_evaluation_contexts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = RuleEvaluationContext; 