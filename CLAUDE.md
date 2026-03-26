# CLAUDE.md — Tesoteam Fundraising CRM

> Este archivo es el contexto permanente del proyecto. Léelo al inicio de cada sesión.
> No lo modifiques sin pedirme permiso.

---

## Qué es este proyecto

Un CRM interno para fundraising empresarial de una fundación que apoya a niños y familias con enfermedades renales.

Reemplaza flujos manuales con email, WhatsApp y Excel. No es una app pública, no es para pacientes, no es una red social.

**Usuario:** equipo interno de la fundación (3–10 personas).
**Dispositivo primario:** laptop / desktop.
**Idioma de la UI:** español.

---

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 15 (App Router) |
| Lenguaje | TypeScript estricto |
| Base de datos | PostgreSQL vía Supabase |
| ORM | Prisma |
| Auth | Supabase Auth |
| UI base | shadcn/ui + Tailwind CSS |
| Estado del servidor | React Server Components + Server Actions |
| Estado del cliente | Zustand (solo donde sea necesario) |
| IA | Anthropic API (claude-sonnet) |
| Email | Resend |
| Repo | tesoteam-crm |

---

## Estructura de carpetas
Aquí está:

markdown
# CLAUDE.md — Tesoteam Fundraising CRM

> Este archivo es el contexto permanente del proyecto. Léelo al inicio de cada sesión.
> No lo modifiques sin pedirme permiso.

---

## Qué es este proyecto

Un CRM interno para fundraising empresarial de una fundación que apoya a niños y familias con enfermedades renales.

Reemplaza flujos manuales con email, WhatsApp y Excel. No es una app pública, no es para pacientes, no es una red social.

**Usuario:** equipo interno de la fundación (3–10 personas).
**Dispositivo primario:** laptop / desktop.
**Idioma de la UI:** español.

---

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | Next.js 15 (App Router) |
| Lenguaje | TypeScript estricto |
| Base de datos | PostgreSQL vía Supabase |
| ORM | Prisma |
| Auth | Supabase Auth |
| UI base | shadcn/ui + Tailwind CSS |
| Estado del servidor | React Server Components + Server Actions |
| Estado del cliente | Zustand (solo donde sea necesario) |
| IA | Anthropic API (claude-sonnet) |
| Email | Resend |
| Repo | tesoteam-crm |

---

## Estructura de carpetas
```
tesoteam-crm/
├── app/
│   ├── (auth)/
│   │   └── login/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── companies/
│   │   │   ├── page.tsx          ← lista
│   │   │   ├── new/page.tsx      ← crear
│   │   │   └── [id]/page.tsx     ← perfil
│   │   ├── contacts/
│   │   ├── pipeline/
│   │   ├── donations/
│   │   ├── retention/
│   │   ├── tasks/
│   │   └── settings/
│   └── api/
│       ├── companies/
│       ├── contacts/
│       ├── interactions/
│       ├── tasks/
│       ├── donations/
│       └── email-ai/
├── components/
│   ├── ui/                       ← shadcn components (no editar)
│   ├── layout/                   ← sidebar, topbar, shell
│   ├── companies/
│   ├── pipeline/
│   ├── interactions/
│   ├── tasks/
│   ├── donations/
│   ├── retention/
│   └── email-ai/
├── lib/
│   ├── db/                       ← prisma client singleton
│   ├── auth/                     ← helpers de sesión/roles
│   ├── pipeline/                 ← lógica de etapas
│   ├── retention/                ← lógica de estados de retención
│   ├── tasks/                    ← creación de tareas automáticas
│   ├── email-ai/                 ← generación del primer correo
│   └── validations/              ← zod schemas
├── prisma/
│   └── schema.prisma
├── types/
│   └── index.ts
├── hooks/
├── services/
└── prompts/
    └── first-contact-email.ts    ← prompt base para el correo IA
```

---

## Convenciones de código

### Generales
- TypeScript estricto — no usar `any`, no ignorar errores de tipo
- Server Actions para mutaciones (no API routes para CRUD simple)
- API routes solo para webhooks o lógica externa (ej. Anthropic)
- No usar `useEffect` para fetching de datos — usar RSC o SWR
- Zod para toda validación de inputs
- Errores siempre explícitos — no silenciar con `catch (e) {}`

### Naming
- Componentes: PascalCase (`CompanyCard.tsx`)
- Funciones/hooks: camelCase (`useCompanyFilter`)
- Server actions: `actions/companies.ts` con función `createCompany()`
- Tipos: PascalCase con sufijo descriptivo (`CompanyWithContacts`)
- Variables de entorno: `NEXT_PUBLIC_` solo si es necesario en cliente

### Componentes
- Preferir Server Components por defecto
- Marcar `"use client"` solo cuando se necesite interactividad
- Props siempre tipadas con `interface`, no `type` para props de componentes
- No pasar más de 5 props a un componente — si hay más, usar un objeto

### Base de datos
- Usar Prisma Client desde `lib/db/index.ts` (singleton)
- Nunca hacer queries en componentes — solo en server actions o route handlers
- Toda query con `try/catch` y error tipado
- Usar `select` explícito en queries — no traer campos innecesarios

---

## Modelo de datos (resumen)

Las entidades principales y sus relaciones:
```
User           → tiene Companies asignadas
Company        → tiene Contacts, Interactions, Tasks, Donations, RetentionProfile
Contact        → pertenece a Company
Interaction    → pertenece a Company, opcionalmente a Contact
Task           → pertenece a Company, asignada a User
Donation       → pertenece a Company, actualiza RetentionProfile
RetentionProfile → 1:1 con Company
EmailGeneration → pertenece a Company, opcionalmente a Contact
PipelineStageHistory → log de cambios de etapa por Company
```

