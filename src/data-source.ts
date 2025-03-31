import { DataSource } from 'typeorm';
import { User } from './user/entities/user.entity';

export default new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'guang',
  database: 'nest-migration-test',
  synchronize: false,
  logging: true,
  entities: [User],
  poolSize: 10,
  migrations: ['src/migrations/**.ts'],
  connectorPackage: 'mysql2',
  extra: {
    authPlugin: 'sha256_password',
  },
});
