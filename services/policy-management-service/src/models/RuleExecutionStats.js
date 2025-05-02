const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RuleExecutionStats = sequelize.define('RuleExecutionStats', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  rule_id: {
    type: DataTypes.UUID,
    references: {
      model: 'rules',
      key: 'id'
    }
  },
  evaluation_count: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  avg_execution_time_ms: {
    type: DataTypes.DECIMAL
  },
  success_count: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  failure_count: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  last_executed: {
    type: DataTypes.DATE
  },
  last_status: {
    type: DataTypes.STRING(20)
  }
}, {
  tableName: 'rule_execution_stats',
  timestamps: false
});

module.exports = RuleExecutionStats; 