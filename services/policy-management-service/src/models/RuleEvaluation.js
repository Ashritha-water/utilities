const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RuleEvaluation = sequelize.define('RuleEvaluation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  evaluation_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  consumer_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  policy_id: {
    type: DataTypes.UUID,
    references: {
      model: 'policies',
      key: 'id'
    }
  },
  rule_id: {
    type: DataTypes.UUID,
    references: {
      model: 'rules',
      key: 'id'
    }
  },
  evaluation_context: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  evaluation_result: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Success', 'Failed', 'Partial'),
    allowNull: false
  },
  evaluation_start: {
    type: DataTypes.DATE,
    allowNull: false
  },
  evaluation_end: {
    type: DataTypes.DATE,
    allowNull: false
  },
  initiated_by: {
    type: DataTypes.STRING(50)
  },
  notes: {
    type: DataTypes.TEXT
  },
  metadata: {
    type: DataTypes.JSONB
  }
}, {
  tableName: 'rule_evaluations',
  timestamps: false
});

module.exports = RuleEvaluation; 