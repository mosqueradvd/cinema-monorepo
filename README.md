# 🎬 Cine Monorepo

Sistema de gestión de reservas de películas en salas de cine con validaciones de capacidad y prevención de sobreventa.

## 📋 Requisitos

- **Node.js**: 20+ (recomendado)
- **PostgreSQL**: 16+ (instalación local)
- **npm** o **yarn** para gestión de dependencias

## 🏗️ Arquitectura

- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js 15 (App Router) + Tailwind CSS
- **Base de datos**: PostgreSQL 16
- **ORM**: Prisma con migraciones automáticas
- **UI**: Diseño moderno con tema oscuro y notificaciones toast

## 🚀 Setup rápido

### 1. Clonar y configurar

```bash
git clone <repo-url>
cd cine-monorepo
```

### 2. Configurar PostgreSQL

**Opción A: Instalación local (recomendado)**

```bash
# macOS con Homebrew
brew install postgresql@16
brew services start postgresql@16

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Windows
# Descargar desde https://www.postgresql.org/download/windows/
```

**Crear base de datos:**

```bash
# Conectar a PostgreSQL
sudo -u postgres psql

# Crear usuario y base de datos
CREATE USER cine WITH PASSWORD 'cine';
CREATE DATABASE cine OWNER cine;
GRANT ALL PRIVILEGES ON DATABASE cine TO cine;
\q
```

### 3. Backend (NestJS)

```bash
cd server

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env  # Si existe
# Editar .env con tu configuración de PostgreSQL

# Aplicar migraciones y seed
npm run prisma:migrate
npm run prisma:seed

# Iniciar servidor
npm run start:dev
```

**API disponible en**: http://localhost:3000
**Documentación Swagger**: http://localhost:3000/docs

### 4. Frontend (Next.js)

```bash
cd web

# Instalar dependencias
npm install

# Iniciar aplicación
npm run dev
```

**Frontend disponible en**: http://localhost:3001

## 📁 Estructura del proyecto

```
cine-monorepo/
├── server/                 # Backend NestJS
│   ├── src/
│   │   ├── movies/        # CRUD de películas
│   │   ├── halls/         # CRUD de salas
│   │   ├── showtimes/     # Gestión de funciones
│   │   ├── tickets/       # Compra de tickets
│   │   └── prisma/        # Configuración de base de datos
│   ├── prisma/
│   │   ├── schema.prisma  # Modelos de datos
│   │   ├── migrations/    # Migraciones de BD
│   │   └── seed.ts        # Datos de prueba
│   └── package.json
├── web/                   # Frontend Next.js
│   ├── src/app/
│   │   ├── components/    # Componentes React
│   │   │   └── Toast.tsx  # Sistema de notificaciones
│   │   ├── api.ts         # Cliente API
│   │   ├── globals.css    # Estilos globales + Tailwind
│   │   └── page.tsx       # Interfaz de administración
│   ├── tailwind.config.js # Configuración Tailwind
│   └── package.json
└── README.md
```

## 🎯 Funcionalidades

### Backend (NestJS)

- **Movies**: CRUD completo de películas
- **Halls**: CRUD completo de salas de cine
- **Showtimes**: Crear funciones (película + sala + hora)
- **Tickets**: Compra de tickets con validaciones

### Reglas de negocio implementadas

- ✅ **No se pueden crear funciones en el pasado**
- ✅ **No se puede superar la capacidad de la sala**
- ✅ **Transacciones para evitar sobreventa**
- ✅ **Validación global con class-validator**
- ✅ **Conteo de tickets vendidos en tiempo real**

### Frontend (Next.js)

- 📝 **Formularios modernos** para crear películas, salas y funciones
- 🎫 **Compra de tickets** con un clic y validación visual
- 🔄 **Actualización automática** de datos
- 📱 **Interfaz responsive** con tema oscuro
- 🔔 **Sistema de notificaciones toast** en esquina inferior derecha
- 📊 **Contador de tickets vendidos** en tiempo real
- ⚠️ **Alertas visuales** cuando se alcanza la capacidad

## 🛠️ Scripts útiles

### Backend

```bash
cd server

# Desarrollo
npm run start:dev          # Servidor con hot reload
npm run build              # Compilar TypeScript
npm run start:prod         # Servidor de producción

# Prisma
npm run prisma:migrate     # Aplicar migraciones
npm run prisma:generate    # Generar Prisma Client
npm run prisma:studio      # Abrir Prisma Studio
npm run prisma:seed        # Ejecutar seed de datos

# Testing
npm run test               # Tests unitarios
npm run test:e2e           # Tests end-to-end
```

### Frontend

```bash
cd web

npm run dev                # Servidor de desarrollo
npm run build              # Build de producción
npm run start              # Servidor de producción
npm run lint               # Linting (si configurado)
```

## 🔗 Endpoints principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/movies` | Listar películas |
| POST | `/movies` | Crear película |
| GET | `/movies/:id` | Obtener película |
| PATCH | `/movies/:id` | Actualizar película |
| DELETE | `/movies/:id` | Eliminar película |
| GET | `/halls` | Listar salas |
| POST | `/halls` | Crear sala |
| GET | `/halls/:id` | Obtener sala |
| PATCH | `/halls/:id` | Actualizar sala |
| DELETE | `/halls/:id` | Eliminar sala |
| GET | `/showtimes` | Listar funciones |
| POST | `/showtimes` | Crear función |
| GET | `/showtimes/:id` | Obtener función |
| DELETE | `/showtimes/:id` | Eliminar función |
| POST | `/tickets/purchase` | Comprar ticket |

## 🗄️ Modelos de datos

- **Movie**: título, descripción, duración, timestamps
- **CinemaHall**: nombre, capacidad, timestamps
- **Showtime**: película, sala, fecha/hora, timestamps
- **Ticket**: función, fecha de compra, timestamps

## 🎨 Características de UI/UX

- **Tema oscuro** con colores slate/gray
- **Diseño responsive** que se adapta a móviles
- **Notificaciones toast** con animaciones suaves
- **Estados visuales** para funciones agotadas
- **Contadores en tiempo real** de tickets vendidos
- **Validación visual** en formularios
- **Iconos descriptivos** para mejor UX

## 🧪 Testing

```bash
# Backend
cd server
npm run test              # Tests unitarios
npm run test:e2e          # Tests end-to-end

# Frontend
cd web
npm run test              # Tests (si se configuran)
```

## 🚀 Deployment

### Backend
```bash
cd server
npm run build
npm run start:prod
```

### Frontend
```bash
cd web
npm run build
npm run start
```

## 🔧 Solución de problemas

### Error de conexión a PostgreSQL
```bash
# Verificar que PostgreSQL esté corriendo
sudo systemctl status postgresql  # Linux
brew services list | grep postgresql  # macOS
```

### Error de migraciones
```bash
cd server
npm run prisma:generate
npm run prisma:migrate
```

### Error de dependencias
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

## 📚 Documentación adicional

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
