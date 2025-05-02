const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PolicyVersion = sequelize.define('PolicyVersion', {
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
  version: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  snapshot: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  changed_by: {
    type: DataTypes.UUID,
    allowNull: false
  },
  change_reason: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'policy_versions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['policy_id', 'version']
    }
  ]
});

module.exports = PolicyVersion; 