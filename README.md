# 🤖 Chatbot Casino - Backend

Un chatbot inteligente para consultas sobre regulaciones de casinos en Perú, construido con **Arquitectura Hexagonal** y **Node.js**.

## 🏗️ Arquitectura

### **Arquitectura Hexagonal (Ports & Adapters)**

```
┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ Controllers │  │ Repositories│  │   Routes    │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │  Use Cases  │  │   Services  │  │    DTOs     │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     DOMAIN                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │  Entities   │  │ Interfaces  │  │ Value Objs  │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### **Capas de la Arquitectura**

- **Domain**: Entidades de negocio, interfaces y objetos de valor
- **Application**: Casos de uso, servicios y DTOs
- **Infrastructure**: Controladores, repositorios y rutas

## 🚀 Características

- ✅ **Arquitectura Hexagonal** (Ports & Adapters)
- ✅ **Integración con Dialogflow** (formato oficial)
- ✅ **Gestión de sesiones** conversacionales
- ✅ **Normalización de entidades** (Chimbote → Provincia)
- ✅ **Respuestas condicionales** según ubicación
- ✅ **Historial de interacciones**
- ✅ **Testing automatizado**
- ✅ **Docker & Docker Compose**
- ✅ **Logging estructurado**
- ✅ **Health checks**

## 🎯 Intenciones Soportadas

| Intención | Descripción | Entidades |
|-----------|-------------|-----------|
| `abrir_casino` | Requisitos para abrir casino | - |
| `ubicacion_casino` | Ubicaciones permitidas | `@ubicacion` |
| `prevencion_ludopatia` | Medidas de prevención | `@ubicacion` |
| `regulaciones_casino` | Normativas vigentes | - |
| `licencias_casino` | Proceso de licenciamiento | - |

## 🛠️ Instalación

### **Requisitos**

- Node.js 20+
- MySQL 8.0+
- Docker & Docker Compose (opcional)

### **Instalación Local**

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd chatbot-casino

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp env.example .env
# Editar .env con tus configuraciones

# 4. Configurar base de datos
mysql -u root -p < database/init.sql

# 5. Ejecutar aplicación
npm start
```

### **Instalación con Docker**

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd chatbot-casino

# 2. Ejecutar con Docker Compose
docker-compose up -d

# 3. Verificar servicios
docker-compose ps
```

## ⚙️ Configuración

### **Variables de Entorno**

```env
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=chatbot_casino_db

# Aplicación
PORT=3000
NODE_ENV=development
LOG_LEVEL=info

# Dialogflow (opcional)
DIALOGFLOW_PROJECT_ID=tu-proyecto-id
DIALOGFLOW_AUTH_TOKEN=tu-token-secreto
```

## 🧪 Testing

### **Testing de Intenciones**

```bash
# Probar todas las intenciones
npm run test:intents

# Probar webhook de Dialogflow
npm run test:dialogflow

# Probar arquitectura completa
npm run test:architecture
```

### **Testing Manual**

```bash
# Health check
curl http://localhost:3000/api/webhook/health

# Información de la API
curl http://localhost:3000/api/webhook/

# Probar intención específica
curl -X POST http://localhost:3000/api/webhook/dialogflow/test \
  -H "Content-Type: application/json" \
  -d '{
    "intent": "ubicacion_casino",
    "parameters": {"ubicacion": "Lima"},
    "languageCode": "es"
  }'
```

## 📡 API Endpoints

### **Webhook Principal (Dialogflow)**

```
POST /api/webhook/dialogflow
```

**Formato de entrada (Dialogflow oficial):**
```json
{
  "responseId": "response-id",
  "session": "projects/project-id/agent/sessions/session-id",
  "queryResult": {
    "queryText": "¿Dónde puedo abrir un casino en Lima?",
    "action": "ubicacion_casino",
    "parameters": {
      "ubicacion": "Lima"
    },
    "allRequiredParamsPresent": true,
    "fulfillmentText": "",
    "fulfillmentMessages": [],
    "intent": {
      "name": "projects/project-id/agent/intents/intent-id",
      "displayName": "ubicacion_casino"
    },
    "intentDetectionConfidence": 0.95,
    "languageCode": "es"
  }
}
```

**Formato de salida (Dialogflow oficial):**
```json
{
  "fulfillmentText": "En Lima, los casinos solo pueden operar en hoteles de 4 o 5 estrellas y restaurantes turísticos de 5 tenedores.",
  "fulfillmentMessages": [
    {
      "text": {
        "text": ["En Lima, los casinos solo pueden operar en hoteles de 4 o 5 estrellas y restaurantes turísticos de 5 tenedores."]
      }
    }
  ],
  "payload": {
    "intent": 9,
    "confidence": 1.0,
    "responseId": 14,
    "conditions": {
      "ubicacion": "Lima"
    },
    "sessionState": null
  }
}
```

### **Endpoints Disponibles**

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `POST /api/webhook/dialogflow` | POST | **Webhook principal** (formato oficial) |
| `POST /api/webhook/dialogflow/test` | POST | Testing con formato simulado |
| `POST /api/webhook/dialogflow/validate` | POST | Validar formato de request |
| `GET /api/webhook/dialogflow/health` | GET | Health check de Dialogflow |
| `GET /api/webhook/dialogflow/info` | GET | Información de endpoints |
| `GET /api/webhook/` | GET | Información general de la API |
| `GET /api/webhook/health` | GET | Health check general |

## 🔄 Flujo Conversacional

### **Ejemplo: Ubicación de Casino**

1. **Usuario**: "¿Dónde puedo abrir un casino en Lima?"
2. **Dialogflow**: Detecta intención `ubicacion_casino` + entidad `ubicacion: "Lima"`
3. **Webhook**: Procesa con arquitectura hexagonal
4. **Backend**: 
   - ✅ Valida intención
   - ✅ Normaliza entidades (Lima → Lima)
   - ✅ Busca respuestas en BD
   - ✅ Aplica condiciones
   - ✅ Genera respuesta específica
5. **Respuesta**: "En Lima, los casinos solo pueden operar en hoteles de 4 o 5 estrellas..."

## 🗄️ Base de Datos

### **Tablas Principales**

```sql
-- Tablas principales
intenciones              # Intenciones del chatbot
respuestas               # Respuestas por intención
entidades                # Entidades del dominio
intencion_entidad        # Relación intención-entidad
valores_entidad          # Valores de entidades
sinonimos_entidad        # Sinónimos para normalización
historial_interacciones  # Historial de conversaciones
sesiones                 # Gestión de sesiones
```

### **Estructura de Datos**

```sql
-- Ejemplo de datos
INSERT INTO intenciones (id, nombre, descripcion) VALUES 
(1, 'abrir_casino', 'Requisitos para abrir casino'),
(2, 'ubicacion_casino', 'Ubicaciones permitidas');

