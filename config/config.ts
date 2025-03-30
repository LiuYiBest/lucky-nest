export default () => {
  return {
    // ....
    redis: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT, 10),
      // username: process.env.DATABASE_USERNAME,
      password: process.env.REDIS_PASSWORD,
      database: process.env.REDIS_DB,
    },
  };
};
