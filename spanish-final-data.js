(function () {
  let rotateSeed = 0;

  function q(section, prompt, correct, distractors, explain, flags) {
    const answer = rotateSeed % 4;
    rotateSeed += 1;
    const options = distractors.slice(0, 3);
    options.splice(answer, 0, correct);
    return {
      section,
      prompt,
      options,
      answer,
      explain,
      anchor: Boolean(flags && flags.anchor),
      nosotros: Boolean(flags && flags.nosotros),
      trap: Boolean(flags && flags.trap)
    };
  }

  function quiz(id, title, subtitle, kind, rows) {
    rotateSeed = 0;
    return {
      id,
      title,
      subtitle,
      kind,
      questions: rows.map(row => q(...row))
    };
  }

  const vocabRows = [
    ["Vocabulario", "Hay mucha _______ en la ciudad debido al trafico y las fabricas.", "contaminacion", ["solicitud", "periodico", "huelga"], "The city problem caused by traffic and factories is contaminacion.", { anchor: true }],
    ["Vocabulario", "Para conseguir una entrevista, primero es necesario llenar _______.", "una solicitud", ["un prestamo", "un recibo", "un semaforo"], "Llenar una solicitud is the job-application pattern from the chapter prueba.", { anchor: true }],
    ["Vocabulario", "Un profesional que cuida de los dientes de los pacientes es _______.", "dentista", ["secretario", "profesora", "analista de sistemas"], "Dental patients point to dentista.", { anchor: true }],
    ["Vocabulario", "Un profesional que trabaja con muchos libros e informacion es _______.", "bibliotecario", ["astronauta", "enfermero", "plomero"], "Books and information point to bibliotecario.", { anchor: true }],
    ["Vocabulario", "Para comprar un auto, muchos piden _______ del banco.", "un prestamo", ["un recibo", "una factura", "un billete"], "A bank loan is un prestamo.", { anchor: true }],
    ["Vocabulario", "En los restaurantes, si no uso tarjeta, prefiero pagar _______.", "en efectivo", ["a plazos", "con recibos", "en facturas"], "Cash payment is en efectivo.", { anchor: true }],
    ["Vocabulario", "Es una regla de una sociedad que establece lo legal y lo ilegal.", "la ley", ["el ejercito", "la dictadura", "la discriminacion"], "The legal rule is la ley.", { anchor: true }],
    ["Vocabulario", "Hace tres semanas que los obreros de esa fabrica estan en _______.", "huelga", ["choque", "prensa", "ciudadano"], "Workers seeking better conditions go on strike: huelga.", { anchor: true }],
    ["Vocabulario", "El _______ dio a conocer los resultados de la eleccion ayer.", "periodico", ["cargo", "sueldo", "prestamo"], "A newspaper publishes election results.", {}],
    ["Vocabulario", "La _______ de comunicacion puede causar problemas en el equipo.", "falta", ["muerte", "ley", "moneda"], "Falta de comunicacion means lack of communication.", {}],
    ["Vocabulario", "Mi hermana trabaja a _______ en una empresa internacional.", "tiempo completo", ["a plazos", "en efectivo", "en huelga"], "A job schedule can be de tiempo completo.", {}],
    ["Vocabulario", "Mis hermanos _______ cuando no estan de acuerdo.", "pelean", ["renuncian", "solicitan", "depositan"], "People fight when they disagree: pelean.", {}],
    ["Vocabulario", "El contador revisa _______ de la empresa.", "las cuentas", ["los puentes", "los pacientes", "las artesanias"], "Accountants work with accounts and budgets.", {}],
    ["Vocabulario", "La ingeniera disena _______.", "puentes y edificios", ["la ropa y los zapatos", "los perros y gatos", "los articulos"], "Engineers are associated with bridges/buildings.", {}],
    ["Vocabulario", "El soldado trabaja con _______.", "la proteccion nacional", ["la cocina", "los pacientes", "las ventas"], "Soldado matches national protection and conflicts.", {}],
    ["Vocabulario", "La vendedora trabaja con _______.", "la ropa y los zapatos", ["la medicina", "la ley", "la estacion de radio"], "A salesperson can sell clothes/shoes.", {}],
    ["Vocabulario", "Poner dinero en el banco cada mes y no gastarlo es _______.", "ahorrar", ["cobrar", "prestar", "sacar"], "To save money is ahorrar.", {}],
    ["Vocabulario", "El dinero de papel se llama _______.", "el billete", ["la moneda", "el recibo", "el presupuesto"], "Billete is a bill; moneda is a coin.", {}],
    ["Vocabulario", "El cajero automatico sirve para _______ dinero.", "sacar", ["postularse", "obedecer", "luchar"], "You withdraw money from an ATM.", {}],
    ["Vocabulario", "Una persona que quiere un cargo politico va a _______.", "postularse", ["enterarse", "mantener", "despedir"], "To run for office is postularse para un cargo.", {}],
    ["Vocabulario", "El pueblo va a _______ por el candidato manana.", "votar", ["informar", "asesinar", "obedecer"], "Citizens vote for candidates.", {}],
    ["Vocabulario", "La prensa y el noticiero son ejemplos de _______.", "medios de comunicacion", ["derechos", "deberes", "presupuestos"], "Press/news are media.", {}],
    ["Vocabulario", "El choque fue un accidente; no fue _______.", "un asesinato", ["una huelga", "un cargo", "un quiosco"], "A murder/assassination is asesinato, not an accident.", {}],
    ["Vocabulario", "Un testigo es una persona que _______.", "ve lo que paso", ["gana la eleccion", "cobra un cheque", "llena una solicitud"], "A witness sees what happened.", {}],
    ["Vocabulario", "Indicate the word that does not belong: informar, enterarse, la prensa, _______.", "postularse", ["el noticiero", "las noticias", "el periodico"], "Postularse belongs to politics/candidacy, not news/media.", { anchor: true, trap: true }],
    ["Vocabulario", "Indicate the word that does not belong: el rey, la reina, la dictadura, _______.", "el cajero automatico", ["el gobierno", "la politica", "el cargo"], "ATM vocabulary belongs to money, not government.", { trap: true }],
    ["Vocabulario", "La etapa de vida entre la ninez y la madurez es _______.", "la adolescencia", ["la vejez", "la huelga", "el empleo"], "Chapter 16 life-stage vocabulary: ninez, adolescencia, madurez, vejez.", {}],
    ["Vocabulario", "Cuando una persona mayor deja de trabajar, decide _______.", "jubilarse", ["asesinar", "obedecer", "contaminar"], "To retire is jubilarse.", {}],
    ["Vocabulario", "La luz roja del _______ significa que debemos parar.", "semaforo", ["quiosco", "sueldo", "cargo"], "Traffic light is semaforo.", {}],
    ["Vocabulario", "Las fabricas pueden _______ el aire si no tienen cuidado.", "contaminar", ["depositar", "postular", "traducir"], "Factories can pollute the air.", {}]
  ];

  const perfectRows = [
    ["Present Perfect", "Jose se alegra de que sus padres le _______ un coche nuevo.", "hayan comprado", ["han comprado", "compraron", "compraran"], "Emotion/reaction + que takes present perfect subjunctive.", { anchor: true }],
    ["Present Perfect", "Las fabricas son necesarias, pero creo que muchas _______ el aire.", "han contaminado", ["hayan contaminado", "hayamos contaminado", "contaminado"], "Creo que normally takes indicative when affirming belief.", { anchor: true }],
    ["Present Perfect", "Me sorprende que nosotros _______ tanto vocabulario esta semana.", "hayamos aprendido", ["hemos aprendido", "aprendimos", "aprenderemos"], "Surprise + que requires subjunctive; nosotros uses hayamos.", { nosotros: true }],
    ["Present Perfect", "Nosotros _______ tres solicitudes para trabajos de verano.", "hemos llenado", ["hayamos llenado", "llenamos", "llenariamos"], "Plain statement of fact uses present perfect indicative.", { nosotros: true }],
    ["Present Perfect", "Es bueno que nosotros _______ a tiempo para el examen.", "hayamos llegado", ["hemos llegado", "llegamos", "llegaremos"], "Es bueno que triggers subjunctive.", { nosotros: true }],
    ["Present Perfect", "No creo que los reporteros _______ toda la informacion.", "hayan recibido", ["han recibido", "recibieron", "recibiran"], "No creo que triggers subjunctive.", {}],
    ["Present Perfect", "Mi padre sabe que yo _______ dinero en el banco.", "he depositado", ["haya depositado", "habia depositado", "depositara"], "Saber/affirmed knowledge takes indicative.", {}],
    ["Present Perfect", "Dudo que tu _______ las noticias hoy.", "hayas visto", ["has visto", "viste", "veras"], "Doubt triggers subjunctive.", {}],
    ["Present Perfect", "Es posible que la candidata _______ la eleccion.", "haya ganado", ["ha ganado", "gano", "ganara"], "Es posible que triggers subjunctive.", {}],
    ["Present Perfect", "La profesora dice que ustedes _______ muy bien.", "han estudiado", ["hayan estudiado", "estudiaron", "estudiarian"], "Decir as reporting a fact takes indicative.", {}],
    ["Present Perfect", "Nos alegra que nosotros no _______ ningun conflicto con Proctorio.", "hayamos tenido", ["hemos tenido", "tuvimos", "tendremos"], "Alegra que triggers subjunctive; nosotros = hayamos.", { nosotros: true }],
    ["Present Perfect", "Es verdad que nosotros _______ mucho antes del final.", "hemos practicado", ["hayamos practicado", "practiquemos", "practicaramos"], "Es verdad que takes indicative.", { nosotros: true }],
    ["Present Perfect", "No es cierto que el gobierno _______ la ley nueva.", "haya mantenido", ["ha mantenido", "mantuvo", "mantendra"], "No es cierto que triggers subjunctive.", {}],
    ["Present Perfect", "Me molesta que ellos no _______ a tiempo.", "hayan llegado", ["han llegado", "llegaron", "llegaran"], "Emotion + que triggers subjunctive.", {}],
    ["Present Perfect", "Creemos que nosotros _______ suficiente para aprobar.", "hemos hecho", ["hayamos hecho", "hicimos", "hariamos"], "Affirmed belief uses indicative; nosotros = hemos hecho.", { nosotros: true }],
    ["Present Perfect", "Ojala que la estacion de radio _______ las noticias correctas.", "haya informado", ["ha informado", "informo", "informara"], "Ojala que triggers subjunctive.", {}],
    ["Present Perfect", "Es terrible que los obreros _______ en huelga otra vez.", "hayan estado", ["han estado", "estuvieron", "estaran"], "Evaluative expression + que triggers subjunctive.", {}],
    ["Present Perfect", "Yo se que mis amigos _______ por ese partido.", "han votado", ["hayan votado", "votaran", "votarian"], "Se que takes indicative.", {}],
    ["Present Perfect", "No pensamos que nosotros _______ todos los errores.", "hayamos corregido", ["hemos corregido", "corregimos", "corregiremos"], "No pensar que triggers subjunctive.", { nosotros: true }],
    ["Present Perfect", "Es probable que ustedes _______ la respuesta correcta.", "hayan escogido", ["han escogido", "escogieron", "escogeran"], "Probability triggers subjunctive.", {}],
    ["Present Perfect", "El noticiero anuncia que la guerra _______.", "ha terminado", ["haya terminado", "terminara", "terminaria"], "Announcement of fact takes indicative.", {}],
    ["Present Perfect", "Nos preocupa que nosotros no _______ bastante tiempo.", "hayamos tenido", ["hemos tenido", "tenemos", "tendriamos"], "Concern + que triggers subjunctive.", { nosotros: true }],
    ["Present Perfect", "Estoy seguro de que tu _______ la cuenta.", "has pagado", ["hayas pagado", "pagaste", "pagaras"], "Estoy seguro de que takes indicative.", {}],
    ["Present Perfect", "Es imposible que la victima _______ sola despues del choque.", "haya salido", ["ha salido", "salio", "saldra"], "Impossibility triggers subjunctive.", {}],
    ["Present Perfect", "Nosotros _______ muchos ejercicios con el subjuntivo perfecto.", "hemos completado", ["hayamos completado", "completamos", "completariamos"], "Plain factual statement uses indicative.", { nosotros: true }],
    ["Present Perfect", "No niego que los estudiantes _______ mucho.", "han trabajado", ["hayan trabajado", "trabajaran", "trabajarian"], "No negar that something happened accepts indicative.", { trap: true }],
    ["Present Perfect", "Niego que los estudiantes _______ todo el capitulo.", "hayan leido", ["han leido", "leyeron", "leerian"], "Negar que triggers subjunctive.", { trap: true }],
    ["Present Perfect", "Es una lastima que nosotros _______ puntos por un detalle pequeno.", "hayamos perdido", ["hemos perdido", "perdimos", "perderemos"], "Es una lastima que triggers subjunctive.", { nosotros: true }],
    ["Present Perfect", "La candidata cree que nosotros _______ su discurso.", "hemos entendido", ["hayamos entendido", "entendamos", "entenderiamos"], "Creer que takes indicative.", { nosotros: true }],
    ["Present Perfect", "No parece que el reportero _______ con los testigos.", "haya hablado", ["ha hablado", "hablo", "hablaria"], "No parece que triggers subjunctive.", {}]
  ];

  const antecedentRows = [
    ["Antecedents", "No conozco a nadie que _______ guarani.", "hable", ["habla", "hablo", "hablara"], "No one known exists in the sentence, so use subjunctive.", { anchor: true }],
    ["Antecedents", "Necesito un coche que no _______ mucha gasolina.", "gaste", ["gasta", "gasto", "gastara"], "The car is desired/indefinite, so subjunctive.", { anchor: true }],
    ["Antecedents", "Conozco a alguien que _______ recien casado.", "esta", ["este", "estuvo", "estara"], "Known antecedent uses indicative.", { anchor: true }],
    ["Antecedents", "En esta clase, hay alguien que _______ tocar un instrumento?", "sepa", ["sabe", "supo", "sabia"], "Questioning existence often takes subjunctive.", { anchor: true }],
    ["Antecedents", "Busco a una profesora que _______ mucha paciencia.", "tenga", ["tiene", "tuvo", "tendra"], "Looking for an unknown person: subjunctive.", {}],
    ["Antecedents", "Busco a la profesora que _______ al lado de la biblioteca.", "vive", ["viva", "vivio", "vivira"], "Specific known professor: indicative.", { trap: true }],
    ["Antecedents", "No hay ningun candidato que _______ todos los problemas.", "resuelva", ["resuelve", "resolvio", "resolvera"], "No candidate exists: subjunctive.", {}],
    ["Antecedents", "Hay un candidato que _______ todos los problemas.", "resuelve", ["resuelva", "resolvio", "resolveria"], "An existing candidate: indicative.", { trap: true }],
    ["Antecedents", "Queremos un trabajo que nos _______ buen sueldo.", "ofrezca", ["ofrece", "ofrecio", "ofrecera"], "Desired indefinite job: subjunctive.", { nosotros: true }],
    ["Antecedents", "Tenemos un trabajo que nos _______ buen sueldo.", "ofrece", ["ofrezca", "ofrecio", "ofrecera"], "Known job: indicative.", { nosotros: true, trap: true }],
    ["Antecedents", "No conozco ningun banco que _______ prestamos sin interes.", "de", ["da", "dio", "dara"], "Nonexistent/unknown bank: subjunctive.", {}],
    ["Antecedents", "Conozco un banco que _______ prestamos para estudiantes.", "da", ["de", "dio", "daria"], "Known bank: indicative.", {}],
    ["Antecedents", "Necesitamos reporteros que _______ al dia.", "esten", ["estan", "estuvieron", "estaran"], "Needed but unidentified reporters: subjunctive.", {}],
    ["Antecedents", "Los reporteros que trabajan aqui _______ al dia.", "estan", ["esten", "estuvieron", "estarian"], "Known reporters in a factual clause: indicative.", {}],
    ["Antecedents", "No hay nadie en mi familia que _______ para un cargo politico.", "se postule", ["se postula", "se postulo", "se postulara"], "No one exists: subjunctive.", {}],
    ["Antecedents", "Mi tio es una persona que _______ para alcalde.", "se postula", ["se postule", "se postulo", "se postularia"], "Specific person: indicative.", {}],
    ["Antecedents", "Queremos una ciudad que no _______ tanto aire.", "contamine", ["contamina", "contamino", "contaminara"], "Desired city/quality: subjunctive.", { nosotros: true }],
    ["Antecedents", "Vivimos en una ciudad que _______ demasiado aire.", "contamina", ["contamine", "contamino", "contaminaria"], "Known city: indicative.", { nosotros: true }],
    ["Antecedents", "Necesito companeros que _______ trabajar en equipo.", "sepan", ["saben", "supieron", "sabran"], "Needed indefinite classmates: subjunctive.", {}],
    ["Antecedents", "Mis companeros _______ trabajar en equipo.", "saben", ["sepan", "supieron", "sabrían"], "Known classmates: indicative.", {}],
    ["Antecedents", "No veo ningun semaforo que _______ correctamente.", "funcione", ["funciona", "funciono", "funcionara"], "No visible traffic light exists: subjunctive.", {}],
    ["Antecedents", "El semaforo de Highland Road _______ correctamente.", "funciona", ["funcione", "funciono", "funcionaria"], "Specific traffic light: indicative.", {}],
    ["Antecedents", "Necesitamos un restaurante que nos _______ tarde.", "sirva", ["sirve", "sirvio", "servira"], "Unknown restaurant that meets need: subjunctive.", { nosotros: true, anchor: true }],
    ["Antecedents", "El restaurante mexicano nos _______ tarde.", "sirve", ["sirva", "sirvio", "serviria"], "Specific restaurant: indicative.", { nosotros: true }],
    ["Antecedents", "No hay ningun estudiante que _______ todas las respuestas.", "sepa", ["sabe", "supo", "sabia"], "No student exists with that quality.", {}],
    ["Antecedents", "Hay una estudiante que _______ todas las respuestas.", "sabe", ["sepa", "supo", "sabria"], "Known/existing student: indicative.", {}],
    ["Antecedents", "Buscamos una aplicacion que nos _______ practicar sin escribir.", "permita", ["permite", "permitio", "permitira"], "Unknown app with desired feature: subjunctive.", { nosotros: true }],
    ["Antecedents", "Esta aplicacion nos _______ practicar sin escribir.", "permite", ["permita", "permitio", "permitiria"], "Specific app: indicative.", { nosotros: true }],
    ["Antecedents", "No encuentro a nadie que _______ explicar las clausulas con si.", "pueda", ["puede", "pudo", "podra"], "No one found: subjunctive.", {}],
    ["Antecedents", "Mi tutor es alguien que _______ explicar las clausulas con si.", "puede", ["pueda", "pudo", "podria"], "Known tutor: indicative.", {}]
  ];

  const purposeRows = [
    ["Purpose/Contingency", "En caso de que _______ Juan, dile que ya sali.", "llegue", ["llega", "llego", "llegara"], "En caso de que always takes subjunctive.", { anchor: true }],
    ["Purpose/Contingency", "Coma usted algo antes de _______.", "salir", ["salga", "sale", "salio"], "Same subject with antes de takes infinitive.", { anchor: true }],
    ["Purpose/Contingency", "Llevo a mis amigos a casa para que no _______.", "conduzcan", ["conducen", "conduciran", "condujeron"], "Para que with a new subject takes subjunctive.", { anchor: true }],
    ["Purpose/Contingency", "Los estudiantes no estudian sin que los profesores les _______ tarea.", "den", ["dan", "dieron", "daran"], "Sin que takes subjunctive.", { anchor: true }],
    ["Purpose/Contingency", "Nosotros estudiamos para _______ buenas notas.", "sacar", ["saquemos", "sacamos", "sacaremos"], "Same subject with para takes infinitive.", { nosotros: true }],
    ["Purpose/Contingency", "La profesora explica despacio para que nosotros _______ la regla.", "entendamos", ["entendemos", "entenderemos", "entendiamos"], "Para que + different subject takes subjunctive.", { nosotros: true }],
    ["Purpose/Contingency", "Te presto mi computadora con tal de que la _______ hoy.", "devuelvas", ["devuelves", "devolveras", "devolviste"], "Con tal de que takes subjunctive.", {}],
    ["Purpose/Contingency", "No puedes salir a menos que _______ el examen.", "termines", ["terminas", "terminaste", "terminaras"], "A menos que takes subjunctive.", {}],
    ["Purpose/Contingency", "Nosotros vamos temprano en caso de que _______ mucho trafico.", "haya", ["hay", "habia", "habra"], "En caso de que triggers subjunctive.", { nosotros: true }],
    ["Purpose/Contingency", "Voy a llamar antes de que ustedes _______.", "salgan", ["salen", "salieron", "saldran"], "Antes de que takes subjunctive.", {}],
    ["Purpose/Contingency", "Nosotros cerramos la puerta antes de _______.", "dormir", ["durmamos", "dormimos", "dormiremos"], "Same subject with antes de takes infinitive.", { nosotros: true }],
    ["Purpose/Contingency", "El jefe habla claro para que los empleados _______ el plan.", "comprendan", ["comprenden", "comprenderan", "comprendieron"], "Purpose clause with different subject: subjunctive.", {}],
    ["Purpose/Contingency", "No hay practica sin que nosotros _______ errores.", "cometamos", ["cometemos", "cometeremos", "cometiamos"], "Sin que takes subjunctive; nosotros = cometamos.", { nosotros: true }],
    ["Purpose/Contingency", "Traigo dinero en efectivo en caso de que el cajero no _______.", "funcione", ["funciona", "funciono", "funcionara"], "Contingency takes subjunctive.", {}],
    ["Purpose/Contingency", "El candidato hace entrevistas para _______ mas votos.", "ganar", ["gane", "gana", "ganara"], "Same subject: infinitive.", {}],
    ["Purpose/Contingency", "El candidato hace entrevistas para que los ciudadanos lo _______.", "conozcan", ["conocen", "conoceran", "conocieron"], "Different subject: subjunctive.", {}],
    ["Purpose/Contingency", "Nosotros no compramos nada a menos que _______ dinero.", "tengamos", ["tenemos", "tendremos", "teniamos"], "A menos que triggers subjunctive.", { nosotros: true }],
    ["Purpose/Contingency", "Salimos temprano para _______ el trafico.", "evitar", ["evitemos", "evitamos", "evitaremos"], "Same subject: infinitive.", { nosotros: true }],
    ["Purpose/Contingency", "El policia pone un semaforo para que los carros _______.", "paren", ["paran", "pararon", "pararan"], "Purpose with different subject: subjunctive.", {}],
    ["Purpose/Contingency", "No publiques la noticia sin que el editor la _______.", "revise", ["revisa", "reviso", "revisara"], "Sin que requires subjunctive.", {}],
    ["Purpose/Contingency", "Nosotros ahorramos dinero con tal de que _______ viajar en mayo.", "podamos", ["podemos", "podremos", "podriamos"], "Con tal de que + nosotros = podamos.", { nosotros: true }],
    ["Purpose/Contingency", "El banco ofrece prestamos para _______ mas clientes.", "atraer", ["atraiga", "atrae", "atraera"], "Same subject/business goal: infinitive.", {}],
    ["Purpose/Contingency", "El banco ofrece prestamos para que los estudiantes _______ matricula.", "paguen", ["pagan", "pagaran", "pagaron"], "Different subject: subjunctive.", {}],
    ["Purpose/Contingency", "Nosotros hablamos bajo para que nadie nos _______.", "oiga", ["oye", "oyo", "oira"], "Para que + different subject = subjunctive.", { nosotros: true }],
    ["Purpose/Contingency", "Voy a estudiar sin _______ el telefono.", "mirar", ["mire", "miro", "mirare"], "Same subject with sin takes infinitive.", {}],
    ["Purpose/Contingency", "No entregues la solicitud sin que nosotros la _______.", "leamos", ["leemos", "leeremos", "leiamos"], "Sin que + different subject = subjunctive.", { nosotros: true }],
    ["Purpose/Contingency", "Hago una lista antes de _______ al supermercado.", "ir", ["vaya", "voy", "ire"], "Same subject: infinitive.", {}],
    ["Purpose/Contingency", "Te mando el enlace en caso de que lo _______.", "necesites", ["necesitas", "necesitaras", "necesitaste"], "En caso de que takes subjunctive.", {}],
    ["Purpose/Contingency", "Nos quedamos hasta tarde para que el proyecto _______ completo.", "este", ["esta", "estuvo", "estara"], "Purpose/outcome with different subject: subjunctive.", { nosotros: true }],
    ["Purpose/Contingency", "El profesor repite la pregunta antes de que nosotros _______.", "respondamos", ["respondemos", "responderemos", "respondiamos"], "Antes de que + nosotros = respondamos.", { nosotros: true }]
  ];

  const timeRows = [
    ["Time Conjunctions", "Tan pronto como _______ trabajo, ganare mucho dinero.", "tenga", ["tengo", "tendre", "tener"], "Future/pending action after time conjunction: subjunctive.", { anchor: true }],
    ["Time Conjunctions", "Siempre pago las cuentas en cuanto _______ mi cheque.", "recibo", ["reciba", "recibire", "recibir"], "Habitual action: indicative.", { anchor: true }],
    ["Time Conjunctions", "No puedo comprar el regalo hasta que tu me _______ el dinero.", "devuelvas", ["devuelves", "devolveras", "devolviste"], "Pending future condition: subjunctive.", { anchor: true }],
    ["Time Conjunctions", "Cada dia leo los anuncios tan pronto como _______ el periodico.", "llega", ["llegue", "llegara", "llego"], "Cada dia signals habitual action: indicative.", { anchor: true }],
    ["Time Conjunctions", "En cuanto _______ tu a Antofagasta, mandame una postal.", "vayas", ["vas", "iras", "fuiste"], "Command + future/pending event: subjunctive.", { anchor: true }],
    ["Time Conjunctions", "Voy a estudiar hasta que _______ listo.", "me sienta", ["me siento", "me sentire", "me sentia"], "Pending endpoint: subjunctive.", { anchor: true }],
    ["Time Conjunctions", "Siempre nos saludan en cuanto nosotros _______ de la oficina.", "salimos", ["salgamos", "saldremos", "saliamos"], "Siempre = habitual, so indicative.", { nosotros: true, anchor: true }],
    ["Time Conjunctions", "Te llamare cuando nosotros _______ al aeropuerto.", "lleguemos", ["llegamos", "llegaremos", "llegabamos"], "Future/pending cuando: subjunctive.", { nosotros: true }],
    ["Time Conjunctions", "Cuando nosotros _______ ninos, jugabamos afuera.", "eramos", ["seamos", "seremos", "fueramos"], "Past habitual context: imperfect indicative.", { nosotros: true }],
    ["Time Conjunctions", "Despues de que nosotros _______ el examen, iremos a comer.", "terminemos", ["terminamos", "terminaremos", "terminabamos"], "Future/pending after: subjunctive.", { nosotros: true }],
    ["Time Conjunctions", "Despues de que nosotros _______ el examen ayer, fuimos a comer.", "terminamos", ["terminemos", "terminaremos", "terminaramos"], "Completed past action: preterite indicative.", { nosotros: true, trap: true }],
    ["Time Conjunctions", "Mientras nosotros _______ en LSU, trabajamos mucho.", "estamos", ["estemos", "estaremos", "estuvieramos"], "Current/habitual fact: indicative.", { nosotros: true }],
    ["Time Conjunctions", "Seguiremos practicando mientras nosotros _______ tiempo.", "tengamos", ["tenemos", "tendremos", "teniamos"], "Future/pending while: subjunctive.", { nosotros: true }],
    ["Time Conjunctions", "Antes de que los estudiantes _______ la sala, apaguen sus telefonos.", "entren", ["entran", "entraron", "entraran"], "Antes de que takes subjunctive.", {}],
    ["Time Conjunctions", "Cuando mi padre _______ joven, trabajaba mucho.", "era", ["sea", "sera", "fuera"], "Past habitual/background: imperfect indicative.", {}],
    ["Time Conjunctions", "Cuando mi padre _______ a Baton Rouge, me llamara.", "llegue", ["llega", "llegara", "llego"], "Future pending: subjunctive.", {}],
    ["Time Conjunctions", "En cuanto el noticiero _______ la noticia, todos se enteraron.", "anuncio", ["anuncie", "anunciara", "anuncia"], "Completed past event: preterite.", {}],
    ["Time Conjunctions", "En cuanto el noticiero _______ la noticia, todos se enteraran.", "anuncie", ["anuncia", "anunciara", "anuncio"], "Future/pending event: subjunctive.", { trap: true }],
    ["Time Conjunctions", "Hasta que nosotros _______ toda la informacion, no decidiremos.", "tengamos", ["tenemos", "tendremos", "teniamos"], "Pending condition: subjunctive.", { nosotros: true, anchor: true }],
    ["Time Conjunctions", "Elena llena solicitudes cuando _______ oportunidades.", "hay", ["haya", "habra", "hubiera"], "Habitual action with cuando: indicative.", { anchor: true }],
    ["Time Conjunctions", "Tengo que seguir trabajando aqui hasta que me _______ algo mejor.", "ofrezcan", ["ofrecen", "ofreceran", "ofrecieron"], "Future/pending endpoint: subjunctive.", { anchor: true }],
    ["Time Conjunctions", "Nos quedaremos en la oficina hasta que ustedes _______ el informe.", "completen", ["completan", "completaran", "completaron"], "Pending endpoint: subjunctive.", { anchor: true }],
    ["Time Conjunctions", "Tan pronto como nosotros _______ una decision, te avisaremos.", "tomemos", ["tomamos", "tomaremos", "tomabamos"], "Future/pending: subjunctive.", { nosotros: true }],
    ["Time Conjunctions", "Tan pronto como nosotros _______ una decision ayer, te avisamos.", "tomamos", ["tomemos", "tomaremos", "tomaramos"], "Completed past: preterite.", { nosotros: true, trap: true }],
    ["Time Conjunctions", "Cuando la guerra _______ finalmente, habra paz.", "termine", ["termina", "terminara", "termino"], "Future/pending event: subjunctive.", {}],
    ["Time Conjunctions", "Cuando la guerra _______ finalmente, hubo paz.", "termino", ["termine", "terminara", "terminaba"], "Completed past: preterite.", {}],
    ["Time Conjunctions", "Siempre leo las noticias antes de que _______ la clase.", "empiece", ["empieza", "empezara", "empezo"], "Antes de que takes subjunctive.", {}],
    ["Time Conjunctions", "Leo las noticias antes de _______ a clase.", "ir", ["vaya", "voy", "ire"], "Same subject with antes de: infinitive.", { trap: true }],
    ["Time Conjunctions", "Nosotros comeremos despues de que _______ el repaso.", "acabemos", ["acabamos", "acabaremos", "acabamos ayer"], "Future/pending after: subjunctive.", { nosotros: true }],
    ["Time Conjunctions", "Nosotros comiamos juntos cuando _______ cerca.", "viviamos", ["vivamos", "viviremos", "vivieramos"], "Habitual past action: imperfect indicative.", { nosotros: true }]
  ];

  const futureRows = [
    ["Future", "Este verano yo _______ con mi mejor amiga y mi familia.", "viajare", ["viajo", "viajaria", "viajara"], "Simple future = infinitive + future ending.", { anchor: true }],
    ["Future", "Maria _______ en un pais hispanohablante.", "vivira", ["vive", "viviria", "viviera"], "Third-person singular future: vivira.", { anchor: true }],
    ["Future", "Nosotros _______ visitar a nuestros abuelos en Florida.", "podremos", ["podemos", "podriamos", "pudieramos"], "Poder has irregular future stem podr-; nosotros = podremos.", { anchor: true, nosotros: true }],
    ["Future", "Nosotros _______ la verdad despues del examen.", "sabremos", ["sabemos", "sabriamos", "supieramos"], "Saber future stem sabr-; nosotros = sabremos.", { nosotros: true }],
    ["Future", "Nosotros _______ de la oficina a las cinco.", "saldremos", ["salimos", "saldríamos", "salgamos"], "Salir future stem saldr-.", { nosotros: true }],
    ["Future", "Nosotros _______ una solicitud nueva manana.", "llenaremos", ["llenamos", "llenariamos", "llenaramos"], "Regular -ar future keeps infinitive.", { nosotros: true }],
    ["Future", "Yo _______ la noticia por la radio.", "oire", ["oigo", "oiria", "oyera"], "Oir is regular in simple future: oire.", {}],
    ["Future", "Tu _______ que estudiar mas vocabulario.", "tendras", ["tienes", "tendrias", "tuvieras"], "Tener future stem tendr-.", {}],
    ["Future", "El candidato _______ mas entrevistas.", "hara", ["hace", "haria", "hiciera"], "Hacer future stem har-.", {}],
    ["Future", "Los estudiantes _______ el examen el viernes.", "tomaran", ["toman", "tomarian", "tomaran (subj.)"], "Future ellos form: tomaran with accent on final syllable in pronunciation; spelling same as written here.", {}],
    ["Future", "Nosotros _______ la respuesta correcta si practicamos.", "diremos", ["decimos", "diriamos", "dijeramos"], "Decir future stem dir-.", { nosotros: true }],
    ["Future", "Ustedes _______ los resultados pronto.", "veran", ["ven", "verian", "vieran"], "Ver future: veran.", {}],
    ["Future", "El banco _______ mas prestamos el proximo ano.", "ofrecera", ["ofrece", "ofreceria", "ofreciera"], "Future signal: el proximo ano.", {}],
    ["Future", "Nosotros no _______ tarde al salon.", "llegaremos", ["llegamos", "llegariamos", "lleguemos"], "Regular future; no spelling change in future.", { nosotros: true, trap: true }],
    ["Future", "Yo _______ mi curriculo esta noche.", "pondre", ["pongo", "pondria", "pusiera"], "Poner future stem pondr-.", {}],
    ["Future", "Ella _______ un puesto mejor.", "querra", ["quiere", "querria", "quisiera"], "Querer future stem querr-.", {}],
    ["Future", "Nosotros _______ la cuenta en efectivo.", "pagaremos", ["pagamos", "pagariamos", "paguemos"], "Regular future; pagar keeps g in infinitive form.", { nosotros: true }],
    ["Future", "El periodista _______ un articulo sobre la huelga.", "escribira", ["escribe", "escribiria", "escribiera"], "Future action: escribira.", {}],
    ["Future", "Nosotros _______ a clase quince minutos temprano.", "vendremos", ["venimos", "vendriamos", "vinieramos"], "Venir future stem vendr-.", { nosotros: true }],
    ["Future", "Habra muchas preguntas de _______ en el final.", "nosotros", ["nosotro", "nosotras solo", "ustedes"], "The sentence itself is vocabulary-like, but the focus is recognizing future hay -> habra.", { nosotros: true }],
    ["Future", "El noticiero _______ a las seis.", "empezara", ["empieza", "empezaria", "empezara (subj.)"], "Simple future of empezar.", {}],
    ["Future", "Nosotros _______ la eleccion en las noticias.", "seguiremos", ["seguimos", "seguiriamos", "sigamos"], "Regular future of seguir: seguiremos.", { nosotros: true }],
    ["Future", "La profesora _______ las instrucciones otra vez.", "repetira", ["repite", "repetiria", "repitiera"], "Future of repetir.", {}],
    ["Future", "Yo _______ a Proctorio si hay un problema.", "llamare", ["llamo", "llamaria", "llamara"], "Future signal with si hay.", {}],
    ["Future", "Nosotros _______ mucho despues de graduarnos.", "trabajaremos", ["trabajamos", "trabajariamos", "trabajaramos"], "Future after graduation.", { nosotros: true }],
    ["Future", "Los ciudadanos _______ sus derechos.", "mantendran", ["mantienen", "mantendrian", "mantuvieran"], "Mantener uses future stem mantendr-.", {}],
    ["Future", "Nosotros _______ la ley si es justa.", "obedeceremos", ["obedecemos", "obedeceriamos", "obedezcamos"], "Regular future of obedecer.", { nosotros: true }],
    ["Future", "Tu _______ un buen sueldo algun dia.", "ganaras", ["ganas", "ganarias", "ganaras (subj.)"], "Algun dia points to future.", {}],
    ["Future", "Nosotros _______ el presupuesto antes de viajar.", "haremos", ["hacemos", "hariamos", "hicieramos"], "Hacer future stem har-; nosotros = haremos.", { nosotros: true }],
    ["Future", "La revista _______ una entrevista con la candidata.", "publicara", ["publica", "publicaria", "publicara (subj.)"], "Future context: upcoming publication.", {}]
  ];

  const pastSubjRows = [
    ["Past Subjunctive", "Cuando era adolescente, era obligatorio que yo _______ la mesa.", "pusiera", ["ponia", "puse", "pondre"], "Past obligation + que triggers past subjunctive.", { anchor: true }],
    ["Past Subjunctive", "El presidente pidio que la Guardia Nacional _______ al lugar del desastre.", "fuera", ["fue", "iba", "ira"], "Pedir que in past takes past subjunctive.", { anchor: true }],
    ["Past Subjunctive", "Hace unos anos era imposible que los ciudadanos _______ contar con esa economia.", "pudieran", ["podian", "pudieron", "podran"], "Past evaluative expression + que = past subjunctive.", { anchor: true }],
    ["Past Subjunctive", "Ella sintio que el politico no _______ ganar la eleccion.", "pudiera", ["podia", "pudo", "podra"], "Feeling/reaction in past about dependent clause: past subjunctive.", { anchor: true }],
    ["Past Subjunctive", "Me sorprendio que tanta gente _______ por ese candidato.", "votara", ["votaba", "voto", "votaria"], "Surprise in past triggers past subjunctive.", { anchor: true }],
    ["Past Subjunctive", "El reportero iba a escribir su informe en cuanto _______ los detalles.", "supiera", ["sabia", "supo", "sabra"], "Past pending time clause often uses past subjunctive.", { anchor: true }],
    ["Past Subjunctive", "La maestra esperaba que nosotros _______ la tarea.", "terminaramos", ["terminamos", "terminemos", "terminariamos"], "Esperar que in past triggers past subjunctive; nosotros has -aramos.", { nosotros: true }],
    ["Past Subjunctive", "Era una lastima que nosotros no _______ ir al concierto.", "pudieramos", ["podimos", "podamos", "podriamos"], "Poder past subjunctive stem: pudier-.", { nosotros: true }],
    ["Past Subjunctive", "Mis padres querian que nosotros _______ mas temprano.", "llegaramos", ["llegamos", "lleguemos", "llegariamos"], "Past desire + que = past subjunctive.", { nosotros: true }],
    ["Past Subjunctive", "El profesor recomendo que nosotros _______ todos los capitulos.", "repasaramos", ["repasamos", "repasemos", "repasariamos"], "Recommendation in past triggers past subjunctive.", { nosotros: true }],
    ["Past Subjunctive", "No creia que la prensa _______ toda la verdad.", "dijera", ["decia", "dijo", "dira"], "No creer que in past triggers past subjunctive.", {}],
    ["Past Subjunctive", "Era importante que los estudiantes _______ a tiempo.", "llegaran", ["llegaban", "llegaron", "llegarian"], "Past importance + que = past subjunctive.", {}],
    ["Past Subjunctive", "El jefe queria que yo _______ el formulario.", "llenara", ["llenaba", "llene", "llenare"], "Past desire + que = past subjunctive.", {}],
    ["Past Subjunctive", "Dudabamos que el banco nos _______ el prestamo.", "diera", ["daba", "dio", "dara"], "Doubt in past triggers past subjunctive.", { nosotros: true }],
    ["Past Subjunctive", "No queriamos que nuestro hijo _______ alli durante la guerra.", "estuviera", ["estaba", "estuvo", "estara"], "Past desire/concern + que = past subjunctive.", { anchor: true }],
    ["Past Subjunctive", "Muchas personas salieron para que sus hijos _______ la paz.", "conocieran", ["conocian", "conocieron", "conocerian"], "Para que in past context uses past subjunctive.", { anchor: true }],
    ["Past Subjunctive", "El sueno era que Latinoamerica _______.", "se uniera", ["se unia", "se unio", "se unira"], "Noun clause after desire/ideal in past: past subjunctive.", { anchor: true }],
    ["Past Subjunctive", "Algunos criticos preferirian que las cosas _______ de otra manera.", "se hicieran", ["se hacian", "se hicieron", "se haran"], "Preferirian que triggers past subjunctive.", { anchor: true }],
    ["Past Subjunctive", "Si nosotros _______ mas tiempo, estudiariamos otra hora.", "tuvieramos", ["teniamos", "tuvimos", "tendriamos"], "Hypothetical si clause uses past subjunctive.", { nosotros: true }],
    ["Past Subjunctive", "Como si nosotros _______ expertos, el examen nos puso trampas.", "fueramos", ["somos", "fuimos", "seriamos"], "Como si takes past subjunctive.", { nosotros: true }],
    ["Past Subjunctive", "Ojala que nosotros _______ ganado el partido ayer.", "hubieramos", ["hemos", "hayamos", "habriamos"], "Past impossible wish uses past perfect subjunctive.", { nosotros: true, trap: true }],
    ["Past Subjunctive", "Era necesario que tu _______ la verdad.", "dijeras", ["decias", "dijiste", "dirias"], "Decir stem from dijeron -> dijera.", {}],
    ["Past Subjunctive", "El medico insistio en que ella _______ el medicamento.", "tomara", ["tomaba", "tomo", "tomaria"], "Insistence in past triggers past subjunctive.", {}],
    ["Past Subjunctive", "Nos pidieron que nosotros _______ la radio.", "apagaramos", ["apagamos", "apaguemos", "apagariamos"], "Pedir que in past; nosotros past subjunctive.", { nosotros: true }],
    ["Past Subjunctive", "Era raro que el testigo no _______ nada.", "recordara", ["recordaba", "recordo", "recordaria"], "Past reaction + que = past subjunctive.", {}],
    ["Past Subjunctive", "Buscaban un reportero que _______ hablar guarani.", "pudiera", ["podia", "pudo", "podra"], "Unknown antecedent in past uses past subjunctive.", {}],
    ["Past Subjunctive", "No habia ningun semaforo que _______ bien.", "funcionara", ["funcionaba", "funciono", "funcionara (future)"], "Nonexistent antecedent in past: past subjunctive.", {}],
    ["Past Subjunctive", "Mis abuelos esperaban que nosotros _______ de LSU.", "nos graduaramos", ["nos graduamos", "nos graduemos", "nos graduariamos"], "Past hope + que; nosotros reflexive form.", { nosotros: true }],
    ["Past Subjunctive", "El gerente no permitio que nosotros _______ temprano.", "salieramos", ["salimos", "salgamos", "saldriamos"], "Past prohibition + que = past subjunctive.", { nosotros: true }],
    ["Past Subjunctive", "Me molestaba que ellos _______ tanto durante la clase.", "hablaran", ["hablaban", "hablaron", "hablarian"], "Past emotion + que = past subjunctive.", {}]
  ];

  const conditionalRows = [
    ["Conditional", "En Espana yo _______ espanol todo el tiempo.", "hablaria", ["hablaba", "hablara", "hablare"], "Conditional expresses what would happen.", { anchor: true }],
    ["Conditional", "Mis amigos y yo _______ un espectaculo de flamenco.", "veriamos", ["veiamos", "vieramos", "veremos"], "Nosotros conditional of ver: veriamos.", { anchor: true, nosotros: true }],
    ["Conditional", "Mis padres _______ un viaje a Barcelona.", "harian", ["hacian", "hicieran", "haran"], "Hacer conditional stem har-.", { anchor: true }],
    ["Conditional", "Tu _______ que ir durante el verano.", "tendrias", ["tenias", "tuvieras", "tendras"], "Tener conditional stem tendr-.", { anchor: true }],
    ["Conditional", "_______ interesante pasar unos dias en Granada.", "Seria", ["Era", "Fuera", "Sera"], "Seria = it would be.", { anchor: true }],
    ["Conditional", "Me _______ viajar a Barcelona.", "gustaria", ["gustaba", "gustara", "gustare"], "Me gustaria = I would like.", { anchor: true }],
    ["Conditional", "Mi amiga y yo _______ mas si tuvieramos tiempo.", "viajariamos", ["viajabamos", "viajaramos", "viajaremos"], "Conditional in main clause after si + past subj.", { anchor: true, nosotros: true }],
    ["Conditional", "Ustedes _______ la eleccion sin el sindicato.", "perderian", ["perdian", "perdieran", "perderan"], "Conditional of perder.", { anchor: true }],
    ["Conditional", "Nosotros _______ la verdad si supieramos los detalles.", "diriamos", ["deciamos", "dijeramos", "diremos"], "Decir conditional stem dir-.", { nosotros: true }],
    ["Conditional", "Nosotros _______ mas dinero con otro empleo.", "ganariamos", ["ganabamos", "ganaramos", "ganaremos"], "Regular conditional.", { nosotros: true }],
    ["Conditional", "El banco _______ mas prestamos si bajaran los intereses.", "ofreceria", ["ofrecia", "ofreciera", "ofrecera"], "Main clause of hypothetical uses conditional.", {}],
    ["Conditional", "Yo _______ el formulario, pero no tengo tiempo.", "llenaria", ["llenaba", "llenara", "llenare"], "Would fill out = conditional.", {}],
    ["Conditional", "Nosotros _______ la cuenta en efectivo.", "pagariamos", ["pagabamos", "pagaramos", "pagaremos"], "Nosotros conditional ending: -iamos.", { nosotros: true }],
    ["Conditional", "Ellos _______ salir temprano.", "querrian", ["querian", "quisieran", "querran"], "Querer conditional stem querr-.", {}],
    ["Conditional", "Yo _______ el presupuesto antes de viajar.", "haria", ["hacia", "hiciera", "hare"], "Hacer conditional stem har-.", {}],
    ["Conditional", "Nosotros _______ ayudar al testigo.", "podriamos", ["podiamos", "pudieramos", "podremos"], "Poder conditional stem podr-.", { nosotros: true }],
    ["Conditional", "La reportera _______ el articulo manana si pudiera.", "escribiria", ["escribia", "escribiera", "escribira"], "Hypothetical main clause: conditional.", {}],
    ["Conditional", "Nosotros _______ de la ciudad si hubiera un desastre.", "saldriamos", ["saliamos", "salieramos", "saldremos"], "Salir conditional stem saldr-.", { nosotros: true }],
    ["Conditional", "Usted _______ la ley aunque fuera dificil.", "obedeceria", ["obedecia", "obedeciera", "obedecera"], "Would obey: conditional.", {}],
    ["Conditional", "Nosotros _______ el examen si no estudiaramos.", "perderiamos", ["perdiamos", "perdieramos", "perderemos"], "Hypothetical result: conditional.", { nosotros: true }],
    ["Conditional", "Cuando era nino, yo _______ con mis primos cada verano.", "jugaba", ["jugaria", "jugara", "jugare"], "English 'would' as habitual past is imperfect, not conditional.", { trap: true }],
    ["Conditional", "Si fuera rico, yo _______ por todo el mundo.", "viajaria", ["viajara", "viajaba", "viajare"], "Si + past subjunctive, main clause conditional.", { anchor: true }],
    ["Conditional", "Nosotros _______ al profesor si tuvieramos una pregunta.", "llamariamos", ["llamabamos", "llamaramos", "llamaremos"], "Conditional result with nosotros.", { nosotros: true }],
    ["Conditional", "Habria muchas oportunidades si nosotros _______ preparados.", "estuvieramos", ["estabamos", "estaremos", "estariamos"], "This item asks for si-clause form; past subjunctive after si.", { nosotros: true, trap: true }],
    ["Conditional", "Yo _______ mantener la calma durante el examen.", "deberia", ["debia", "debiera", "debere"], "Deberia = I should/would have to.", {}],
    ["Conditional", "Nosotros _______ la respuesta por eliminacion.", "escogeriamos", ["escogiamos", "escogieramos", "escogeremos"], "Conditional of escoger.", { nosotros: true }],
    ["Conditional", "Mi padre dijo que el examen _______ dificil.", "seria", ["era", "fuera", "sera"], "Reported future often becomes conditional.", {}],
    ["Conditional", "La profesora dijo que nosotros _______ muchas preguntas de conjugacion.", "tendriamos", ["teniamos", "tuvieramos", "tendremos"], "Reported future: tendriamos.", { nosotros: true }],
    ["Conditional", "Yo _______ una tarjeta de debito, pero prefiero efectivo.", "usaria", ["usaba", "usara", "usare"], "Would use = conditional in hypothetical preference.", {}],
    ["Conditional", "Nosotros _______ en Baton Rouge despues de graduarnos si hubiera trabajo.", "viviriamos", ["viviamos", "vivieramos", "viviremos"], "Hypothetical result: conditional.", { nosotros: true }]
  ];

  const siRows = [
    ["Si Clauses", "Si yo _______ , iria a Espana de vacaciones.", "pudiera", ["podria", "podia", "podre"], "Si-clause of a hypothetical uses past subjunctive.", { anchor: true }],
    ["Si Clauses", "Si Julia _______ suficiente dinero, compraria el abrigo.", "tuviera", ["tuvo", "tenia", "tendra"], "Si + past subjunctive.", { anchor: true }],
    ["Si Clauses", "Si fuera rico, _______ por todo el mundo.", "viajaria", ["viajara", "viajaba", "viajare"], "Main clause uses conditional.", { anchor: true }],
    ["Si Clauses", "Iria a Espana si yo _______ suficiente dinero.", "tuviera", ["tenia", "tendria", "tendre"], "Flipped order: main clause first, si-clause still past subjunctive.", { anchor: true, trap: true }],
    ["Si Clauses", "Nosotros viajariamos si _______ tiempo libre.", "tuvieramos", ["teniamos", "tendriamos", "tendremos"], "Nosotros in si-clause: tuvieramos.", { nosotros: true }],
    ["Si Clauses", "Si nosotros tuvieramos tiempo, _______ mas vocabulario.", "practicariamos", ["practicabamos", "practicaramos", "practicaremos"], "Main clause after si + past subjunctive uses conditional.", { nosotros: true }],
    ["Si Clauses", "Si el banco bajara los intereses, nosotros _______ un prestamo.", "pediriamos", ["pediamos", "pidieramos", "pediremos"], "Hypothetical result: conditional nosotros.", { nosotros: true }],
    ["Si Clauses", "Nosotros pediriamos un prestamo si el banco _______ los intereses.", "bajara", ["bajaba", "bajaria", "bajara (future)"], "Flipped order; si-clause uses past subjunctive.", { nosotros: true, trap: true }],
    ["Si Clauses", "Si la profesora diera otra practica, nosotros _______ mejor.", "entenderiamos", ["entendiamos", "entendieramos", "entenderemos"], "Conditional result.", { nosotros: true }],
    ["Si Clauses", "Nosotros entenderiamos mejor si la profesora _______ otra practica.", "diera", ["daba", "daria", "dara"], "Flipped order; si-clause past subjunctive.", { nosotros: true, trap: true }],
    ["Si Clauses", "Si yo fuera presidente, _______ la ley.", "cambiaria", ["cambiara", "cambiaba", "cambiare"], "Hypothetical result: conditional.", {}],
    ["Si Clauses", "Yo cambiaria la ley si _______ presidente.", "fuera", ["era", "seria", "sere"], "Flipped order; si-clause past subjunctive.", { trap: true }],
    ["Si Clauses", "Si los ciudadanos votaran, el candidato _______.", "ganaria", ["ganara", "ganaba", "ganara (future)"], "Main clause conditional.", {}],
    ["Si Clauses", "El candidato ganaria si los ciudadanos _______.", "votaran", ["votaban", "votarian", "votaran (future)"], "Si-clause past subjunctive.", { trap: true }],
    ["Si Clauses", "Si nosotros supieramos la respuesta, la _______.", "escogeriamos", ["escogiamos", "escogieramos", "escogeremos"], "Main clause conditional nosotros.", { nosotros: true }],
    ["Si Clauses", "La escogeriamos si nosotros _______ la respuesta.", "supieramos", ["sabiamos", "sabríamos", "sabremos"], "Flipped order; si-clause past subjunctive.", { nosotros: true, trap: true }],
    ["Si Clauses", "Si hubiera una huelga, la prensa _______ la noticia.", "informaria", ["informara", "informaba", "informara (future)"], "Conditional result.", {}],
    ["Si Clauses", "La prensa informaria la noticia si _______ una huelga.", "hubiera", ["habia", "habria", "habra"], "Si-clause with haber: hubiera.", { trap: true }],
    ["Si Clauses", "Si tu estudiaras mas, _______ menos errores.", "cometerias", ["cometieras", "cometias", "cometeras"], "Main result uses conditional.", {}],
    ["Si Clauses", "Cometerias menos errores si _______ mas.", "estudiaras", ["estudiabas", "estudiarias", "estudiaras (future)"], "Flipped order; si-clause past subjunctive.", { trap: true }],
    ["Si Clauses", "Si nosotros fueramos al examen temprano, _______ mejores asientos.", "tendriamos", ["teniamos", "tuvieramos", "tendremos"], "Conditional result nosotros.", { nosotros: true }],
    ["Si Clauses", "Nosotros tendriamos mejores asientos si _______ temprano.", "fueramos", ["ibamos", "iriamos", "iremos"], "Flipped order; si-clause past subjunctive.", { nosotros: true, trap: true }],
    ["Si Clauses", "Si el reportero supiera mas, _______ otro articulo.", "escribiria", ["escribiera", "escribia", "escribira"], "Conditional result.", {}],
    ["Si Clauses", "El reportero escribiria otro articulo si _______ mas.", "supiera", ["sabia", "sabria", "sabra"], "Si-clause past subjunctive.", { trap: true }],
    ["Si Clauses", "Si nosotros pudieramos usar notas, el final _______ facil.", "seria", ["fuera", "era", "sera"], "Main clause conditional.", { nosotros: true }],
    ["Si Clauses", "El final seria facil si nosotros _______ usar notas.", "pudieramos", ["podiamos", "podriamos", "podremos"], "Flipped order; si-clause past subjunctive.", { nosotros: true, trap: true }],
    ["Si Clauses", "Si ustedes hicieran la tarea, _______ mas preparados.", "estarian", ["estuvieran", "estaban", "estaran"], "Main clause conditional.", {}],
    ["Si Clauses", "Ustedes estarian mas preparados si _______ la tarea.", "hicieran", ["hacian", "harian", "haran"], "Si-clause past subjunctive.", { trap: true }],
    ["Si Clauses", "Si nosotros no practicaramos, _______ puntos faciles.", "perderiamos", ["perdiamos", "perdieramos", "perderemos"], "Conditional result nosotros.", { nosotros: true }],
    ["Si Clauses", "Nosotros perderiamos puntos faciles si no _______.", "practicaramos", ["practicabamos", "practicariamos", "practicaremos"], "Flipped order; si-clause past subjunctive.", { nosotros: true, trap: true }]
  ];

  const quizzes = {
    vocab: quiz("vocab", "Vocabulary, Chapters 15-18", "Context sentences, closest-match items, and not-belong traps modeled on the chapter pruebas.", "Vocabulary", vocabRows),
    perfect: quiz("perfect", "Present Perfect: Indicative vs. Subjunctive", "Choose between ha/han/hemos and haya/hayan/hayamos patterns.", "Grammar", perfectRows),
    antecedents: quiz("antecedents", "Nonexistent and Indefinite Antecedents", "Known antecedent takes indicative; unknown, nonexistent, or sought antecedent takes subjunctive.", "Grammar", antecedentRows),
    purpose: quiz("purpose", "Purpose and Contingency Conjunctions", "Para que, sin que, en caso de que, a menos que, and infinitive traps.", "Grammar", purposeRows),
    time: quiz("time", "Time Conjunctions", "Future/pending vs. habitual/past after cuando, en cuanto, hasta que, and tan pronto como.", "Grammar", timeRows),
    future: quiz("future", "Simple Future Tense", "Regular endings, irregular stems, and heavy nosotros practice.", "Grammar", futureRows),
    "past-subjunctive": quiz("past-subjunctive", "Imperfect / Past Subjunctive", "Past triggers, irregular preterite stems, si-clause setup, and nosotros accent forms.", "Grammar", pastSubjRows),
    conditional: quiz("conditional", "Conditional Tense", "Regular and irregular conditional forms, reported future, and would-traps.", "Grammar", conditionalRows),
    "si-clauses": quiz("si-clauses", "Clausulas con si", "Normal and flipped si-clause order, including the tricky pattern your professor flagged.", "Grammar", siRows)
  };

  const anchorTargets = {
    vocab: 8,
    perfect: 6,
    antecedents: 6,
    purpose: 6,
    time: 8,
    future: 6,
    "past-subjunctive": 8,
    conditional: 8,
    "si-clauses": 6
  };

  Object.entries(anchorTargets).forEach(([id, target]) => {
    quizzes[id].questions.forEach((question, index) => {
      question.anchor = index < target;
    });
  });

  const mockPlan = [
    ["vocab", 0, 1, 4, 7, 14, 20, 24, 27],
    ["perfect", 0, 2, 3, 6, 10, 18],
    ["antecedents", 0, 1, 5, 8, 16, 26],
    ["purpose", 0, 1, 5, 16, 25],
    ["time", 0, 1, 7, 10, 18, 22],
    ["future", 0, 2, 4, 10, 18],
    ["past-subjunctive", 0, 1, 6, 14, 18, 20],
    ["conditional", 0, 1, 8, 20],
    ["si-clauses", 0, 3, 5, 7]
  ];

  const mockQuestions = [];
  mockPlan.forEach(([id, ...indexes]) => {
    indexes.forEach(index => {
      const source = quizzes[id].questions[index];
      mockQuestions.push({ ...source, section: quizzes[id].title });
    });
  });

  let mockAnchorCount = 0;
  mockQuestions.forEach(question => {
    if (!question.anchor) return;
    mockAnchorCount += 1;
    if (mockAnchorCount > 14) question.anchor = false;
  });

  quizzes.mock = {
    id: "mock",
    title: "Comprehensive Mock Final",
    subtitle: "50 multiple-choice questions weighted to the study guide, with anchor items plus fresh near-clones.",
    kind: "Mock Final",
    questions: mockQuestions
  };

  window.SPANISH_FINAL_QUIZZES = quizzes;
})();
