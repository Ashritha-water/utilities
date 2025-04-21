import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Consumer from './consumer.model';

// Consumer Snapshot
interface ConsumerSnapshotAttributes {
  snapshotId: string;
  consumerId: string;
  snapshotType: string;
  capturedAt: Date;
  capturedBy: string;
  fullSnapshot: any;
}

class ConsumerSnapshot extends Model<ConsumerSnapshotAttributes> implements ConsumerSnapshotAttributes {
  public snapshotId!: string;
  public consumerId!: string;
  public snapshotType!: string;
  public capturedAt!: Date;
  public capturedBy!: string;
  public fullSnapshot!: any;
}

ConsumerSnapshot.init(
  {
    snapshotId: {
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
    snapshotType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    capturedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    capturedBy: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fullSnapshot: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'consumer_snapshots',
    timestamps: false, // Using capturedAt instead of timestamps
  }
);

// Snapshot Correction Request
interface SnapshotCorrectionRequestAttributes {
  requestId: string;
  snapshotId: string;
  correctionReason?: string;
  correctedSnapshot: any;
  status: string;
  submittedBy: string;
  submittedAt: Date;
  reviewedBy?: string;
  reviewedAt?: Date;
}

class SnapshotCorrectionRequest extends Model<SnapshotCorrectionRequestAttributes> implements SnapshotCorrectionRequestAttributes {
  public requestId!: string;
  public snapshotId!: string;
  public correctionReason?: string;
  public correctedSnapshot!: any;
  public status!: string;
  public submittedBy!: string;
  public submittedAt!: Date;
  public reviewedBy?: string;
  public reviewedAt?: Date;
}

SnapshotCorrectionRequest.init(
  {
    requestId: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    snapshotId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: ConsumerSnapshot,
        key: 'snapshotId',
      },
    },
    correctionReason: {
      type: DataTypes.TEXT,
    },
    correctedSnapshot: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    submittedBy: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    submittedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reviewedBy: {
      type: DataTypes.STRING(100),
    },
    reviewedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: 'snapshot_correction_requests',
    timestamps: false, // Using submittedAt/reviewedAt instead of timestamps
  }
);

export { ConsumerSnapshot, SnapshotCorrectionRequest };
