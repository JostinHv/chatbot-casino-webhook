#!/usr/bin/env node

const readline = require('readline');
const { ChatbotService } = require('../application/services/ChatbotService');
const { DatabaseConnection } = require('../infrastructure/database/connection');
const { logger } = require('../infrastructure/logger');

class TestCLI {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    this.chatbotService = new ChatbotService(DatabaseConnection.getInstance());
  }

  async start() {
    console.log('🎰 CLI de Prueba - Chatbot de Casinos en Perú');
    console.log('================================================');
    console.log('Comandos disponibles:');
    console.log('  test <intent> [parametros] - Probar una intención');
    console.log('  list                          - Listar intenciones disponibles');
    console.log('  health                        - Verificar estado del sistema');
    console.log('  history                       - Ver historial de interacciones');
    console.log('  stats                         - Ver estadísticas');
    console.log('  exit                          - Salir');
    console.log('');

    this.showPrompt();
  }

  showPrompt() {
    this.rl.question('🤖 > ', async (input) => {
      const args = input.trim().split(' ');
      const command = args[0].toLowerCase();

      try {
        switch (command) {
          case 'test':
            await this.testIntent(args.slice(1));
            break;
          case 'list':
            await this.listIntents();
            break;
          case 'health':
            await this.checkHealth();
            break;
          case 'history':
            await this.showHistory();
            break;
          case 'stats':
            await this.showStats();
            break;
          case 'exit':
          case 'quit':
            console.log('👋 ¡Hasta luego!');
            this.rl.close();
            return;
          default:
            console.log('❌ Comando no reconocido. Usa "help" para ver comandos disponibles.');
        }
      } catch (error) {
        console.error('❌ Error:', error.message);
      }

      this.showPrompt();
    });
  }

  async testIntent(args) {
    if (args.length === 0) {
      console.log('❌ Uso: test <intent> [parametros]');
      console.log('Ejemplo: test abrir_casino ubicacion=Lima tipo_establecimiento=Hotel');
      return;
    }

    const intentName = args[0];
    const parameters = {};

    // Parsear parámetros adicionales
    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      if (arg.includes('=')) {
        const [key, value] = arg.split('=');
        parameters[key] = value;
      }
    }

    console.log(`🔍 Probando intención: ${intentName}`);
    console.log(`📝 Parámetros:`, parameters);

    try {
      const result = await this.chatbotService.processIntent(intentName, parameters);
      
      console.log('\n✅ Resultado:');
      console.log(`📤 Respuesta: ${result.fulfillmentText}`);
      console.log(`🎯 Intención: ${result.intent}`);
      console.log(`📊 Confianza: ${result.confidence}`);
      
      if (result.conditions) {
        console.log(`🔧 Condiciones:`, result.conditions);
      }
      
      if (result.responseId) {
        console.log(`🆔 ID Respuesta: ${result.responseId}`);
      }

    } catch (error) {
      console.error('❌ Error procesando intención:', error.message);
    }
  }

  async listIntents() {
    try {
      console.log('📋 Intenciones disponibles:');
      console.log('============================');
      
      const intents = await this.chatbotService.getAvailableIntents();
      
      if (intents.length === 0) {
        console.log('❌ No se encontraron intenciones activas.');
        return;
      }

      intents.forEach((intent, index) => {
        console.log(`${index + 1}. ${intent.nombre}`);
        console.log(`   Descripción: ${intent.descripcion || 'Sin descripción'}`);
        console.log(`   Versión: ${intent.version}`);
        console.log('');
      });

    } catch (error) {
      console.error('❌ Error obteniendo intenciones:', error.message);
    }
  }

  async checkHealth() {
    try {
      console.log('🏥 Verificando estado del sistema...');
      
      const intents = await this.chatbotService.getAvailableIntents();
      const dbConnection = DatabaseConnection.getInstance();
      const isConnected = await dbConnection.testConnection();
      
      console.log('✅ Estado del sistema:');
      console.log(`   📊 Base de datos: ${isConnected ? 'Conectada' : 'Desconectada'}`);
      console.log(`   🎯 Intenciones activas: ${intents.length}`);
      console.log(`   ⏰ Timestamp: ${new Date().toISOString()}`);

    } catch (error) {
      console.error('❌ Error verificando estado:', error.message);
    }
  }

  async showHistory() {
    try {
      console.log('📜 Historial de interacciones:');
      console.log('===============================');
      
      const history = await this.chatbotService.getInteractionHistory(10);
      
      if (history.length === 0) {
        console.log('❌ No hay interacciones registradas.');
        return;
      }

      history.forEach((interaction, index) => {
        console.log(`${index + 1}. ${interaction.intencionDetectada}`);
        console.log(`   📅 Fecha: ${new Date(interaction.fecha).toLocaleString()}`);
        console.log(`   🎯 Entidades: ${JSON.stringify(interaction.entidadesDetectadas)}`);
        console.log(`   💬 Respuesta: ${interaction.respuestaDevuelta.substring(0, 100)}...`);
        console.log('');
      });

    } catch (error) {
      console.error('❌ Error obteniendo historial:', error.message);
    }
  }

  async showStats() {
    try {
      console.log('📊 Estadísticas del sistema:');
      console.log('============================');
      
      const stats = await this.chatbotService.getStats();
      
      if (stats.length === 0) {
        console.log('❌ No hay estadísticas disponibles.');
        return;
      }

      stats.forEach((stat, index) => {
        console.log(`${index + 1}. Fecha: ${stat.fecha_dia}`);
        console.log(`   📈 Interacciones: ${stat.interacciones_por_dia}`);
        console.log(`   🎯 Intenciones únicas: ${stat.intenciones_unicas}`);
        console.log('');
      });

    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error.message);
    }
  }
}

// Ejecutar CLI si se llama directamente
if (require.main === module) {
  const cli = new TestCLI();
  cli.start().catch(error => {
    console.error('❌ Error iniciando CLI:', error.message);
    process.exit(1);
  });
}

module.exports = { TestCLI }; 
module.exports = { TestCLI }; 