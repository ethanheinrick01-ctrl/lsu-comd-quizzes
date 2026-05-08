(function () {
  const answerSlots = {
    default: [2, 0, 3, 1, 1, 3, 0, 2, 3, 1, 2, 0, 0, 2, 1, 3, 2, 0, 3, 1],
    mock: [2, 0, 3, 1, 1, 3, 0, 2, 3, 1, 2, 0, 0, 2, 1, 3, 2, 0, 3, 1, 1, 2, 0, 3, 3, 0, 2, 1, 0, 1, 2, 3, 1, 0, 3, 2, 0, 1, 2, 3]
  };

  const labels = {
    vocab: "Vocabulario (Capítulos 15-18)",
    perfect: "Presente perfecto: indicativo o subjuntivo",
    antecedents: "Antecedentes inexistentes e indefinidos",
    purpose: "Conjunciones de propósito y contingencia",
    time: "Conjunciones de tiempo",
    future: "El futuro",
    past: "El imperfecto del subjuntivo",
    conditional: "El condicional",
    si: "Cláusulas con si"
  };

  function q(section, prompt, correct, distractors, explain, flags, answerSlot) {
    const answer = Number.isInteger(answerSlot) ? answerSlot : 0;
    const options = distractors.slice(0, 3);
    options.splice(answer, 0, correct);
    return {
      section,
      prompt,
      options,
      answer,
      explain,
      nosotros: Boolean(flags && flags.nosotros),
      trap: Boolean(flags && flags.trap)
    };
  }

  function quiz(id, title, subtitle, kind, rows) {
    const slots = answerSlots[id] || answerSlots.default;
    return {
      id,
      title,
      subtitle,
      kind,
      questions: rows.map((row, index) => q(...row, slots[index % slots.length]))
    };
  }

  const vocabRows = [
    [labels.vocab, "Para no gastar gasolina, prefiero usar _______ público.", "el transporte", ["la factura", "la boda", "el ejército"], "Transporte is the Ch. 15 word for transportation."],
    [labels.vocab, "Después del choque, el conductor llevó el carro al _______.", "taller", ["noticiero", "presupuesto", "templo"], "A repair shop for a car is el taller."],
    [labels.vocab, "Si la llanta está desinflada, necesito revisar _______.", "la llanta", ["la prensa", "el cargo", "la solicitud"], "Llanta is the tire; desinflada means flat."],
    [labels.vocab, "La ciudad quiere proteger _______ porque los ríos están contaminados.", "el medio ambiente", ["el noviazgo", "el cheque", "el senador"], "Pollution and rivers point to the environment."],
    [labels.vocab, "En una boda, la pareja normalmente celebra en _______.", "la iglesia", ["la gasolinera", "el cajero automático", "la autopista"], "Iglesia belongs to relationship/wedding vocabulary."],
    [labels.vocab, "Cuando dos personas no se llevan bien, a veces _______.", "se pelean", ["se gradúan", "se estacionan", "se depositan"], "Pelearse means to fight with someone."],
    [labels.vocab, "El periodo después de la boda se llama _______.", "la luna de miel", ["la circulación", "la dictadura", "el recibo"], "Luna de miel means honeymoon."],
    [labels.vocab, "Una persona que ya no está casada porque su esposo murió es _______.", "viuda", ["candidata", "mecánica", "soltera"], "Viudo/a means widow/widower."],
    [labels.vocab, "Nosotros _______ dinero cada mes para pagar la matrícula.", "ahorramos", ["asesinamos", "tocamos", "doblamos"], "Ahorrar is to save money.", { nosotros: true }],
    [labels.vocab, "Nosotros pagamos _______ cuando no queremos usar tarjeta.", "en efectivo", ["a la izquierda", "en huelga", "con cariño"], "En efectivo means in cash.", { nosotros: true }],
    [labels.vocab, "La persona que diseña puentes y edificios es _______.", "ingeniera", ["abogada", "enfermera", "soldada"], "Engineering connects to bridges/buildings."],
    [labels.vocab, "Para recibir salario, el empleado debe _______ el cheque.", "cobrar", ["postularse", "enterarse", "reciclar"], "Cobrar is to cash a check or charge."],
    [labels.vocab, "Nosotros _______ una solicitud cuando queremos un empleo.", "llenamos", ["matamos", "obedecemos", "luchamos"], "Llenar una solicitud is the job-application pattern.", { nosotros: true }],
    [labels.vocab, "El periódico, la radio y el noticiero son _______.", "medios de comunicación", ["recursos naturales", "estados civiles", "tarjetas bancarias"], "Media outlets are medios de comunicación."],
    [labels.vocab, "Si una persona vio el accidente, es _______.", "testigo", ["dictador", "gobierno", "interés"], "A witness is un/una testigo."],
    [labels.vocab, "Una persona que quiere un cargo político necesita _______.", "postularse", ["divorciarse", "estacionar", "contaminar"], "Postularse is to run for office."],
    [labels.vocab, "Nosotros _______ por el candidato antes de leer las noticias.", "votamos", ["cubrimos", "renunciamos", "nacemos"], "Votar is to vote.", { nosotros: true }],
    [labels.vocab, "La _______ protege los derechos y define lo legal.", "ley", ["batería", "cita", "finca"], "A legal rule is la ley."],
    [labels.vocab, "Los obreros no trabajan porque están en _______.", "huelga", ["semáforo", "amor", "efectivo"], "Huelga means strike."],
    [labels.vocab, "Nosotros leemos _______ para estar al día con la política.", "las noticias", ["los frenos", "las llantas", "las bodas"], "News keeps you up to date.", { nosotros: true }]
  ];

  const perfectRows = [
    [labels.perfect, "Dudo que el reportero _______ la verdad completa.", "haya dicho", ["ha dicho", "dijo", "dirá"], "Doubt triggers present perfect subjunctive."],
    [labels.perfect, "Es cierto que la revista _______ la entrevista.", "ha publicado", ["haya publicado", "publicó", "publicara"], "Es cierto que takes indicative."],
    [labels.perfect, "Me sorprende que tú _______ tanto vocabulario en una noche.", "hayas aprendido", ["has aprendido", "aprendiste", "aprenderás"], "Surprise/emotion triggers subjunctive."],
    [labels.perfect, "El profesor sabe que nosotros _______ los capítulos.", "hemos repasado", ["hayamos repasado", "repasáramos", "repasaremos"], "Saber que expresses certainty, so use indicative.", { nosotros: true }],
    [labels.perfect, "No creo que la fábrica _______ el río.", "haya protegido", ["ha protegido", "protegió", "protegerá"], "No creo que triggers subjunctive."],
    [labels.perfect, "Creo que los ciudadanos _______ por la candidata.", "han votado", ["hayan votado", "votaran", "votarán"], "Affirmed belief uses indicative."],
    [labels.perfect, "Es una lástima que nosotros _______ el recibo.", "hayamos perdido", ["hemos perdido", "perdimos", "perderemos"], "Es una lástima que triggers subjunctive.", { nosotros: true }],
    [labels.perfect, "No es verdad que el banco _______ intereses bajos.", "haya ofrecido", ["ha ofrecido", "ofreció", "ofrecerá"], "No es verdad que triggers subjunctive."],
    [labels.perfect, "Estoy seguro de que ustedes _______ el formulario.", "han completado", ["hayan completado", "completaron", "completaran"], "Estoy seguro de que takes indicative."],
    [labels.perfect, "Es probable que la policía _______ al testigo.", "haya encontrado", ["ha encontrado", "encontró", "encontrará"], "Probability triggers subjunctive."],
    [labels.perfect, "Nosotros no pensamos que _______ suficientes tarjetas.", "hayamos traído", ["hemos traído", "trajimos", "traeremos"], "No pensar que triggers subjunctive.", { nosotros: true }],
    [labels.perfect, "El noticiero confirma que la huelga _______.", "ha terminado", ["haya terminado", "terminó", "terminara"], "Confirmation of fact uses indicative."],
    [labels.perfect, "Ojalá que el gobierno _______ los recursos naturales.", "haya protegido", ["ha protegido", "protegió", "protegerá"], "Ojalá que triggers subjunctive."],
    [labels.perfect, "Mi madre dice que yo _______ demasiado en gasolina.", "he gastado", ["haya gastado", "gasté", "gastara"], "Decir as a report of fact uses indicative."],
    [labels.perfect, "Nos preocupa que nosotros no _______ bastante.", "hayamos dormido", ["hemos dormido", "dormimos", "dormiremos"], "Concern triggers subjunctive.", { nosotros: true }],
    [labels.perfect, "Niego que el candidato _______ sus promesas.", "haya cumplido", ["ha cumplido", "cumplió", "cumplirá"], "Niego que triggers subjunctive.", { trap: true }],
    [labels.perfect, "No niego que la prensa _______ mucho sobre el desastre.", "ha informado", ["haya informado", "informara", "informará"], "No niego que can affirm the fact, so indicative fits.", { trap: true }],
    [labels.perfect, "Es obvio que el semáforo _______ de funcionar.", "ha dejado", ["haya dejado", "dejó", "dejara"], "Es obvio que takes indicative."],
    [labels.perfect, "Nosotros estamos contentos de que _______ temprano.", "hayamos llegado", ["hemos llegado", "llegamos", "llegaremos"], "Emotion + de que triggers subjunctive.", { nosotros: true }],
    [labels.perfect, "Es posible que los mecánicos _______ el carro.", "hayan reparado", ["han reparado", "repararon", "repararán"], "Possibility triggers subjunctive."]
  ];

  const antecedentRows = [
    [labels.antecedents, "Busco una gasolinera que _______ abierta después de medianoche.", "esté", ["está", "estuvo", "estará"], "Searched-for/unknown place takes subjunctive."],
    [labels.antecedents, "La gasolinera de la esquina _______ abierta toda la noche.", "está", ["esté", "estuvo", "estaría"], "Specific known place takes indicative."],
    [labels.antecedents, "No hay ningún mecánico que _______ mi coche hoy.", "pueda", ["puede", "pudo", "podrá"], "No hay ningún points to nonexistent antecedent."],
    [labels.antecedents, "Conozco a una mecánica que _______ coches híbridos.", "repara", ["repare", "reparó", "reparará"], "Known person takes indicative."],
    [labels.antecedents, "Necesitamos un banco que nos _______ un préstamo justo.", "ofrezca", ["ofrece", "ofreció", "ofrecerá"], "Needed but unidentified bank takes subjunctive.", { nosotros: true }],
    [labels.antecedents, "Tenemos un banco que nos _______ préstamos sin muchos intereses.", "ofrece", ["ofrezca", "ofreció", "ofrecería"], "Existing bank takes indicative.", { nosotros: true, trap: true }],
    [labels.antecedents, "¿Hay alguien aquí que _______ cambiar una llanta?", "sepa", ["sabe", "supo", "sabrá"], "Existence is uncertain in the question."],
    [labels.antecedents, "Mi hermano es alguien que _______ cambiar una llanta.", "sabe", ["sepa", "supo", "sabría"], "Known person takes indicative."],
    [labels.antecedents, "No conozco a nadie que _______ en esa dictadura.", "confíe", ["confía", "confió", "confiará"], "No conozco a nadie triggers subjunctive."],
    [labels.antecedents, "Hay ciudadanos que _______ contra la discriminación.", "luchan", ["luchen", "lucharon", "lucharían"], "Existing citizens take indicative."],
    [labels.antecedents, "Nosotros queremos representantes que _______ nuestros derechos.", "defiendan", ["defienden", "defendieron", "defenderán"], "Wanted representatives are indefinite.", { nosotros: true }],
    [labels.antecedents, "Los representantes que elegimos _______ nuestros derechos.", "defienden", ["defiendan", "defendieron", "defenderían"], "Specific elected representatives take indicative.", { trap: true }],
    [labels.antecedents, "No encuentro una revista que _______ ese acontecimiento.", "explique", ["explica", "explicó", "explicará"], "No encuentro + indefinite thing takes subjunctive."],
    [labels.antecedents, "La revista de la biblioteca _______ ese acontecimiento.", "explica", ["explique", "explicó", "explicaría"], "Specific magazine takes indicative."],
    [labels.antecedents, "Buscamos un profesor que nos _______ el imperfecto del subjuntivo.", "enseñe", ["enseña", "enseñó", "enseñará"], "Searched-for teacher takes subjunctive.", { nosotros: true }],
    [labels.antecedents, "El profesor de esta sección nos _______ el imperfecto del subjuntivo.", "enseña", ["enseñe", "enseñó", "enseñaría"], "Specific professor takes indicative.", { nosotros: true }],
    [labels.antecedents, "No hay ninguna pareja que _______ siempre de acuerdo.", "esté", ["está", "estuvo", "estará"], "No hay ninguna triggers subjunctive."],
    [labels.antecedents, "Conozco una pareja que _______ muy bien.", "se lleva", ["se lleve", "se llevó", "se llevaría"], "Known couple takes indicative."],
    [labels.antecedents, "Necesito una aplicación que no me _______ las respuestas.", "muestre", ["muestra", "mostró", "mostrará"], "Needed unknown app takes subjunctive."],
    [labels.antecedents, "Esta aplicación me _______ preguntas nuevas.", "muestra", ["muestre", "mostró", "mostraría"], "Specific app takes indicative."]
  ];

  const purposeRows = [
    [labels.purpose, "Salgo temprano para _______ tráfico en la autopista.", "evitar", ["evite", "evito", "evitaré"], "Same subject after para takes infinitive."],
    [labels.purpose, "Mi padre me llama para que yo no _______ tarde.", "llegue", ["llego", "llegaré", "llegué"], "Para que with a new subject takes subjunctive."],
    [labels.purpose, "Nosotros usamos GPS para _______ la gasolinera.", "encontrar", ["encontremos", "encontramos", "encontraremos"], "Same subject after para takes infinitive.", { nosotros: true }],
    [labels.purpose, "La policía pone señales para que nosotros _______ despacio.", "manejemos", ["manejamos", "manejaremos", "manejábamos"], "Para que + new subject triggers subjunctive.", { nosotros: true }],
    [labels.purpose, "No salgas sin que tu novia _______ la dirección.", "sepa", ["sabe", "supo", "sabrá"], "Sin que takes subjunctive."],
    [labels.purpose, "Voy a estudiar sin _______ música.", "escuchar", ["escuche", "escucho", "escucharé"], "Same subject after sin takes infinitive."],
    [labels.purpose, "Te presto mi tarjeta con tal de que la _______ mañana.", "devuelvas", ["devuelves", "devolverás", "devolviste"], "Con tal de que takes subjunctive."],
    [labels.purpose, "Nosotros compramos comida en caso de que _______ una reunión larga.", "haya", ["hay", "habrá", "había"], "En caso de que takes subjunctive.", { nosotros: true }],
    [labels.purpose, "A menos que el banco _______ temprano, no podré cobrar el cheque.", "abra", ["abre", "abrió", "abrirá"], "A menos que takes subjunctive."],
    [labels.purpose, "La candidata practica antes de _______ con la prensa.", "hablar", ["hable", "habla", "hablará"], "Same subject after antes de takes infinitive."],
    [labels.purpose, "No publiques la noticia antes de que el testigo la _______.", "confirme", ["confirma", "confirmó", "confirmará"], "Antes de que takes subjunctive."],
    [labels.purpose, "Nosotros no votamos a menos que _______ bien informados.", "estemos", ["estamos", "estaremos", "estábamos"], "A menos que triggers subjunctive.", { nosotros: true }],
    [labels.purpose, "El gobierno crea leyes para _______ los derechos.", "proteger", ["proteja", "protege", "protegerá"], "Same subject purpose uses infinitive."],
    [labels.purpose, "El gobierno crea leyes para que los ciudadanos _______ seguros.", "estén", ["están", "estuvieron", "estarán"], "Para que + different subject takes subjunctive."],
    [labels.purpose, "Lleva efectivo en caso de que la tarjeta no _______.", "funcione", ["funciona", "funcionó", "funcionará"], "Contingency takes subjunctive."],
    [labels.purpose, "Nosotros cerramos la puerta antes de _______ la casa.", "salir", ["salgamos", "salimos", "saldremos"], "Same subject after antes de takes infinitive.", { nosotros: true }],
    [labels.purpose, "Mi jefe repite la regla para que todos la _______.", "entiendan", ["entienden", "entenderán", "entendieron"], "Para que triggers subjunctive."],
    [labels.purpose, "No entregues la solicitud sin que el gerente la _______.", "revise", ["revisa", "revisó", "revisará"], "Sin que takes subjunctive."],
    [labels.purpose, "La pareja ahorra dinero con tal de _______ una casa.", "comprar", ["compre", "compra", "comprará"], "Same subject with con tal de uses infinitive."],
    [labels.purpose, "Te llamo en caso de que _______ ayuda con el futuro.", "necesites", ["necesitas", "necesitarás", "necesitaste"], "En caso de que takes subjunctive."]
  ];

  const timeRows = [
    [labels.time, "Cuando nosotros _______ a Lockett, buscaremos nuestros asientos.", "lleguemos", ["llegamos", "llegaremos", "llegábamos"], "Future/pending cuando takes subjunctive.", { nosotros: true }],
    [labels.time, "Cuando mis primos _______ niños, montaban bicicletas.", "eran", ["sean", "serán", "fueran"], "Past background after cuando takes imperfect indicative."],
    [labels.time, "Siempre reviso el tanque antes de que _______ vacío.", "esté", ["está", "estará", "estuvo"], "Antes de que takes subjunctive."],
    [labels.time, "Leo las noticias mientras _______ el desayuno.", "tomo", ["tome", "tomaré", "tomara"], "Habitual/current action takes indicative."],
    [labels.time, "Te mandaré un mensaje tan pronto como _______ el examen.", "termine", ["termino", "terminaré", "terminé"], "Future/pending action takes subjunctive."],
    [labels.time, "Ayer te llamé tan pronto como _______ el examen.", "terminé", ["termine", "terminaré", "terminaba"], "Completed past action takes preterite."],
    [labels.time, "Nosotros seguiremos practicando hasta que _______ seguros.", "estemos", ["estamos", "estaremos", "estábamos"], "Pending endpoint takes subjunctive.", { nosotros: true }],
    [labels.time, "Nosotros estudiamos cada vez que _______ tiempo.", "tenemos", ["tengamos", "tendremos", "tuviéramos"], "Habitual cada vez que takes indicative.", { nosotros: true }],
    [labels.time, "En cuanto la profesora _______ las instrucciones, empieza la prueba.", "da", ["dé", "dará", "diera"], "General/habitual procedure takes indicative."],
    [labels.time, "En cuanto la profesora _______ las instrucciones mañana, empezaremos.", "dé", ["da", "dará", "dio"], "Future/pending event takes subjunctive."],
    [labels.time, "Después de que el candidato _______ el debate, todos hablaron.", "perdió", ["pierda", "perderá", "perdiera"], "Completed past action takes indicative."],
    [labels.time, "Después de que el candidato _______ el debate, la prensa escribirá.", "pierda", ["pierde", "perderá", "perdió"], "Future/pending after takes subjunctive."],
    [labels.time, "Nosotros no saldremos hasta que el semáforo _______ verde.", "esté", ["está", "estará", "estaba"], "Pending condition after hasta que takes subjunctive.", { nosotros: true }],
    [labels.time, "Cada mañana escucho la radio cuando _______ al trabajo.", "manejo", ["maneje", "manejaré", "manejara"], "Habitual action uses indicative."],
    [labels.time, "Cuando _______ a manejar, compraré un coche híbrido.", "aprenda", ["aprendo", "aprenderé", "aprendí"], "Future/pending cuando takes subjunctive."],
    [labels.time, "Antes de _______ el recibo, reviso la cuenta.", "pagar", ["pague", "pago", "pagaré"], "Same subject after antes de takes infinitive."],
    [labels.time, "Antes de que nosotros _______ la cuenta, revisa el recibo.", "paguemos", ["pagamos", "pagaremos", "pagábamos"], "Antes de que + new subject takes subjunctive.", { nosotros: true }],
    [labels.time, "Mientras hubo huelga, los obreros no _______.", "trabajaron", ["trabajen", "trabajarán", "trabajaran"], "Completed past context takes indicative."],
    [labels.time, "Mientras _______ huelga, el gobierno negociará.", "haya", ["hay", "habrá", "hubo"], "Pending condition takes subjunctive."],
    [labels.time, "Cuando mi abuela _______ joven, no había Internet.", "era", ["sea", "será", "fuera"], "Past background uses imperfect indicative."]
  ];

  const futureRows = [
    [labels.future, "Nosotros _______ el capítulo 18 antes de dormir.", "repasaremos", ["repasamos", "repasaríamos", "repasáramos"], "Regular future uses infinitive + -emos.", { nosotros: true }],
    [labels.future, "Mañana yo _______ una solicitud para el trabajo.", "llenaré", ["lleno", "llenaría", "llenara"], "Mañana points to simple future."],
    [labels.future, "La mecánica _______ la batería esta tarde.", "cambiará", ["cambia", "cambiaría", "cambiara"], "Simple future: cambiará."],
    [labels.future, "Nosotros _______ la verdad si el reportero pregunta.", "diremos", ["decimos", "diríamos", "dijéramos"], "Decir future stem is dir-.", { nosotros: true }],
    [labels.future, "El banco _______ nuevos préstamos en junio.", "ofrecerá", ["ofrece", "ofrecería", "ofreciera"], "Future time marker: en junio."],
    [labels.future, "Tú _______ que obedecer el límite de velocidad.", "tendrás", ["tienes", "tendrías", "tuvieras"], "Tener future stem is tendr-."],
    [labels.future, "Nosotros _______ de Baton Rouge a las seis.", "saldremos", ["salimos", "saldríamos", "saliéramos"], "Salir future stem is saldr-.", { nosotros: true }],
    [labels.future, "La prensa _______ el acontecimiento esta noche.", "cubrirá", ["cubre", "cubriría", "cubriera"], "Cubrir is regular in future."],
    [labels.future, "Yo _______ menos gasolina con un coche híbrido.", "gastaré", ["gasto", "gastaría", "gastara"], "Simple future of gastar."],
    [labels.future, "Ustedes _______ los resultados después del examen.", "sabrán", ["saben", "sabrían", "supieran"], "Saber future stem is sabr-."],
    [labels.future, "Nosotros _______ un presupuesto antes del viaje.", "haremos", ["hacemos", "haríamos", "hiciéramos"], "Hacer future stem is har-.", { nosotros: true }],
    [labels.future, "Mi hermano _______ dinero en efectivo.", "traerá", ["trae", "traería", "trajera"], "Traer is regular in simple future."],
    [labels.future, "La pareja _______ en una iglesia pequeña.", "se casará", ["se casa", "se casaría", "se casara"], "Simple future of casarse."],
    [labels.future, "Nosotros _______ comunicarnos con la profesora.", "podremos", ["podemos", "podríamos", "pudiéramos"], "Poder future stem is podr-.", { nosotros: true }],
    [labels.future, "Habrá más tráfico cuando _______ la manifestación.", "termine", ["termina", "terminará", "terminó"], "The main verb is future hay -> habrá; pending cuando uses subjunctive.", { trap: true }],
    [labels.future, "El candidato _______ sus promesas si gana.", "mantendrá", ["mantiene", "mantendría", "mantuviera"], "Mantener future stem is mantendr-."],
    [labels.future, "Yo _______ la cuenta con tarjeta.", "pagaré", ["pago", "pagaría", "pagara"], "Regular future keeps infinitive; no pague spelling change."],
    [labels.future, "La clase _______ a las siete y media.", "empezará", ["empieza", "empezaría", "empezara"], "Future time is implied for the exam."],
    [labels.future, "Los estudiantes _______ temprano al salón.", "vendrán", ["vienen", "vendrían", "vinieran"], "Venir future stem is vendr-."],
    [labels.future, "Yo _______ el carro en el estacionamiento.", "pondré", ["pongo", "pondría", "pusiera"], "Poner future stem is pondr-."]
  ];

  const pastSubjRows = [
    [labels.past, "Era importante que nosotros _______ la guía completa.", "leyéramos", ["leímos", "leamos", "leeríamos"], "Past importance + que takes imperfect subjunctive.", { nosotros: true }],
    [labels.past, "La profesora pidió que los estudiantes _______ a tiempo.", "llegaran", ["llegaban", "llegaron", "llegarán"], "Pedir que in past triggers imperfect subjunctive."],
    [labels.past, "Mis padres querían que yo _______ más cuidado al manejar.", "tuviera", ["tenía", "tuve", "tendría"], "Past desire + que takes imperfect subjunctive."],
    [labels.past, "Era raro que el noticiero no _______ la huelga.", "mencionara", ["mencionaba", "mencionó", "mencionaría"], "Past reaction + que triggers imperfect subjunctive."],
    [labels.past, "Nosotros dudábamos que el banco nos _______ el préstamo.", "diera", ["daba", "dio", "dará"], "Doubt in the past triggers imperfect subjunctive.", { nosotros: true }],
    [labels.past, "No había nadie que _______ la causa del choque.", "supiera", ["sabía", "supo", "sabrá"], "Nonexistent antecedent in the past takes imperfect subjunctive."],
    [labels.past, "Buscaban un testigo que _______ hablar con la prensa.", "pudiera", ["podía", "pudo", "podría"], "Unknown antecedent in past context takes imperfect subjunctive."],
    [labels.past, "Me molestó que tú no _______ el recibo.", "trajeras", ["traías", "trajiste", "traerías"], "Past emotion + que triggers imperfect subjunctive."],
    [labels.past, "El gerente insistió en que nosotros _______ la solicitud.", "llenáramos", ["llenamos", "llenemos", "llenaríamos"], "Insistir en que in the past triggers imperfect subjunctive.", { nosotros: true }],
    [labels.past, "Era necesario que los ciudadanos _______ sus derechos.", "conocieran", ["conocían", "conocieron", "conocerían"], "Past necessity + que triggers imperfect subjunctive."],
    [labels.past, "Como si el político _______ todas las respuestas, habló por una hora.", "tuviera", ["tenía", "tuvo", "tendría"], "Como si takes imperfect subjunctive."],
    [labels.past, "Ojalá que nosotros _______ estudiado antes.", "hubiéramos", ["hemos", "hayamos", "habríamos"], "Past impossible wish uses past perfect subjunctive.", { nosotros: true, trap: true }],
    [labels.past, "Si yo _______ más vocabulario, entendería el noticiero.", "supiera", ["sabía", "sabría", "sabré"], "Hypothetical si uses imperfect subjunctive."],
    [labels.past, "El jefe no permitió que ella _______ temprano.", "saliera", ["salía", "salió", "saldría"], "Permitir que in past triggers imperfect subjunctive."],
    [labels.past, "Nos sorprendió que el ejército _______ tan rápido.", "llegara", ["llegaba", "llegó", "llegaría"], "Past surprise triggers imperfect subjunctive."],
    [labels.past, "Yo esperaba que nosotros _______ en efectivo.", "pagáramos", ["pagamos", "paguemos", "pagaríamos"], "Past hope + que triggers imperfect subjunctive.", { nosotros: true }],
    [labels.past, "La candidata negó que la prensa _______ la verdad.", "dijera", ["decía", "dijo", "dirá"], "Negar que in past triggers imperfect subjunctive."],
    [labels.past, "Era imposible que el semáforo _______ después del choque.", "funcionara", ["funcionaba", "funcionó", "funcionará"], "Past impossibility takes imperfect subjunctive."],
    [labels.past, "Me habría gustado que tú _______ a la reunión.", "vinieras", ["venías", "viniste", "vendrías"], "Would have liked + que triggers imperfect subjunctive."],
    [labels.past, "Los estudiantes estudiaban como si _______ todo el semestre.", "hubieran practicado", ["han practicado", "habían practicado", "practicarían"], "Como si can take past perfect subjunctive for prior action."]
  ];

  const conditionalRows = [
    [labels.conditional, "Nosotros _______ más rápido sin tráfico.", "manejaríamos", ["manejábamos", "manejáramos", "manejaremos"], "Conditional nosotros ending is -íamos.", { nosotros: true }],
    [labels.conditional, "Yo _______ un coche híbrido si costara menos.", "compraría", ["compraba", "comprara", "compraré"], "Hypothetical result takes conditional."],
    [labels.conditional, "El gobierno _______ la ley si hubiera presión pública.", "cambiaría", ["cambiaba", "cambiara", "cambiará"], "Result of hypothetical uses conditional."],
    [labels.conditional, "Mis amigos _______ un préstamo para viajar.", "pedirían", ["pedían", "pidieran", "pedirán"], "Conditional of pedir is regular from infinitive."],
    [labels.conditional, "Nosotros _______ la noticia si estuviéramos al día.", "entenderíamos", ["entendíamos", "entendiéramos", "entenderemos"], "Conditional result with nosotros.", { nosotros: true }],
    [labels.conditional, "Tú _______ más si trabajaras a tiempo completo.", "ganarías", ["ganabas", "ganaras", "ganarás"], "Si + past subjunctive result uses conditional."],
    [labels.conditional, "La prensa _______ el desastre si pudiera entrar.", "cubriría", ["cubría", "cubriera", "cubrirá"], "Would cover = conditional."],
    [labels.conditional, "Yo _______ la verdad, pero no sé los detalles.", "diría", ["decía", "dijera", "diré"], "Decir conditional stem is dir-."],
    [labels.conditional, "Nosotros _______ que estudiar menos si recordáramos el vocabulario.", "tendríamos", ["teníamos", "tuviéramos", "tendremos"], "Tener conditional stem is tendr-.", { nosotros: true }],
    [labels.conditional, "El banco _______ aceptar pagos a plazos.", "debería", ["debía", "debiera", "deberá"], "Debería means should/would have to."],
    [labels.conditional, "Mi hermana dijo que la boda _______ en junio.", "sería", ["era", "fuera", "será"], "Reported future can use conditional."],
    [labels.conditional, "Nosotros _______ de la ciudad si hubiera un desastre.", "saldríamos", ["salíamos", "saliéramos", "saldremos"], "Salir conditional stem is saldr-.", { nosotros: true }],
    [labels.conditional, "Usted _______ la factura con tarjeta o efectivo.", "pagaría", ["pagaba", "pagara", "pagará"], "Would pay = conditional."],
    [labels.conditional, "Cuando era niño, yo _______ con mis primos cada verano.", "jugaba", ["jugaría", "jugara", "jugaré"], "English 'would' as past habit uses imperfect, not conditional.", { trap: true }],
    [labels.conditional, "Los candidatos _______ más votos con mejores discursos.", "recibirían", ["recibían", "recibieran", "recibirán"], "Conditional result."],
    [labels.conditional, "Nosotros _______ ayudar al testigo después del examen.", "podríamos", ["podíamos", "pudiéramos", "podremos"], "Poder conditional stem is podr-.", { nosotros: true }],
    [labels.conditional, "Yo _______ el presupuesto antes de pedir un préstamo.", "haría", ["hacía", "hiciera", "haré"], "Hacer conditional stem is har-."],
    [labels.conditional, "La pareja _______ vivir cerca del lago.", "querría", ["quería", "quisiera", "querrá"], "Querer conditional stem is querr-."],
    [labels.conditional, "La profesora dijo que los estudiantes _______ cuatro preguntas con si.", "verían", ["veían", "vieran", "verán"], "Reported future uses conditional."],
    [labels.conditional, "Si yo _______ rico, compraría una casa.", "fuera", ["era", "sería", "seré"], "This asks for the si-clause; use imperfect subjunctive.", { trap: true }]
  ];

  const siRows = [
    [labels.si, "Si nosotros _______ más tiempo, repasaríamos vocabulario.", "tuviéramos", ["teníamos", "tendríamos", "tendremos"], "Si half uses imperfect subjunctive.", { nosotros: true }],
    [labels.si, "Nosotros repasaríamos vocabulario si _______ más tiempo.", "tuviéramos", ["teníamos", "tendríamos", "tendremos"], "Flipped order: si half still uses imperfect subjunctive.", { nosotros: true, trap: true }],
    [labels.si, "Si el banco _______ intereses bajos, pediría un préstamo.", "ofreciera", ["ofrecía", "ofrecería", "ofrecerá"], "Si + imperfect subjunctive."],
    [labels.si, "Pediría un préstamo si el banco _______ intereses bajos.", "ofreciera", ["ofrecía", "ofrecería", "ofrecerá"], "Flipped order, same si-clause rule.", { trap: true }],
    [labels.si, "Si yo fuera candidato, _______ por la igualdad.", "lucharía", ["luchara", "luchaba", "lucharé"], "Result half uses conditional."],
    [labels.si, "Yo lucharía por la igualdad si _______ candidato.", "fuera", ["era", "sería", "seré"], "Si half uses imperfect subjunctive.", { trap: true }],
    [labels.si, "Si la prensa _______ más detalles, el público estaría al día.", "informara", ["informaba", "informaría", "informará"], "Si + imperfect subjunctive."],
    [labels.si, "El público estaría al día si la prensa _______ más detalles.", "informara", ["informaba", "informaría", "informará"], "Flipped order, still imperfect subjunctive.", { trap: true }],
    [labels.si, "Si nosotros _______ el recibo, pagaríamos la factura.", "encontráramos", ["encontramos", "encontraríamos", "encontraremos"], "Nosotros si-clause uses -áramos.", { nosotros: true }],
    [labels.si, "Nosotros pagaríamos la factura si _______ el recibo.", "encontráramos", ["encontramos", "encontraríamos", "encontraremos"], "Flipped order with nosotros si-clause.", { nosotros: true, trap: true }],
    [labels.si, "Si tú _______ la ley, no tendrías problemas.", "obedecieras", ["obedecías", "obedecerías", "obedecerás"], "Si + imperfect subjunctive."],
    [labels.si, "No tendrías problemas si _______ la ley.", "obedecieras", ["obedecías", "obedecerías", "obedecerás"], "Flipped order, same si rule.", { trap: true }],
    [labels.si, "Si hubiera menos contaminación, el aire _______ más puro.", "sería", ["fuera", "era", "será"], "Result half uses conditional."],
    [labels.si, "El aire sería más puro si _______ menos contaminación.", "hubiera", ["había", "habría", "habrá"], "Si half uses imperfect subjunctive haber."],
    [labels.si, "Si nosotros _______ las noticias, sabríamos del desastre.", "leyéramos", ["leíamos", "leeríamos", "leeremos"], "Si half uses imperfect subjunctive nosotros.", { nosotros: true }],
    [labels.si, "Sabrías del desastre si tú _______ las noticias.", "leyeras", ["leías", "leerías", "leerás"], "Flipped order; the si half still uses imperfect subjunctive.", { trap: true }],
    [labels.si, "Si Marta _______ manejar, compraría un coche.", "supiera", ["sabía", "sabría", "sabrá"], "Si + imperfect subjunctive."],
    [labels.si, "Marta compraría un coche si _______ manejar.", "supiera", ["sabía", "sabría", "sabrá"], "Flipped order, same si rule.", { trap: true }],
    [labels.si, "Si el candidato ganara, ellos _______ la política.", "seguirían", ["siguen", "siguieran", "seguirán"], "Result half uses conditional."],
    [labels.si, "Ellos seguirían la política si el candidato _______.", "ganara", ["ganaba", "ganaría", "ganará"], "Flipped order; si half uses imperfect subjunctive.", { trap: true }]
  ];

  const quizzes = {
    vocab: quiz("vocab", "Vocabulary, Chapters 15-18", "20 high-yield context items from environment, relationships, work/money, media, and politics.", "Vocabulary", vocabRows),
    perfect: quiz("perfect", "Present Perfect: Indicative vs. Subjunctive", "20 trigger-first items: certainty vs doubt, emotion, denial, and probability.", "Grammar", perfectRows),
    antecedents: quiz("antecedents", "Nonexistent and Indefinite Antecedents", "20 known-vs-unknown antecedent traps, including exact contrast pairs.", "Grammar", antecedentRows),
    purpose: quiz("purpose", "Purpose and Contingency Conjunctions", "20 para/para que, antes de/antes de que, sin/sin que, and contingency items.", "Grammar", purposeRows),
    time: quiz("time", "Time Conjunctions", "20 future/pending, habitual, and completed-past contrast items.", "Grammar", timeRows),
    future: quiz("future", "Simple Future Tense", "20 future-tense items with irregular stems and five nosotros targets.", "Grammar", futureRows),
    "past-subjunctive": quiz("past-subjunctive", "Imperfect / Past Subjunctive", "20 past-trigger, como si, si-clause, and past-perfect-subjunctive items.", "Grammar", pastSubjRows),
    conditional: quiz("conditional", "Conditional Tense", "20 would/should/reported-future items with conditional-vs-imperfect traps.", "Grammar", conditionalRows),
    "si-clauses": quiz("si-clauses", "Cláusulas con si", "20 normal and flipped si-clause items: si + past subjunctive -> conditional.", "Grammar", siRows)
  };

  const ruleSets = {
    vocab: [
      "Vocabulary comes from Ch. 15-18: environment/driving, relationships, work/money, media, politics.",
      "Use the category first, then the word: bank terms, media terms, politics terms, relationship terms.",
      "Ch. 17 money traps: préstamo = loan, recibo = receipt, presupuesto = budget, efectivo = cash.",
      "Ch. 18 media/politics traps: prensa/noticiero/noticias vs ley/cargo/candidato/votar.",
      "Read the whole sentence. Most wrong answers are real words from the wrong chapter category."
    ],
    perfect: [
      "Certainty/fact takes indicative: sé que, creo que, es cierto que, estoy seguro de que.",
      "Doubt, denial, emotion, probability, and judgment take subjunctive.",
      "Nosotros forms: hemos + participle for indicative; hayamos + participle for subjunctive.",
      "Do not choose preterite/future if the meaning is has/have done.",
      "The trigger before que decides the mood."
    ],
    antecedents: [
      "Known/specific antecedent takes indicative.",
      "Unknown, nonexistent, searched-for, or desired antecedent takes subjunctive.",
      "No hay ningún/ninguna and no conozco a nadie are strong subjunctive signals.",
      "Contrast pairs matter: tenemos un banco que ofrece vs necesitamos un banco que ofrezca.",
      "Questions with hay alguien que often signal uncertainty."
    ],
    purpose: [
      "Para que, sin que, en caso de que, con tal de que, a menos que, antes de que take subjunctive.",
      "Same subject after para, sin, antes de, con tal de takes infinitive.",
      "Para estudiar = same subject; para que nosotros estudiemos = new subject.",
      "Contingency expressions almost always want subjunctive.",
      "Watch spelling changes in subjunctive: llegar -> llegue/lleguemos, pagar -> pague/paguemos."
    ],
    time: [
      "Future or pending action after cuando/en cuanto/tan pronto como/hasta que/después de que takes subjunctive.",
      "Habitual action takes indicative.",
      "Completed past action takes indicative.",
      "Antes de que takes subjunctive; antes de + infinitive is same subject.",
      "Do not choose future after a time conjunction when the dependent action is pending."
    ],
    future: [
      "Future = infinitive + -é, -ás, -á, -emos, -éis, -án.",
      "Nosotros future ending is -emos.",
      "Irregular stems: dir-, har-, podr-, pondr-, querr-, sabr-, saldr-, tendr-, vendr-, habr-.",
      "Future is not conditional: podré/podremos = will be able; podría/podríamos = would be able.",
      "The infinitive shape stays mostly intact in future tense."
    ],
    "past-subjunctive": [
      "Build from ellos preterite: tuvieron -> tuviera; dijeron -> dijera; fueron -> fuera.",
      "Past triggers: quería que, pidió que, era importante que, me sorprendió que.",
      "Nosotros imperfect subjunctive has an accent: habláramos, tuviéramos, fuéramos.",
      "Como si and hypothetical si clauses use imperfect subjunctive.",
      "Past perfect subjunctive = hubiera/hubieras/hubiéramos/hubieran + participle."
    ],
    conditional: [
      "Conditional = infinitive + -ía, -ías, -ía, -íamos, -íais, -ían.",
      "Same irregular stems as future: dir-, har-, podr-, pondr-, querr-, sabr-, saldr-, tendr-, vendr-.",
      "Use conditional for the result half of a hypothetical.",
      "Nosotros conditional ending is -íamos.",
      "English would can be imperfect if it means used to."
    ],
    "si-clauses": [
      "Formula: si + imperfect subjunctive, then conditional.",
      "The order can flip; the si half still takes imperfect subjunctive.",
      "In the si half, choose tuviera, pudiera, fuera, supiera, hubiera.",
      "In the result half, choose tendría, podría, sería, viajaría.",
      "Professor-flagged trap: flipped clause order."
    ]
  };

  Object.entries(ruleSets).forEach(([id, rules]) => {
    quizzes[id].ruleIntro = "Use these rules before choosing an answer.";
    quizzes[id].rules = rules;
  });

  const mockRows = [
    [labels.vocab, "Para reducir la contaminación, la ciudad quiere mejorar _______.", "el transporte público", ["la luna de miel", "el recibo", "la dictadura"], "Transportation/environment vocabulary from Ch. 15."],
    [labels.vocab, "Después de retirar dinero, el cajero automático me dio _______.", "un recibo", ["un bosque", "una manifestación", "una novia"], "A receipt confirms the transaction."],
    [labels.vocab, "El/la _______ habló en vivo desde el lugar del desastre.", "reportero/a", ["dentista", "agricultor/a", "mecánico/a"], "Media/disaster context points to reporter."],
    [labels.vocab, "Una persona que quiere representar al pueblo necesita _______.", "postularse", ["casarse", "estacionar", "reciclar"], "Postularse = to run for office."],
    [labels.vocab, "Cuando dos novios deciden terminar la relación, van a _______.", "romper", ["cobrar", "obedecer", "mantener"], "Romper con means to break up with."],
    [labels.perfect, "Es dudoso que la revista _______ todos los detalles.", "haya confirmado", ["ha confirmado", "confirmó", "confirmará"], "Doubt triggers present perfect subjunctive."],
    [labels.perfect, "Nosotros creemos que _______ suficiente vocabulario.", "hemos practicado", ["hayamos practicado", "practicáramos", "practicaremos"], "Creer que expresses belief/certainty.", { nosotros: true }],
    [labels.perfect, "Me alegra que el banco me _______ el préstamo.", "haya aprobado", ["ha aprobado", "aprobó", "aprobará"], "Emotion + que triggers subjunctive."],
    [labels.perfect, "Es verdad que los estudiantes _______ temprano.", "han llegado", ["hayan llegado", "llegaron", "llegaran"], "Es verdad que takes indicative."],
    [labels.antecedents, "Necesito una tarjeta que no _______ intereses altos.", "tenga", ["tiene", "tuvo", "tendrá"], "Needed unknown thing takes subjunctive."],
    [labels.antecedents, "Mi tarjeta bancaria _______ pocos intereses.", "tiene", ["tenga", "tuvo", "tendría"], "Specific known card takes indicative."],
    [labels.antecedents, "No conocemos a nadie que _______ en esa estación de radio.", "trabaje", ["trabaja", "trabajó", "trabajará"], "No conocemos a nadie triggers subjunctive.", { nosotros: true }],
    [labels.antecedents, "Hay una periodista que _______ al día con la política.", "está", ["esté", "estuvo", "estaría"], "Existing journalist takes indicative."],
    [labels.purpose, "Traigo mi licencia para que la policía no me _______ problemas.", "cause", ["causa", "causará", "causó"], "Para que + new subject takes subjunctive."],
    [labels.purpose, "Nosotros salimos temprano para _______ tráfico.", "evitar", ["evitemos", "evitamos", "evitaremos"], "Same subject after para takes infinitive.", { nosotros: true }],
    [labels.purpose, "No compres el coche sin que el mecánico lo _______.", "revise", ["revisa", "revisó", "revisará"], "Sin que takes subjunctive."],
    [labels.purpose, "Llamo en caso de que tú _______ la dirección.", "pierdas", ["pierdes", "perderás", "perdiste"], "En caso de que takes subjunctive."],
    [labels.time, "Cuando nosotros _______ del examen, iremos a desayunar.", "salgamos", ["salimos", "saldremos", "salíamos"], "Future/pending cuando takes subjunctive.", { nosotros: true }],
    [labels.time, "Cada vez que la prensa _______ una noticia, la leo.", "publica", ["publique", "publicará", "publicó"], "Habitual action takes indicative."],
    [labels.time, "Después de que el gobierno _______ la ley ayer, hubo protestas.", "aprobó", ["apruebe", "aprobará", "aprobara"], "Completed past event takes preterite."],
    [labels.time, "Hasta que la huelga _______ , los obreros no volverán.", "termine", ["termina", "terminará", "terminó"], "Pending endpoint takes subjunctive."],
    [labels.future, "Nosotros _______ los resultados en el noticiero.", "veremos", ["vemos", "veríamos", "viéramos"], "Simple future nosotros of ver.", { nosotros: true }],
    [labels.future, "Yo _______ el tanque antes de viajar.", "llenaré", ["lleno", "llenaría", "llenara"], "Simple future of llenar."],
    [labels.future, "El candidato _______ un discurso mañana.", "hará", ["hace", "haría", "hiciera"], "Hacer future stem is har-."],
    [labels.future, "Ustedes _______ que pagar en efectivo.", "tendrán", ["tienen", "tendrían", "tuvieran"], "Tener future stem is tendr-."],
    [labels.future, "La pareja _______ después de graduarse.", "se casará", ["se casa", "se casaría", "se casara"], "Future of casarse."],
    [labels.past, "Era necesario que nosotros _______ los frenos.", "revisáramos", ["revisamos", "revisemos", "revisaríamos"], "Past necessity + que takes imperfect subjunctive.", { nosotros: true }],
    [labels.past, "El profesor recomendó que yo _______ las reglas.", "memorizara", ["memorizaba", "memoricé", "memorizaría"], "Past recommendation triggers imperfect subjunctive."],
    [labels.past, "No había ningún estudiante que _______ todos los términos.", "recordara", ["recordaba", "recordó", "recordará"], "Nonexistent antecedent in past takes imperfect subjunctive."],
    [labels.past, "La candidata hablaba como si _______ presidenta.", "fuera", ["era", "sería", "será"], "Como si takes imperfect subjunctive."],
    [labels.past, "Ojalá que nosotros _______ más temprano ayer.", "hubiéramos empezado", ["hemos empezado", "hayamos empezado", "empezaríamos"], "Past impossible wish takes past perfect subjunctive.", { nosotros: true }],
    [labels.conditional, "Nosotros _______ más si tuviéramos otro día.", "estudiaríamos", ["estudiábamos", "estudiáramos", "estudiaremos"], "Hypothetical result takes conditional.", { nosotros: true }],
    [labels.conditional, "Yo _______ la autopista si hubiera demasiado tráfico.", "evitaría", ["evitaba", "evitara", "evitaré"], "Would avoid = conditional."],
    [labels.conditional, "El gobierno _______ los derechos si pudiera.", "mantendría", ["mantenía", "mantuviera", "mantendrá"], "Mantener conditional stem is mantendr-."],
    [labels.conditional, "Cuando era niño, mi abuelo _______ historias cada noche.", "contaba", ["contaría", "contara", "contará"], "Past habitual would uses imperfect.", { trap: true }],
    [labels.si, "Si nosotros _______ la guía, aprobaríamos.", "entendiéramos", ["entendíamos", "entenderíamos", "entenderemos"], "Si half uses imperfect subjunctive.", { nosotros: true }],
    [labels.si, "Aprobaríamos si nosotros _______ la guía.", "entendiéramos", ["entendíamos", "entenderíamos", "entenderemos"], "Flipped order; si half still takes imperfect subjunctive.", { nosotros: true, trap: true }],
    [labels.si, "Si el reportero supiera la verdad, la _______.", "diría", ["dijera", "decía", "dirá"], "Result half uses conditional."],
    [labels.si, "La candidata ganaría si los ciudadanos _______.", "votaran", ["votaban", "votarían", "votarán"], "Flipped order; si half takes imperfect subjunctive.", { trap: true }],
    [labels.si, "Si hubiera menos contaminación, nosotros _______ mejor.", "viviríamos", ["vivíamos", "viviéramos", "viviremos"], "Result half uses conditional nosotros.", { nosotros: true }]
  ];

  quizzes.mock = quiz(
    "mock",
    "Comprehensive Mock Final",
    "40 new high-yield questions. Each question is labeled by final-exam section so you do not have to infer the grammar type from context.",
    "Mock Final",
    mockRows
  );
  quizzes.mock.ruleIntro = "Mock final labels match the exam buckets from the study guide.";
  quizzes.mock.rules = [
    "Read the label above each question first; it tells you which rule set to use.",
    "Vocab items are Ch. 15-18 category/context questions.",
    "Grammar items target triggers, known vs unknown antecedents, future/pending time clauses, future/conditional stems, and si-clause order.",
    "For si clauses, check whether the blank is in the si half or the result half.",
    "There are repeated nosotros targets because those endings are high-yield."
  ];

  window.SPANISH_FINAL_QUIZZES = quizzes;
})();
