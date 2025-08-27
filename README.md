# 🎬 Cine Monorepo

Sistema de gestión de reservas de películas en salas de cine.

## 📋 Requisitos

- Node.js 20+ (recomendado)
- PostgreSQL 16 (Homebrew en macOS) o Docker (opcional)

## 🏗️ Arquitectura

- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js 15 (App Router)
- **Base de datos**: PostgreSQL 16
- **ORM**: Prisma con migraciones

## 🚀 Setup rápido

### 1. Clonar y configurar

```bash
git clone <repo-url>
cd cine-monorepo
```

### 2. Backend (NestJS)

```bash
cd server

# Instalar dependencias
npm install

# Configurar base de datos (macOS)
brew install postgresql@16
brew services start postgresql@16

# Crear usuario y base de datos
export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"
psql -d postgres -c "CREATE ROLE cine LOGIN PASSWORD 'cine';" || true
createdb -O cine cine || true

# Aplicar migraciones y seed
npm run prisma:migrate
npm run prisma:seed

# Iniciar servidor
npm run start:dev
```

**API disponible en**: http://localhost:3000
**Documentación Swagger**: http://localhost:3000/docs

### 3. Frontend (Next.js)

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
│   │   ├── api.ts         # Cliente API
│   │   └── page.tsx       # Interfaz de administración
│   └── package.json
└── docker-compose.yml     # PostgreSQL (opcional)
```

## 🎯 Funcionalidades

### Backend (NestJS)

- **Movies**: CRUD completo de películas
- **Halls**: CRUD completo de salas de cine
- **Showtimes**: Crear funciones (película + sala + hora)
- **Tickets**: Compra de tickets con validaciones

### Reglas de negocio implementadas

- ✅ No se pueden crear funciones en el pasado
- ✅ No se puede superar la capacidad de la sala
- ✅ Transacciones para evitar sobreventa
- ✅ Validación global con class-validator

### Frontend (Next.js)

- 📝 Formularios para crear películas, salas y funciones
- 🎫 Compra de tickets con un clic
- 🔄 Actualización automática de datos
- 📱 Interfaz responsive

## 🛠️ Scripts útiles

### Backend

```bash
cd server

# Desarrollo
npm run start:dev          # Servidor con hot reload
npm run build              # Compilar TypeScript
npm run test               # Ejecutar tests

# Prisma
npm run prisma:migrate     # Aplicar migraciones
npm run prisma:generate    # Generar Prisma Client
npm run prisma:studio      # Abrir Prisma Studio
npm run prisma:seed        # Ejecutar seed de datos
```

### Frontend

```bash
cd web

npm run dev                # Servidor de desarrollo
npm run build              # Build de producción
npm run start              # Servidor de producción
```

## 🔗 Endpoints principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/movies` | Listar películas |
| POST | `/movies` | Crear película |
| GET | `/halls` | Listar salas |
| POST | `/halls` | Crear sala |
| GET | `/showtimes` | Listar funciones |
| POST | `/showtimes` | Crear función |
| POST | `/tickets/purchase` | Comprar ticket |

## 🗄️ Modelos de datos

- **Movie**: título, descripción, duración
- **CinemaHall**: nombre, capacidad
- **Showtime**: película, sala, fecha/hora
- **Ticket**: función, fecha de compra

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
- Build: `npm run build`
- Producción: `npm run start:prod`

### Frontend
- Build: `npm run build`
- Producción: `npm run start`

## 📚 Documentación adicional

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Contribución

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
