(function () {
  "use strict";

  var SOURCE_NOTE = "Rebuilt from the real Test 1/Test 2 format: Q1-Q10 True/False at 1 point each, Q11-Q20 MC/Find All at 2 points each, then a 45-point back half of tube models, displays, spectrograms, and compact written mechanism answers.";
  var INSTRUCTIONS = "Paper final simulation. Read TRUE, FALSE, BEST, NOT TRUE, FIND TWO, and FIND ALL wording carefully. For written questions, answer in principle -> cause -> acoustic consequence form.";

  function tf(topic, prompt, answer, explanation) {
    return { type: "tf", points: 1, topic: topic, prompt: prompt, answer: answer ? 0 : 1, explanation: explanation };
  }

  function mc(topic, prompt, options, answer, explanation, visual, visualCaption) {
    var q = { type: "mc", points: 2, topic: topic, prompt: prompt, options: options, answer: answer, explanation: explanation };
    if (visual) addVisual(q, visual, visualCaption);
    return q;
  }

  function multi(topic, prompt, options, answer, explanation, visual, visualCaption) {
    var q = { type: "multi", points: 2, topic: topic, prompt: prompt, options: options, answer: answer, explanation: explanation };
    if (visual) addVisual(q, visual, visualCaption);
    return q;
  }

  function written(points, topic, prompt, model, rubric, visual, visualCaption) {
    var q = { type: "visual", points: points, topic: topic, prompt: prompt, model: model, rubric: rubric || [] };
    if (visual) addVisual(q, visual, visualCaption);
    return q;
  }

  function short(points, topic, prompt, model, rubric, visual, visualCaption) {
    var q = { type: "short", points: points, topic: topic, prompt: prompt, model: model, rubric: rubric || [] };
    if (visual) addVisual(q, visual, visualCaption);
    return q;
  }

  function auto(points, topic, prompt, options, answer, explanation, visual, visualCaption) {
    var q = { type: Array.isArray(answer) ? "multi" : "mc", points: points, topic: topic, prompt: prompt, options: options, answer: answer, explanation: explanation };
    if (visual) addVisual(q, visual, visualCaption);
    return q;
  }

  function addVisual(q, visual, caption) {
    if (visual.indexOf("img:") === 0) q.visualImage = visual.slice(4);
    else q.visual = visual;
    if (caption) q.visualCaption = caption;
  }

  function page(title, subtitle, formName, sections) {
    return {
      type: "quiz",
      course: "COMD 4153",
      title: title,
      subtitle: subtitle,
      sourceNote: SOURCE_NOTE,
      examHeader: {
        title: formName + " - 75 points",
        instructions: INSTRUCTIONS
      },
      sections: sections
    };
  }

  function sections(tfQuestions, mcQuestions, appliedTitle, appliedQuestions) {
    return [
      {
        title: "Part I - True / False Precision Statements",
        desc: "10 questions, 1 point each. These are exact-relationship traps.",
        questions: tfQuestions
      },
      {
        title: "Part II - Multiple Choice and Find All",
        desc: "10 questions, 2 points each. Watch BEST, NOT TRUE, FIND TWO, and FIND ALL wording.",
        questions: mcQuestions
      },
      {
        title: appliedTitle,
        desc: "Questions 21-34 carry 45 points. This matches the uneven back-half Moodle pattern: visuals, fill-ins, short reasons, and compact explanations.",
        questions: appliedQuestions
      }
    ];
  }

  var commonTF = [
    tf("Nasalization", "Nasalized vowels show greater amplitude than comparable non-nasalized vowels.", false, "False. Nasal coupling can damp acoustic energy and reduce vowel amplitude, especially around F1."),
    tf("Nasal consonants", "The pharyngeal-oral tract is open during both nasal consonants and nasalized vowels.", false, "False. Nasalized vowels keep the oral tract open; nasal consonants have oral closure."),
    tf("Perturbation", "Any constriction in the vocal tract can change the resonant frequencies of the tube.", true, "True. Constriction location relative to pressure/volume patterns changes resonance."),
    tf("Fricatives", "Peak frequency alone can reliably classify every fricative place of articulation.", false, "False. Weak nonsibilants such as /f/ can have diffuse spectra; spectral moments and context matter."),
    tf("Fricative source", "For fricatives, turbulence generated in the supralaryngeal vocal tract functions as source energy.", true, "True. Fricatives use aperiodic turbulent airflow as a source."),
    tf("VOT", "Voiceless stops typically have shorter VOT than voiced stops.", false, "False. English voiceless stops usually have longer positive VOT than voiced stops."),
    tf("Stop cavities", "For stop sounds, the front cavity in front of the constriction is mainly associated with antiresonance.", false, "False. Front cavity shape is mainly tied to burst resonance; antiresonance is tied to side/trapped cavities."),
    tf("Laterals", "Antiresonance can be found in lateral liquid sounds.", true, "True. The lateral side cavity can introduce antiresonances."),
    tf("Stop release", "The frication or aspiration interval of a stop is generated by the closure interval itself.", false, "False. Closure is silence or low voicing; post-release noise follows the burst."),
    tf("Affricates", "Affricates are slowly released stops with a relatively longer frication interval than plain stops.", true, "True. Affricates begin stop-like and release into sustained frication.")
  ];

  var commonMC = [
    mc("Nasalized vowels", "Which answer is TRUE about nasalized vowel production?", ["Oral and nasal airways are coupled.", "Both oral and nasal tracts are open to atmosphere.", "The output spectrum mixes oral and nasal resonance effects.", "The velopharyngeal port is open.", "All of the above."], 4, "All are true for nasalized vowels: oral tract open, nasal port open, and coupled resonances."),
    mc("Nasal antiresonance", "Which answer BEST describes /m/ versus /n/ nasal spectra?", ["The arrow always marks a vowel formant.", "/m/ has a smaller trapped oral cavity than /n/.", "The antiresonance for /m/ is usually higher than /n/.", "Both /m/ and /n/ include resonance and antiresonance effects."], 3, "Nasal consonants contain nasal resonance plus antiresonance from the trapped oral cavity."),
    multi("Laterals", "FIND TWO statements that are TRUE about lateral sounds.", ["They can involve both resonant and antiresonant frequencies.", "Air passes along one or both sides of the tongue.", "Turbulent airflow is the main source.", "They require complete blockage of all airflow.", "Their source is normally complex aperiodic noise."], [0, 1], "Laterals are sonorant-like and voiced, with side-channel airflow and possible antiresonance."),
    mc("Antiresonance", "Which answer BEST defines antiresonance?", ["A frequency region where acoustic energy is reduced by side-cavity or nasal coupling.", "A normal vowel peak caused only by an open oral tract.", "A rise in amplitude at every harmonic.", "The rate of vocal fold vibration.", "A sampling-rate setting."], 0, "Antiresonance is a dip or notch in energy, not a peak."),
    mc("Fricative cavity", "As the cavity in front of a fricative constriction gets smaller, the main spectral peak tends to:", ["decrease in frequency", "increase in frequency", "turn into F0", "disappear from every spectrum"], 1, "Smaller resonating cavity -> higher resonance/peak frequency."),
    multi("Fricatives", "FIND TWO statements that are TRUE about fricative sounds.", ["Aperiodic turbulence provides the main source for voiceless fricatives.", "Voiced fricatives can combine turbulence with vocal fold vibration.", "The source for /s/ is lower in intensity than /f/.", "Fricatives never involve filtering by the vocal tract.", "Peak frequency alone is always sufficient."], [0, 1], "Voiceless fricatives use turbulence; voiced fricatives add voicing."),
    mc("Spectrum and LPC", "A simplified, smoothed curve fitted to a harmonic spectrum is used to estimate:", ["VOT only", "formant peaks", "Moodle timing", "phoneme spelling"], 1, "The smoothed spectral envelope/LPC-style curve helps estimate formants."),
    mc("Stop burst spectra", "Which answer BEST explains why /p/, /t/, and /k/ bursts have different spectra?", ["The same source is shaped by different front-cavity resonators.", "The burst is determined only by F0.", "/p/ always has the highest compact peak.", "Closure duration alone gives place."], 0, "Burst source energy is filtered by the vocal tract cavity in front of the constriction.", "img:acoustics_assets/spectrograms/stop-burst-spectra-place.png", "Class-style stop burst spectra."),
    mc("Digitization", "Which statement is TRUE about speech analysis programs?", ["Recording converts an analog signal into digital numbers.", "One sample per cycle is always enough.", "20,000 Hz is the only standard sampling rate.", "Sampling rate means number of amplitude levels."], 0, "Digital recording samples and quantizes an analog acoustic signal."),
    mc("Suprasegmentals", "Which answer is TRUE about suprasegmental features?", ["They extend beyond single segment duration.", "F0 is perceptual and pitch is acoustic.", "Aperiodic noise is easier for pitch tracking than vowels.", "They cannot affect duration."], 0, "Suprasegmentals include features such as stress and intonation that extend across segments.")
  ];

  var comprehensiveApplied = [
    written(9, "Tube models", "Identify the three schematic tube classes, then explain each in terms of source energy and resonance/antiresonance.", "A strong answer labels (a) vowel-like oral resonance, (b) voiceless fricative/stop-release front-cavity filtering, and (c) nasal consonant or lateral-like side-cavity coupling. Vowels use periodic source energy shaped by vocal-tract resonances. Voiceless fricatives/stops use aperiodic noise shaped by the cavity in front of the constriction. Nasals/laterals use voicing plus side or trapped cavities, so resonance and antiresonance can both appear.", ["Identifies the three sound classes.", "States periodic vs aperiodic source energy.", "Names resonance for vowels/front cavities.", "Names antiresonance for nasals or laterals.", "Uses source -> filter -> output logic."], "tube-classes", "Generated tube-model prompt matching the Test 2 back-half style."),
    auto(1, "Tube antiresonance", "In the tube model, which structure is most likely to create antiresonance?", ["open oral vowel tube", "side branch or trapped oral cavity", "ordinary F0 vibration", "the time axis"], 1, "Antiresonance comes from side-branch or trapped-cavity coupling."),
    auto(1, "Nasal tube", "A tube with oral closure plus an open nasal branch most directly represents:", ["nasal consonant", "oral vowel", "voiceless fricative", "pure sine wave"], 0, "Oral closure with nasal airflow is the nasal consonant pattern."),
    short(2, "Nasal reason", "Give a one- or two-sentence reason why oral closure separates nasal consonants from nasalized vowels.", "Nasal consonants have oral closure, so the sound exits through the nasal tract and trapped oral-cavity energy can create antiresonance. Nasalized vowels keep the oral tract open while the nasal port is also open, so oral and nasal resonances are coupled.", ["States oral closure for nasal consonants.", "States oral tract open for nasalized vowels.", "Mentions resonance/antiresonance or coupled tracts."], "nasalization", "Nasalized vowel versus nasal-consonant logic."),
    written(5, "Stop waveform", "Label closure, burst, aspiration/frication, and VOT in this stop display.", "1 = closure interval, 2 = release burst, 3 = aspiration/frication after release, 4 = vowel onset. VOT begins at the burst release and ends at the first glottal pulse of the vowel; closure is not part of VOT.", ["Labels the four intervals.", "Starts VOT at burst.", "Ends VOT at voicing onset.", "Excludes closure.", "Connects long VOT to voiceless stops."], "spec:voiceless-stop-pa", "Generated Praat-style stop display."),
    short(2, "Voiced/voiceless stop", "Explain HOW and WHY voiced and voiceless stop closure/VOT patterns differ.", "Voiceless stops often show silent closure and longer positive VOT because voicing begins later after release and aspiration. Voiced stops can show a low-frequency voicing bar during closure and short-lag or negative VOT because the vocal folds are closer to phonation.", ["Contrasts silent closure with voicing bar.", "Contrasts long VOT with short/negative VOT.", "Gives the laryngeal reason."], "spec:voiced-stop-ba", "Generated voiced-stop comparison display."),
    written(10, "Displays", "Identify the three displays and give the x-, y-, and z/darkness meaning for each where applicable.", "Waveform: x-axis = time, y-axis = amplitude. Spectrum: x-axis = frequency, y-axis = amplitude. Spectrogram: x-axis = time, y-axis = frequency, darkness or color intensity = amplitude/energy.", ["Names waveform.", "Names spectrum.", "Names spectrogram.", "Gives waveform axes.", "Gives spectrum axes.", "Gives spectrogram axes.", "Defines darkness/intensity as amplitude.", "Does not confuse F0 with formants."], "displays", "Waveform, spectrum, and spectrogram display identification."),
    auto(1, "VOT interval", "Which option names the numbered interval(s) counted inside VOT for the displayed voiceless stop?", ["1 only", "2 and 3", "3 and 4", "1, 2, and 3"], 1, "VOT starts at the burst and includes the post-release aspiration/noise until voicing begins.", "spec:voiceless-stop-pa", "Numbered stop intervals."),
    auto(1, "Frication interval", "Select the numbered interval that corresponds to sustained aperiodic frication before the vowel.", ["1", "2", "3", "4"], 0, "Interval 1 is the sustained fricative noise before the vowel.", "spec:voiceless-fricative-sa", "Generated fricative plus vowel."),
    auto(1, "Voicing bar", "In a voiced stop display, low-frequency energy during closure is called:", ["a voicing bar", "F2", "antiresonance", "a release burst"], 0, "The voicing bar reflects vocal fold vibration during closure.", "spec:voiced-stop-ba", "Generated voiced stop."),
    short(5, "Vowel formants", "Explain why corner vowels from the same speaker differ in F1/F2, and why the same vowel differs across adult male, adult female, and child speakers.", "Within the same speaker, corner vowels differ because tongue height, tongue advancement, and lip rounding change the vocal-tract resonator, shifting F1 and F2. Across speakers, vocal tract length and size differ; children have shorter tracts and generally higher formant frequencies, while adult males tend to have longer tracts and lower formant frequencies.", ["Mentions tongue height and F1.", "Mentions advancement/fronting and F2.", "Mentions lip rounding or tract length.", "Contrasts same-speaker vowel shape with across-speaker anatomy.", "States shorter tracts -> higher formants."], "vowel-space", "F1/F2 vowel-space interpretation."),
    short(2, "Closure comparison", "The closure interval of voiceless /t/ and voiced /d/ differs. Explain HOW and WHY.", "Voiceless /t/ closure is more likely to be silent, while voiced /d/ may show a voicing bar during closure. The difference comes from laryngeal timing: /d/ maintains or resumes vocal fold vibration earlier, while /t/ delays voicing.", ["States silent closure vs voicing bar.", "Mentions laryngeal timing.", "Links to voicing/VOT."], "stop-vot", "Stop closure and VOT schematic."),
    written(3, "Stop/affricate/fricative ID", "Identify which panel is stop, fricative, and affricate, and give the main cue for each.", "Stop = closure plus burst and brief release noise. Fricative = sustained aperiodic noise without a preceding complete stop closure. Affricate = closure and burst followed by prolonged frication.", ["Labels all three classes.", "Mentions closure/burst for stop.", "Mentions sustained frication for fricative.", "Mentions closure + prolonged frication for affricate."], "affricate-compare", "Stop, fricative, and affricate timing comparison."),
    short(2, "Affricate reason", "Why are affricates called slowly released stops?", "They begin with a stop-like closure and burst, but the release is gradual enough to create a prolonged frication interval before the following vowel.", ["Mentions stop-like closure and burst.", "Mentions gradual release.", "Mentions prolonged frication."])
  ];

  var vowelTF = [
    tf("Source-filter", "The rate of vocal fold vibration primarily determines vowel formant frequencies.", false, "False. Vocal fold vibration determines F0; vocal tract configuration determines formants."),
    tf("Source-filter", "In acoustic theory, source and filter are independent enough that F0 can change without necessarily changing vocal tract shape.", true, "True. F0/harmonics belong to source; formants belong to the filter."),
    tf("Fourier analysis", "Fourier analysis decomposes a complex waveform into sinusoidal components.", true, "True. That is why spectra reveal frequency components hidden in a waveform."),
    tf("F0", "Complex aperiodic signals have a stable fundamental frequency.", false, "False. Aperiodic noise does not repeat at a fixed period, so it does not have stable F0."),
    tf("Vowel height", "Increasing tongue height generally decreases F1.", true, "True. F1 is inversely related to tongue height."),
    tf("Vowel fronting", "Increasing tongue advancement generally decreases F2.", false, "False. Fronting/advancement generally increases F2."),
    tf("Lip rounding", "Lip rounding lengthens the vocal tract and tends to lower formant frequencies, especially F2.", true, "True. Rounding lowers formants by lengthening the resonator."),
    tf("IPA", "Two vowels with the same IPA symbol across languages must have identical formant patterns.", false, "False. IPA sameness does not guarantee identical acoustic realization."),
    tf("Diphthongs", "Diphthongs are best characterized by formant trajectories across time.", true, "True. A midpoint alone can miss the dynamic cue."),
    tf("Undershoot", "Faster speaking rate can increase vowel undershoot.", true, "True. Reduced time limits articulator movement toward the target.")
  ];

  var vowelMC = [
    mc("Source", "In source-filter theory, the vowel source is generated mainly by:", ["vocal fold vibration", "lips rounding only", "nasal antiresonance", "the ear canal"], 0, "The glottal source is vocal fold vibration."),
    mc("Filter", "The vowel filter function is shaped most directly by:", ["the configuration of the vocal tract", "Moodle question order", "only F0", "the sampling window alone"], 0, "The vocal tract filter creates formant peaks."),
    mc("Fourier", "Which statement is NOT TRUE about Fourier analysis?", ["It decomposes complex periodic waveforms.", "It helps move from time domain to frequency domain.", "It proves formants and F0 are the same thing.", "It is used in speech analysis software."], 2, "F0 is source frequency; formants are resonances of the filter."),
    mc("Frequency", "If period is 8 ms, the frequency is closest to:", ["125 Hz", "250 Hz", "500 Hz", "1000 Hz"], 0, "Frequency = 1 / .008 seconds = 125 Hz."),
    mc("Vowel /i/", "A high front unrounded vowel like /i/ should have:", ["low F1 and high F2", "high F1 and low F2", "no formants", "only aperiodic noise"], 0, "/i/ is high and front: low F1, high F2."),
    mc("Vowel /u/", "A high back rounded vowel like /u/ should have:", ["low F1 and low F2", "high F1 and high F2", "no filter function", "only antiresonance"], 0, "/u/ is high/back/rounded: low F1 and low F2."),
    multi("Perturbation", "FIND ALL correct perturbation statements.", ["Constriction near maximum pressure tends to raise a resonance.", "Constriction near zero pressure tends to lower a resonance.", "Constrictions never affect resonance.", "The effect depends on constriction location."], [0, 1, 3], "Perturbation effects depend on where the constriction occurs relative to pressure/volume patterns."),
    multi("Speaker variation", "FIND ALL factors that can shift vowel formants across speakers.", ["vocal tract length", "speaker age/body size", "speaker sex-related anatomy", "whether the professor uses Moodle"], [0, 1, 2], "Anatomical vocal-tract size and shape shift formant values."),
    multi("Within-speaker variation", "FIND ALL factors that can contribute to within-speaker vowel variability.", ["speaking rate", "stress", "speaking style", "phonetic context"], [0, 1, 2, 3], "The review emphasized all four."),
    mc("Duration", "Which answer is an extrinsic vowel-duration factor?", ["vowel lengthening before a voiced consonant", "low vowels being longer than high vowels", "tense vowels being longer than lax vowels", "formant frequency being measured in Hz"], 0, "Surrounding consonant context is external to the vowel identity.", "img:acoustics_assets/spectrograms/vowel-duration-cvc-frame.png", "Class vowel-duration graph.")
  ];

  var vowelApplied = [
    written(9, "Source-filter figure", "Use the figure to identify source, filter, and output, then explain what would change if F0 changed but the vowel stayed /i/.", "The source is vocal fold vibration, which determines F0 and harmonic spacing. The filter is vocal tract shape, which determines formants. The output is the source spectrum shaped by the filter. If F0 changes but /i/ remains /i/, harmonic spacing changes but the low F1/high F2 filter pattern stays recognizable.", ["Labels source/filter/output.", "Assigns F0 to source.", "Assigns formants to filter.", "Explains output spectrum.", "Uses /i/ example correctly."], "source-filter", "Source-filter theory schematic."),
    auto(1, "Period", "If T = 5 ms, F0 is:", ["100 Hz", "125 Hz", "200 Hz", "500 Hz"], 2, "1 / .005 seconds = 200 Hz."),
    auto(1, "Domain", "A waveform is primarily a:", ["time-domain display", "frequency-domain display", "nasalance score", "tube perturbation map"], 0, "Waveforms show amplitude over time."),
    short(2, "Periodic vs aperiodic", "In two sentences, define complex periodic versus complex aperiodic acoustic events and give one example of each.", "Complex periodic signals repeat at a regular interval and have F0 plus harmonics; vowels are the key speech example. Complex aperiodic signals do not repeat regularly and lack stable F0; frication or white noise are examples.", ["Defines periodic.", "Defines aperiodic.", "Gives speech examples."], "displays", "Waveform, spectrum, and spectrogram displays."),
    written(5, "Formant perturbation", "A constriction for /i/ is made near the highlighted front-palatal region. Predict the direction of F1 and F2 using pressure-node logic.", "For /i/, the high front constriction tends to lower F1 and raise F2. Mechanistically, constriction effects depend on the pressure/volume pattern for each resonance; the exam answer should state direction plus why, not just memorize /i/ = low F1/high F2.", ["States F1 decreases.", "States F2 increases.", "Mentions constriction location.", "Uses pressure/perturbation logic.", "Avoids saying F0 determines formants."], "vowel-space", "Vowel-space and perturbation prompt."),
    short(2, "Speaker anatomy", "Why can the same vowel produced by a child and an adult male have different formant frequencies?", "Children have shorter, smaller vocal tracts, so their resonances/formants are generally higher. Adult males usually have longer tracts, so the same vowel can show lower formants.", ["Mentions tract length/size.", "States shorter -> higher formants.", "States longer -> lower formants."]),
    written(10, "Displays", "Identify waveform, spectrum, and spectrogram axes. Then state which display is best for seeing formant movement across time.", "Waveform: x = time, y = amplitude. Spectrum: x = frequency, y = amplitude. Spectrogram: x = time, y = frequency, darkness/intensity = amplitude. The spectrogram is best for seeing formant movement across time.", ["Names all displays.", "Gives all axes.", "Defines darkness/intensity.", "Selects spectrogram for movement.", "Uses formant language."], "displays", "Display-axis identification."),
    auto(1, "F1/F2", "Which formant pattern best matches /i/?", ["low F1, high F2", "high F1, low F2", "high F1, high F2", "no F2"], 0, "/i/ is high/front."),
    auto(1, "Lip rounding", "Lip rounding most directly tends to:", ["lower formant frequencies", "eliminate periodicity", "increase F0 only", "create a stop burst"], 0, "Rounding lengthens the vocal tract and lowers formants."),
    auto(1, "Diphthong cue", "For a diphthong, the examiner most wants you to notice:", ["formant trajectory over time", "one midpoint only", "no formants", "closure silence"], 0, "Diphthongs are dynamic."),
    short(5, "Diphthongs", "Explain why diphthongs are not simply two monophthongs glued together, and how they should be measured.", "Diphthongs have a continuous dynamic pattern as the articulators move through the vowel. They should be characterized with formant trajectories, including onset-to-offset movement and slope, because a single midpoint can miss the cue.", ["States dynamic pattern.", "Mentions continuous articulator movement.", "Names formant trajectories.", "Rejects midpoint-only measurement.", "Explains why trajectory matters."], "img:acoustics_assets/spectrograms/diphthong-formant-trajectory.png", "Class diphthong formant tracking slide."),
    short(2, "Undershoot", "Define vowel undershoot and give one condition that increases it.", "Undershoot is reduced movement toward the intended vowel target, so the formants do not reach the ideal steady-state values. It increases with faster speech, shorter duration, unstressed syllables, or coarticulatory pressure.", ["Defines reduced target achievement.", "Mentions formant effect.", "Gives one condition."]),
    written(3, "Cross-language vowel trap", "State the trap in assuming identical IPA symbols mean identical acoustics.", "IPA labels are phonetic categories, not exact acoustic coordinates. The same IPA vowel can occupy different F1/F2 regions across languages, speakers, and contexts.", ["Rejects identical-acoustics assumption.", "Mentions F1/F2 variation.", "Names language/speaker/context variation."], "img:acoustics_assets/spectrograms/vowel-cross-language-space.png", "Cross-language vowel-space figure."),
    short(2, "Final compact answer", "In one compact final-exam paragraph, separate F0, harmonics, and formants.", "F0 is the fundamental frequency of vocal fold vibration. Harmonics are integer multiples of F0 in the source spectrum. Formants are vocal-tract resonances that shape which harmonic regions are strongest in the output vowel.", ["Defines F0.", "Defines harmonics.", "Defines formants.", "Separates source from filter."])
  ];

  var consonantApplied = [
    written(9, "Nasal/fricative/vowel tube models", "Identify the tube models and explain source energy plus resonance/antiresonance for each.", "A vowel tube is open and uses periodic voicing shaped by oral resonances. A fricative or stop-release tube uses aperiodic turbulent source energy shaped by the front cavity. A nasal/lateral side-branch tube uses voicing with coupled side cavities, so resonance and antiresonance both matter.", ["Labels the three models.", "States periodic voicing for vowels/nasals.", "States aperiodic turbulence for fricatives.", "Mentions front-cavity resonance.", "Mentions nasal/lateral antiresonance."], "tube-classes", "Tube-class identification."),
    auto(1, "Antiresonance location", "Which place is most likely to create nasal antiresonance?", ["trapped oral cavity", "open lip radiation only", "F0 source", "time axis"], 0, "The trapped oral cavity behaves like a side branch."),
    auto(1, "Fricative source", "The main source for /s/ is:", ["aperiodic turbulent airflow", "periodic vowel voicing only", "nasal murmur", "silent closure"], 0, "Voiceless fricatives use aperiodic turbulence."),
    short(2, "Nasalized vowel", "Why do nasalized vowels often have reduced amplitude compared with non-nasalized vowels?", "Opening the nasal port couples the oral and nasal tracts, adding damping and antiresonance effects. That can weaken F1 or other energy regions compared with a purely oral vowel.", ["Mentions nasal port opening.", "Mentions coupling/damping.", "Mentions lower amplitude/F1."], "nasalization", "Nasalized vowel spectrum logic."),
    written(5, "Fricative spectra", "Use the spectra to compare /s/, /sh/, and /f/ in source, intensity, and front-cavity filtering.", "/s/, /sh/, and /f/ all involve turbulent aperiodic source energy. /s/ and /sh/ are sibilants and usually stronger because the jet strikes an obstacle; /s/ has a smaller front cavity than /sh/, so its spectral peak is higher. /f/ is a nonsibilant with weak, diffuse energy, so peak frequency alone is unreliable.", ["Names turbulent source.", "Distinguishes sibilant/nonsibilant.", "States /s/ higher peak than /sh/.", "Mentions /f/ weak/diffuse.", "States peak-frequency trap."], "img:acoustics_assets/spectrograms/fricatives-s-vs-f-spectrogram.png", "Class /s/ versus /f/ spectrogram."),
    short(2, "Voiced fricative", "How does a voiced fricative differ acoustically from a voiceless fricative?", "A voiced fricative combines aperiodic turbulent noise with periodic vocal fold vibration. A voiceless fricative lacks the periodic voicing component during the frication interval.", ["Mentions turbulence.", "Mentions voicing/periodic component.", "Contrasts voiceless."], "spec:voiced-fricative-za", "Generated voiced fricative."),
    written(10, "Display axes", "Identify waveform, spectrum, and spectrogram axes and state where frication and voicing are easiest to see.", "Waveform: time by amplitude. Spectrum: frequency by amplitude. Spectrogram: time by frequency with darkness as amplitude. Frication is easiest to see on a spectrogram/spectrum as high-frequency aperiodic energy; voicing appears as periodic pulses or a low-frequency voicing bar.", ["Names displays.", "Gives axes.", "Defines darkness.", "Identifies frication visually.", "Identifies voicing visually."], "displays", "Display-axis identification."),
    auto(1, "VOT", "For the displayed voiceless stop, VOT begins at:", ["closure onset", "burst release", "middle of vowel", "nasal murmur"], 1, "VOT starts at release burst.", "spec:voiceless-stop-ta", "Generated voiceless stop."),
    auto(1, "Affricate", "The defining affricate cue is:", ["closure plus burst followed by prolonged frication", "only a vowel", "only nasal murmur", "no aperiodic energy"], 0, "Affricates are slowly released stops.", "spec:affricate-cha", "Generated affricate."),
    auto(1, "Nasal murmur", "A nasal murmur is usually:", ["lower intensity than the following vowel", "stronger than every vowel", "pure white noise", "only a stop burst"], 0, "Nasal murmur is damped and lower in intensity."),
    short(5, "Stops and VOT", "Define VOT and explain how voiced and voiceless stops differ in closure and VOT.", "VOT is the interval from stop release burst to the first glottal pulse of the following vowel. Voiceless stops usually show silent closure and longer positive VOT because voicing starts later; voiced stops may show a voicing bar during closure and short-lag or negative VOT.", ["Defines VOT.", "Excludes closure.", "States voiceless long VOT.", "States voiced short/negative VOT.", "Mentions voicing bar or laryngeal timing."], "spec:voiceless-stop-pa", "Generated stop timing."),
    short(2, "Closure interval", "Explain HOW and WHY /t/ and /d/ closure intervals differ.", "/t/ closure is more likely silent because voicing is delayed. /d/ closure may contain low-frequency periodic voicing because vocal fold vibration can continue into closure or begin before release.", ["Contrasts silent and voiced closure.", "Mentions vocal fold vibration.", "Links to /t/ vs /d/."], "spec:voiced-stop-ba", "Generated voiced-stop timing."),
    written(3, "Stop/fricative/affricate ID", "Identify stop, fricative, and affricate timing from the figure.", "Stop = closure, burst, brief release/aspiration, vowel. Fricative = sustained aperiodic noise before the vowel without a complete closure. Affricate = closure and burst followed by prolonged frication.", ["Labels all three.", "Gives the timing cue for each.", "Mentions prolonged affricate frication."], "affricate-compare", "Stop, fricative, and affricate timing."),
    short(2, "Semivowel cue", "Why are semivowels tested with transitions rather than just static formant values?", "Semivowels are dynamic approximants, so their identity depends heavily on formant transitions into and out of the constriction. Static values can miss cues such as low F3 for /r/ or low F2/F3 for /w/.", ["Mentions transitions.", "Mentions constriction movement.", "Gives /r/ or /w/ cue."], "semivowels", "Semivowel transition schematic.")
  ];

  var consonantTF = [
    tf("Nasals", "Nasal consonants contain nasal resonance and can contain antiresonance from a trapped oral cavity.", true, "True. Oral closure plus nasal coupling creates murmur and antiresonance effects."),
    tf("Nasal vowels", "Nasalized vowels and nasal consonants both require complete oral closure.", false, "False. Nasalized vowels keep the oral tract open."),
    tf("Laterals", "The shunt cavity in /l/ can introduce antiresonance.", true, "True. Laterals can show side-cavity antiresonance."),
    tf("Fricative intensity", "Sibilants are usually less intense than nonsibilant fricatives.", false, "False. Sibilants are usually stronger."),
    tf("Fricative source", "Voiceless fricatives use aperiodic turbulent source energy.", true, "True."),
    tf("Voiced fricatives", "Voiced fricatives contain only periodic source energy.", false, "False. They contain turbulence plus voicing."),
    tf("VOT", "A 10 ms VOT is more likely voiced than voiceless in English.", true, "True. Short-lag VOT favors voiced perception."),
    tf("Negative VOT", "A -20 ms VOT means voicing begins before release.", true, "True. Negative VOT is prevoicing."),
    tf("Affricates", "Affricates have no closure interval.", false, "False. They begin with stop-like closure."),
    tf("Prosody", "Lexical stress can increase F0, intensity, and duration.", true, "True. Those are standard acoustic correlates of stress.")
  ];

  var consonantMC = [
    mc("Nasals", "Nasals are generally less intense than vowels mainly because:", ["nasal coupling damps energy and introduces antiresonance", "nasals are always voiceless", "nasals have no resonance", "nasals are pure sine waves"], 0, "Nasal coupling damps energy."),
    mc("Nasal order", "The expected antiresonance-frequency ordering from lowest to highest is:", ["/m/ < /n/ < /ng/", "/ng/ < /n/ < /m/", "/n/ < /m/ < /ng/", "all equal"], 0, "Larger trapped cavity for /m/ gives lower antiresonance."),
    mc("Nasalized vowels", "The key articulatory difference between a nasal consonant and nasalized vowel is:", ["nasal consonants have oral closure; nasalized vowels have oral tract open", "nasalized vowels have no nasal port opening", "nasal consonants have no voicing", "they are identical"], 0, "This exact contrast appears in the real-test style."),
    mc("Nasalance", "Nasalance is commonly represented as:", ["nasal acoustic energy divided by total oral-plus-nasal acoustic energy", "F0 divided by F1", "VOT divided by closure duration", "F2 minus F1 only"], 0, "Nasalance is a nasal/total acoustic energy proportion."),
    mc("Fricative front cavity", "A smaller front cavity in front of a fricative constriction produces:", ["a higher spectral peak", "a lower spectral peak", "no source energy", "a nasal murmur"], 0, "Smaller cavity -> higher resonance."),
    mc("Voiced fricative", "A voiced fricative such as /z/ has:", ["aperiodic turbulence plus periodic voicing", "only a stop burst", "only nasal resonance", "no source energy"], 0, "Voiced fricatives are mixed-source sounds."),
    multi("Fricative classification", "FIND TWO reasons peak frequency alone is a weak classifier.", ["nonsibilants can be weak/diffuse", "context shifts spectra", "all fricatives are identical", "peak frequency measures only F0"], [0, 1], "Weak spectra and context make peak alone unreliable."),
    mc("Stop sequence", "The typical voiceless stop sequence is:", ["closure -> burst -> aspiration/frication -> vowel voicing", "vowel -> nasal murmur -> closure", "F0 -> F1 -> F2 only", "spectrogram -> waveform -> spectrum"], 0, "That is the standard stop timing sequence."),
    mc("Affricate", "Affricates are called slowly released stops because they have:", ["closure and burst followed by prolonged frication", "no burst", "only steady voicing", "only nasal airflow"], 0, "Affricates release gradually into frication."),
    multi("Stress", "FIND ALL acoustic effects associated with stressed syllables.", ["higher F0", "greater intensity", "longer duration", "more distinctive vowel quality"], [0, 1, 2, 3], "The final review listed all four.")
  ];

  var visualTF = [
    tf("Waveform", "The x-axis of a waveform is time.", true, "True. A waveform shows amplitude over time."),
    tf("Spectrum", "The x-axis of a spectrum is time.", false, "False. A spectrum shows amplitude over frequency."),
    tf("Spectrogram", "A spectrogram shows time on the x-axis and frequency on the y-axis.", true, "True."),
    tf("Spectrogram darkness", "Darker spectrogram regions usually indicate stronger acoustic energy.", true, "True."),
    tf("VOT", "The closure interval is part of VOT.", false, "False. VOT begins at burst release."),
    tf("Fricatives", "Sustained high-frequency aperiodic energy is a common visual cue for /s/.", true, "True."),
    tf("Nasals", "Nasal murmurs are usually brighter and stronger than adjacent vowels.", false, "False. Nasal murmurs are usually dimmer/lower intensity."),
    tf("Affricates", "An affricate can look like a stop followed by a sustained fricative-like interval.", true, "True."),
    tf("Diphthongs", "A diphthong spectrogram is best read by tracking formant movement across time.", true, "True."),
    tf("Semivowels", "Semivowel identity is often carried by formant transitions.", true, "True.")
  ];

  var visualMC = [
    mc("Display axes", "Which statement is correct?", ["Waveform: x = time, y = amplitude.", "Spectrum: x = time, y = frequency.", "Spectrogram: x = amplitude, y = loudness.", "Waveform darkness = F2."], 0, "Waveform axes are time and amplitude.", "displays", "Display-axis schematic."),
    multi("Display axes", "FIND ALL correct display-axis statements.", ["Waveform: x = time, y = amplitude.", "Spectrum: x = frequency, y = amplitude.", "Spectrogram: x = time, y = frequency, darkness = amplitude/intensity.", "Spectrogram: x = amplitude, y = loudness."], [0, 1, 2], "The first three are correct."),
    mc("Vowel visual", "The most vowel-like visual cue is:", ["stable periodic energy with formant bands", "silent closure only", "brief release burst only", "weak diffuse noise with no voicing"], 0, "Vowels are periodic and formant-dominated.", "spec:vowel-a", "Generated vowel spectrogram."),
    mc("Diphthong visual", "For the displayed diphthong, the strongest cue is:", ["formant movement across time", "absence of all formants", "long silent closure", "nasal antiresonance only"], 0, "Diphthongs are dynamic.", "spec:diphthong-ai", "Generated diphthong spectrogram."),
    mc("Nasal visual", "A nasal murmur is suggested by:", ["low-frequency voiced energy weaker than the following vowel", "only high-frequency voiceless frication", "no voicing and no resonance", "a pure burst"], 0, "Nasals show voiced murmur and damping.", "spec:nasal-ma", "Generated nasal-vowel display."),
    mc("Fricative visual", "The first interval is best identified as:", ["voiceless sibilant fricative", "nasal murmur", "steady vowel", "voiced stop closure"], 0, "It has sustained high-frequency aperiodic energy.", "spec:voiceless-fricative-sa", "Generated /s/ plus vowel."),
    mc("Weak fricative", "Why can /f/ be easy to miss visually?", ["It is a weak nonsibilant with diffuse energy.", "It always has the darkest band.", "It has no aperiodic source.", "It always has negative VOT."], 0, "/f/ is nonsibilant and relatively weak.", "spec:weak-fricative-fa", "Generated /f/ plus vowel."),
    mc("Stop visual", "In the stop display, interval 1 is:", ["closure", "vowel", "nasal murmur", "F2 only"], 0, "Interval 1 is the closure interval.", "spec:voiceless-stop-pa", "Numbered stop display."),
    mc("Affricate visual", "The feature that makes this an affricate is:", ["extended frication after closure and burst", "lack of closure", "only nasal resonance", "only a steady vowel"], 0, "Affricates have stop-like closure plus sustained frication.", "spec:affricate-cha", "Generated affricate display."),
    mc("Semivowel visual", "The classic /r/ visual cue is:", ["lowered F3", "only high-frequency noise", "no formant transitions", "a stop burst"], 0, "/r/ is the low-F3 trap.", "spec:semivowel-ra", "Generated /r/ transition display.")
  ];

  var visualApplied = [
    written(9, "Display set", "Identify each display and explain what information each one makes easiest to see.", "The waveform shows amplitude over time and is useful for timing, closure, burst, and periodicity. The spectrum shows amplitude over frequency and is useful for peaks, formants, spectral shape, and fricative energy. The spectrogram shows time by frequency with darkness as intensity, so it is best for formant movement, VOT, frication, nasal murmur, and transitions.", ["Names all three displays.", "Gives axes.", "Explains waveform timing.", "Explains spectrum frequency peaks.", "Explains spectrogram time-varying cues."], "displays", "Waveform, spectrum, and spectrogram display set."),
    auto(1, "Waveform axis", "The y-axis of a waveform is:", ["amplitude", "frequency", "time", "F2 only"], 0, "Waveform y-axis is amplitude."),
    auto(1, "Spectrum axis", "The x-axis of a spectrum is:", ["frequency", "time", "nasalance", "VOT"], 0, "Spectrum x-axis is frequency."),
    short(2, "Spectrogram darkness", "In one sentence, state what dark bands on a spectrogram represent.", "Dark bands represent stronger acoustic energy at particular frequencies across time; for vowels, these dark bands often correspond to formants.", ["Mentions stronger energy/amplitude.", "Mentions frequency over time.", "Mentions formants when relevant."]),
    written(5, "VOT display", "Label closure, burst, aspiration/frication, vowel onset, and VOT in this figure.", "1 = closure, 2 = burst release, 3 = aspiration/frication interval, 4 = vowel/voicing onset. VOT begins at 2 and ends at the first glottal pulse at 4, so the closure interval is excluded.", ["Labels intervals.", "Defines VOT.", "Excludes closure.", "Includes aspiration/noise until voicing.", "Uses release-to-voicing language."], "spec:voiceless-stop-pa", "Numbered voiceless stop display."),
    short(2, "Voiced-stop visual", "Why should the voiced-stop display have shorter VOT than the voiceless-stop display?", "The voiced stop has vocal fold vibration during or immediately after closure/release, so voicing begins quickly. The voiceless stop delays voicing and often includes aspiration, producing longer VOT.", ["Mentions early voicing.", "Mentions short VOT.", "Contrasts voiceless aspiration."], "spec:voiced-stop-ba", "Generated voiced stop."),
    written(10, "Phrase-style spectrogram", "For the displayed stop-fricative-vowel patterns, state which numbered intervals would be closure, burst, frication, and vowel voicing. Then state which intervals count for VOT.", "In the voiceless stop, closure is the silent interval before release, burst is the brief spike at release, frication/aspiration is the post-release aperiodic interval, and vowel voicing begins at the first periodic vowel pulses. VOT is counted from burst release through the post-release noise until vowel voicing begins, not from closure onset.", ["Identifies closure.", "Identifies burst.", "Identifies frication/aspiration.", "Identifies vowel voicing.", "Defines VOT interval.", "Excludes closure."], "spec:voiceless-stop-ta", "Generated stop timing display."),
    auto(1, "Fricative interval", "Select the interval that corresponds to sustained /s/-like aperiodic energy.", ["1", "2", "3", "4"], 0, "Interval 1 is the sustained high-frequency frication interval.", "spec:voiceless-fricative-sa", "Generated /s/ display."),
    auto(1, "Nasal interval", "In the nasal display, interval 1 is best called:", ["nasal murmur", "stop burst", "aspiration", "F0 sampling rate"], 0, "Interval 1 is nasal murmur.", "spec:nasal-ma", "Generated nasal display."),
    auto(1, "Affricate interval", "In the affricate display, the extended frication interval is:", ["1", "2", "3", "4"], 2, "Interval 3 is the prolonged frication after burst.", "spec:affricate-cha", "Generated affricate display."),
    short(5, "Spectrogram sound classes", "Compare the visual cues for vowel, nasal, fricative, stop, and affricate.", "Vowels show strong periodic energy and formant bands. Nasals show lower-intensity voiced murmur with damping/antiresonance. Fricatives show sustained aperiodic noise, often high-frequency for sibilants. Stops show closure plus burst and VOT. Affricates show stop-like closure and burst followed by prolonged frication.", ["Covers vowels.", "Covers nasals.", "Covers fricatives.", "Covers stops.", "Covers affricates."], "affricate-compare", "Sound-class timing comparison."),
    short(2, "Diphthong visual", "Why is formant tracking better than one midpoint for diphthongs?", "Diphthongs are defined by movement from one vowel target toward another, so the trajectory and slope across time carry the cue. One midpoint can hide onset and offset movement.", ["Mentions movement/trajectory.", "Mentions slope or onset-to-offset.", "Rejects midpoint-only."], "spec:diphthong-ai", "Generated diphthong display."),
    written(3, "Semivowel transitions", "Use the semivowel figure to name one cue each for /w/, /j/, and /r/.", "/w/ has low F2/F3 moving into the vowel, /j/ has high F2/F3 transitions, and /r/ has a lowered F3. The exam trap is that transitions, not a static vowel midpoint, carry much of the cue.", ["Names /w/ low F2/F3.", "Names /j/ high F2/F3.", "Names /r/ low F3.", "Mentions transitions."], "semivowels", "Semivowel transition schematic."),
    short(2, "Visual final rule", "State the safest strategy for any unknown acoustic figure on the final.", "First name the display and axes, then identify source type, periodicity, intensity, closure/noise/voicing timing, and resonance or antiresonance. After that, connect the visual cue to the articulatory mechanism.", ["Names display/axes first.", "Mentions source/periodicity/timing.", "Mentions resonance/antiresonance.", "Connects cue to mechanism."])
  ];

  var pages = {
    "acoustics-mock-final-exam.html": page(
      "Chung-Style Acoustics Mock Final",
      "Comprehensive 75-point Form A rebuilt to mirror the real Test 1/Test 2 structure and point spread.",
      "COMD 4153 Acoustics Mock Final Form A",
      sections(commonTF, commonMC, "Part III - Visual, Fill-In, and Written Application", comprehensiveApplied)
    ),
    "acoustics-source-filter-vowels-drill.html": page(
      "Chung-Style Acoustics Exam Form B",
      "A 75-point source-filter and vowel-heavy exam form using the same real-test structure.",
      "COMD 4153 Acoustics Exam Form B - Source-Filter and Vowels",
      sections(vowelTF, vowelMC, "Part III - Source-Filter, Vowel, and Display Application", vowelApplied)
    ),
    "acoustics-consonant-feature-drill.html": page(
      "Chung-Style Acoustics Exam Form C",
      "A 75-point consonant-heavy exam form for nasals, laterals, fricatives, stops, VOT, affricates, semivowels, and prosody.",
      "COMD 4153 Acoustics Exam Form C - Consonants",
      sections(consonantTF, consonantMC, "Part III - Consonant Visual and Written Application", consonantApplied)
    ),
    "acoustics-spectrogram-visual-drill.html": page(
      "Chung-Style Acoustics Exam Form D",
      "A 75-point visual-heavy exam form for waveform, spectrum, spectrogram, VOT, frication, nasal murmur, and transition interpretation.",
      "COMD 4153 Acoustics Exam Form D - Visual Interpretation",
      sections(visualTF, visualMC, "Part III - Display, Spectrogram, and Timing Application", visualApplied)
    )
  };

  var current = window.location.pathname.split("/").pop() || "acoustics-mock-final-exam.html";
  window.ACOUSTICS_PAGE = pages[current] || pages["acoustics-mock-final-exam.html"];
})();
