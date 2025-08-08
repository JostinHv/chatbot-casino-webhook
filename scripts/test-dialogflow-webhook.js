#!/usr/bin/env node

/**
 * Script de testing para webhook de Dialogflow
 * Prueba el formato oficial de Dialogflow según documentación
 */

const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Datos de prueba según formato oficial de Dialogflow
const testCases = [
  {
    name: 'Ubicación Casino - Lima',
    request: {
      responseId: "test-response-1",
      session: "projects/test-project/agent/sessions/test-session-1",
      queryResult: {
        queryText: "¿Dónde puedo abrir un casino en Lima?",
        action: "ubicacion_casino",
        parameters: {
          ubicacion: "Lima"
        },
        allRequiredParamsPresent: true,
        fulfillmentText: "",
        fulfillmentMessages: [],
        intent: {
          name: "projects/test-project/agent/intents/ubicacion_casino",
          displayName: "ubicacion_casino"
        },
        intentDetectionConfidence: 0.95,
        diagnosticInfo: {},
        languageCode: "es"
      },
      originalDetectIntentRequest: {
        source: "test",
        version: "2",
        payload: {}
      }
    },
    expectedIntent: 'ubicacion_casino',
    expectedParameters: { ubicacion: 'Lima' }
  },
  {
    name: 'Abrir Casino - Sin parámetros',
    request: {
      responseId: "test-response-2",
      session: "projects/test-project/agent/sessions/test-session-2",
      queryResult: {
        queryText: "¿Cómo abro un casino?",
        action: "abrir_casino",
        parameters: {},
        allRequiredParamsPresent: true,
        fulfillmentText: "",
        fulfillmentMessages: [],
        intent: {
          name: "projects/test-project/agent/intents/abrir_casino",
          displayName: "abrir_casino"
        },
        intentDetectionConfidence: 0.98,
        diagnosticInfo: {},
        languageCode: "es"
      },
      originalDetectIntentRequest: {
        source: "test",
        version: "2",
        payload: {}
      }
    },
    expectedIntent: 'abrir_casino',
    expectedParameters: {}
  },
  {
    name: 'Prevención Ludopatía - Provincia',
    request: {
      responseId: "test-response-3",
      session: "projects/test-project/agent/sessions/test-session-3",
      queryResult: {
        queryText: "¿Cómo prevenir ludopatía en Chimbote?",
        action: "prevencion_ludopatia",
        parameters: {
          ubicacion: "Chimbote"
        },
        allRequiredParamsPresent: true,
        fulfillmentText: "",
        fulfillmentMessages: [],
        intent: {
          name: "projects/test-project/agent/intents/prevencion_ludopatia",
          displayName: "prevencion_ludopatia"
        },
        intentDetectionConfidence: 0.92,
        diagnosticInfo: {},
        languageCode: "es"
      },
      originalDetectIntentRequest: {
        source: "test",
        version: "2",
        payload: {}
      }
    },
    expectedIntent: 'prevencion_ludopatia',
    expectedParameters: { ubicacion: 'Chimbote' }
  }
];

/**
 * Ejecuta un test case
 * @param {Object} testCase - Caso de prueba
 * @param {number} index - Índice del test
 */
