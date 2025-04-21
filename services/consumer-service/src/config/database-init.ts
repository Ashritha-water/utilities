import sequelize from './database';
import Consumer from '../models/consumer.model';
import Connection from '../models/connection.model';
import ConnectionType from '../models/connection-type.model';
import ConsumerCategory from '../models/consumer-category.model';
import ConsumerStatus from '../models/consumer-status.model';
import OrganizationUnit from '../models/organization-unit.model';

export async function initializeDatabase() {
  try {
    // First, sync base/independent tables
    await Promise.all([
      ConsumerCategory.sync(),
      ConsumerStatus.sync(),
      ConnectionType.sync(),
      OrganizationUnit.sync(),
    ]);

    // Then sync Consumer which depends on the above
    await Consumer.sync();

    // Finally sync Connection which depends on Consumer
    await Connection.sync();

    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
    throw error;
  }
}

export async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    
    await initializeDatabase();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}
