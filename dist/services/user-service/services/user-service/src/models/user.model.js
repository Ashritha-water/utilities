"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginHistory = exports.UserRole = exports.User = void 0;
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class User extends sequelize_1.Model {
    static async findById(userId) {
        return User.findOne({
            where: { user_id: userId }
        });
    }
    static async find({ user_id }) {
        return UserRole.findAll({ where: { user_id } });
    }
    static findByIdAndUpdate(userId, arg1, arg2) {
        throw new Error('Method not implemented.');
    }
}
exports.User = User;
class UserRole extends sequelize_1.Model {
    static async find({ user_id }) {
        return UserRole.findAll({ where: { user_id } });
    }
}
exports.UserRole = UserRole;
class LoginHistory extends sequelize_1.Model {
}
exports.LoginHistory = LoginHistory;
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        allowNull: false,
        unique: true
    },
    username: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    login_url: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    utility_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    contact_info: {
        type: sequelize_1.DataTypes.JSONB
    },
    status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active'
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    },
    updatedAt: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: database_1.default,
    modelName: 'User',
    tableName: 'users',
    schema: 'public',
    timestamps: true
});
UserRole.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    role_name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false
    },
    assigned_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW
    }
}, {
    sequelize: database_1.default,
    modelName: 'UserRole',
    tableName: 'user_roles',
    schema: 'public',
    timestamps: true
});
LoginHistory.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id'
        }
    },
    ip_address: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    user_agent: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    login_at: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    success: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
}, {
    sequelize: database_1.default,
    modelName: 'LoginHistory',
    tableName: 'login_history',
});
// Define associations after models are initialized
User.hasMany(UserRole, { foreignKey: 'user_id' });
UserRole.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(LoginHistory, {
    foreignKey: 'user_id',
    sourceKey: 'user_id' // Specify that we're using user_id as the source key
});
LoginHistory.belongsTo(User, {
    foreignKey: 'user_id',
    targetKey: 'user_id' // Specify that we're using user_id as the target key
});