INSERT INTO respuestas (id, intencion_id, texto, condicion) VALUES 
(1, 1, 'Para abrir un casino necesitas...', NULL),
(2, 2, 'En Lima, los casinos solo pueden operar...', '{"ubicacion": "Lima"}');
```

## 🤖 Integración con Dialogflow

### **Configuración en Dialogflow Console**

1. **Crear proyecto en GCP**
2. **Habilitar Dialogflow API**
3. **Configurar intenciones y entidades**
4. **Configurar webhook:**
   ```
   URL: https://tu-dominio.com/api/webhook/dialogflow
   Headers: Authorization: Bearer tu-token-secreto (opcional)
   ```

### **Testing de Integración**

```bash
# Probar formato oficial de Dialogflow
node scripts/test-dialogflow-webhook.js

# Probar con Postman
# URL: POST https://tu-dominio.com/api/webhook/dialogflow
# Body: (formato oficial de Dialogflow)
```

## 📁 Estructura del Proyecto

```
chatbot-casino/
├── src/
│   ├── domain/           # 🏛️ Dominio
│   │   ├── entities/     # Entidades de dominio
│   │   ├── interfaces/   # Puertos (interfaces)
│   │   └── dtos/         # Objetos de transferencia
│   ├── application/      # 📋 Casos de uso
│   │   └── use-cases/    # Lógica de aplicación
│   └── infrastructure/   # 🔧 Adaptadores
│       ├── controllers/  # Controladores REST
│       ├── repositories/ # Implementaciones de repositorios
│       └── routes/       # Definición de rutas
├── database/             # 🗄️ Scripts de BD
├── scripts/              # 🧪 Scripts de testing
├── docs/                 # 📚 Documentación
└── logs/                 # 📝 Logs de aplicación
```

## 🐳 Docker

### **Desarrollo**

```bash
# Ejecutar servicios básicos
docker-compose up -d app db

# Con phpMyAdmin
docker-compose --profile dev up -d

# Con Redis cache
docker-compose --profile cache up -d
```

### **Producción**

```bash
# Despliegue completo
docker-compose -f docker-compose.prod.yml up -d

# Verificar servicios
docker-compose -f docker-compose.prod.yml ps
```

## 📊 Monitoreo

### **Health Checks**

```bash
# Health check general
curl http://localhost:3000/api/webhook/health

# Health check de Dialogflow
curl http://localhost:3000/api/webhook/dialogflow/health

# Logs en tiempo real
docker-compose logs -f app
```

### **Métricas**

- **Respuesta time**: < 2 segundos
- **Uptime**: > 99.9%
- **Error rate**: < 0.1%
- **Intent accuracy**: > 95%

## 🔧 Desarrollo

### **Comandos Útiles**

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Ejecutar tests
npm test

# Linting
npm run lint

# Formatear código
npm run format
```

### **Debugging**

```bash
# Ver logs detallados
LOG_LEVEL=debug npm start

# Testing específico
node scripts/test-all-intents.js

# Verificar base de datos
node scripts/check-database-data.js
```

## 🚀 Despliegue

### **Requisitos de Producción**

- ✅ **SSL/HTTPS** (requerido para Dialogflow)
- ✅ **Dominio público**
- ✅ **Base de datos optimizada**
- ✅ **Logging estructurado**
- ✅ **Monitoreo y alertas**

### **Configuración de Producción**

```bash
# 1. Configurar variables de entorno
NODE_ENV=production
DB_HOST=tu-db-host
DB_USER=tu-db-user
DB_PASSWORD=tu-db-password

# 2. Configurar SSL
# Colocar certificados en nginx/ssl/

# 3. Desplegar
docker-compose -f docker-compose.prod.yml up -d

# 4. Verificar
curl https://tu-dominio.com/api/webhook/dialogflow/health
```

## 📚 Documentación Adicional

- [Guía de Integración con Dialogflow](docs/dialogflow-integration.md)
- [Guía de Docker](docs/docker-guide.md)

