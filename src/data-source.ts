import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './user/entities/user.entity';
import { Logger } from '@nestjs/common';

const logger = new Logger('DataSource');

const options: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'guang',
  database: process.env.DB_DATABASE || 'nest-migration-test',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.DB_LOGGING === 'true',
  entities: [User],
  poolSize: parseInt(process.env.DB_POOL_SIZE || '10', 10),
  migrations: ['src/migrations/**.ts'],
  connectorPackage: 'mysql2',
  extra: {
    authPlugin: 'sha256_password',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
    waitForConnections: true,
    queueLimit: 0,
  },
};

const dataSource = new DataSource(options);

// 添加连接事件监听
dataSource
  .initialize()
  .then(() => {
    logger.log('数据源初始化成功');
  })
  .catch((error) => {
    logger.error('数据源初始化失败', error.stack);
    process.exit(1);
  });

dataSource.on('error', (error) => {
  logger.error('数据库连接错误', error.stack);
});

export default dataSource;
