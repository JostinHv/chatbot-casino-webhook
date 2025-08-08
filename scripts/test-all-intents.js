#!/usr/bin/env node

const { getContainer } = require('../src/infrastructure/container/DependencyContainer');

const INTENTS_TO_TEST = [
  'abrir_casino',
  'certificado_defensa_civil', 
  'licencias_casino',
  'multas',
  'obligaciones_titular',
  'prevencion_ludopatia',
  'registro_prohibidos',
  'requisitos_maquinas',
  'ubicacion_casino'
];

async function testAllIntents() {
  console.log('🧪 Probando todas las intenciones del chatbot con nueva arquitectura hexagonal...\n');
  
  const container = getContainer();
  const processWebhookUseCase = container.getProcessWebhookUseCase();
  
  let passedTests = 0;
  let totalTests = INTENTS_TO_TEST.length;
  
  for (const intent of INTENTS_TO_TEST) {
    try {
      console.log(`📝 Probando intención: ${intent}`);
      
      // Test 1: Probar sin parámetros (flujo básico)
      const result1 = await processWebhookUseCase.execute(
        intent,
        {},
        `test_${intent}_1`,
        'es'
      );
      
      console.log(`  ✅ Sin parámetros: ${result1.fulfillmentText.substring(0, 50)}...`);
      
      // Test 2: Probar con parámetros simulados
      const mockParams = { ubicacion: 'Lima', tipo: 'Provincia' };
      const result2 = await processWebhookUseCase.execute(
        intent,
        mockParams,
        `test_${intent}_2`,
        'es'
      );
      
      console.log(`  ✅ Con parámetros: ${result2.fulfillmentText.substring(0, 50)}...`);
      
      // Test 3: Verificar que la respuesta es válida
      if (result1.fulfillmentText && result1.fulfillmentText.length > 0) {
        console.log(`  ✅ Respuesta válida para ${intent}`);
        passedTests++;
      } else {
        console.log(`  ❌ Respuesta inválida para ${intent}`);
      }
      
    } catch (error) {
      console.log(`  ❌ Error en ${intent}: ${error.message}`);
    }
    
    console.log(''); // Línea en blanco para separar
  }
  
  console.log(`📊 Resultados: ${passedTests}/${totalTests} intenciones funcionando correctamente`);
  
  if (passedTests === totalTests) {
    console.log('✅ Todas las intenciones funcionan correctamente');
    return true;
  } else {
    console.log('❌ Algunas intenciones tienen problemas');
    return false;
  }
}

// Ejecutar las pruebas si se llama directamente
if (require.main === module) {
  testAllIntents().then((success) => {
    if (success) {
      console.log('\n🏁 Pruebas completadas exitosamente');
      process.exit(0);
    } else {
      console.log('\n💥 Pruebas fallaron');
      process.exit(1);
    }
  }).catch(error => {
    console.error('💥 Error fatal:', error);
    process.exit(1);
  });
}

module.exports = { testAllIntents }; 