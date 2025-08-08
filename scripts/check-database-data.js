#!/usr/bin/env node

const { DatabaseConnection } = require('../src/infrastructure/database/connection');

async function checkDatabaseData() {
  console.log('🔍 Verificando datos en la base de datos...\n');
  
  try {
    const dbConnection = DatabaseConnection.getInstance();
    
    // Verificar intenciones
    console.log('📋 INTENCIONES:');
    const intenciones = await dbConnection.query('SELECT * FROM intenciones WHERE estado_activo = TRUE');
    console.log(`Total intenciones activas: ${intenciones.length}`);
    intenciones.forEach(int => {
      console.log(`  - ID: ${int.intencion_id}, Nombre: ${int.nombre}, Estado: ${int.estado_activo}`);
    });
    
    console.log('\n📝 RESPUESTAS:');
    const respuestas = await dbConnection.query('SELECT * FROM respuestas LIMIT 10');
    console.log(`Total respuestas (primeras 10): ${respuestas.length}`);
    respuestas.forEach(resp => {
      console.log(`  - ID: ${resp.respuesta_id}, IntentID: ${resp.intencion_id}, Texto: ${resp.respuesta_texto.substring(0, 50)}...`);
    });
    
    console.log('\n🏷️ ENTIDADES:');
    const entidades = await dbConnection.query('SELECT * FROM entidades LIMIT 10');
    console.log(`Total entidades (primeras 10): ${entidades.length}`);
    entidades.forEach(ent => {
      console.log(`  - ID: ${ent.entidad_id}, Nombre: ${ent.nombre}`);
    });
    
    console.log('\n🔗 INTENCION-ENTIDAD (con requerida y prompt):');
    const intentEntities = await dbConnection.query('SELECT ie.*, e.nombre as entidad_nombre FROM intencion_entidad ie JOIN entidades e ON ie.entidad_id = e.entidad_id LIMIT 10');
    console.log(`Total relaciones (primeras 10): ${intentEntities.length}`);
    intentEntities.forEach(ie => {
      console.log(`  - IntentID: ${ie.intencion_id}, EntityID: ${ie.entidad_id}, Entidad: ${ie.entidad_nombre}, Requerida: ${ie.requerida}, Prompt: ${ie.prompt || 'N/A'}`);
    });
    
    console.log('\n💡 VALORES DE ENTIDADES:');
    const valores = await dbConnection.query('SELECT * FROM valores_entidad LIMIT 10');
    console.log(`Total valores (primeras 10): ${valores.length}`);
    valores.forEach(val => {
      console.log(`  - EntityID: ${val.entidad_id}, Valor: ${val.valor_canonico}`);
    });
    
  } catch (error) {
    console.error('❌ Error verificando base de datos:', error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  checkDatabaseData().then(() => {
    console.log('\n✅ Verificación completada');
    process.exit(0);
  }).catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
}

module.exports = { checkDatabaseData }; 