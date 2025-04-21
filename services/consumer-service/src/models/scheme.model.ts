import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Utility from './utility.model';
import Consumer from './consumer.model';

// Scheme Master
interface SchemeMasterAttributes {
  schemeId: string;
  utilityId: string;
  schemeName: string;
  description?: string;
  conditions: any;
  benefitStructure: any;
  activeFrom: Date;
  activeTo?: Date;
}

class SchemeMaster extends Model<SchemeMasterAttributes> implements SchemeMasterAttributes {
  public schemeId!: string;
  public utilityId!: string;
  public schemeName!: string;
  public description?: string;
  public conditions!: any;
  public benefitStructure!: any;
  public activeFrom!: Date;
  public activeTo?: Date;
}

SchemeMaster.init(
  {
    schemeId: {
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
    schemeName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    conditions: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    benefitStructure: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    activeFrom: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    activeTo: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    sequelize,
    tableName: 'scheme_master',
    timestamps: false,
  }
);

// Scheme Enrollment Request
interface SchemeEnrollmentRequestAttributes {
  enrollmentId: string;
  consumerId: string;
  schemeId: string;
  enrollmentDate: Date;
  status: string;
  evaluationSnapshot: any;
  remarks?: string;
}

class SchemeEnrollmentRequest extends Model<SchemeEnrollmentRequestAttributes> implements SchemeEnrollmentRequestAttributes {
  public enrollmentId!: string;
  public consumerId!: string;
  public schemeId!: string;
  public enrollmentDate!: Date;
  public status!: string;
  public evaluationSnapshot!: any;
  public remarks?: string;
}

SchemeEnrollmentRequest.init(
  {
    enrollmentId: {
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
    schemeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: SchemeMaster,
        key: 'schemeId',
      },
    },
    enrollmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    evaluationSnapshot: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    remarks: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: 'scheme_enrollment_requests',
    timestamps: true,
  }
);

// Scheme Eligibility Log
interface SchemeEligibilityLogAttributes {
  logId: string;
  consumerId: string;
  schemeId: string;
  evaluatedOn: Date;
  isEligible: boolean;
  reason?: string;
}

class SchemeEligibilityLog extends Model<SchemeEligibilityLogAttributes> implements SchemeEligibilityLogAttributes {
  public logId!: string;
  public consumerId!: string;
  public schemeId!: string;
  public evaluatedOn!: Date;
  public isEligible!: boolean;
  public reason?: string;
}

SchemeEligibilityLog.init(
  {
    logId: {
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
    schemeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: SchemeMaster,
        key: 'schemeId',
      },
    },
    evaluatedOn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isEligible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: 'scheme_eligibility_logs',
    timestamps: true,
  }
);

export { SchemeMaster, SchemeEnrollmentRequest, SchemeEligibilityLog };
