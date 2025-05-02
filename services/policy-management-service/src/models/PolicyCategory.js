const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PolicyCategory = sequelize.define('PolicyCategory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  utility_type_id: {
    type: DataTypes.UUID
  }
}, {
  tableName: 'policy_categories',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = PolicyCategory; 