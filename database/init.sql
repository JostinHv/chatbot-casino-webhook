-- 🗄️ Script de inicialización para Chatbot Casino Backend
-- Arquitectura Hexagonal - Base de Datos MySQL

-- Crear base de datos si no existe
CREATE DATABASE IF NOT EXISTS chatbot_casino_db;
USE chatbot_casino_db;

DROP TABLE IF EXISTS `entidades`;
CREATE TABLE `entidades` (
  `entidad_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`entidad_id`),
  UNIQUE KEY `entidad_id` (`entidad_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `entidades`
--

LOCK TABLES `entidades` WRITE;
INSERT INTO `entidades` VALUES (1,'registro'),(2,'regulacion'),(3,'tipo_establecimiento'),(4,'tipo_licencia'),(5,'tipo_maquina'),(6,'tipo_multa'),(7,'ubicacion');
UNLOCK TABLES;

--
-- Table structure for table `frases_entrenamiento`
--

DROP TABLE IF EXISTS `frases_entrenamiento`;
CREATE TABLE `frases_entrenamiento` (
  `frase_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `intencion_id` int DEFAULT NULL,
  `texto_frase` text NOT NULL,
  PRIMARY KEY (`frase_id`),
  UNIQUE KEY `frase_id` (`frase_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `frases_entrenamiento`
--

LOCK TABLES `frases_entrenamiento` WRITE;
UNLOCK TABLES;

--
-- Table structure for table `historial_interacciones`
--

DROP TABLE IF EXISTS `historial_interacciones`;
CREATE TABLE `historial_interacciones` (
  `historial_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `fecha` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `intencion_detectada` varchar(100) DEFAULT NULL,
  `entidades_detectadas` json DEFAULT NULL,
  `respuesta_devuelta` text,
  PRIMARY KEY (`historial_id`),
  UNIQUE KEY `historial_id` (`historial_id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `historial_interacciones`
--

LOCK TABLES `historial_interacciones` WRITE;
INSERT INTO `historial_interacciones` VALUES (1,'2025-08-06 12:06:26','abrir_casino','{\"ubicacion\": \"Lima\"}','Para obtener un certificado de Defensa Civil, debes presentar planos de seguridad, planes de evacuación y cumplir con los requisitos técnicos exigidos por la normativa local.'),(2,'2025-08-06 12:07:41','abrir_casino','{\"ubicacion\": \"Lima\"}','Para obtener un certificado de Defensa Civil, debes presentar planos de seguridad, planes de evacuación y cumplir con los requisitos técnicos exigidos por la normativa local.'),(3,'2025-08-06 12:11:25','abrir_casino','{\"ubicacion\": \"Lima\"}','Para abrir un casino en Perú, debes presentar una solicitud a la Dirección General de Juegos de Casino y Máquinas Tragamonedas. Esto incluye documentos como planos del local, licencias municipales y un certificado de Defensa Civil.'),(4,'2025-08-06 12:11:40','abrir_casino','{\"ubicacion\": \"Chimbote\"}','Para abrir un casino en Perú, debes presentar una solicitud a la Dirección General de Juegos de Casino y Máquinas Tragamonedas. Esto incluye documentos como planos del local, licencias municipales y un certificado de Defensa Civil.'),(5,'2025-08-06 12:13:08','certificado_defensa_civil','{\"tipo_licencia\": \"Certificado de defensa civil\"}','Para obtener un certificado de Defensa Civil, debes presentar planos de seguridad, planes de evacuación y cumplir con los requisitos técnicos exigidos por la normativa local.'),(6,'2025-08-06 12:13:28','licencias_casino','{\"tipo_licencia\": \"Licencia municipal\"}','Para abrir un casino, necesitas una licencia municipal, un certificado de Defensa Civil y la autorización de la Dirección General de Juegos de Casino y Máquinas Tragamonedas.'),(7,'2025-08-06 12:13:38','licencias_casino','{}','Para abrir un casino, necesitas una licencia municipal, un certificado de Defensa Civil y la autorización de la Dirección General de Juegos de Casino y Máquinas Tragamonedas.'),(8,'2025-08-06 12:13:46','multas','{\"tipo_multa\": \"Multa UIT\", \"tipo_licencia\": \"Licencia municipal\"}','El incumplimiento de las normativas puede llevar a sanciones administrativas como una multa de 1000 UIT, clausura del establecimiento y pérdida de la licencia.'),(9,'2025-08-06 12:14:05','obligaciones_titular','{}','La Dirección General de Juegos de Casino y Máquinas Tragamonedas realiza inspecciones periódicas y verifica el cumplimiento de los planes y sistemas requeridos.'),(10,'2025-08-06 12:14:47','obligaciones_titular','{}','La Dirección General de Juegos de Casino y Máquinas Tragamonedas realiza inspecciones periódicas y verifica el cumplimiento de los planes y sistemas requeridos.'),(11,'2025-08-06 12:14:48','obligaciones_titular','{}','La Dirección General de Juegos de Casino y Máquinas Tragamonedas realiza inspecciones periódicas y verifica el cumplimiento de los planes y sistemas requeridos.'),(12,'2025-08-06 12:14:49','obligaciones_titular','{}','La Dirección General de Juegos de Casino y Máquinas Tragamonedas realiza inspecciones periódicas y verifica el cumplimiento de los planes y sistemas requeridos.'),(13,'2025-08-06 12:14:49','obligaciones_titular','{}','La Dirección General de Juegos de Casino y Máquinas Tragamonedas realiza inspecciones periódicas y verifica el cumplimiento de los planes y sistemas requeridos.'),(14,'2025-08-06 12:14:50','obligaciones_titular','{}','La Dirección General de Juegos de Casino y Máquinas Tragamonedas realiza inspecciones periódicas y verifica el cumplimiento de los planes y sistemas requeridos.'),(15,'2025-08-06 12:14:51','obligaciones_titular','{}','La Dirección General de Juegos de Casino y Máquinas Tragamonedas realiza inspecciones periódicas y verifica el cumplimiento de los planes y sistemas requeridos.'),(16,'2025-08-06 12:16:26','ubicacion_casino','{\"ubicacion\": \"Provincia\", \"tipo_establecimiento\": \"Hotel\"}','En provincias, puedes abrir un casino en hoteles de 3 a 5 estrellas o en resorts equivalentes.'),(17,'2025-08-06 12:16:40','requisitos_maquinas','{\"tipo_maquina\": \"Máquina tragamonedas\"}','Todas las máquinas deben cumplir con los estándares técnicos y estar registradas ante la Dirección General de Juegos de Casino y Máquinas Tragamonedas.'),(18,'2025-08-06 12:22:43','requisitos_maquinas','{\"tipo_maquina\": \"Máquina tragamonedas\"}','Todas las máquinas deben cumplir con los estándares técnicos y estar registradas ante la Dirección General de Juegos de Casino y Máquinas Tragamonedas.'),(19,'2025-08-06 12:26:11','ubicacion_casino','{}','Solo se permite abrir casinos en hoteles de 3 a 5 estrellas fuera de Lima, y de 4 a 5 estrellas en Lima y Callao.'),(20,'2025-08-06 12:36:50','abrir_casino','{}','Para abrir un casino en Perú, debes presentar una solicitud a la Dirección General de Juegos de Casino y Máquinas Tragamonedas. Esto incluye documentos como planos del local, licencias municipales y un certificado de Defensa Civil.'),(21,'2025-08-06 12:37:42','abrir_casino','{}','Para abrir un casino en Perú, debes presentar una solicitud a la Dirección General de Juegos de Casino y Máquinas Tragamonedas. Esto incluye documentos como planos del local, licencias municipales y un certificado de Defensa Civil.');
UNLOCK TABLES;

--
-- Table structure for table `intencion_entidad`
--

DROP TABLE IF EXISTS `intencion_entidad`;
CREATE TABLE `intencion_entidad` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `intencion_id` int DEFAULT NULL,
  `entidad_id` int DEFAULT NULL,
  `requerida` tinyint(1) DEFAULT '0',
  `prompt` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `intencion_entidad`
--

LOCK TABLES `intencion_entidad` WRITE;
INSERT INTO `intencion_entidad` VALUES (1,2,4,0,NULL),(2,3,4,0,NULL),(3,4,4,0,NULL),(4,4,6,0,NULL),(5,6,2,0,NULL),(6,6,7,1,'¿Dónde está tu negocio, en Lima o provincia?'),(7,7,1,0,NULL),(8,8,5,0,NULL),(9,9,3,0,NULL),(10,9,7,1,'¿Dónde está tu negocio, en Lima o provincia?');
UNLOCK TABLES;

--
-- Table structure for table `intenciones`
--

DROP TABLE IF EXISTS `intenciones`;
CREATE TABLE `intenciones` (
  `intencion_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text,
  `version` int DEFAULT '1',
  `estado_activo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`intencion_id`),
  UNIQUE KEY `intencion_id` (`intencion_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `intenciones`
--

LOCK TABLES `intenciones` WRITE;
INSERT INTO `intenciones` VALUES (1,'abrir_casino','Requisitos para abrir un casino',1,1),(2,'certificado_defensa_civil','Información sobre certificado de Defensa Civil',1,1),(3,'licencias_casino','Tipos de licencias necesarias para un casino',1,1),(4,'multas','Multas o sanciones por incumplimiento',1,1),(5,'obligaciones_titular','Obligaciones del titular del casino',1,1),(6,'prevencion_ludopatia','Medidas para prevenir la ludopatía',1,1),(7,'registro_prohibidos','Información sobre el registro de personas prohibidas',1,1),(8,'requisitos_maquinas','Requisitos técnicos de las máquinas de juego',1,1),(9,'ubicacion_casino','Lugares permitidos para abrir un casino',1,1);
UNLOCK TABLES;

--
-- Table structure for table `respuestas`
--

DROP TABLE IF EXISTS `respuestas`;
CREATE TABLE `respuestas` (
  `respuesta_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `intencion_id` int DEFAULT NULL,
  `respuesta_texto` text NOT NULL,
  `idioma` varchar(10) DEFAULT 'es',
  `condicion` JSON DEFAULT NULL,
  PRIMARY KEY (`respuesta_id`),
  UNIQUE KEY `respuesta_id` (`respuesta_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `respuestas`
--

LOCK TABLES `respuestas` WRITE;
INSERT INTO `respuestas` VALUES (1,1,'Para abrir un casino en Perú, debes presentar una solicitud a la Dirección General de Juegos de Casino y Máquinas Tragamonedas. Esto incluye documentos como planos del local, licencias municipales y un certificado de Defensa Civil.','es',NULL),(2,1,'Deberás cumplir con los requisitos establecidos por el Ministerio de Comercio Exterior y Turismo (Mincetur) y la normativa de la Ley N.° 27153, promulgada por el Congreso en 1999.','es',NULL),(3,2,'Para obtener un certificado de Defensa Civil, debes presentar planos de seguridad, planes de evacuación y cumplir con los requisitos técnicos exigidos por la normativa local.','es',NULL),(4,3,'Para abrir un casino, necesitas una licencia municipal, un certificado de Defensa Civil y la autorización de la Dirección General de Juegos de Casino y Máquinas Tragamonedas.','es',NULL),(5,3,'La autorización para operar debe ser solicitada al Mincetur, siguiendo los procedimientos estipulados en la Ley N.° 27153.','es',NULL),(6,4,'El incumplimiento de las normativas puede llevar a sanciones administrativas como una multa de 1000 UIT, clausura del establecimiento y pérdida de la licencia.','es',NULL),(7,5,'La Dirección General de Juegos de Casino y Máquinas Tragamonedas realiza inspecciones periódicas y verifica el cumplimiento de los planes y sistemas requeridos.','es',NULL),(8,5,'Como titular, debes garantizar la seguridad de los usuarios, implementar medidas contra la ludopatía y cumplir con todas las normativas vigentes.','es',NULL),(9,6,'Para prevenir la ludopatía en Perú, debes implementar un Plan de Prevención de la Ludopatía, como lo exige la Ley N.° 29907, promulgada durante el gobierno de Ollanta Humala en 2012. Este plan debe incluir campañas informativas, cuyos resultados deben presentarse cada dos años.','es',NULL),(10,7,'El registro de personas prohibidas es administrado por la Dirección General de Juegos de Casino y Máquinas Tragamonedas. Incluye personas que lo soliciten voluntariamente o sean inscritas por recomendación médica. La permanencia mínima es de seis meses, renovable automáticamente.','es',NULL),(11,7,'Se puede salir del registro de personas prohibidas con un plazo mínimo de seis meses desde su inscripción.','es',NULL),(12,8,'Todas las máquinas deben cumplir con los estándares técnicos y estar registradas ante la Dirección General de Juegos de Casino y Máquinas Tragamonedas.','es',NULL),(13,8,'Las máquinas tragamonedas deben garantizar un porcentaje de retorno al público del 85% y contar con un generador de números aleatorios.','es',NULL),(14,9,'En Lima, los casinos solo pueden operar en hoteles de 4 o 5 estrellas y restaurantes turísticos de 5 tenedores.','es','{\"ubicacion\": \"Lima\"}'),(15,9,'En provincias, puedes abrir un casino en hoteles de 3 a 5 estrellas o en resorts equivalentes.','es','{\"ubicacion\": \"Provincia\"}'),(16,9,'Solo se permite abrir casinos en hoteles de 3 a 5 estrellas fuera de Lima, y de 4 a 5 estrellas en Lima y Callao.','es','{}');
UNLOCK TABLES;

--
-- Table structure for table `sinonimos_entidad`
--

DROP TABLE IF EXISTS `sinonimos_entidad`;
CREATE TABLE `sinonimos_entidad` (
  `sinonimo_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `entidad_id` int DEFAULT NULL,
  `valor_canonico` varchar(100) DEFAULT NULL,
  `sinonimo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`sinonimo_id`),
  UNIQUE KEY `sinonimo_id` (`sinonimo_id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sinonimos_entidad`
--

LOCK TABLES `sinonimos_entidad` WRITE;
INSERT INTO `sinonimos_entidad` VALUES (1,7,'Lima','Callao'),(2,7,'Provincia','Chimbote'),(3,7,'Provincia','Nuevo Chimbote'),(4,7,'Provincia','Nv. Chimbote'),(5,7,'Provincia','Fuera de Lima'),(6,3,'Hotel','Hoteles'),(7,3,'Hotel','Resort'),(8,3,'Restaurante','Restaurante turístico'),(9,4,'Licencia municipal','Licencia de funcionamiento'),(10,4,'Licencia municipal','Licencia'),(11,4,'Certificado de defensa civil','Aprobación de defensa civil'),(12,4,'Certificado de defensa civil','Certificado'),(13,5,'Máquina tragamonedas','Tragamonedas'),(14,5,'Máquina tragamonedas','Máquina de azar'),(15,5,'Mesas de juego','Blackjack'),(16,5,'Mesas de juego','Poker'),(17,5,'Mesas de juego','Dados'),(18,5,'Mesas de juego','Ruleta'),(19,5,'Mesas de juego','Poquér'),(20,5,'Mesas de juego','Baccarat'),(21,6,'Multa','Multa máxima'),(22,6,'Multa','Multa Grande'),(23,6,'Multa','Multa UIT'),(24,6,'Multa','Gravamen'),(25,6,'Multa','Sanción');
UNLOCK TABLES;

--
-- Table structure for table `valores_entidad`
--

DROP TABLE IF EXISTS `valores_entidad`;
CREATE TABLE `valores_entidad` (
  `valor_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `entidad_id` int DEFAULT NULL,
  `valor_canonico` varchar(100) NOT NULL,
  `descripcion` text,
  PRIMARY KEY (`valor_id`),
  UNIQUE KEY `valor_id` (`valor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `valores_entidad`
--

LOCK TABLES `valores_entidad` WRITE;
INSERT INTO `valores_entidad` VALUES (1,7,'Lima','Capital del Perú'),(2,7,'Provincia','Fuera de Lima'),(3,3,'Hotel','Hotel de 3 a 5 estrellas'),(4,3,'Restaurante','Restaurante turístico'),(5,4,'Licencia municipal','Otorgada por la municipalidad'),(6,4,'Certificado de defensa civil','Emitido por la autoridad local'),(7,5,'Máquina tragamonedas','Máquina de azar electrónica'),(8,5,'Mesas de juego','Mesas de casino como ruleta o poker'),(9,6,'Multa','Sanción económica');
UNLOCK TABLES;
