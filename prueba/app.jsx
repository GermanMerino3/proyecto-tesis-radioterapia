// RadiaCare - Plataforma de Gestión y Comunicación para Radioterapia Hospitalaria
// Desarrollado con directrices de privacidad estricta (Cero RUT), frontend intencional y React reactivo.

const { useState, useEffect, useMemo, useCallback } = React;

// --- BASE DE DATOS MOCK INICIAL ---
const INITIAL_MACHINES = [
  { id: 'AL-1', name: 'Acelerador Lineal 1', room: 'Búnker 1', model: 'Varian Clinac iX', status: 'OPERATIONAL', delayMinutes: 0 },
  { id: 'AL-2', name: 'Acelerador Lineal 2', room: 'Búnker 2', model: 'Elekta Versa HD', status: 'OPERATIONAL', delayMinutes: 0 },
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

// --- COMPONENTE PRINCIPAL APP ---
function App() {
  // Estado general
  const [activeRole, setActiveRole] = useState('PATIENT'); // 'PATIENT' | 'STAFF'
  const [selectedPatientId, setSelectedPatientId] = useState('pat-1');
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [machines, setMachines] = useState(INITIAL_MACHINES);
  const [appointments, setAppointments] = useState(generateInitialAppointments);
  const [notifications, setNotifications] = useState([]);
  const [activeToast, setActiveToast] = useState(null);

  // Estados de interfaz
  const [calendarViewMode, setCalendarViewMode] = useState('MONTH'); // 'MONTH' | 'WEEK'
  const [calendarMonthOffset, setCalendarMonthOffset] = useState(0); // 0 = Septiembre 2026
  const [selectedAppointmentDetail, setSelectedAppointmentDetail] = useState(null);
  const [showAbsenceModal, setShowAbsenceModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(null); // appointment to reschedule
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [selectedEducationalArticle, setSelectedEducationalArticle] = useState(null);

  // Paciente activo actual
  const currentPatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId) || patients[0];
  }, [patients, selectedPatientId]);

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

    // Auto ocultar toast tras 6 segundos
    setTimeout(() => {
      setActiveToast(current => (current && current.id === newNotif.id ? null : current));
    }, 7000);
  }, []);

  // Handler: Paciente avisa inasistencia
  const handleReportAbsence = useCallback((reason) => {
    if (!nextAppointment) return;

    // Actualizar estado de la cita
    setAppointments(prev => prev.map(apt => {
      if (apt.id === nextAppointment.id) {
        return {
          ...apt,
          status: 'CANCELLED_PATIENT',
          cancellationReason: reason,
        };
      }
      return apt;
    }));

    setShowAbsenceModal(false);

    // Disparar confirmación al paciente y al panel
    triggerNotification(
      currentPatient.preferredChannel === 'EMAIL' ? currentPatient.contactEmail : currentPatient.contactPhone,
      currentPatient.preferredChannel,
      'Inasistencia Registrada',
      `Estimado/a ${currentPatient.firstName}, hemos recibido tu aviso de inasistencia para la sesión de hoy (${nextAppointment.time} hrs). Tu cupo ha sido liberado y tu equipo clínico coordinará la reprogramación de tu dosis al final del ciclo para garantizar la efectividad total del tratamiento. Que te recuperes pronto.`,
      'Aviso de Inasistencia'
    );
  }, [nextAppointment, currentPatient, triggerNotification]);

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
      triggerNotification(
        affectedPatient.preferredChannel === 'EMAIL' ? affectedPatient.contactEmail : affectedPatient.contactPhone,
        affectedPatient.preferredChannel,
        'Actualización de Cita de Radioterapia',
        `Hola ${affectedPatient.firstName}, tu cita ha sido reprogramada para el día ${newDate} a las ${newTime} hrs en el ${affectedPatient.machineId}. Tu calendario en línea ya se encuentra actualizado.`,
        'Reprogramación de Cita'
      );
    }
  }, [patients, triggerNotification]);

  // Handler: Alerta masiva por falla o retraso de acelerador
  const handleSendMassAlert = useCallback((machineId, alertType, delayMinutes, customNotes) => {
    // 1. Actualizar estado de la máquina
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

    // 2. Identificar pacientes asignados a esta máquina con citas hoy
    const todayStr = '2026-09-05';
    const affectedAppointments = appointments.filter(a => a.machineId === machineId && a.date === todayStr && a.status === 'SCHEDULED');
    
    // 3. Disparar notificaciones masivas
    affectedAppointments.forEach(apt => {
      const patient = patients.find(p => p.id === apt.patientId);
      if (patient) {
        const bodyText = alertType === 'MAINTENANCE'
          ? `AVISO URGENTE: El ${machineId} se encuentra temporalmente en mantención técnica no programada. Nuestro equipo de física médica está trabajando para reanudar a la brevedad. Te contactaremos con tu nueva hora.`
          : `AVISO DE SERVICIO: El ${machineId} presenta un retraso operacional estimado de ${delayMinutes} minutos debido a calibración. Tu hora de atención de hoy (${apt.time} hrs) se estima ahora para las ${calculateDelayedTime(apt.time, delayMinutes)} hrs. Si deseas, puedes retrasar tu llegada al hospital.`;

        triggerNotification(
          patient.preferredChannel === 'EMAIL' ? patient.contactEmail : patient.contactPhone,
          patient.preferredChannel,
          `Alerta Servicio: ${machineId}`,
          bodyText,
          'Alerta Masiva de Máquina'
        );
      }
    });

    setShowBroadcastModal(false);
  }, [appointments, patients, triggerNotification]);

  // Handler: Restablecer estado de acelerador a operacional
  const handleResetMachineStatus = useCallback((machineId) => {
    setMachines(prev => prev.map(m => {
      if (m.id === machineId) {
        return { ...m, status: 'OPERATIONAL', delayMinutes: 0 };
      }
      return m;
    }));

    triggerNotification(
      'Todos los pacientes de ' + machineId,
      'WHATSAPP',
      'Servicio Normalizado',
      `El ${machineId} ha completado sus revisiones técnicas y ya opera con total normalidad en horario regular.`,
      'Restablecimiento Operacional'
    );
  }, [triggerNotification]);

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-[#F8FAFC]">
      {/* BARRA SUPERIOR DE NAVEGACIÓN Y CONTROL DE PRIVACIDAD */}
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
                  Radioterapia Hospitalaria
                </span>
              </div>
              <p className="text-[11px] text-slate-300 flex items-center space-x-1">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Cumplimiento Calidad: Privacidad Estricta (Cero RUT)</span>
              </p>
            </div>
          </div>

          {/* SELECTOR DE ROL Y SIMULADOR DE PACIENTE */}
          <div className="flex items-center space-x-3">
            {/* Si está en modo paciente, permite elegir qué paciente de prueba ver */}
            {activeRole === 'PATIENT' && (
              <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <span className="text-xs text-slate-300">Paciente Demo:</span>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="bg-slate-900 text-xs text-white rounded border border-slate-600 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-brand-400"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} ({p.diagnosisLabel.replace('Cáncer de ', '')}) - {p.machineId}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* SWITCH DE MODO: PACIENTE VS PROFESIONAL */}
            <div className="bg-slate-900/90 p-1 rounded-xl flex items-center border border-slate-700/80">
              <button
                onClick={() => setActiveRole('PATIENT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  activeRole === 'PATIENT'
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Portal Paciente</span>
              </button>

              <button
                onClick={() => setActiveRole('STAFF')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                  activeRole === 'STAFF'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Planilla Digital (Equipo Clínico)</span>
              </button>
            </div>
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
                {m.status === 'OPERATIONAL' && 'En horario normal'}
                {m.status === 'DELAYED' && `Retraso de +${m.delayMinutes} min`}
                {m.status === 'MAINTENANCE' && 'En mantención técnica'}
              </span>
            </div>
          ))}
        </div>

        <div className="text-slate-500 text-[11px] flex items-center space-x-2">
          <span>Identificador de Paciente Activo:</span>
          <span className="font-mono bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-300">
            {currentPatient.contactPhone}
          </span>
        </div>
      </div>

      {/* CUERPO PRINCIPAL CONDICIONADO AL ROL */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeRole === 'PATIENT' ? (
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
            onOpenAbsenceModal={() => setShowAbsenceModal(true)}
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
            onSelectPatientForPreview={(pId) => {
              setSelectedPatientId(pId);
              setActiveRole('PATIENT');
            }}
          />
        )}
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Plataforma RadiaCare • Hospital Clínico de Alta Complejidad</span>
          <span className="text-[11px] text-slate-500">Diseñado con enfoque de empatía clínica, privacidad estricta y reducción activa de ansiedad</span>
        </div>
      </footer>

      {/* --- MODALES Y DRAWERS --- */}

      {/* 1. Modal: Notificar Inasistencia */}
      {showAbsenceModal && (
        <AbsenceModal
          patient={currentPatient}
          appointment={nextAppointment}
          onClose={() => setShowAbsenceModal(false)}
          onConfirm={handleReportAbsence}
        />
      )}

      {/* 2. Modal: Detalle de Sesión / Cita del Calendario */}
      {selectedAppointmentDetail && (
        <AppointmentDetailModal
          appointment={selectedAppointmentDetail}
          patient={currentPatient}
          machine={machines.find(m => m.id === selectedAppointmentDetail.machineId)}
          onClose={() => setSelectedAppointmentDetail(null)}
          onCancelFromDetail={() => {
            setSelectedAppointmentDetail(null);
            setShowAbsenceModal(true);
          }}
        />
      )}

      {/* 3. Modal: Reprogramar Cita (Profesional) */}
      {showRescheduleModal && (
        <RescheduleModal
          appointment={showRescheduleModal}
          patient={patients.find(p => p.id === showRescheduleModal.patientId)}
          onClose={() => setShowRescheduleModal(null)}
          onSave={handleRescheduleAppointment}
        />
      )}

      {/* 4. Modal: Alerta Masiva de Máquina (Profesional) */}
      {showBroadcastModal && (
        <BroadcastModal
          machines={machines}
          onClose={() => setShowBroadcastModal(false)}
          onSend={handleSendMassAlert}
        />
      )}

      {/* 5. Drawer / Modal: Cápsula Educativa Detallada */}
      {selectedEducationalArticle && (
        <EducationalArticleModal
          article={selectedEducationalArticle}
          patient={currentPatient}
          onClose={() => setSelectedEducationalArticle(null)}
        />
      )}

      {/* 6. TOAST SIMULADOR DE NOTIFICACIÓN AUTOMÁTICA EN TIEMPO REAL */}
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* AVISO URGENTE DE MÁQUINA SI ESTÁ CON RETRASO O MANTENCIÓN */}
      {machine && machine.status !== 'OPERATIONAL' && (
        <div className={`p-4 rounded-2xl border flex items-start space-x-4 shadow-sm ${
          machine.status === 'DELAYED'
            ? 'bg-amber-50 border-amber-300 text-amber-900'
            : 'bg-red-50 border-red-300 text-red-900'
        }`}>
          <div className={`p-2 rounded-xl mt-0.5 ${
            machine.status === 'DELAYED' ? 'bg-amber-200 text-amber-800' : 'bg-red-200 text-red-800'
          }`}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="font-display font-bold text-base">
              {machine.status === 'DELAYED'
                ? `Aviso del Servicio: Retraso operacional de +${machine.delayMinutes} minutos en tu acelerador`
                : 'Aviso Importante: Acelerador en mantención técnica no programada'}
            </h4>
            <p className="text-sm mt-1">
              {machine.status === 'DELAYED'
                ? `Tu unidad (${machine.name}) está calibrando parámetros para mayor precisión. Si tu cita es hoy, puedes demorar tu llegada ${machine.delayMinutes} minutos o consultar con la recepción al llegar.`
                : `Tu unidad (${machine.name}) está siendo ajustada por el equipo de física médica. Nos comunicaremos contigo vía WhatsApp/SMS con tu horario de atención.`}
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
              <span>Tratamiento en Curso • {patient.diagnosisLabel}</span>
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
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-medium">1. TAC Simulación</span>
              <span className="font-semibold text-sm text-white block">{formatFriendlyDate(patient.tacDate)}</span>
              <span className="text-[11px] text-emerald-400 font-medium">Completado con éxito</span>
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
              <span className="text-[11px] text-brand-300 font-medium">En curso activo</span>
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
              <span className="text-[10px] uppercase font-bold tracking-tight">HOY</span>
              <span className="font-display font-extrabold text-base leading-none">05</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-brand-100 text-brand-800">
                  {nextAppointment.type === 'SESION_RADIOTERAPIA' ? `Sesión #${nextAppointment.sessionNumber}` : 'Control Médico'}
                </span>
                <span className="text-xs text-slate-500">Hora programada: <strong className="text-slate-800 text-sm">{nextAppointment.time} hrs</strong></span>
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg mt-1">
                {nextAppointment.type === 'SESION_RADIOTERAPIA' ? 'Sesión diaria de radioterapia' : 'Control semanal con radioncólogo'}
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
              <span>Avisar que no podré asistir hoy</span>
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
          <button
            onClick={onCancelFromDetail}
            className="text-xs text-rose-700 hover:text-rose-900 font-semibold underline"
          >
            ¿No podrás asistir a esta cita?
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
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
              Emitir Alerta Masiva a Pacientes
            </h3>
            <p className="text-xs text-slate-500">
              Notifica simultáneamente a todos los pacientes citados hoy en la máquina afectada.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Acelerador Afectado:</label>
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
            <label className="font-semibold text-slate-700 block mb-1">Tipo de Evento Técnico:</label>
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
                <strong>Retraso Operacional</strong>
                <span className="block text-[11px] text-slate-500 mt-0.5">Retrasa las horas de hoy</span>
              </button>

              <button
                type="button"
                onClick={() => setAlertType('MAINTENANCE')}
                className={`p-3 rounded-xl border text-left font-medium transition-all ${
                  alertType === 'MAINTENANCE'
                    ? 'bg-red-50 border-red-400 text-red-900 ring-1 ring-red-400'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <strong>Falla / Mantención</strong>
                <span className="block text-[11px] text-slate-500 mt-0.5">Detención técnica imprevista</span>
              </button>
            </div>
          </div>

          {alertType === 'DELAY' && (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Retraso Estimado (minutos):</label>
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
            📢 <strong>Alcance de la alerta:</strong> Se enviará un mensaje instantáneo personalizado (WhatsApp / SMS / Email) a cada paciente que tenga cita para hoy a partir de la hora actual.
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
          {article.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.trim().startsWith('###')) {
              return (
                <h4 key={index} className="font-display font-bold text-base text-slate-900 pt-2">
                  {paragraph.replace('###', '').trim()}
                </h4>
              );
            }
            if (paragraph.trim().startsWith('####')) {
              return (
                <h5 key={index} className="font-display font-semibold text-sm text-brand-800 pt-1">
                  {paragraph.replace('####', '').trim()}
                </h5>
              );
            }
            return (
              <p key={index} className="text-xs sm:text-sm text-slate-600">
                {paragraph.trim()}
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

// Render en el DOM
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);
