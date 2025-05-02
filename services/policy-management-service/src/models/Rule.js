const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Rule = sequelize.define('Rule', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  external_id: {
    type: DataTypes.STRING(50)
  },
  policy_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'policies',
      key: 'id'
    }
  },
  rule_group_id: {
    type: DataTypes.UUID,
    references: {
      model: 'rule_groups',
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
  condition_type: {
    type: DataTypes.ENUM('Simple', 'Composite'),
    allowNull: false
  },
  evaluation_phase: {
    type: DataTypes.ENUM('Pre', 'Post', 'Final')
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  is_mandatory: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('Draft', 'Active', 'Inactive', 'Archived'),
    allowNull: false
  },
  error_action: {
    type: DataTypes.ENUM('Continue', 'Stop', 'Rollback')
  },
  execution_mode: {
    type: DataTypes.ENUM('Parallel', 'Sequential'),
    defaultValue: 'Parallel'
  },
  timeout_ms: {
    type: DataTypes.INTEGER,
    defaultValue: 5000
  },
  retry_policy: {
    type: DataTypes.JSONB
  },
  circuit_breaker: {
    type: DataTypes.JSONB
  },
  conditions: {
    type: DataTypes.JSONB
  },
  actions: {
    type: DataTypes.JSONB
  },
  metadata: {
    type: DataTypes.JSONB
  }
}, {
  tableName: 'rules',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = Rule; 