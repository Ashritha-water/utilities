import { Sequelize, Dialect } from 'sequelize';
import dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

interface DatabaseConfig {
  url: string;
  dialect: Dialect;
  logging: boolean | ((sql: string) => void);
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

class DatabaseConfiguration {
  private static instance: DatabaseConfiguration;
  private config: DatabaseConfig;

  private constructor() {
    const url = process.env.DATABASE_URL || 
      `postgres://${encodeURIComponent(process.env.DB_USER || 'postgres')}:${encodeURIComponent(process.env.DB_PASSWORD || 'root')}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'Billing'}`;

    // Validate URL early
    try {
      new URL(url);
    } catch (error: any) {
      throw new Error(`Invalid database URL: ${error.message}`);
    }

    this.config = {
      url,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: parseInt(process.env.DB_POOL_MAX || '5'),
        min: parseInt(process.env.DB_POOL_MIN || '0'),
        acquire: parseInt(process.env.DB_POOL_ACQUIRE || '30000'),
        idle: parseInt(process.env.DB_POOL_IDLE || '10000'),
      },
    };
  }

  public static getInstance(): DatabaseConfiguration {
    if (!DatabaseConfiguration.instance) {
      DatabaseConfiguration.instance = new DatabaseConfiguration();
    }
    return DatabaseConfiguration.instance;
  }

  public getConfig(): DatabaseConfig {
    return this.config;
  }
}

// Use only the URL and options separately
const dbConfig = DatabaseConfiguration.getInstance().getConfig();

const sequelize = new Sequelize(dbConfig.url, {
  dialect: dbConfig.dialect,
  logging: dbConfig.logging,
  pool: dbConfig.pool,
});

export default sequelize;
