import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database'; 
import Consumer from './consumer.model';
import Utility from './utility.model';

// Approval Request
interface ApprovalRequestAttributes {
  requestId: string;
  consumerId: string;
  requestType: string;
  requestPayload: any;
  status: string;
  requestedBy: string;
  requestTimestamp: Date;
  approvalComment?: string;
}

class ApprovalRequest extends Model<ApprovalRequestAttributes> implements ApprovalRequestAttributes {
  public requestId!: string;
  public consumerId!: string;
  public requestType!: string;
  public requestPayload!: any;
  public status!: string;
  public requestedBy!: string;
  public requestTimestamp!: Date;
  public approvalComment?: string;
}

ApprovalRequest.init(
  {
    requestId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    consumerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Consumer,
        key: 'consumerId',
      },
    },
    requestType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    requestPayload: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    requestedBy: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    requestTimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    approvalComment: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: 'approval_requests',
    timestamps: false,
  }
);

// Approval Level
interface ApprovalLevelAttributes {
  levelId: string;
  requestId: string;
  levelNumber: number;
  approverRole: string;
  approverId: string;
  status: string;
  remarks?: string;
  timestamp: Date;
}

class ApprovalLevel extends Model<ApprovalLevelAttributes> implements ApprovalLevelAttributes {
  public levelId!: string;
  public requestId!: string;
  public levelNumber!: number;
  public approverRole!: string;
  public approverId!: string;
  public status!: string;
  public remarks?: string;
  public timestamp!: Date;
}

ApprovalLevel.init(
  {
    levelId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    requestId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: ApprovalRequest,
        key: 'requestId',
      },
    },
    levelNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    approverRole: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    approverId: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'approval_levels',
    timestamps: true,
  }
);

// Approval Configuration
interface ApprovalConfigurationAttributes {
  configId: string;
  utilityId: string;
  requestType: string;
  approvalFlow: any;
}

class ApprovalConfiguration extends Model<ApprovalConfigurationAttributes> implements ApprovalConfigurationAttributes {
  public configId!: string;
  public utilityId!: string;
  public requestType!: string;
  public approvalFlow!: any;
}

ApprovalConfiguration.init(
  {
    configId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    utilityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Utility,
        key: 'utilityId',
      },
    },
    requestType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    approvalFlow: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'approval_configurations',
    timestamps: true,
  }
);

export { ApprovalRequest, ApprovalLevel, ApprovalConfiguration };
