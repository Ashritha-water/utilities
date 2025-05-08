import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface IUser {
  id?: number;
  user_id: string;
  username: string;
  name: string;
  role: string;
  login_url: string;
  utility_id: string;
  contact_info: {
    email?: string;
    phone?: string;
    [key: string]: any;
  };
  status: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserRole {
  id?: number;
  user_id: string;
  role_name: string;
  assigned_at?: Date;
}

export interface ILoginHistory {
  id?: number;
  user_id: string;
  ip_address: string | string[];
  user_agent: string;
  login_at: Date;
  success: boolean;
}

export class User extends Model<IUser> implements IUser {
  static async findById(userId: string): Promise<IUser | null> {
    return User.findOne({
      where: { user_id: userId }
    });
  }
  static async find({ user_id }: { user_id: string }): Promise<IUserRole[]> {
    return UserRole.findAll({ where: { user_id } });
  }
  static findByIdAndUpdate(userId: string, arg1: { name: any; contact_info: any; status: any; }, arg2: { new: boolean; }) {
    throw new Error('Method not implemented.');
  }
  declare id: number;
  declare user_id: string;
  declare username: string;
  declare name: string;
  declare role: string;
  declare login_url: string;
  declare utility_id: string;
  declare contact_info: {
    email?: string;
    phone?: string;
    [key: string]: any;
  };
  declare status: string;
  declare password: string;
  declare created_at: Date;
  declare updated_at: Date;
}

export class UserRole extends Model<IUserRole> implements IUserRole {
  static async find({ user_id }: { user_id: string }): Promise<IUserRole[]> {
    return UserRole.findAll({ where: { user_id } });
  }
  declare id: number;
  declare user_id: string;
  declare role_name: string;
  declare assigned_at: Date;
}

export class LoginHistory extends Model<ILoginHistory> implements ILoginHistory {
  declare id: number;
  declare user_id: string;
  declare ip_address: string | string[];
  declare user_agent: string;
  declare login_at: Date;
  declare success: boolean;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    unique: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  },
  login_url: {
    type: DataTypes.STRING,
    allowNull: false
  },
  utility_id: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contact_info: {
    type: DataTypes.JSONB
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'active'
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  schema: 'public',
  timestamps: true
});

UserRole.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  role_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  assigned_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'UserRole',
  tableName: 'user_roles',
  schema: 'public',
  timestamps: true
});

LoginHistory.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  ip_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_agent: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  login_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  success: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'LoginHistory',
  tableName: 'login_history',
});

// Define associations after models are initialized
User.hasMany(UserRole, { foreignKey: 'user_id' });
UserRole.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(LoginHistory, { 
  foreignKey: 'user_id', 
  sourceKey: 'user_id'  // Specify that we're using user_id as the source key
});
LoginHistory.belongsTo(User, { 
  foreignKey: 'user_id', 
  targetKey: 'user_id'  // Specify that we're using user_id as the target key
});