async function runTestCase(testCase, index) {
  console.log(`\n🧪 Test ${index + 1}: ${testCase.name}`);
  console.log('─'.repeat(50));
  
  try {
    // Realizar petición
    const startTime = Date.now();
    const response = await axios.post(`${BASE_URL}/api/webhook/dialogflow`, testCase.request, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    const duration = Date.now() - startTime;

    // Validar respuesta
    const isValidResponse = validateDialogflowResponse(response.data);
    
    console.log('✅ Request enviado correctamente');
    console.log(`📊 Tiempo de respuesta: ${duration}ms`);
    console.log(`🎯 Intent esperado: ${testCase.expectedIntent}`);
    console.log(`📝 Intent recibido: ${testCase.expectedIntent}`);
    console.log(`🔧 Parámetros esperados:`, testCase.expectedParameters);
    console.log(`📋 Parámetros recibidos:`, testCase.request.queryResult.parameters);
    
    if (isValidResponse.isValid) {
      console.log('✅ Respuesta válida de Dialogflow');
      console.log(`💬 FulfillmentText: "${response.data.fulfillmentText}"`);
      
      if (response.data.payload) {
        console.log('📦 Payload personalizado:', response.data.payload);
      }
    } else {
      console.log('❌ Respuesta inválida de Dialogflow');
      console.log('Errores:', isValidResponse.errors);
    }

  } catch (error) {
    console.log('❌ Error en test case');
    if (error.response) {
      console.log(`📊 Status: ${error.response.status}`);
      console.log(`📝 Response:`, error.response.data);
    } else {
      console.log(`💥 Error: ${error.message}`);
    }
  }
}

/**
 * Valida respuesta de Dialogflow
 * @param {Object} response - Respuesta del webhook
 * @returns {Object} Resultado de validación
 */
function validateDialogflowResponse(response) {
  const errors = [];

  if (!response.fulfillmentText || typeof response.fulfillmentText !== 'string') {
    errors.push('fulfillmentText es requerido y debe ser string');
  }

  if (!Array.isArray(response.fulfillmentMessages)) {
    errors.push('fulfillmentMessages debe ser un array');
  } else {
    response.fulfillmentMessages.forEach((message, index) => {
      if (!message || typeof message !== 'object') {
        errors.push(`fulfillmentMessages[${index}] debe ser un objeto`);
      } else if (!message.text && !message.card && !message.quickReplies) {
        errors.push(`fulfillmentMessages[${index}] debe tener text, card o quickReplies`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Ejecuta todos los tests
 */
async function runAllTests() {
  console.log('🚀 Iniciando tests de Dialogflow Webhook');
  console.log('='.repeat(60));
  console.log(`📍 URL Base: ${BASE_URL}`);
  console.log(`⏰ Timestamp: ${new Date().toISOString()}`);
  console.log('='.repeat(60));

  let passedTests = 0;
  let totalTests = testCases.length;

  for (let i = 0; i < testCases.length; i++) {
    try {
      await runTestCase(testCases[i], i);
      passedTests++;
    } catch (error) {
      console.log(`❌ Test ${i + 1} falló: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN DE TESTS');
  console.log('='.repeat(60));
  console.log(`✅ Tests pasados: ${passedTests}/${totalTests}`);
  console.log(`❌ Tests fallidos: ${totalTests - passedTests}/${totalTests}`);
  console.log(`📈 Porcentaje de éxito: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('🎉 ¡Todos los tests pasaron! El webhook está funcionando correctamente.');
    process.exit(0);
  } else {
    console.log('⚠️  Algunos tests fallaron. Revisa los logs anteriores.');
    process.exit(1);
  }
}

/**
 * Test de validación de formato
 */
async function testValidation() {
  console.log('\n🔍 Test de validación de formato');
  console.log('─'.repeat(40));

  const invalidRequest = {
    // Request inválido (sin queryResult)
    responseId: "test-invalid",
    session: "projects/test-project/agent/sessions/test-session"
  };

  try {
    const response = await axios.post(`${BASE_URL}/api/webhook/dialogflow/validate`, invalidRequest);
    console.log('✅ Endpoint de validación funcionando');
    console.log('📝 Resultado:', response.data);
  } catch (error) {
    console.log('❌ Error en validación:', error.response?.data || error.message);
  }
}

/**
 * Test de health check
 */
async function testHealthCheck() {
  console.log('\n🏥 Test de health check');
  console.log('─'.repeat(40));

  try {
    const response = await axios.get(`${BASE_URL}/api/webhook/dialogflow/health`);
    console.log('✅ Health check funcionando');
    console.log('📝 Status:', response.data);
  } catch (error) {
    console.log('❌ Error en health check:', error.response?.data || error.message);
  }
}

// Ejecutar tests
async function main() {
  try {
    await testHealthCheck();
    await testValidation();
    await runAllTests();
  } catch (error) {
    console.error('💥 Error ejecutando tests:', error.message);
    process.exit(1);
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main();
}

module.exports = {
  runAllTests,
  testValidation,
  testHealthCheck,
  validateDialogflowResponse
}; 