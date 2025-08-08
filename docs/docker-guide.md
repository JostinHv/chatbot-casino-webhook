# 🐳 Guía Docker - Chatbot Casino Backend

## 🚀 Inicio Rápido

### **Desarrollo Local**

```bash
# 1. Clonar repositorio
git clone <repository-url>
cd chatbot-casino

# 2. Ejecutar con Docker Compose
docker-compose up -d

# 3. Verificar servicios
docker-compose ps

# 4. Ver logs
docker-compose logs -f app
```

### **Producción**

```bash
# 1. Ejecutar en producción
docker-compose -f docker-compose.prod.yml up -d

# 2. Verificar servicios
docker-compose -f docker-compose.prod.yml ps

# 3. Escalar servicios
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

## 📋 Servicios Disponibles

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| **app** | 3000 | Backend Node.js |
| **db** | 3306 | MySQL Database |
| **phpmyadmin** | 8080 | Admin BD (dev) |
| **nginx** | 80/443 | Reverse Proxy (prod) |

## 🔧 Comandos Útiles

### **Gestión de Contenedores**

```bash
# Ver logs en tiempo real
docker-compose logs -f app

# Ejecutar comandos en contenedor
docker-compose exec app npm test
docker-compose exec db mysql -u root -p

# Reiniciar servicios
docker-compose restart app

# Detener todos los servicios
docker-compose down

# Eliminar volúmenes
docker-compose down -v
```

### **Base de Datos**

```bash
# Acceder a MySQL
docker-compose exec db mysql -u root -p chatbot_casino_db

# Ejecutar script SQL
docker-compose exec -T db mysql -u root -p < database/init.sql

# Backup de BD
docker-compose exec db mysqldump -u root -p chatbot_casino_db > backup.sql

# Restaurar BD
docker-compose exec -T db mysql -u root -p chatbot_casino_db < backup.sql
```

### **Desarrollo**

```bash
# Ejecutar tests en contenedor
docker-compose exec app npm test

# Instalar dependencias
docker-compose exec app npm install

# Ver logs de aplicación
docker-compose logs -f app

# Acceder a shell del contenedor
docker-compose exec app sh
```

## 🛠️ Configuración

### **Variables de Entorno**

```env
# Desarrollo (.env)
NODE_ENV=development
DB_HOST=db
DB_USER=root
DB_PASSWORD=root_password

# Producción
NODE_ENV=production
DB_USER=chatbot_user
DB_PASSWORD=chatbot_pass_prod
```

### **Volúmenes**

```yaml
# Datos persistentes
mysql_data: /var/lib/mysql
redis_data: /data
logs: ./logs
```

## 📊 Monitoreo

### **Health Checks**

```bash
# Verificar estado de servicios
docker-compose ps

# Health check manual
curl http://localhost:3000/api/health

# Logs de health check
docker-compose logs app | grep health
```

### **Métricas**

```bash
# Uso de recursos
docker stats

# Espacio en disco
docker system df

# Limpiar recursos no utilizados
docker system prune
```

## 🔒 Seguridad

### **Usuarios No-Root**

- La aplicación se ejecuta como usuario `nodejs` (UID 1001)
- MySQL se ejecuta como usuario `mysql`
- Nginx se ejecuta como usuario `nginx`

### **Redes Aisladas**

```yaml
networks:
  chatbot-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
```

## 🚀 Despliegue

### **Desarrollo**

```bash
# Ejecutar solo servicios básicos
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

# Con SSL (requiere certificados)
# 1. Colocar certificados en nginx/ssl/
# 2. Descomentar configuración HTTPS en nginx.conf
# 3. Ejecutar con nginx
```

## 🔧 Troubleshooting

### **Problemas Comunes**

1. **Puerto 3306 ocupado**
   ```bash
   # Cambiar puerto en docker-compose.yml
   ports:
     - "3307:3306"
   ```

2. **Permisos de logs**
   ```bash
   # Crear directorio con permisos
   mkdir -p logs && chmod 755 logs
   ```

3. **Memoria insuficiente**
   ```bash
   # Aumentar memoria en docker-compose.yml
   deploy:
     resources:
       limits:
         memory: 1G
   ```

### **Logs de Error**

```bash
# Ver todos los logs
docker-compose logs

# Filtrar por servicio
docker-compose logs app | grep ERROR

# Seguir logs en tiempo real
docker-compose logs -f app db
```

## 📚 Recursos Adicionales

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [MySQL Docker Image](https://hub.docker.com/_/mysql)
- [Node.js Docker Image](https://hub.docker.com/_/node)

---

**¡Disfruta desarrollando con Docker!** 🐳 