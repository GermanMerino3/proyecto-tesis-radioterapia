// RadiaCare - Plataforma de Gestión y Comunicación para Radioterapia Hospitalaria
// Desarrollado con directrices de privacidad estricta (Cero RUT), frontend intencional y React reactivo.

const { useState, useEffect, useMemo, useCallback } = React;

// --- BASE DE DATOS MOCK INICIAL ---
const INITIAL_MACHINES = [
  { id: 'AL-1', name: 'Sala de Tratamiento 1', room: 'Búnker 1', model: 'Acelerador Lineal Varian', status: 'OPERATIONAL', delayMinutes: 0 },
  { id: 'AL-2', name: 'Sala de Tratamiento 2', room: 'Búnker 2', model: 'Acelerador Lineal Elekta', status: 'OPERATIONAL', delayMinutes: 0 },
];

const INITIAL_PATIENTS = [
  {
    id: 'pat-1',
    firstName: 'Carlos',
    lastNameInitial: 'Mendoza R.',
    contactPhone: '+56 9 8452 1190',
    contactEmail: 'carlos.mendoza.r@gmail.com',
    preferredChannel: 'WHATSAPP',
    diagnosisCategory: 'ca_prostata',
    diagnosisLabel: 'Cáncer de Próstata',
    assignedDoctor: 'Dra. Valentina Soto (Radioncóloga)',
    machineId: 'AL-1',
    currentPhase: 'EN_TRATAMIENTO',
    totalFractions: 25,
    completedFractions: 8,
    tacDate: '2026-08-20',
    startDate: '2026-08-28',
    estimatedEndDate: '2026-10-02',
    defaultTime: '10:30',
  },
  {
    id: 'pat-2',
    firstName: 'Rosa',
    lastNameInitial: 'Pacheco S.',
    contactPhone: '+56 9 7321 9940',
    contactEmail: 'rosa.pacheco.s@gmail.com',
    preferredChannel: 'SMS',
    diagnosisCategory: 'ca_mama',
    diagnosisLabel: 'Cáncer de Mama',
    assignedDoctor: 'Dr. Fernando Lagos (Radioncólogo)',
    machineId: 'AL-2',
    currentPhase: 'EN_TRATAMIENTO',
    totalFractions: 20,
    completedFractions: 14,
    tacDate: '2026-08-10',
    startDate: '2026-08-18',
    estimatedEndDate: '2026-09-15',
    defaultTime: '11:45',
  },
  {
    id: 'pat-3',
    firstName: 'Miguel',
    lastNameInitial: 'Ahumada T.',
    contactPhone: '+56 9 6654 3321',
    contactEmail: 'miguel.ahumada.t@gmail.com',
    preferredChannel: 'EMAIL',
    diagnosisCategory: 'ca_cabeza_cuello',
    diagnosisLabel: 'Cáncer de Cabeza y Cuello',
    assignedDoctor: 'Dra. Valentina Soto (Radioncóloga)',
    machineId: 'AL-1',
    currentPhase: 'ESPERA_TAC',
    totalFractions: 30,
    completedFractions: 0,
    tacDate: '2026-09-08',
    startDate: '2026-09-16',
    estimatedEndDate: '2026-10-28',
    defaultTime: '12:15',
  },
];

// Generador de citas representativas alrededor de la fecha actual
const generateInitialAppointments = () => {
  return [
    // Citas Carlos Mendoza (Próstata, AL-1)
    { id: 'apt-1', patientId: 'pat-1', machineId: 'AL-1', type: 'SESION_RADIOTERAPIA', sessionNumber: 6, date: '2026-09-03', time: '10:30', status: 'COMPLETED', preparation: 'Vejiga confortablemente llena (tomar 500ml agua 45 min antes).' },
    { id: 'apt-2', patientId: 'pat-1', machineId: 'AL-1', type: 'SESION_RADIOTERAPIA', sessionNumber: 7, date: '2026-09-04', time: '10:30', status: 'COMPLETED', preparation: 'Vejiga confortablemente llena (tomar 500ml agua 45 min antes).' },
    { id: 'apt-3', patientId: 'pat-1', machineId: 'AL-1', type: 'SESION_RADIOTERAPIA', sessionNumber: 8, date: '2026-09-05', time: '10:30', status: 'SCHEDULED', preparation: 'Vejiga confortablemente llena (tomar 500ml agua 45 min antes) y recto vacío.' },
    { id: 'apt-4', patientId: 'pat-1', machineId: 'AL-1', type: 'CONTROL_MEDICO', sessionNumber: null, date: '2026-09-05', time: '11:15', status: 'SCHEDULED', preparation: 'Control con Dra. Valentina Soto en Consulta 4.' },
    { id: 'apt-5', patientId: 'pat-1', machineId: 'AL-1', type: 'SESION_RADIOTERAPIA', sessionNumber: 9, date: '2026-09-08', time: '10:30', status: 'SCHEDULED', preparation: 'Vejiga confortablemente llena (tomar 500ml agua 45 min antes).' },
    { id: 'apt-6', patientId: 'pat-1', machineId: 'AL-1', type: 'SESION_RADIOTERAPIA', sessionNumber: 10, date: '2026-09-09', time: '10:30', status: 'SCHEDULED', preparation: 'Vejiga confortablemente llena (tomar 500ml agua 45 min antes).' },
    { id: 'apt-7', patientId: 'pat-1', machineId: 'AL-1', type: 'SESION_RADIOTERAPIA', sessionNumber: 11, date: '2026-09-10', time: '10:30', status: 'SCHEDULED', preparation: 'Vejiga confortablemente llena (tomar 500ml agua 45 min antes).' },
    { id: 'apt-8', patientId: 'pat-1', machineId: 'AL-1', type: 'SESION_RADIOTERAPIA', sessionNumber: 12, date: '2026-09-11', time: '10:30', status: 'SCHEDULED', preparation: 'Vejiga confortablemente llena (tomar 500ml agua 45 min antes).' },

    // Citas Rosa Pacheco (Mama, AL-2)
    { id: 'apt-9', patientId: 'pat-2', machineId: 'AL-2', type: 'SESION_RADIOTERAPIA', sessionNumber: 14, date: '2026-09-05', time: '11:45', status: 'SCHEDULED', preparation: 'Piel limpia y seca. No aplicar cremas o desodorante 2 horas antes.' },
    { id: 'apt-10', patientId: 'pat-2', machineId: 'AL-2', type: 'SESION_RADIOTERAPIA', sessionNumber: 15, date: '2026-09-08', time: '11:45', status: 'SCHEDULED', preparation: 'Piel limpia y seca. Ropa cómoda de algodón fácil de retirar.' },

    // Citas Miguel Ahumada (Cabeza y Cuello, AL-1)
    { id: 'apt-11', patientId: 'pat-3', machineId: 'AL-1', type: 'TAC_SIMULACION', sessionNumber: null, date: '2026-09-08', time: '12:15', status: 'SCHEDULED', preparation: 'Acudir en ayuno de 2 horas. Confección de máscara termoplástica personalizada (duración aprox: 45 min).' },
  ];
};