Schema completo en `prisma/schema.prisma`.

---

## Módulos y responsabilidades

| Módulo | Qué hace |
|--------|----------|
| **Auth** | Login, sesión, roles (Admin / Captación / Dirección) |
| **Companies** | CRUD de empresas, asignación de responsable, etapa en pipeline |
| **Contacts** | CRUD de contactos por empresa, contacto principal |
| **Pipeline** | Vista kanban + tabla, mover empresas entre etapas, historial |
| **Interactions** | Timeline de interacciones por empresa, próximo paso |
| **Tasks** | Tareas manuales y automáticas, alertas por vencimiento |
| **Donations** | Registro de donaciones, historial, monto acumulado |
| **Retention** | Estados de retención, detección de riesgo, reactivación |
| **Email AI** | Generación del primer correo personalizado con IA |
| **Dashboard** | KPIs, pipeline summary, retención summary |

---

## Roles y permisos

| Acción | Admin | Captación | Dirección |
|--------|-------|-----------|-----------|
| Todo | ✅ | — | — |
| Empresas, contactos, interacciones, pipeline, tareas | ✅ | ✅ | — |
| Ver KPIs, pipeline, donaciones, reportes | ✅ | — | ✅ |

Los permisos se validan en cada Server Action y route handler, nunca solo en el frontend.

---

## Etapas del pipeline
```
1.  prospectoDetectado
2.  investigado
3.  contactoInicialEnviado
4.  respondio
5.  reunionAgendada
6.  propuestaPresentada
7.  seguimientoActivo
8.  donacionCerrada
9.  postDonacion
10. reactivacion
11. perdidoPausado
```

Toda empresa debe tener siempre una etapa asignada.
Cada cambio de etapa se registra en `PipelineStageHistory`.

---

## Estados de retención
```
nuevoDonante
donanteActivo
donanteRecurrente
donanteEnRiesgo
donanteInactivo
donanteReactivado
```

La lógica de transición vive en `lib/retention/`.

---

## Reglas de negocio críticas

### Empresa nueva
1. Al crear empresa → se asigna etapa `prospectoDetectado`
2. Si tiene contacto con email válido y nunca fue contactada → disparar flujo de email IA
3. Se crea tarea automática de seguimiento inicial

### Primer correo IA
- Se genera **una sola vez** por empresa en el flujo automático
- Usa los datos del registro: nombre empresa, contacto, industria, ciudad, fuente del lead, relación previa
- No inventa datos
- No promete cosas que la fundación no hace
- Queda guardado en `EmailGeneration` con `status: draft` o `sent`
- El usuario puede revisar antes de enviar (modo revisión) o enviar automáticamente

### Interacciones
- Toda interacción puede definir un `nextStep` y `nextStepDate`
- Si `nextStepDate` existe → se crea tarea automática

### Tareas automáticas
- 7 días sin actividad en empresa → alerta amarilla
- 14 días sin actividad → alerta roja
- Post-donación → crear tareas de seguimiento post-cierre
- Inactividad prolongada post-donación → mover a `donanteEnRiesgo` / `reactivacion`

### Donaciones
- Al registrar donación → actualizar o crear `RetentionProfile`
- Empresa pasa a etapa `donacionCerrada` o `postDonacion`

---

## Variables de entorno necesarias
```env
# Supabase
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Anthropic (para generación de correo)
ANTHROPIC_API_KEY=

# Resend (para envío de correo)
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# App
NEXT_PUBLIC_APP_URL=
```

---

## Flujos principales

### Flujo 1 — empresa nueva
```
usuario registra empresa
  → agrega contacto principal
  → sistema asigna etapa: prospectoDetectado
  → sistema genera primer correo con IA
  → sistema registra interacción inicial
  → sistema crea tarea de seguimiento
```

### Flujo 2 — seguimiento de prospecto
```
empresa responde
  → usuario registra interacción
  → mueve empresa de etapa
  → define siguiente acción
  → sistema monitorea inactividad
```

### Flujo 3 — cierre de donación
```
usuario registra donación
  → empresa cambia a donacionCerrada / postDonacion
  → sistema actualiza RetentionProfile
  → sistema crea tareas post-donación
```

### Flujo 4 — reactivación
```
sistema detecta inactividad prolongada
  → empresa pasa a donanteEnRiesgo / reactivacion
  → usuario recibe tarea
  → se registra recontacto
```

---

## MVP — qué debe funcionar antes de demo

- [ ] Login con Supabase Auth
- [ ] Crear, editar y ver empresa
- [ ] Crear y ver contacto por empresa
- [ ] Ver lista de empresas con filtros básicos
- [ ] Ver perfil completo de empresa
- [ ] Registrar interacción con siguiente paso
- [ ] Mover empresa en pipeline (kanban)
- [ ] Crear y ver tareas
- [ ] Registrar donación
- [ ] Ver estado de retención
- [ ] Generar primer correo con IA
- [ ] Dashboard básico con KPIs

---

## Lo que NO construimos en el MVP

- Página web pública
- App móvil
- Sistema para familias o pacientes
- Automatización completa con IA
- Envío masivo de correos
- Integración con contabilidad

---

## Cómo trabajar con este proyecto

Cuando te pida construir algo, sigue este orden:
1. Lee el módulo correspondiente en este archivo
2. Revisa las entidades de Prisma involucradas
3. Construye en este orden: schema → server action → UI
4. Valida con Zod antes de persistir
5. Maneja errores explícitamente
6. Si hay duda sobre un comportamiento → pregunta antes de inventar

No agregues dependencias nuevas sin consultarme primero.
No cambies convenciones de naming sin consultarme.
No generes datos de prueba en producción.

---

*Última actualización: inicio del proyecto — Fase 1*







