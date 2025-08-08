const mysql = require('mysql2/promise');
const { logger } = require('../logger');

class DatabaseConnection {
  constructor() {
    this.connection = null;
    this.pool = null;
  }

  static getInstance() {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  async connect() {
    try {
      if (this.pool) {
        return this.pool;
      }

      const config = {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '1234',
        database: process.env.DB_NAME || 'chatbot_casino_db',
        connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT) || 10,
        acquireTimeout: 60000,
        timeout: 60000,
        charset: 'utf8mb4',
        timezone: '+00:00'
      };

      this.pool = mysql.createPool(config);
      
      // Probar la conexión
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      
      logger.info('Conexión a base de datos establecida', {
        host: config.host,
        database: config.database,
        connectionLimit: config.connectionLimit
      });

      return this.pool;
    } catch (error) {
      logger.error('Error conectando a la base de datos', {
        error: error.message,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME
      });
      throw new Error(`Error de conexión a base de datos: ${error.message}`);
    }
  }

  async getConnection() {
    if (!this.pool) {
      await this.connect();
    }
    return this.pool.getConnection();
  }

  async query(sql, params = []) {
    try {
      const pool = await this.connect();
      const [rows] = await pool.execute(sql, params);
      return rows; // Devolver rows directamente
    } catch (error) {
      logger.error('Error ejecutando query', {
        sql: sql.substring(0, 100) + '...',
        params: params,
        error: error.message
      });
      throw error;
    }
  }

  async testConnection() {
    try {
      const connection = await this.getConnection();
      await connection.ping();
      connection.release();
      return true;
    } catch (error) {
      logger.error('Test de conexión fallido', { error: error.message });
      return false;
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
      logger.info('Conexión a base de datos cerrada');
    }
  }
}

// Manejo de señales para cerrar conexión graceful
process.on('SIGINT', async () => {
  const dbConnection = DatabaseConnection.getInstance();
  await dbConnection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  const dbConnection = DatabaseConnection.getInstance();
  await dbConnection.close();
  process.exit(0);
});

module.exports = { DatabaseConnection }; 