// Cápsulas Educativas Segmentadas por Diagnóstico
const EDUCATIONAL_MODULES = [
  // Cáncer de Próstata
  {
    id: 'edu-pro-1',
    category: 'ca_prostata',
    tag: 'PREPARACIÓN CLAVE',
    title: 'Por qué la vejiga llena es tu mejor escudo protector',
    readTime: '3 min',
    summary: 'Comprende cómo el agua desplaza suavemente los órganos sanos fuera del campo de tratamiento.',
    content: `
      ### ¿Por qué insistimos tanto en la preparación de la vejiga?
      Cuando bebes agua 45 minutos antes de tu cita y mantienes la vejiga confortablemente llena, ocurre algo extraordinario:
      - La vejiga aumenta de tamaño de forma controlada y empuja las asas del intestino delgado hacia arriba, alejándolas del haz de radiación.
      - Esto protege tus órganos digestivos y reduce drásticamente cualquier molestia urinaria a largo plazo.
      
      #### Recomendación práctica diaria:
      1. Orina completamente 1 hora antes de tu hora de cita.
      2. Inmediatamente bebe entre 500 y 600 ml de agua sin gas (unos 2 vasos grandes).
      3. No vuelvas a orinar hasta que hayas salido del búnker.
      
      *Si sientes que no puedes aguantar, avisa de inmediato al tecnólogo médico en la sala de espera para pasar antes.*
    `,
  },
  {
    id: 'edu-pro-2',
    category: 'ca_prostata',
    tag: 'QUÉ ESPERAR',
    title: 'Paso a paso en el búnker: La radiación dura solo 2 minutos',
    readTime: '4 min',
    summary: 'Estarás dentro unos 12 minutos en total, pero el haz activo emite sonido solo por breves instantes.',
    content: `
      ### Tu rutina diaria en el Acelerador Lineal
      Muchos pacientes sienten inquietud antes de entrar a la sala. Esto es exactamente lo que pasará:
      
      1. **Posicionamiento (5 min):** Los tecnólogos te ayudarán a recostarte en la camilla con tus soportes de piernas personalizados. Alinearán los láseres guía con las pequeñas marcas en tu piel.
      2. **Imagen de verificación IGRT (3 min):** La máquina girará tomando una radiografía de baja dosis para verificar milimétricamente la posición de tu próstata antes de encender el haz.
      3. **Tratamiento activo (2 a 3 min):** El equipo saldrá a la consola de control. Escucharás un zumbido rítmico: esa es la máquina trabajando. **No duele, no quema y no se siente nada.**
      4. **Término:** Te ayudamos a levantarte y puedes seguir con tu día normal.
    `,
  },
  {
    id: 'edu-pro-3',
    category: 'ca_prostata',
    tag: 'MITOS Y VERDADES',
    title: 'Mito aclarado: No quedas radiactivo tras la sesión',
    readTime: '2 min',
    summary: 'Puedes abrazar a tus hijos, nietos y estar con tu familia sin ninguna restricción.',
    content: `
      ### La radioterapia externa no deja residuos en tu cuerpo
      A diferencia de ciertos tratamientos de medicina nuclear, la radioterapia con Acelerador Lineal funciona como una bombilla de luz:
      - Cuando la luz se apaga, la habitación queda a oscuras.
      - De la misma forma, cuando el acelerador se detiene, **no queda ninguna radiación dentro de ti**.
      - Puedes dormir con tu pareja, alzar a tus nietos, viajar en transporte público y convivir con total tranquilidad desde el primer día.
    `,
  },

  // Cáncer de Mama
  {
    id: 'edu-mam-1',
    category: 'ca_mama',
    tag: 'CUIDADO DE PIEL',
    title: 'Guía esencial para proteger la piel del pecho irradiado',
    readTime: '3 min',
    summary: 'Aprende qué productos usar y cuáles suspender para mantener tu piel sana durante las semanas de tratamiento.',
    content: `
      ### Cuidado diario de la piel en radioterapia de mama
      Hacia la segunda o tercera semana, la piel del área tratada puede verse sonrosada, similar a una leve insolación de verano.
      
      #### Reglas de oro:
      - **Agua tibia:** Dúchate con agua templada. Evita el chorro de agua caliente directamente sobre el pecho.
      - **Jabón neutro:** Usa jabón syndet o de glicerina neutra sin fragancias. Seca con toques suaves de toalla, sin frotar.
      - **Hidratación autorizada:** Aplica únicamente la crema recomendada por tu médico (ej. caléndula o dexpantenol) **después** de la sesión diaria, nunca justo antes de entrar al acelerador.
      - **Cero desodorantes con aluminio:** En la axila del lado tratado, evita antitranspirantes que contengan metales.
    `,
  },
  {
    id: 'edu-mam-2',
    category: 'ca_mama',
    tag: 'VESTIMENTA',
    title: 'Ropa cómoda: Adiós a los aros metálicos por ahora',
    readTime: '2 min',
    summary: 'Prendas 100% algodón, holgadas y sin elásticos que presionen la zona de tratamiento.',
    content: `
      ### ¿Qué ponerte para venir al hospital?
      - Prefiere sostenes deportivos de algodón sin costuras ni varillas/aros de metal.
      - Las blusas o camisas con botones al frente son mucho más fáciles de poner y quitar en el vestidor.
      - Evita el roce de tirantes apretados sobre la clavícula o la zona mamaria.
    `,
  },
  {
    id: 'edu-mam-3',
    category: 'ca_mama',
    tag: 'MOVILIDAD',
    title: 'Ejercicios suaves para preservar la elasticidad del brazo',
    readTime: '4 min',
    summary: 'Rutina de 5 minutos al día para evitar la rigidez del hombro y facilitar la postura en la máquina.',
    content: `
      ### Mantén la flexibilidad sin forzar
      Durante cada sesión, deberás mantener el brazo elevado sobre la cabeza en un soporte ergonómico.
      - Realiza caminatas de dedos sobre la pared 2 veces al día.
      - Giros suaves de hombro hacia atrás respirando pausadamente.
      - Si sientes tirantez o hinchazón, consulta con el equipo de enfermería en tu próximo control semanal.
    `,
  },

  // Cáncer de Cabeza y Cuello
  {
    id: 'edu-cc-1',
    category: 'ca_cabeza_cuello',
    tag: 'SALUD ORAL',
    title: 'Cuidado bucal y prevención de mucositis',
    readTime: '4 min',
    summary: 'Enjuagues suaves con bicarbonato y cepillo extra blando para proteger encías y paladar.',
    content: `
      ### Protocolo de protección de la mucosa oral
      - Cepilla tus dientes suavemente después de cada comida con cepillo post-quirúrgico extra suave.
      - Enjuagues 4 veces al día con solución salina y una pizca de bicarbonato en agua hervida tibia.
      - Evita pastas dentales blanqueadoras o enjuagues comerciales con alcohol.
    `,
  },
  {
    id: 'edu-cc-2',
    category: 'ca_cabeza_cuello',
    tag: 'NUTRICIÓN',
    title: 'Alimentación fácil de deglutir y rica en proteínas',
    readTime: '3 min',
    summary: 'Texturas suaves, purés nutritivos y cómo mantener tu peso sin molestias.',
    content: `
      ### Nutrición durante la radioterapia de cabeza y cuello
      - Prefiere comidas tibias o frías (el calor excesivo irrita la garganta).
      - Texturas papilla, batidos nutritivos con proteína en polvo, cremas de verduras y huevo cocido.
      - Evita cítricos fuertes, picantes, comidas crujientes o vinagres.
    `,
  },
];

// --- PERFILES DEL EQUIPO CLÍNICO ---
const CLINICAL_STAFF = [
  { id: 'staff-1', name: 'Dra. Valentina Soto', role: 'Médico Radioncóloga', specialty: 'Jefa de Servicio de Radioterapia' },
  { id: 'staff-2', name: 'Dr. Fernando Lagos', role: 'Médico Radioncólogo', specialty: 'Especialista en Mama y Tórax' },
  { id: 'staff-3', name: 'Tec. Med. Roberto Castro', role: 'Tecnólogo Médico', specialty: 'Supervisor de Búnkers y Dosimetría' },
];

// Fecha simulada de la demo
const DEMO_TODAY = '2026-09-05';

// Etiquetas visibles para cada tipo de cita
const APPOINTMENT_TYPE_LABELS = {
  SESION_RADIOTERAPIA: { badge: (apt) => `Sesión #${apt.sessionNumber}`, title: 'Sesión diaria de radioterapia' },
  CONTROL_MEDICO: { badge: () => 'Control Médico', title: 'Control semanal con radioncólogo' },
  TAC_SIMULACION: { badge: () => 'TAC de Simulación', title: 'TAC para planificar tu tratamiento' },
};

const WEEKDAY_SHORT = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];

function normalizePhoneDigits(phoneStr) {
  return (phoneStr || '').replace(/\D/g, '');
}

