# RadiaCare | Servicio de Radioterapia Hospitalario

Plataforma web de gestión, comunicación y reducción activa de la incertidumbre para pacientes oncológicos en tratamiento de radioterapia, reemplazando las planillas Excel manuales por un sistema reactivo y digitalizado.

---

## 🎯 Objetivo General
Optimizar el flujo de comunicación entre el equipo clínico (médicos radioncólogos, tecnólogos médicos y enfermería) y los pacientes, eliminando la ansiedad durante los tiempos de espera y tratamiento mediante:
- Visualización clara de fechas, horarios e hitos (TAC de simulación, inicio y fin de sesiones).
- Calendario interactivo amigable con instrucciones de preparación específicas.
- Avisos en tiempo real sobre contingencias técnicas de los aceleradores lineales.
- Cápsulas educativas personalizadas y filtradas por diagnóstico.
- Gestión de inasistencias en un solo clic con reprogramación automática al final del ciclo.

---

## 🔒 Privacidad Estricta y Cumplimiento Normativo (Oficina de Calidad)

> **Regla de Oro: Cero RUT**  
> Para cumplir rigurosamente con las normativas hospitalarias de protección de datos:
> 1. **No se solicita, almacena ni muestra el RUT** o número de cédula en ninguna parte del sistema.
> 2. **Identificador Único:** Número telefónico móvil verificado (E.164) o correo electrónico personal (Gmail).
> 3. **Acceso sin Contraseña (Passwordless):** Autenticación fluida mediante códigos OTP de un solo uso o Magic Links.
> 4. **No exposición de fichas clínicas completas:** Solo se gestiona la metadata logística indispensable para la atención y la categoría diagnóstica general (ej: `ca_mama`, `ca_prostata`, `ca_cabeza_cuello`) para asignar el material educativo correspondiente.

---

## 🏗️ Arquitectura y Stack Tecnológico

- **Frontend:** HTML5, React 18, Tailwind CSS, Google Fonts (`Plus Jakarta Sans` e `Inter`).
- **Diseño Visual:** Basado en principios de diseño intencional y empático (evitando clichés genéricos de IA), con paleta oceánica y relajante (Deep Ocean Slate `#142938`, Jade Restaurativo `#0D7C66`).
- **Base de Datos Relacional (PostgreSQL):** Modelo normalizado con tablas para `machines`, `patients`, `appointments`, `educational_content` y `notification_logs`.
- **Automatización de Mensajería:** Integración de disparadores en tiempo real simulando notificaciones por WhatsApp, SMS y Email ante cualquier reprogramación o alerta masiva.

---

## 🚀 Cómo Ejecutar el Proyecto Localmente

No se requiere instalar Node.js ni compilar paquetes pesados:

1. **Opción 1: Abrir directamente en el navegador**
   - Haz doble clic en el archivo `index.html` en cualquier navegador moderno (Google Chrome, Microsoft Edge, Firefox, Safari).

2. **Opción 2: Levantar servidor local (opcional)**
   ```bash
   # Con Python
   python -m http.server 3000
   ```
   Luego abre [http://localhost:3000](http://localhost:3000).

---

## 👥 Guía para Colaborar y Modificar con IA (Antigravity / Cursor / VS Code)

Si deseas solicitar nuevas funcionalidades o realizar modificaciones en el código utilizando un asistente de IA como **Google Antigravity**:
1. Abre esta carpeta en tu editor con Antigravity activo.
2. Las directrices y skills del proyecto se encuentran en la carpeta [`.agents/skills/`](.agents/skills/).
3. Puedes solicitar directamente cambios al agente escribiendo por ejemplo:
   - *"Agrega un filtro por médico radioncólogo en la vista de calendario"*
   - *"Añade una nueva cápsula educativa para Cáncer de Pulmón"*
   - *"Integra una exportación a formato PDF de la citación del paciente"*