// --- PORTAL DE ENTRADA / INICIO DE SESIÓN INSTITUCIONAL ---
function EntryPortalView({ patients, onLoginPatient, onLoginStaff, onTriggerNotification }) {
  const [activeTab, setActiveTab] = useState('PATIENT'); // 'PATIENT' | 'STAFF'
  const [phoneInput, setPhoneInput] = useState('+56 9 8452 1190');
  const [step, setStep] = useState('PHONE'); // 'PHONE' | 'OTP'
  const [otpInput, setOtpInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedStaffId, setSelectedStaffId] = useState('staff-1');

  // Identificar paciente según el teléfono ingresado
  const matchedPatient = useMemo(() => {
    const inputDigits = normalizePhoneDigits(phoneInput);
    if (!inputDigits || inputDigits.length < 6) return null;
    return patients.find(p => {
      const pDigits = normalizePhoneDigits(p.contactPhone);
      return pDigits.endsWith(inputDigits) || inputDigits.endsWith(pDigits);
    }) || null;
  }, [patients, phoneInput]);

  // Handler: Solicitar código SMS/WhatsApp
  const handleRequestOtp = (e) => {
    if (e) e.preventDefault();
    setErrorMessage('');

    if (!matchedPatient) {
      setErrorMessage('No encontramos un paciente registrado con este número. Por favor verifica los dígitos o selecciona uno de los accesos de prueba a continuación.');
      return;
    }

    onTriggerNotification(
      matchedPatient.contactPhone,
      matchedPatient.preferredChannel === 'EMAIL' ? 'SMS' : matchedPatient.preferredChannel,
      'Código de Acceso RadiaCare',
      `Hola ${matchedPatient.firstName}, tu código seguro de acceso al portal es 4829. Úsalo para revisar tu calendario de sesiones y recomendaciones.`,
      'Autenticación Segura'
    );

    setStep('OTP');
  };

  // Handler: Validar código
  const handleVerifyOtp = (e) => {
    if (e) e.preventDefault();
    if (!matchedPatient) return;
    if (otpInput.trim() === '4829' || otpInput.trim().length >= 4) {
      onLoginPatient(matchedPatient.id);
    } else {
      setErrorMessage('Código no válido. Ingresa 4829 o presiona "Usar código de prueba".');
    }
  };

  const currentStaff = CLINICAL_STAFF.find(s => s.id === selectedStaffId) || CLINICAL_STAFF[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#142938] to-[#0d1a24] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Elementos ambientales de iluminación */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Barra de Encabezado Institucional */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between text-white py-2 z-10">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-lg shadow-brand-900/50">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-bold text-xl tracking-tight text-white">RadiaCare</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-900/80 border border-brand-400/40 text-brand-300 font-medium">
                Hospital Clínico
              </span>
            </div>
            <p className="text-xs text-slate-300">Servicio de Radioterapia Oncológica</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-[11px] text-slate-300 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Búnkers 1 y 2 en Operación Normal</span>
        </div>
      </div>

      {/* Tarjeta Central de Inicio de Sesión */}
      <div className="max-w-xl w-full mx-auto my-auto py-6 z-10">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-fade-in">
          {/* Cabecera de la Tarjeta */}
          <div className="p-6 sm:p-8 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 text-center">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
              <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Acceso Seguro • Privacidad Estricta (Cero RUT)</span>
            </div>
            <h1 className="font-display font-bold text-2xl text-slate-900 tracking-tight">
              Portal de Entrada al Servicio
            </h1>
            <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
              Selecciona tu perfil de ingreso para acceder a tu información personalizada o a la gestión clínica del servicio de radioterapia.
            </p>

            {/* Pestañas de Acceso */}
            <div className="mt-6 grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('PATIENT');
                  setErrorMessage('');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'PATIENT'
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Soy Paciente</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('STAFF');
                  setErrorMessage('');
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
                  activeTab === 'STAFF'
                    ? 'bg-[#142938] text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Equipo Clínico</span>
              </button>
            </div>
          </div>

          {/* VISTA PESTAÑA: PACIENTE */}
          {activeTab === 'PATIENT' && (
            <div className="p-6 sm:p-8 space-y-6">
              {step === 'PHONE' ? (
                <form onSubmit={handleRequestOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Número Telefónico Registrado:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        placeholder="+56 9 8452 1190"
                        className="w-full px-4 py-3 text-sm font-semibold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50 focus:bg-white text-slate-900"
                        required
                      />
                      <div className="absolute right-3 top-3 text-slate-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-100 text-xs text-brand-900 leading-relaxed flex items-start space-x-2.5">
                    <span className="text-base leading-none">🛡️</span>
                    <div>
                      <strong>Garantía de Privacidad y Calidad:</strong> En RadiaCare no te pediremos RUT ni contraseñas bancarias complejas. Tu teléfono móvil registrado es tu documento verificador único para resguardar tu ficha médica.
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                      ⚠️ {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-all shadow-md shadow-brand-600/30 flex items-center justify-center space-x-2"
                  >
                    <span>Verificar y Recibir Código de Acceso</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </form>
              ) : (
                /* PASO OTP */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="font-display font-bold text-base text-slate-900">Código de Seguridad Enviado</h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Hemos enviado un código SMS/WhatsApp al <strong>{phoneInput}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 text-center">
                      Ingresa el código de 4 dígitos:
                    </label>
                    <input
                      type="text"
                      maxLength="4"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="4829"
                      className="w-40 mx-auto block text-center tracking-widest text-2xl font-mono font-bold py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white text-slate-900"
                      autoFocus
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setOtpInput('4829')}
                    className="block mx-auto text-xs text-brand-700 hover:text-brand-800 font-semibold underline"
                  >
                    Usar código recibido: 4829 (Autocompletar)
                  </button>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
                      ⚠️ {errorMessage}
                    </div>
                  )}

                  <div className="pt-2 flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        setStep('PHONE');
                        setErrorMessage('');
                      }}
                      className="w-1/3 py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      ← Cambiar
                    </button>
                    <button
                      type="submit"
                      className="w-2/3 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-md"
                    >
                      Ingresar al Portal
                    </button>
                  </div>
                </form>
              )}

              {/* ACCESOS RÁPIDOS DEMO PARA EVALUACIÓN / PROFESOR */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Accesos Rápidos Demo (1 Clic):
                  </span>
                  <span className="text-[10px] text-slate-400">Demostración para docentes</span>
                </div>

                <div className="space-y-2">
                  {patients.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onLoginPatient(p.id)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 hover:border-brand-400 bg-slate-50 hover:bg-brand-50/50 text-left transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 font-bold text-xs flex items-center justify-center group-hover:bg-brand-600 group-hover:text-white transition-colors">
                          {p.firstName[0]}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                            <span>{p.firstName} {p.lastNameInitial}</span>
                            <span className="text-[10px] font-normal text-slate-500 font-mono">({p.contactPhone})</span>
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {p.diagnosisLabel.replace('Cáncer de ', '')} • {p.machineId === 'AL-1' ? 'Sala 1 (Búnker 1)' : 'Sala 2 (Búnker 2)'}
                          </div>
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-brand-700 group-hover:text-brand-800">
                        Entrar →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VISTA PESTAÑA: EQUIPO CLÍNICO */}
          {activeTab === 'STAFF' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Selecciona tu Perfil Profesional:
                </label>
                <div className="space-y-2.5">
                  {CLINICAL_STAFF.map(staff => {
                    const isSelected = selectedStaffId === staff.id;
                    return (
                      <div
                        key={staff.id}
                        onClick={() => setSelectedStaffId(staff.id)}
                        className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/70 shadow-sm ring-1 ring-blue-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            👨‍⚕️
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">{staff.name}</h4>
                            <p className="text-[11px] text-slate-600">{staff.role} • {staff.specialty}</p>
                          </div>
                        </div>
                        <input
                          type="radio"
                          name="staffProfile"
                          checked={isSelected}
                          onChange={() => setSelectedStaffId(staff.id)}
                          className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                <strong>Área Restringida:</strong> Permite gestionar la planilla digital de pacientes, reprogramar citas con avisos empáticos automáticos y activar avisos preventivos por calibración o seguridad de búnkers.
              </div>

              <button
                type="button"
                onClick={() => onLoginStaff(currentStaff)}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white bg-[#142938] hover:bg-slate-800 transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <span>Ingresar a la Planilla de Gestión Clínica</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer del Portal de Entrada */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-slate-400 py-3 z-10">
        Hospital Clínico de Alta Complejidad • Plataforma RadiaCare • Diseñado con empatía clínica y privacidad estricta
      </div>
    </div>
  );
}

// --- COMPONENTE PRINCIPAL APP ---
function App() {
  // Estado de Sesión Hospitalaria:
  // null = Portal de Entrada
  // { role: 'PATIENT', patientId } = Portal del Paciente
  // { role: 'STAFF', staffName, staffRole } = Planilla del Profesional
  const [session, setSession] = useState(null);
  const [previewPatientId, setPreviewPatientId] = useState(null);

  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [machines, setMachines] = useState(INITIAL_MACHINES);
  const [appointments, setAppointments] = useState(generateInitialAppointments);
  const [notifications, setNotifications] = useState([]);
  const [activeToast, setActiveToast] = useState(null);

  // Estados de interfaz
  const [calendarViewMode, setCalendarViewMode] = useState('MONTH'); // 'MONTH' | 'WEEK'
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0); // 0 = Septiembre 2026
  const [selectedAppointmentDetail, setSelectedAppointmentDetail] = useState(null);
  const [absenceTarget, setAbsenceTarget] = useState(null); // Cita que el paciente quiere cancelar
  const [showRescheduleModal, setShowRescheduleModal] = useState(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [selectedEducationalArticle, setSelectedEducationalArticle] = useState(null);

  // Paciente activo según sesión o preview
  const currentPatient = useMemo(() => {
    if (session?.role === 'PATIENT') {
      return patients.find(p => p.id === session.patientId) || patients[0];
    }
    if (session?.role === 'STAFF' && previewPatientId) {
      return patients.find(p => p.id === previewPatientId) || patients[0];
    }
    return patients[0];
  }, [patients, session, previewPatientId]);

  // Máquina asignada al paciente actual
  const currentPatientMachine = useMemo(() => {
    return machines.find(m => m.id === currentPatient.machineId);
  }, [machines, currentPatient]);

  // Citas del paciente actual
  const currentPatientAppointments = useMemo(() => {
    return appointments.filter(a => a.patientId === currentPatient.id);
  }, [appointments, currentPatient.id]);

  // Cápsulas educativas desbloqueadas para el diagnóstico del paciente actual
  const currentEducationalModules = useMemo(() => {
    return EDUCATIONAL_MODULES.filter(m => m.category === currentPatient.diagnosisCategory);
  }, [currentPatient.diagnosisCategory]);

  // Próxima cita del paciente actual
  const nextAppointment = useMemo(() => {
    const scheduled = currentPatientAppointments
      .filter(a => a.status === 'SCHEDULED')
      .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
    return scheduled[0] || null;
  }, [currentPatientAppointments]);

  // Función para disparar notificación y toast en tiempo real
  const triggerNotification = useCallback((recipient, channel, title, body, reason) => {
    const newNotif = {
      id: 'notif-' + Date.now(),
      recipient,
      channel,
      title,
      body,
      reason,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setNotifications(prev => [newNotif, ...prev]);
    setActiveToast(newNotif);

    // Auto ocultar toast tras 7 segundos
    setTimeout(() => {
      setActiveToast(current => (current && current.id === newNotif.id ? null : current));
    }, 7000);
  }, []);

  // Handler: Paciente avisa inasistencia
  const handleReportAbsence = useCallback((appointment, reason) => {
    if (!appointment) return;

    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointment.id) {
        return {
          ...apt,
          status: 'CANCELLED_PATIENT',
          cancellationReason: reason,
        };
      }
      return apt;
    }));

    setAbsenceTarget(null);

    const appointmentWhen = appointment.date === DEMO_TODAY
      ? `de hoy (${appointment.time} hrs)`
      : `del ${formatFriendlyDate(appointment.date)} (${appointment.time} hrs)`;

    triggerNotification(
      currentPatient.preferredChannel === 'EMAIL' ? currentPatient.contactEmail : currentPatient.contactPhone,
      currentPatient.preferredChannel,
      'Inasistencia Registrada',
      `Estimado/a ${currentPatient.firstName}, hemos recibido tu aviso de inasistencia para tu cita ${appointmentWhen}. Tu cupo ha sido liberado y tu equipo clínico coordinará la reprogramación de tu dosis al final del ciclo para garantizar la efectividad total del tratamiento. Que te recuperes pronto.`,
      'Aviso de Inasistencia'
    );
  }, [currentPatient, triggerNotification]);

  // Handler: Profesional reprograma una cita
  const handleRescheduleAppointment = useCallback((appointmentId, newDate, newTime) => {
    let affectedPatient = null;

    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        affectedPatient = patients.find(p => p.id === apt.patientId);
        return {
          ...apt,
          date: newDate,
          time: newTime,
          status: 'SCHEDULED',
        };
      }
      return apt;
    }));

    setShowRescheduleModal(null);

    if (affectedPatient) {
      const machineObj = machines.find(m => m.id === affectedPatient.machineId);
      const roomLabel = machineObj ? `${machineObj.name} (${machineObj.room})` : 'tu sala de atención habitual';
      triggerNotification(
        affectedPatient.preferredChannel === 'EMAIL' ? affectedPatient.contactEmail : affectedPatient.contactPhone,
        affectedPatient.preferredChannel,
        'Actualización de horario de tu sesión',
        `Hola ${affectedPatient.firstName}, te informamos con cariño que hemos actualizado el horario de tu sesión de radioterapia: te esperamos el día ${formatFriendlyDate(newDate)} a las ${newTime} hrs en ${roomLabel}. Tu calendario en la web ya se encuentra actualizado. ¡Que tengas un excelente día!`,
        'Reprogramación de Cita'
      );
    }
  }, [patients, machines, triggerNotification]);

  // Handler: Alerta masiva por contingencia o revisión de sala
  const handleSendMassAlert = useCallback((machineId, alertType, delayMinutes, customNotes) => {
    setMachines(prev => prev.map(m => {
      if (m.id === machineId) {
        return {
          ...m,
          status: alertType === 'MAINTENANCE' ? 'MAINTENANCE' : 'DELAYED',
          delayMinutes: parseInt(delayMinutes || 0, 10),
        };
      }
      return m;
    }));

    const todayStr = '2026-09-05';
    const affectedAppointments = appointments.filter(a => a.machineId === machineId && a.date === todayStr && a.status === 'SCHEDULED');
    const machineObj = machines.find(m => m.id === machineId);
    const roomTitle = machineObj ? `${machineObj.name} (${machineObj.room})` : 'tu sala de tratamiento';

    affectedAppointments.forEach(apt => {
      const patient = patients.find(p => p.id === apt.patientId);
      if (patient) {
        const newEstimatedTime = calculateDelayedTime(apt.time, delayMinutes);
        const bodyText = alertType === 'MAINTENANCE'
          ? `Hola ${patient.firstName}, te saludamos con mucho cariño desde el Servicio de Radioterapia. El equipo de ${roomTitle} se encuentra en una pausa técnica de seguridad para una revisión preventiva. Queremos darte total tranquilidad: tu sesión y tu dosis de tratamiento están completamente aseguradas. Nuestro equipo de enfermería y recepción se comunicará contigo durante el día para coordinar tu atención sin que tengas que esperar de más. Si tienes alguna duda, puedes contactarnos directamente al mesón de atención.`
          : `Hola ${patient.firstName}, te escribimos desde el Servicio de Radioterapia. El equipo de ${roomTitle} está realizando un ajuste de rutina y calibración para asegurar que todo esté en óptimas condiciones para tu atención. Por este motivo, las sesiones de hoy tienen un desfase estimado de ${delayMinutes} minutos. Tu sesión de hoy (${apt.time} hrs) se estima ahora para las ${newEstimatedTime} hrs. Si aún estás en casa o en camino, puedes venir con más calma. ¡Te esperamos para atenderte con el mayor cuidado!`;

        triggerNotification(
          patient.preferredChannel === 'EMAIL' ? patient.contactEmail : patient.contactPhone,
          patient.preferredChannel,
          alertType === 'MAINTENANCE' ? 'Información importante sobre tu sesión de hoy' : 'Aviso sobre tu hora de atención hoy',
          bodyText,
          alertType === 'MAINTENANCE' ? 'Aviso Preventivo de Seguridad' : 'Aviso de Desfase de Horario'
        );
      }
    });

    setShowBroadcastModal(false);
  }, [appointments, patients, machines, triggerNotification]);

  // Handler: Restablecer estado de sala a operacional
  const handleResetMachineStatus = useCallback((machineId) => {
    setMachines(prev => prev.map(m => {
      if (m.id === machineId) {
        return { ...m, status: 'OPERATIONAL', delayMinutes: 0 };
      }
      return m;
    }));

    const machineObj = machines.find(m => m.id === machineId);
    const roomTitle = machineObj ? `${machineObj.name} (${machineObj.room})` : 'La sala de atención';

    triggerNotification(
      'Pacientes citados en ' + (machineObj?.room || machineId),
      'WHATSAPP',
      'Atención Normalizada',
      `Buenas noticias: ${roomTitle} ha finalizado sus revisiones de seguridad y precisión. Todo el equipo médico y técnico ya está atendiendo en su horario habitual con total normalidad. ¡Te esperamos!`,
      'Atención Normalizada'
    );
  }, [machines, triggerNotification]);

  // --- SI NO HAY SESIÓN INICIADA: RENDERIZAR PORTAL DE ENTRADA ---
  if (!session) {
    return (
      <div className="min-h-screen">
        <EntryPortalView
          patients={patients}
          onLoginPatient={(patientId) => setSession({ role: 'PATIENT', patientId })}
          onLoginStaff={(staff) => setSession({ role: 'STAFF', staffName: staff.name, staffRole: staff.role })}
          onTriggerNotification={triggerNotification}
        />
        {activeToast && (
          <SimulatedPhoneToast
            notification={activeToast}
            onClose={() => setActiveToast(null)}
          />
        )}
      </div>
    );
  }

  // --- SI LA SESIÓN ES DE PACIENTE ---
  if (session.role === 'PATIENT') {
    return (
      <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-[#F8FAFC]">
        {/* BARRA SUPERIOR EXCLUSIVA DEL PACIENTE */}
        <header className="bg-[#142938] text-white border-b border-slate-700/60 sticky top-0 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center shadow-inner">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-display font-bold text-lg tracking-tight text-white">RadiaCare</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-900/80 border border-brand-400/30 text-brand-300 font-medium">
                    Portal del Paciente
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 flex items-center space-x-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Acompañamiento en Tiempo Real</span>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-xs font-bold text-white">
                  {currentPatient.firstName} {currentPatient.lastNameInitial}
                </span>
                <span className="text-[11px] text-emerald-400 font-mono flex items-center space-x-1">
                  <span>✓ Teléfono verificado:</span>
                  <span>{currentPatient.contactPhone}</span>
                </span>
              </div>

              <button
                onClick={() => {
                  setSession(null);
                  setPreviewPatientId(null);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-rose-900/80 text-rose-300 hover:text-white text-xs font-bold border border-slate-700 transition-colors flex items-center space-x-1.5 shadow-sm"
                title="Cerrar sesión de forma segura"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </header>

        {/* ESTADO GLOBAL DE ACELERADORES (TICKER INFORMATIVO) */}
        <div className="bg-white border-b border-slate-200 py-1.5 px-4 sm:px-6 lg:px-8 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
              Estado de Salas de Tratamiento:
            </span>
            {machines.map(m => (
              <div key={m.id} className="flex items-center space-x-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  m.status === 'OPERATIONAL' ? 'bg-emerald-500' :
                  m.status === 'DELAYED' ? 'bg-amber-500 animate-ping' : 'bg-red-500'
                }`}></span>
                <span className="font-medium text-slate-700">{m.name}:</span>
                <span className={`font-semibold ${
                  m.status === 'OPERATIONAL' ? 'text-emerald-700' :
                  m.status === 'DELAYED' ? 'text-amber-700' : 'text-red-700'
                }`}>
                  {m.status === 'OPERATIONAL' && 'En horario regular'}
                  {m.status === 'DELAYED' && `Desfase de +${m.delayMinutes} min (calibración)`}
                  {m.status === 'MAINTENANCE' && 'Pausa preventiva de seguridad'}
                </span>
              </div>
            ))}
          </div>

          <div className="text-slate-500 text-[11px] flex items-center space-x-2">
            <span>Tu sala asignada:</span>
            <span className="font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
              {currentPatientMachine?.name || 'Sala 1'} ({currentPatientMachine?.room || 'Búnker 1'})
            </span>
          </div>
        </div>

        {/* CUERPO PRINCIPAL DEL PACIENTE */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <PatientPortalView
            patient={currentPatient}
            machine={currentPatientMachine}
            appointments={currentPatientAppointments}
            nextAppointment={nextAppointment}
            educationalModules={currentEducationalModules}
            calendarViewMode={calendarViewMode}
            setCalendarViewMode={setCalendarViewMode}
            calendarMonthOffset={calendarMonthOffset}
            setCalendarMonthOffset={setCalendarMonthOffset}
            onSelectAppointment={setSelectedAppointmentDetail}
            onOpenAbsenceModal={() => setAbsenceTarget(nextAppointment)}
            onSelectArticle={setSelectedEducationalArticle}
          />
        </main>

        {/* FOOTER */}
        <footer className="bg-white border-t border-slate-200 py-4 mt-12 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Plataforma RadiaCare • Hospital Clínico de Alta Complejidad</span>
            <span className="text-[11px] text-slate-500">Diseñado con enfoque de empatía clínica, privacidad estricta y reducción activa de ansiedad</span>
          </div>
        </footer>

        {/* MODALES DEL PACIENTE */}
        {absenceTarget && (
          <AbsenceModal
            patient={currentPatient}
            appointment={absenceTarget}
            onClose={() => setAbsenceTarget(null)}
            onConfirm={(reason) => handleReportAbsence(absenceTarget, reason)}
          />
        )}

        {selectedAppointmentDetail && (
          <AppointmentDetailModal
            appointment={selectedAppointmentDetail}
            patient={currentPatient}
            machine={machines.find(m => m.id === selectedAppointmentDetail.machineId)}
            onClose={() => setSelectedAppointmentDetail(null)}
            onCancelFromDetail={() => {
              setAbsenceTarget(selectedAppointmentDetail);
              setSelectedAppointmentDetail(null);
            }}
          />
        )}

        {selectedEducationalArticle && (
          <EducationalArticleModal
            article={selectedEducationalArticle}
            patient={currentPatient}
            onClose={() => setSelectedEducationalArticle(null)}
          />
        )}

        {activeToast && (
          <SimulatedPhoneToast
            notification={activeToast}
            onClose={() => setActiveToast(null)}
          />
        )}
      </div>
    );
  }

  // --- SI LA SESIÓN ES DEL EQUIPO CLÍNICO ---
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-[#F8FAFC]">
      {/* BANNER SUPERIOR CUANDO SE ENCUENTRA EN MODO VISTA PREVIA DE UN PACIENTE */}
      {previewPatientId && (
        <div className="bg-amber-500 text-amber-950 px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-md sticky top-0 z-50">
          <div className="flex items-center space-x-2">
            <span className="text-base">👁️</span>
            <span>
              <strong>MODO VISTA PREVIA CLÍNICA (AUDITORÍA):</strong> Estás viendo el portal del paciente <strong>{currentPatient.firstName} {currentPatient.lastNameInitial}</strong> ({currentPatient.contactPhone}). El paciente no tiene acceso a la planilla clínica.
            </span>
          </div>
          <button
            onClick={() => setPreviewPatientId(null)}
            className="px-3 py-1 rounded-lg bg-amber-950 hover:bg-black text-amber-100 font-bold transition-colors text-xs flex items-center space-x-1 shadow-sm"
          >
            <span>← Volver a Planilla Clínica</span>
          </button>
        </div>
      )}

      {/* BARRA SUPERIOR EXCLUSIVA DEL EQUIPO CLÍNICO */}
      <header className="bg-[#142938] text-white border-b border-slate-700/60 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-inner">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-display font-bold text-lg tracking-tight text-white">RadiaCare</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/80 border border-blue-400/30 text-blue-300 font-medium">
                  Planilla Clínica Digital
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Sesión Activa: <strong className="text-white">{session.staffName}</strong> ({session.staffRole})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setSession(null);
                setPreviewPatientId(null);
              }}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/90 hover:bg-rose-900/80 text-rose-300 hover:text-white text-xs font-bold border border-slate-700 transition-colors flex items-center space-x-1.5 shadow-sm"
              title="Cerrar sesión clínica de forma segura"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Cerrar Sesión Clínica</span>
            </button>
          </div>
        </div>
      </header>

      {/* ESTADO GLOBAL DE ACELERADORES (TICKER INFORMATIVO) */}
      <div className="bg-white border-b border-slate-200 py-1.5 px-4 sm:px-6 lg:px-8 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
            Estado de Búnkers en Tiempo Real:
          </span>
          {machines.map(m => (
            <div key={m.id} className="flex items-center space-x-1.5">
              <span className={`w-2.5 h-2.5 rounded-full ${
                m.status === 'OPERATIONAL' ? 'bg-emerald-500' :
                m.status === 'DELAYED' ? 'bg-amber-500 animate-ping' : 'bg-red-500'
              }`}></span>
              <span className="font-medium text-slate-700">{m.name}:</span>
              <span className={`font-semibold ${
                m.status === 'OPERATIONAL' ? 'text-emerald-700' :
                m.status === 'DELAYED' ? 'text-amber-700' : 'text-red-700'
              }`}>
                {m.status === 'OPERATIONAL' && 'En horario regular'}
                {m.status === 'DELAYED' && `Desfase de +${m.delayMinutes} min (calibración)`}
                {m.status === 'MAINTENANCE' && 'Pausa preventiva de seguridad'}
              </span>
            </div>
          ))}
        </div>

        <div className="text-slate-500 text-[11px] flex items-center space-x-2">
          <span>Control de Calidad:</span>
          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Auditoría Cero RUT Activa
          </span>
        </div>
      </div>

      {/* CUERPO PRINCIPAL DEL EQUIPO CLÍNICO */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {previewPatientId ? (
          <PatientPortalView
            patient={currentPatient}
            machine={currentPatientMachine}
            appointments={currentPatientAppointments}
            nextAppointment={nextAppointment}
            educationalModules={currentEducationalModules}
            calendarViewMode={calendarViewMode}
            setCalendarViewMode={setCalendarViewMode}
            calendarMonthOffset={calendarMonthOffset}
            setCalendarMonthOffset={setCalendarMonthOffset}
            onSelectAppointment={setSelectedAppointmentDetail}
            onOpenAbsenceModal={() => setAbsenceTarget(nextAppointment)}
            onSelectArticle={setSelectedEducationalArticle}
          />
        ) : (
          <StaffPortalView
            patients={patients}
            machines={machines}
            appointments={appointments}
            notifications={notifications}
            onReschedule={(apt) => setShowRescheduleModal(apt)}
            onOpenBroadcastModal={() => setShowBroadcastModal(true)}
            onResetMachine={handleResetMachineStatus}
            onSelectPatientForPreview={(pId) => setPreviewPatientId(pId)}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Plataforma RadiaCare • Hospital Clínico de Alta Complejidad</span>
          <span className="text-[11px] text-slate-500">Gestión Clínica y Dosimetría de Radioterapia Oncológica</span>
        </div>
      </footer>

      {/* MODALES DEL EQUIPO CLÍNICO */}
      {showRescheduleModal && (
        <RescheduleModal
          appointment={showRescheduleModal}
          patient={patients.find(p => p.id === showRescheduleModal.patientId)}
          onClose={() => setShowRescheduleModal(null)}
          onSave={handleRescheduleAppointment}
        />
      )}

      {showBroadcastModal && (
        <BroadcastModal
          machines={machines}
          onClose={() => setShowBroadcastModal(false)}
          onSend={handleSendMassAlert}
        />
      )}

      {absenceTarget && (
        <AbsenceModal
          patient={currentPatient}
          appointment={absenceTarget}
          onClose={() => setAbsenceTarget(null)}
          onConfirm={(reason) => handleReportAbsence(absenceTarget, reason)}
        />
      )}

      {selectedAppointmentDetail && (
        <AppointmentDetailModal
          appointment={selectedAppointmentDetail}
          patient={currentPatient}
          machine={machines.find(m => m.id === selectedAppointmentDetail.machineId)}
          onClose={() => setSelectedAppointmentDetail(null)}
          onCancelFromDetail={() => {
            setAbsenceTarget(selectedAppointmentDetail);
            setSelectedAppointmentDetail(null);
          }}
        />
      )}

      {selectedEducationalArticle && (
        <EducationalArticleModal
          article={selectedEducationalArticle}
          patient={currentPatient}
          onClose={() => setSelectedEducationalArticle(null)}
        />
      )}

      {activeToast && (
        <SimulatedPhoneToast
          notification={activeToast}
          onClose={() => setActiveToast(null)}
        />
      )}
    </div>
  );
}


// ==========================================
// PORTAL DEL PACIENTE (VISTA PRINCIPAL)
// ==========================================
function PatientPortalView({
  patient,
  machine,
  appointments,
  nextAppointment,
  educationalModules,
  calendarViewMode,
  setCalendarViewMode,
  calendarMonthOffset,
  setCalendarMonthOffset,
  onSelectAppointment,
  onOpenAbsenceModal,
  onSelectArticle,
}) {
  const percentCompleted = Math.round((patient.completedFractions / patient.totalFractions) * 100);
  const isWaitingForTac = patient.currentPhase === 'ESPERA_TAC';

  // Datos visibles de la próxima cita, según su tipo y su fecha real
  const nextAppointmentLabels = nextAppointment ? APPOINTMENT_TYPE_LABELS[nextAppointment.type] : null;
  const isNextAppointmentToday = nextAppointment?.date === DEMO_TODAY;
  const nextAppointmentWeekday = nextAppointment
    ? WEEKDAY_SHORT[new Date(`${nextAppointment.date}T12:00:00`).getDay()]
    : '';

  return (
    <div className="space-y-8 animate-fade-in">
      {/* AVISO DE ATENCIÓN SI HAY DESFASE O REVISIÓN PREVENTIVA */}
      {machine && machine.status !== 'OPERATIONAL' && (
        <div className={`p-4 rounded-2xl border flex items-start space-x-4 shadow-sm ${
          machine.status === 'DELAYED'
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-rose-50 border-rose-300 text-rose-900'
        }`}>
          <div className={`p-2 rounded-xl mt-0.5 ${
            machine.status === 'DELAYED' ? 'bg-amber-200 text-amber-800' : 'bg-rose-200 text-rose-800'
          }`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-display font-bold text-base">
              {machine.status === 'DELAYED'
                ? `Aviso para tu atención de hoy: Pequeño desfase de +${machine.delayMinutes} min en tu sala de tratamiento`
                : 'Información sobre tu atención: Tu sala se encuentra en revisión preventiva'}
            </h4>
            <p className="text-sm mt-1 leading-relaxed">
              {machine.status === 'DELAYED'
                ? `El equipo de tu sala (${machine.room}) está realizando una calibración de rutina para garantizar la máxima precisión y seguridad de tu sesión. Si tu cita es hoy y aún estás en casa, puedes salir con unos ${machine.delayMinutes} minutos más de calma, o bien descansar cómodamente en la sala de estar al llegar.`
                : `El equipo de tu sala (${machine.room}) se encuentra en una pausa técnica de seguridad. Quédate completamente tranquilo/a: tu tratamiento y tu dosis están garantizados. Nuestro equipo de recepción te contactará directamente para coordinar tu horario.`}
            </p>
          </div>
        </div>
      )}

      {/* HERO CARD: TRANQUILIDAD, PROGRESO Y DATOS CLAVE */}
      <div className="bg-gradient-to-br from-[#132E35] via-[#1A3E48] to-[#142938] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Adorno visual sutil */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-brand-400"></span>
              <span>{isWaitingForTac ? 'En Espera de TAC de Simulación' : 'Tratamiento en Curso'} • {patient.diagnosisLabel}</span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-white">
              Hola, {patient.firstName}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl leading-relaxed">
              Médico a cargo: <strong className="text-white">{patient.assignedDoctor}</strong>. 
              Asignado a <strong className="text-brand-300">{machine?.name} ({machine?.room})</strong>.
            </p>
          </div>

          {/* TARJETA DE PROGRESO DE SESIONES */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/70 p-5 rounded-2xl min-w-[260px]">
            <div className="flex justify-between items-baseline mb-2">
              <span className="text-xs font-medium text-slate-300">Sesiones Completadas</span>
              <span className="font-display font-bold text-lg text-brand-300">
                {patient.completedFractions} <span className="text-xs text-slate-400 font-normal">de {patient.totalFractions}</span>
              </span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${percentCompleted}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center mt-2 text-[11px] text-slate-400">
              <span>{percentCompleted}% del ciclo total</span>
              <span>Quedan {patient.totalFractions - patient.completedFractions} sesiones</span>
            </div>
          </div>
        </div>

        {/* 3 HITOS CLAVE DEL TRATAMIENTO (ELIMINANDO LA INCERTIDUMBRE) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-700/60">
          {/* Hito 1: TAC Simulación */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/40 flex items-start space-x-3">
            {isWaitingForTac ? (
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">1. TAC Simulación</span>
              <span className="font-semibold text-sm text-white block">{formatFriendlyDate(patient.tacDate)}</span>
              {isWaitingForTac ? (
                <span className="text-[11px] text-amber-300 font-medium">Programado: tu próximo paso</span>
              ) : (
                <span className="text-[11px] text-emerald-400 font-medium">Completado con éxito</span>
              )}
            </div>
          </div>

          {/* Hito 2: Inicio Tratamiento */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/40 flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-300 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">2. Inicio de Sesiones</span>
              <span className="font-semibold text-sm text-white block">{formatFriendlyDate(patient.startDate)}</span>
              {isWaitingForTac ? (
                <span className="text-[11px] text-slate-400 font-medium">Comienza después del TAC</span>
              ) : (
                <span className="text-[11px] text-brand-300 font-medium">En curso activo</span>
              )}
            </div>
          </div>

          {/* Hito 3: Término Estimado */}
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-700/40 flex items-start space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">3. Término Estimado</span>
              <span className="font-semibold text-sm text-white block">{formatFriendlyDate(patient.estimatedEndDate)}</span>
              <span className="text-[11px] text-slate-400">Meta final del tratamiento</span>
            </div>
          </div>
        </div>
      </div>

      {/* PRÓXIMA SESIÓN DESTACADA + BOTÓN DE AVISO DE INASISTENCIA */}
      {nextAppointment && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 border border-brand-200 flex flex-col items-center justify-center shrink-0">
              <span className="text-[10px] uppercase font-bold tracking-tight">{isNextAppointmentToday ? 'HOY' : nextAppointmentWeekday}</span>
              <span className="font-display font-extrabold text-base leading-none">{nextAppointment.date.slice(8)}</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800">
                  {nextAppointmentLabels?.badge(nextAppointment) || nextAppointment.type}
                </span>
                <span className="text-xs text-slate-500">
                  {isNextAppointmentToday ? 'Hora programada:' : `${formatFriendlyDate(nextAppointment.date)} a las`} <strong className="text-slate-800 text-sm">{nextAppointment.time} hrs</strong>
                </span>
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg mt-1">
                {nextAppointmentLabels?.title || nextAppointment.type}
              </h3>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                📌 <strong>Instrucción de preparación:</strong> {nextAppointment.preparation}
              </p>
            </div>
          </div>

          {/* BOTÓN RÁPIDO PARA AVISAR INASISTENCIA */}
          <div className="w-full md:w-auto flex md:flex-col items-end gap-2 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
            <button
              onClick={onOpenAbsenceModal}
              className="w-full md:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center space-x-1.5"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{isNextAppointmentToday ? 'Avisar que no podré asistir hoy' : 'Avisar que no podré asistir'}</span>
            </button>
            <span className="text-[11px] text-slate-500 hidden md:block">Libera el cupo para otro paciente y reprograma</span>
          </div>
        </div>
      )}

      {/* SECCIÓN DEL CALENDARIO INTERACTIVO */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-display font-bold text-xl text-slate-900">
                Tu Calendario de Radioterapia
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                Septiembre 2026
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Haz clic en cualquier sesión para ver los detalles de preparación, búnker y duración estimada.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* VISTA MES / SEMANA */}
            <div className="bg-slate-100 p-1 rounded-xl flex text-xs">
              <button
                onClick={() => setCalendarViewMode('MONTH')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  calendarViewMode === 'MONTH' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mes
              </button>
              <button
                onClick={() => setCalendarViewMode('WEEK')}
                className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                  calendarViewMode === 'WEEK' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Semana
              </button>
            </div>
          </div>
        </div>

        {/* LEYENDA DEL CALENDARIO */}
        <div className="flex flex-wrap items-center gap-4 py-3 text-xs text-slate-600">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-emerald-100 border border-emerald-300"></span>
            <span>Sesión Realizada</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-brand-100 border border-brand-300"></span>
            <span>Sesión Programada</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-indigo-100 border border-indigo-300"></span>
            <span>Control Médico Semanal</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded bg-rose-100 border border-rose-300"></span>
            <span>Inasistencia Justificada</span>
          </div>
        </div>

        {/* COMPONENTE GRILLA CALENDARIO */}
        <InteractiveCalendarGrid
          appointments={appointments}
          viewMode={calendarViewMode}
          onSelectAppointment={onSelectAppointment}
        />
      </section>

      {/* SECCIÓN EDUCATIVA: CÁPSULAS PERSONALIZADAS POR DIAGNÓSTICO */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-display font-bold text-xl text-slate-900">
                Guía de Cuidados para {patient.diagnosisLabel}
              </h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200 font-semibold">
                Personalizado
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Información clara y sin tecnicismos para que vivas tu tratamiento con tranquilidad y seguridad.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
          {educationalModules.map(module => (
            <div
              key={module.id}
              onClick={() => onSelectArticle(module)}
              className="group border border-slate-200 hover:border-brand-400 bg-[#FAFBFB] hover:bg-white rounded-2xl p-5 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-800 tracking-wider uppercase">
                    {module.tag}
                  </span>
                  <span className="text-[11px] text-slate-500 flex items-center space-x-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{module.readTime}</span>
                  </span>
                </div>
                <h3 className="font-display font-bold text-slate-900 group-hover:text-brand-700 text-base transition-colors leading-snug">
                  {module.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {module.summary}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-brand-700 group-hover:translate-x-1 transition-transform">
                <span>Leer cápsula</span>
                <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// ==========================================
// COMPONENTE CALENDARIO INTERACTIVO
// ==========================================
function InteractiveCalendarGrid({ appointments, viewMode, onSelectAppointment }) {
  // Días de la semana (Lunes a Domingo)
  const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Para septiembre 2026: el día 1 de Septiembre fue Martes (índice 1 si Lun=0)
  // Generamos los 30 días de Septiembre 2026
  const daysInMonth = 30;
  const startDayOffset = 1; // Martes

  const daysArray = useMemo(() => {
    const arr = [];
    // Espacios en blanco al inicio del mes
    for (let i = 0; i < startDayOffset; i++) {
      arr.push({ empty: true, id: `empty-${i}` });
    }
    // Días reales del mes
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = day < 10 ? `0${day}` : `${day}`;
      const dateStr = `2026-09-${dayStr}`;
      const dayAppointments = appointments.filter(a => a.date === dateStr);
      arr.push({
        empty: false,
        dayNumber: day,
        dateStr,
        isToday: day === 5, // Simulado fecha actual: 5 de Septiembre
        appointments: dayAppointments,
      });
    }
    return arr;
  }, [appointments]);

  if (viewMode === 'WEEK') {
    // Vista semanal (Semana del 31 de Agosto al 6 de Septiembre 2026)
    const weekDays = [
      { name: 'Lunes', date: '2026-08-31', day: 31 },
      { name: 'Martes', date: '2026-09-01', day: 1 },
      { name: 'Miércoles', date: '2026-09-02', day: 2 },
      { name: 'Jueves', date: '2026-09-03', day: 3 },
      { name: 'Viernes', date: '2026-09-04', day: 4 },
      { name: 'Sábado (Hoy)', date: '2026-09-05', day: 5, isToday: true },
      { name: 'Domingo', date: '2026-09-06', day: 6 },
    ];

    return (
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-7 gap-3">
        {weekDays.map(wd => {
          const dayApts = appointments.filter(a => a.date === wd.date);
          return (
            <div
              key={wd.date}
              className={`p-3 rounded-2xl border min-h-[160px] flex flex-col justify-between ${
                wd.isToday
                  ? 'bg-brand-50/50 border-brand-400 ring-2 ring-brand-400/20'
                  : 'bg-slate-50/70 border-slate-200'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] font-bold uppercase text-slate-500">{wd.name}</span>
                  <span className={`text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold ${
                    wd.isToday ? 'bg-brand-600 text-white' : 'text-slate-700'
                  }`}>
                    {wd.day}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {dayApts.map(apt => (
                    <AppointmentBadge
                      key={apt.id}
                      appointment={apt}
                      onClick={() => onSelectAppointment(apt)}
                    />
                  ))}
                  {dayApts.length === 0 && (
                    <span className="text-[11px] text-slate-400 italic block py-4 text-center">
                      Sin sesiones
                    </span>
                  )}
                </div>
              </div>

              {wd.isToday && (
                <span className="text-[10px] text-brand-700 font-semibold text-center block pt-2 border-t border-brand-200/60">
                  Día de atención hoy
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  // Vista Mensual (Mes completo)
  return (
    <div className="mt-4">
      {/* Encabezados días de la semana */}
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
        {daysOfWeek.map(d => (
          <div key={d} className="py-1">{d}</div>
        ))}
      </div>

      {/* Celdas del calendario */}
      <div className="grid grid-cols-7 gap-2">
        {daysArray.map((cell, idx) => {
          if (cell.empty) {
            return <div key={`cell-${idx}`} className="h-24 sm:h-28 bg-slate-50/30 rounded-xl border border-dashed border-slate-200/50"></div>;
          }

          return (
            <div
              key={cell.dateStr}
              className={`h-24 sm:h-28 p-1.5 sm:p-2 rounded-xl border flex flex-col justify-between transition-all ${
                cell.isToday
                  ? 'bg-brand-50/40 border-brand-500 ring-2 ring-brand-400/20 shadow-xs'
                  : cell.appointments.length > 0
                  ? 'bg-white border-slate-200 hover:border-slate-300'
                  : 'bg-slate-50/50 border-slate-200/60'
              }`}
            >
              <div className="flex justify-between items-start">
                <span className={`text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full ${
                  cell.isToday ? 'bg-brand-600 text-white' : 'text-slate-700'
                }`}>
                  {cell.dayNumber}
                </span>

                {cell.isToday && (
                  <span className="text-[9px] font-bold text-brand-700 uppercase bg-brand-100 px-1 rounded hidden sm:block">
                    Hoy
                  </span>
                )}
              </div>

              {/* Badges de citas dentro del día */}
              <div className="space-y-1 overflow-y-auto max-h-16">
                {cell.appointments.map(apt => (
                  <AppointmentBadge
                    key={apt.id}
                    appointment={apt}
                    onClick={() => onSelectAppointment(apt)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Badge de Cita en Calendario
function AppointmentBadge({ appointment, onClick }) {
  const isCompleted = appointment.status === 'COMPLETED';
  const isCancelled = appointment.status === 'CANCELLED_PATIENT';
  const isMedicalCheck = appointment.type === 'CONTROL_MEDICO';
  const isTac = appointment.type === 'TAC_SIMULACION';

  let bgClass = 'bg-brand-100 text-brand-900 border-brand-300 hover:bg-brand-200';
  let label = `${appointment.time} • Sesión ${appointment.sessionNumber}`;

  if (isCompleted) {
    bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-200 line-through opacity-80';
    label = `✓ ${appointment.time} • Sesión ${appointment.sessionNumber}`;
  } else if (isCancelled) {
    bgClass = 'bg-rose-50 text-rose-800 border-rose-200 line-through';
    label = `✕ ${appointment.time} Inasistencia`;
  } else if (isMedicalCheck) {
    bgClass = 'bg-indigo-50 text-indigo-900 border-indigo-200 font-semibold';
    label = `${appointment.time} • Control`;
  } else if (isTac) {
    bgClass = 'bg-amber-50 text-amber-900 border-amber-200 font-semibold';
    label = `${appointment.time} • TAC Simulación`;
  }

  return (
    <button
      onClick={onClick}
      className={`w-full text-left text-[10px] px-1.5 py-1 rounded border leading-tight transition-transform hover:scale-[1.02] truncate block ${bgClass}`}
      title={`Ver detalle de cita: ${label}`}
    >
      {label}
    </button>
  );
}

// ==========================================
// PORTAL DE PROFESIONALES (PLANILLA DIGITAL)
// ==========================================
function StaffPortalView({
  patients,
  machines,
  appointments,
  notifications,
  onReschedule,
  onOpenBroadcastModal,
  onResetMachine,
  onSelectPatientForPreview,
}) {
  const [filterMachine, setFilterMachine] = useState('ALL');
  const [filterPhase, setFilterPhase] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrado de pacientes en la planilla
  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const matchMachine = filterMachine === 'ALL' || p.machineId === filterMachine;
      const matchPhase = filterPhase === 'ALL' || p.currentPhase === filterPhase;
      const matchSearch =
        p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.contactPhone.includes(searchQuery) ||
        p.diagnosisLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMachine && matchPhase && matchSearch;
    });
  }, [patients, filterMachine, filterPhase, searchQuery]);

  // Citas de inasistencia recibidas hoy
  const cancelledAppointments = useMemo(() => {
    return appointments.filter(a => a.status === 'CANCELLED_PATIENT');
  }, [appointments]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* HEADER DE GESTIÓN Y MÉTRICAS OPERACIONALES */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>Planilla Central de Gestión Digital</span>
          </div>
          <h1 className="font-display font-bold text-2xl text-slate-900">
            Control de Cupos y Radioterapia
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Reemplazo interactivo del Excel tradicional con sincronización reactiva a los calendarios de los pacientes.
          </p>
        </div>

        {/* BOTONES DE ACCIÓN RÁPIDA: ALERTA MASIVA */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenBroadcastModal}
            className="px-4 py-2.5 rounded-xl bg-warmalert-600 hover:bg-warmalert-700 text-white font-semibold text-xs transition-colors shadow-sm flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <span>Emitir Alerta Masiva de Máquina</span>
          </button>
        </div>
      </div>

      {/* TARJETAS DE MONITOREO DE ACELERADORES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {machines.map(m => (
          <div
            key={m.id}
            className={`p-5 rounded-2xl border transition-all ${
              m.status === 'OPERATIONAL'
                ? 'bg-white border-slate-200'
                : 'bg-amber-50/70 border-amber-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {m.room} • {m.model}
                </span>
                <h3 className="font-display font-bold text-lg text-slate-900">{m.name}</h3>
              </div>

              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  m.status === 'OPERATIONAL' ? 'bg-emerald-100 text-emerald-800' :
                  m.status === 'DELAYED' ? 'bg-amber-200 text-amber-900 font-bold' : 'bg-red-200 text-red-900'
                }`}>
                  {m.status === 'OPERATIONAL' && 'Operacional'}
                  {m.status === 'DELAYED' && `Retraso +${m.delayMinutes}m`}
                  {m.status === 'MAINTENANCE' && 'Mantención'}
                </span>

                {m.status !== 'OPERATIONAL' && (
                  <button
                    onClick={() => onResetMachine(m.id)}
                    className="text-[11px] text-blue-700 bg-white border border-blue-300 px-2 py-1 rounded hover:bg-blue-50 font-medium"
                    title="Restablecer máquina a estado normal"
                  >
                    Normalizar
                  </button>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-600">
              <span>Pacientes citados hoy: <strong>18 cupos</strong></span>
              <span className="text-[11px] text-slate-500">Haz clic en alerta masiva para avisar a todos</span>
            </div>
          </div>
        ))}
      </div>

      {/* BANDEJA DE AVISOS DE INASISTENCIA (GESTIÓN DE CONTINGENCIAS) */}
      {cancelledAppointments.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse"></span>
              <h3 className="font-display font-bold text-rose-950 text-sm">
                Inasistencias Notificadas por Pacientes (Cupos Liberados para hoy)
              </h3>
            </div>
            <span className="text-xs bg-rose-200 text-rose-800 font-bold px-2 py-0.5 rounded-full">
              {cancelledAppointments.length} pendiente(s) de ajuste
            </span>
          </div>

          <div className="space-y-2">
            {cancelledAppointments.map(apt => {
              const patient = patients.find(p => p.id === apt.patientId);
              return (
                <div key={apt.id} className="bg-white p-3 rounded-xl border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div>
                    <strong className="text-slate-900">{patient?.firstName} {patient?.lastNameInitial}</strong> ({patient?.diagnosisLabel})
                    <span className="text-slate-500 mx-1.5">•</span>
                    <span>Sesión #{apt.sessionNumber} ({apt.time} hrs)</span>
                    <span className="text-slate-500 mx-1.5">•</span>
                    <span className="text-rose-700 italic">Motivo: "{apt.cancellationReason || 'No especificado'}"</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onReschedule(apt)}
                      className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-semibold text-[11px]"
                    >
                      Reprogramar cupo al final del ciclo
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PLANILLA DIGITAL INTERACTIVA (TABLA PRINCIPAL) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Barra de Filtros y Búsqueda */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              placeholder="Buscar por nombre, teléfono o diagnóstico..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-300 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />

            <select
              value={filterMachine}
              onChange={(e) => setFilterMachine(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">Todas las Máquinas</option>
              <option value="AL-1">Acelerador Lineal 1</option>
              <option value="AL-2">Acelerador Lineal 2</option>
            </select>

            <select
              value={filterPhase}
              onChange={(e) => setFilterPhase(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="ALL">Todos los Estados</option>
              <option value="ESPERA_TAC">En Espera de TAC</option>
              <option value="EN_TRATAMIENTO">En Tratamiento</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Mostrando <strong>{filteredPatients.length}</strong> pacientes registrados
          </div>
        </div>

        {/* Tabla de Datos */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Paciente (Sin RUT)</th>
                <th className="py-3.5 px-4">Contacto Único</th>
                <th className="py-3.5 px-4">Diagnóstico</th>
                <th className="py-3.5 px-4">Médico a Cargo</th>
                <th className="py-3.5 px-4">Máquina / Búnker</th>
                <th className="py-3.5 px-4">Progreso Sesiones</th>
                <th className="py-3.5 px-4">Próxima Cita</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPatients.map(p => {
                const nextApt = appointments
                  .filter(a => a.patientId === p.id && a.status === 'SCHEDULED')
                  .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))[0];

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {p.firstName} {p.lastNameInitial}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                      <div className="flex items-center space-x-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200">
                          {p.preferredChannel}
                        </span>
                        <span>{p.contactPhone}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 font-medium">
                        {p.diagnosisLabel}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {p.assignedDoctor.replace(' (Radioncóloga)', '').replace(' (Radioncólogo)', '')}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">
                      {p.machineId}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900">{p.completedFractions}/{p.totalFractions}</span>
                        <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-brand-600 h-full rounded-full"
                            style={{ width: `${(p.completedFractions / p.totalFractions) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {nextApt ? (
                        <div>
                          <span className="font-bold text-brand-800">{nextApt.date}</span> a las <span className="font-bold">{nextApt.time}</span>
                          <span className="block text-[10px] text-slate-500">
                            {nextApt.type === 'SESION_RADIOTERAPIA' ? `Sesión #${nextApt.sessionNumber}` : nextApt.type}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Sin citas pendientes</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {nextApt && (
                        <button
                          onClick={() => onReschedule(nextApt)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-semibold transition-colors"
                          title="Cambiar fecha u hora y disparar notificación automática al paciente"
                        >
                          Reprogramar
                        </button>
                      )}
                      <button
                        onClick={() => onSelectPatientForPreview(p.id)}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition-colors"
                        title="Ver cómo ve el paciente su portal"
                      >
                        Ver como Paciente
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* HISTORIAL AUDITORÍA DE NOTIFICACIONES DISPARADAS */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <h3 className="font-display font-bold text-base text-slate-900 mb-1">
          Registro de Notificaciones Automáticas Enviadas
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Auditoría de mensajes SMS, WhatsApp y correos electrónicos enviados a los pacientes en tiempo real.
        </p>

        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <span className="text-xs text-slate-400 italic block py-4 text-center">
              Aún no se han generado notificaciones en esta sesión de prueba.
            </span>
          ) : (
            notifications.map(n => (
              <div key={n.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800">{n.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-medium">{n.channel}</span>
                    <span className="text-slate-500">• {n.recipient}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-1">{n.body}</p>
                </div>
                <span className="text-[11px] text-slate-500 font-mono shrink-0">{n.timestamp}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// MODALES Y COMPONENTES SECUNDARIOS
// ==========================================

// 1. Modal Aviso de Inasistencia
function AbsenceModal({ patient, appointment, onClose, onConfirm }) {
  const [reason, setReason] = useState('Malestar general o fiebre');
  const [comment, setComment] = useState('');

  const reasons = [
    'Malestar general o fiebre',
    'Dificultad de transporte / locomoción',
    'Trámite médico o examen imprevisto',
    'Motivo personal / fuerza mayor',
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in border border-slate-200">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h3 className="font-display font-bold text-xl text-slate-900">
          Avisar Inasistencia al Servicio
        </h3>
        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
          Tu salud y comodidad son lo primero. Al avisar, el equipo médico libera el cupo para agilizar la atención de otros pacientes y programa la recuperación de tu dosis.
        </p>

        <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900">
          <span className="font-semibold block">Cita que vas a cancelar:</span>
          <span>
            {APPOINTMENT_TYPE_LABELS[appointment.type]?.badge(appointment) || appointment.type} • {formatFriendlyDate(appointment.date)} a las {appointment.time} hrs
          </span>
        </div>

        <div className="mt-4 space-y-3 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Motivo principal:</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            >
              {reasons.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Comentario adicional (opcional):</label>
            <textarea
              rows="2"
              placeholder="¿Hay algo más que el equipo de enfermería deba saber?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-xs"
            ></textarea>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
            ℹ️ <strong>Importante:</strong> La sesión cancelada no se pierde, se añadirá automáticamente al final de tu calendario para cumplir las {patient.totalFractions} sesiones prescritas.
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Volver atrás
          </button>
          <button
            onClick={() => onConfirm(comment ? `${reason} - ${comment}` : reason)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
          >
            Confirmar Inasistencia
          </button>
        </div>
      </div>
    </div>
  );
}

// 2. Modal Detalle de Cita (Calendario)
function AppointmentDetailModal({ appointment, patient, machine, onClose, onCancelFromDetail }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in border border-slate-200">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-100 text-brand-800">
            {appointment.type === 'SESION_RADIOTERAPIA' ? `Sesión #${appointment.sessionNumber} de ${patient.totalFractions}` : appointment.type}
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            ✕
          </button>
        </div>

        <h3 className="font-display font-bold text-xl text-slate-900">
          Detalle de tu Cita
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          {formatFriendlyDate(appointment.date)} a las <strong>{appointment.time} hrs</strong>
        </p>

        <div className="mt-4 space-y-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Unidad de tratamiento:</span>
              <strong className="text-slate-800">{machine?.name} ({machine?.room})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Tiempo estimado en búnker:</span>
              <strong className="text-slate-800">12 a 15 minutos</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Estado de la sesión:</span>
              <span className="font-semibold text-emerald-700">{appointment.status}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-brand-50/70 border border-brand-200 text-brand-950">
            <span className="font-bold block mb-1">📋 Instrucciones de preparación:</span>
            <p className="text-xs leading-relaxed text-brand-900">{appointment.preparation}</p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          {appointment.status === 'SCHEDULED' && (
            <button
              onClick={onCancelFromDetail}
              className="text-xs text-rose-700 hover:text-rose-900 font-semibold underline"
            >
              ¿No podrás asistir a esta cita?
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-auto px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}

// 3. Modal Reprogramar Cita (Profesional con Notificación Automática)
function RescheduleModal({ appointment, patient, onClose, onSave }) {
  const [newDate, setNewDate] = useState(appointment.date);
  const [newTime, setNewTime] = useState(appointment.time);
  const [sendNotification, setSendNotification] = useState(true);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-fade-in border border-slate-200">
        <h3 className="font-display font-bold text-xl text-slate-900">
          Reprogramar Cita
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Paciente: <strong>{patient?.firstName} {patient?.lastNameInitial}</strong> ({patient?.diagnosisLabel})
        </p>

        <div className="mt-5 space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Nueva Fecha:</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Nuevo Horario de Atención:</label>
            <input
              type="time"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200">
            <label className="flex items-start space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sendNotification}
                onChange={(e) => setSendNotification(e.target.checked)}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-[11px] text-blue-900 leading-snug">
                <strong>Disparar notificación automática de inmediato</strong> vía {patient?.preferredChannel} al número/correo registrado ({patient?.contactPhone}).
              </span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(appointment.id, newDate, newTime)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            Guardar y Notificar
          </button>
        </div>
      </div>
    </div>
  );
}

// 4. Modal Alerta Masiva de Máquina (Profesional)
function BroadcastModal({ machines, onClose, onSend }) {
  const [machineId, setMachineId] = useState('AL-1');
  const [alertType, setAlertType] = useState('DELAY'); // 'DELAY' | 'MAINTENANCE'
  const [delayMinutes, setDelayMinutes] = useState('45');
  const [customNotes, setCustomNotes] = useState('');

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-fade-in border border-slate-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-warmalert-100 text-warmalert-600 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <div>
            <h3 className="font-display font-bold text-xl text-slate-900">
              Avisar Desfase o Revisión de Sala a Pacientes
            </h3>
            <p className="text-xs text-slate-500">
              Notifica simultáneamente con lenguaje cálido y tranquilizador a los pacientes citados hoy en la sala afectada.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Sala de Atención Afectada:</label>
            <select
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-warmalert-500 bg-white"
            >
              {machines.map(m => (
                <option key={m.id} value={m.id}>{m.name} ({m.room})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Motivo del Aviso al Paciente:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAlertType('DELAY')}
                className={`p-3 rounded-xl border text-left font-medium transition-all ${
                  alertType === 'DELAY'
                    ? 'bg-amber-50 border-amber-400 text-amber-900 ring-1 ring-amber-400'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <strong>Desfase de Horario</strong>
                <span className="block text-[11px] text-slate-500 mt-0.5">Calibración de rutina y ajuste de precisión</span>
              </button>

              <button
                type="button"
                onClick={() => setAlertType('MAINTENANCE')}
                className={`p-3 rounded-xl border text-left font-medium transition-all ${
                  alertType === 'MAINTENANCE'
                    ? 'bg-rose-50 border-rose-400 text-rose-900 ring-1 ring-rose-400'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <strong>Pausa Preventiva</strong>
                <span className="block text-[11px] text-slate-500 mt-0.5">Revisión de seguridad sin afectar el tratamiento</span>
              </button>
            </div>
          </div>

          {alertType === 'DELAY' && (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Desfase Estimado (minutos):</label>
              <select
                value={delayMinutes}
                onChange={(e) => setDelayMinutes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-warmalert-500 bg-white"
              >
                <option value="20">+20 minutos</option>
                <option value="30">+30 minutos</option>
                <option value="45">+45 minutos</option>
                <option value="60">+60 minutos (1 hora)</option>
                <option value="90">+90 minutos</option>
              </select>
            </div>
          )}

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
            📢 <strong>Comunicación Empática:</strong> El sistema enviará automáticamente un mensaje cálido por WhatsApp/SMS a cada paciente de hoy, dándoles tranquilidad sobre su tratamiento y sugiriéndoles salir con calma para evitar esperas innecesarias.
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSend(machineId, alertType, delayMinutes, customNotes)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-warmalert-600 hover:bg-warmalert-700 transition-colors shadow-sm"
          >
            Disparar Alerta Masiva
          </button>
        </div>
      </div>
    </div>
  );
}

// 5. Modal Cápsula Educativa Detallada
function EducationalArticleModal({ article, patient, onClose }) {
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl animate-fade-in border border-slate-200">
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded bg-brand-100 text-brand-800 tracking-wider uppercase">
            {article.tag} • {article.readTime} de lectura
          </span>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            ✕
          </button>
        </div>

        <h2 className="font-display font-bold text-2xl text-slate-900 leading-tight">
          {article.title}
        </h2>
        <p className="text-xs text-brand-700 font-medium mt-1">
          Guía personalizada para {patient.diagnosisLabel}
        </p>

        <div className="mt-6 text-sm text-slate-700 leading-relaxed space-y-4 border-t border-slate-100 pt-4">
          {parseArticleContent(article.content).map((block, index) => {
            if (block.type === 'h4') {
              return (
                <h4 key={index} className="font-display font-bold text-base text-slate-900 pt-2">
                  {renderInlineMarkdown(block.text)}
                </h4>
              );
            }
            if (block.type === 'h5') {
              return (
                <h5 key={index} className="font-display font-semibold text-sm text-brand-800 pt-1">
                  {renderInlineMarkdown(block.text)}
                </h5>
              );
            }
            if (block.type === 'ul' || block.type === 'ol') {
              const ListTag = block.type;
              return (
                <ListTag
                  key={index}
                  className={`${block.type === 'ul' ? 'list-disc' : 'list-decimal'} pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600`}
                >
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{renderInlineMarkdown(item)}</li>
                  ))}
                </ListTag>
              );
            }
            return (
              <p key={index} className="text-xs sm:text-sm text-slate-600">
                {renderInlineMarkdown(block.text)}
              </p>
            );
          })}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">¿Tienes dudas adicionales? Consulta con tu equipo clínico en tu próximo control semanal.</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 transition-colors shrink-0"
          >
            Cerrar Cápsula
          </button>
        </div>
      </div>
    </div>
  );
}

// 6. Toast Simulador de Teléfono Celular (WhatsApp / SMS Instantáneo)
function SimulatedPhoneToast({ notification, onClose }) {
  const isWhatsApp = notification.channel === 'WHATSAPP';
  const isSms = notification.channel === 'SMS';

  return (
    <div className="fixed bottom-5 right-5 max-w-sm w-full z-50 animate-fade-in">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-4 border border-slate-700 relative overflow-hidden">
        <div className="flex items-start space-x-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            isWhatsApp ? 'bg-emerald-500 text-white' : 'bg-blue-500 text-white'
          }`}>
            {isWhatsApp ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.299.144.347.491 1.2.534 1.288.043.088.072.19.014.305-.058.115-.087.187-.173.289l-.26.308c-.087.087-.179.182-.077.356.102.174.453.747.971 1.209.667.595 1.229.779 1.403.866.174.087.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.203c.043.073.043.419-.101.824z"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            )}
          </div>

          <div className="flex-1 pr-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                Mensaje Recibido ({notification.channel})
              </span>
              <span className="text-[10px] text-slate-400">{notification.timestamp}</span>
            </div>
            <h4 className="font-display font-bold text-sm text-white mt-0.5">
              {notification.title}
            </h4>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              {notification.body}
            </p>
            <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between">
              <span>Destinatario: {notification.recipient}</span>
              <span className="text-emerald-400 font-medium">✓ Entregado</span>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white text-xs">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// Helpers de formateo
function formatFriendlyDate(dateStr) {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const day = parseInt(parts[2], 10);
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const month = monthNames[parseInt(parts[1], 10) - 1];
  return `${day} de ${month}, 2026`;
}

function calculateDelayedTime(originalTime, minutesToAdd) {
  if (!originalTime) return originalTime;
  const [h, m] = originalTime.split(':').map(Number);
  const totalMin = h * 60 + m + parseInt(minutesToAdd, 10);
  const newH = Math.floor(totalMin / 60) % 24;
  const newM = totalMin % 60;
  return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
}

// Convierte el texto de una cápsula (### títulos, #### subtítulos, listas con "-" o "1.")
// en bloques. Se procesa línea a línea porque las líneas en blanco traen la indentación del código.
function parseArticleContent(content) {
  const blocks = [];
  let current = null; // Párrafo o lista que se está armando

  content.split('\n').forEach(rawLine => {
    const line = rawLine.trim();
    if (!line) {
      current = null;
      return;
    }

    const heading = line.match(/^(#{3,4})\s+(.*)$/);
    if (heading) {
      blocks.push({ type: heading[1].length === 3 ? 'h4' : 'h5', text: heading[2] });
      current = null;
      return;
    }

    const listItem = line.match(/^(-|\d+\.)\s+(.*)$/);
    if (listItem) {
      const listType = listItem[1] === '-' ? 'ul' : 'ol';
      if (!current || current.type !== listType) {
        current = { type: listType, items: [] };
        blocks.push(current);
      }
      current.items.push(listItem[2]);
      return;
    }

    if (current && current.type === 'p') {
      current.text += ' ' + line;
    } else {
      current = { type: 'p', text: line };
      blocks.push(current);
    }
  });

  return blocks;
}

// Aplica **negrita** y *cursiva* sin insertar HTML crudo
function renderInlineMarkdown(text) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold text-slate-800">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

// Render en el DOM
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
