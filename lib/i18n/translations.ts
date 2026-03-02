/**
 * Translations for ImageToWo
 * 
 * Supports English (en), French (fr), Spanish (es), German (de), Dutch (nl), and Italian (it)
 */

export type Locale = "en" | "fr" | "es" | "de" | "nl" | "it";

export const translations = {
  en: {
    // Header
    appName: "ImageToWo",
    newUpload: "New Upload",
    
    // Hero
    heroTitle: "Transform Workout Images",
    heroTitleHighlight: "into .zwo Files",
    heroDescription: "Upload a screenshot of your cycling workout and we'll convert it to a .zwo file for Zwift, Intervals.icu, or TrainingPeaks.",
    
    // Uploader
    dropImage: "Drag & drop your workout image",
    dropHere: "Drop your image here",
    maxSize: "JPEG, PNG, WebP up to",
    browse: "Browse",
    takePhoto: "Take a photo",
    analyzing: "Analyzing workout...",
    
    // Features
    featureUploadTitle: "Upload Image",
    featureUploadDesc: "Drag & drop or take a photo of your workout",
    featureAITitle: "AI Parsing",
    featureAIDesc: "Our AI extracts workout structure automatically",
    featureExportTitle: "Export ZWO",
    featureExportDesc: "Download for Zwift and other platforms",
    
    // Loading
    loadingTitle: "Analyzing your workout...",
    loadingSubtitle: "This may take a few seconds",
    
    // Editor
    editWorkout: "Edit Workout",
    workoutName: "Workout Name",
    workoutNamePlaceholder: "My Workout",
    description: "Description (optional)",
    descriptionPlaceholder: "Optional description...",
    steps: "steps",
    total: "total",
    workoutPreview: "Workout Preview",
    hoverTip: "💡 Hover over intervals to see details",
    workoutSteps: "Workout Steps",
    add: "Add:",
    confidence: "confidence",
    parsingWarnings: "Parsing Warnings",
    
    // Step types
    warmup: "Warmup",
    cooldown: "Cooldown",
    steady: "Steady State",
    intervals: "Intervals",
    interval: "Interval",
    freeride: "Free Ride",
    
    // Step fields
    duration: "Duration",
    power: "Power (%FTP)",
    startPower: "Start Power (%FTP)",
    endPower: "End Power (%FTP)",
    repeat: "Repetitions",
    onDuration: "Work Duration",
    offDuration: "Rest Duration",
    onPower: "Work Power (%FTP)",
    offPower: "Rest Power (%FTP)",
    
    // Export
    readyToExport: "Ready to export?",
    downloadZwo: "Download your workout in .zwo format",
    downloadBtn: "Download .zwo",
    exporting: "Exporting...",
    exportReady: "Ready to export?",
    exportReadyDesc: "Download your workout in .zwo format",
    
    // Import instructions
    importTitle: "How to import your workout",
    tip: "Tip",
    note: "Note",
    yourId: "your ID",
    
    // Intervals.icu
    intervalsStep1: "Log in to",
    intervalsStep2: "Go to Library → Workouts",
    intervalsStep3: "Click the + Add button in the top right",
    intervalsStep4: "Select Import from File",
    intervalsStep5: "Choose your downloaded .zwo file",
    intervalsStep6: "The workout appears in your library, ready to be scheduled!",
    intervalsTip: "You can also drag and drop the .zwo file directly onto a day in your calendar.",
    
    // TrainingPeaks
    tpStep1: "Log in to",
    tpStep2: "Go to Workout Library (left menu)",
    tpStep3: "Click Import Workouts",
    tpStep4: "Select Import from File",
    tpStep5: "Choose your .zwo file",
    tpStep6: "Confirm the import and find the workout in your library",
    tpNote: "Importing .zwo files requires a TrainingPeaks Premium account.",
    
    // Zwift
    zwiftStep1: "Locate the Zwift Workouts folder on your computer:",
    zwiftStep2: "Copy your .zwo file to this folder",
    zwiftStep3: "Launch Zwift and go to Training → Custom Workouts",
    zwiftStep4: "Your workout appears in the list, ready to use!",
    zwiftTip: "Restart Zwift if the workout doesn't appear immediately.",
    
    // Footer
    footerTagline: "ImageToWo — Convert workout images to .zwo files",
    footerCompatible: "Compatible with Zwift, Intervals.icu, and TrainingPeaks",
    
    // Power zones
    z1: "Z1 Recovery",
    z2: "Z2 Endurance",
    z3: "Z3 Tempo",
    z4: "Z4 Threshold",
    z5: "Z5 VO2max",
    
    // Quota
    quotaRemaining: "analyses remaining today",
    quotaExhausted: "Daily limit reached",
    quotaResetIn: "Resets in",
    quotaUnlimited: "Unlimited",

    // Auth gate
    signInRequired: "Sign in to get started",
    signInRequiredDesc: "Sign in with your Google account to upload and analyse workout images.",
    signInWithGoogle: "Sign in with Google",
  },
  
  fr: {
    // Header
    appName: "ImageToWo",
    newUpload: "Nouvel upload",
    
    // Hero
    heroTitle: "Transformez vos images de workout",
    heroTitleHighlight: "en fichiers .zwo",
    heroDescription: "Uploadez une capture d'écran de votre entraînement vélo et nous le convertirons en fichier .zwo pour Zwift, Intervals.icu ou TrainingPeaks.",
    
    // Uploader
    dropImage: "Glissez-déposez votre image de workout",
    dropHere: "Déposez votre image ici",
    maxSize: "JPEG, PNG, WebP jusqu'à",
    browse: "Parcourir",
    takePhoto: "Prendre une photo",
    analyzing: "Analyse du workout en cours...",
    
    // Features
    featureUploadTitle: "Uploadez une image",
    featureUploadDesc: "Glissez-déposez ou prenez une photo de votre workout",
    featureAITitle: "Analyse IA",
    featureAIDesc: "Notre IA extrait la structure du workout automatiquement",
    featureExportTitle: "Export ZWO",
    featureExportDesc: "Téléchargez pour Zwift et autres plateformes",
    
    // Loading
    loadingTitle: "Analyse de votre workout...",
    loadingSubtitle: "Cela peut prendre quelques secondes",
    
    // Editor
    editWorkout: "Éditer le Workout",
    workoutName: "Nom du Workout",
    workoutNamePlaceholder: "Mon Workout",
    description: "Description (optionnel)",
    descriptionPlaceholder: "Description optionnelle...",
    steps: "étapes",
    total: "total",
    workoutPreview: "Aperçu du Workout",
    hoverTip: "💡 Survolez les intervalles pour voir les détails",
    workoutSteps: "Étapes du Workout",
    add: "Ajouter :",
    confidence: "confiance",
    parsingWarnings: "Avertissements d'analyse",
    
    // Step types
    warmup: "Échauffement",
    cooldown: "Récupération",
    steady: "Effort constant",
    intervals: "Intervalles",
    interval: "Intervalle",
    freeride: "Libre",
    
    // Step fields
    duration: "Durée",
    power: "Puissance (%FTP)",
    startPower: "Puissance début (%FTP)",
    endPower: "Puissance fin (%FTP)",
    repeat: "Répétitions",
    onDuration: "Durée effort",
    offDuration: "Durée récup",
    onPower: "Puissance effort (%FTP)",
    offPower: "Puissance récup (%FTP)",
    
    // Export
    readyToExport: "Prêt à exporter ?",
    downloadZwo: "Téléchargez votre workout au format .zwo",
    downloadBtn: "Télécharger .zwo",
    exporting: "Export en cours...",
    exportReady: "Prêt à exporter ?",
    exportReadyDesc: "Téléchargez votre workout au format .zwo",
    
    // Import instructions
    importTitle: "Comment importer votre workout",
    tip: "Astuce",
    note: "Note",
    yourId: "votre ID",
    
    // Intervals.icu
    intervalsStep1: "Connectez-vous à",
    intervalsStep2: "Allez dans Library → Workouts",
    intervalsStep3: "Cliquez sur le bouton + Add en haut à droite",
    intervalsStep4: "Sélectionnez Import from File",
    intervalsStep5: "Choisissez votre fichier .zwo téléchargé",
    intervalsStep6: "Le workout apparaît dans votre bibliothèque, prêt à être planifié !",
    intervalsTip: "Vous pouvez aussi glisser-déposer le fichier .zwo directement sur un jour de votre calendrier.",
    
    // TrainingPeaks
    tpStep1: "Connectez-vous à",
    tpStep2: "Allez dans Workout Library (menu de gauche)",
    tpStep3: "Cliquez sur Import Workouts",
    tpStep4: "Sélectionnez Import from File",
    tpStep5: "Choisissez votre fichier .zwo",
    tpStep6: "Confirmez l'import et retrouvez le workout dans votre bibliothèque",
    tpNote: "L'import de fichiers .zwo nécessite un compte TrainingPeaks Premium.",
    
    // Zwift
    zwiftStep1: "Localisez le dossier Zwift Workouts sur votre ordinateur :",
    zwiftStep2: "Copiez votre fichier .zwo dans ce dossier",
    zwiftStep3: "Lancez Zwift et allez dans Training → Custom Workouts",
    zwiftStep4: "Votre workout apparaît dans la liste, prêt à être utilisé !",
    zwiftTip: "Redémarrez Zwift si le workout n'apparaît pas immédiatement.",
    
    // Footer
    footerTagline: "ImageToWo — Convertissez vos images de workout en fichiers .zwo",
    footerCompatible: "Compatible avec Zwift, Intervals.icu et TrainingPeaks",
    
    // Power zones
    z1: "Z1 Récupération",
    z2: "Z2 Endurance",
    z3: "Z3 Tempo",
    z4: "Z4 Seuil",
    z5: "Z5 VO2max",
    
    // Quota
    quotaRemaining: "analyses restantes aujourd'hui",
    quotaExhausted: "Limite journalière atteinte",
    quotaResetIn: "Réinitialisation dans",
    quotaUnlimited: "Illimité",

    // Auth gate
    signInRequired: "Connectez-vous pour commencer",
    signInRequiredDesc: "Connectez-vous avec votre compte Google pour charger et analyser des images de workout.",
    signInWithGoogle: "Se connecter avec Google",
  },
  es: {
    // Header
    appName: "ImageToWo",
    newUpload: "Nueva subida",

    // Hero
    heroTitle: "Transforma imágenes de entrenamiento",
    heroTitleHighlight: "en archivos .zwo",
    heroDescription: "Sube una captura de pantalla de tu entrenamiento de ciclismo y lo convertiremos a un archivo .zwo para Zwift, Intervals.icu o TrainingPeaks.",

    // Uploader
    dropImage: "Arrastra y suelta tu imagen de entrenamiento",
    dropHere: "Suelta tu imagen aquí",
    maxSize: "JPEG, PNG, WebP hasta",
    browse: "Explorar",
    takePhoto: "Tomar una foto",
    analyzing: "Analizando entrenamiento...",

    // Features
    featureUploadTitle: "Subir imagen",
    featureUploadDesc: "Arrastra y suelta o toma una foto de tu entrenamiento",
    featureAITitle: "Análisis IA",
    featureAIDesc: "Nuestra IA extrae la estructura del entrenamiento automáticamente",
    featureExportTitle: "Exportar ZWO",
    featureExportDesc: "Descarga para Zwift y otras plataformas",

    // Loading
    loadingTitle: "Analizando tu entrenamiento...",
    loadingSubtitle: "Esto puede tardar unos segundos",

    // Editor
    editWorkout: "Editar entrenamiento",
    workoutName: "Nombre del entrenamiento",
    workoutNamePlaceholder: "Mi entrenamiento",
    description: "Descripción (opcional)",
    descriptionPlaceholder: "Descripción opcional...",
    steps: "pasos",
    total: "total",
    workoutPreview: "Vista previa del entrenamiento",
    hoverTip: "💡 Pasa el cursor sobre los intervalos para ver detalles",
    workoutSteps: "Pasos del entrenamiento",
    add: "Añadir:",
    confidence: "confianza",
    parsingWarnings: "Advertencias de análisis",

    // Step types
    warmup: "Calentamiento",
    cooldown: "Enfriamiento",
    steady: "Estado constante",
    intervals: "Intervalos",
    interval: "Intervalo",
    freeride: "Libre",

    // Step fields
    duration: "Duración",
    power: "Potencia (%FTP)",
    startPower: "Potencia inicial (%FTP)",
    endPower: "Potencia final (%FTP)",
    repeat: "Repeticiones",
    onDuration: "Duración trabajo",
    offDuration: "Duración descanso",
    onPower: "Potencia trabajo (%FTP)",
    offPower: "Potencia descanso (%FTP)",

    // Export
    readyToExport: "¿Listo para exportar?",
    downloadZwo: "Descarga tu entrenamiento en formato .zwo",
    downloadBtn: "Descargar .zwo",
    exporting: "Exportando...",
    exportReady: "¿Listo para exportar?",
    exportReadyDesc: "Descarga tu entrenamiento en formato .zwo",

    // Import instructions
    importTitle: "Cómo importar tu entrenamiento",
    tip: "Consejo",
    note: "Nota",
    yourId: "tu ID",

    // Intervals.icu
    intervalsStep1: "Inicia sesión en",
    intervalsStep2: "Ve a Library → Workouts",
    intervalsStep3: "Haz clic en el botón + Add en la esquina superior derecha",
    intervalsStep4: "Selecciona Import from File",
    intervalsStep5: "Elige tu archivo .zwo descargado",
    intervalsStep6: "El entrenamiento aparece en tu biblioteca, ¡listo para programar!",
    intervalsTip: "También puedes arrastrar y soltar el archivo .zwo directamente en un día de tu calendario.",

    // TrainingPeaks
    tpStep1: "Inicia sesión en",
    tpStep2: "Ve a Workout Library (menú izquierdo)",
    tpStep3: "Haz clic en Import Workouts",
    tpStep4: "Selecciona Import from File",
    tpStep5: "Elige tu archivo .zwo",
    tpStep6: "Confirma la importación y encuentra el entrenamiento en tu biblioteca",
    tpNote: "La importación de archivos .zwo requiere una cuenta TrainingPeaks Premium.",

    // Zwift
    zwiftStep1: "Localiza la carpeta Zwift Workouts en tu ordenador:",
    zwiftStep2: "Copia tu archivo .zwo en esta carpeta",
    zwiftStep3: "Inicia Zwift y ve a Training → Custom Workouts",
    zwiftStep4: "Tu entrenamiento aparece en la lista, ¡listo para usar!",
    zwiftTip: "Reinicia Zwift si el entrenamiento no aparece inmediatamente.",

    // Footer
    footerTagline: "ImageToWo — Convierte imágenes de entrenamiento a archivos .zwo",
    footerCompatible: "Compatible con Zwift, Intervals.icu y TrainingPeaks",

    // Power zones
    z1: "Z1 Recuperación",
    z2: "Z2 Resistencia",
    z3: "Z3 Tempo",
    z4: "Z4 Umbral",
    z5: "Z5 VO2max",

    // Quota
    quotaRemaining: "análisis restantes hoy",
    quotaExhausted: "Límite diario alcanzado",
    quotaResetIn: "Se reinicia en",
    quotaUnlimited: "Ilimitado",

    // Auth gate
    signInRequired: "Inicia sesión para comenzar",
    signInRequiredDesc: "Inicia sesión con tu cuenta de Google para subir y analizar imágenes de entrenamiento.",
    signInWithGoogle: "Iniciar sesión con Google",
  },

  de: {
    // Header
    appName: "ImageToWo",
    newUpload: "Neuer Upload",

    // Hero
    heroTitle: "Trainingsbilder umwandeln",
    heroTitleHighlight: "in .zwo-Dateien",
    heroDescription: "Lade einen Screenshot deines Radtrainings hoch und wir konvertieren ihn in eine .zwo-Datei für Zwift, Intervals.icu oder TrainingPeaks.",

    // Uploader
    dropImage: "Ziehe dein Trainingsbild hierher",
    dropHere: "Bild hier ablegen",
    maxSize: "JPEG, PNG, WebP bis zu",
    browse: "Durchsuchen",
    takePhoto: "Foto aufnehmen",
    analyzing: "Training wird analysiert...",

    // Features
    featureUploadTitle: "Bild hochladen",
    featureUploadDesc: "Ziehen & ablegen oder Foto deines Trainings aufnehmen",
    featureAITitle: "KI-Analyse",
    featureAIDesc: "Unsere KI extrahiert die Trainingsstruktur automatisch",
    featureExportTitle: "ZWO exportieren",
    featureExportDesc: "Download für Zwift und andere Plattformen",

    // Loading
    loadingTitle: "Dein Training wird analysiert...",
    loadingSubtitle: "Das kann einige Sekunden dauern",

    // Editor
    editWorkout: "Training bearbeiten",
    workoutName: "Trainingsname",
    workoutNamePlaceholder: "Mein Training",
    description: "Beschreibung (optional)",
    descriptionPlaceholder: "Optionale Beschreibung...",
    steps: "Schritte",
    total: "gesamt",
    workoutPreview: "Trainingsvorschau",
    hoverTip: "💡 Fahre über Intervalle, um Details zu sehen",
    workoutSteps: "Trainingsschritte",
    add: "Hinzufügen:",
    confidence: "Konfidenz",
    parsingWarnings: "Analyse-Warnungen",

    // Step types
    warmup: "Aufwärmen",
    cooldown: "Abkühlen",
    steady: "Gleichmäßige Belastung",
    intervals: "Intervalle",
    interval: "Intervall",
    freeride: "Freie Fahrt",

    // Step fields
    duration: "Dauer",
    power: "Leistung (%FTP)",
    startPower: "Startleistung (%FTP)",
    endPower: "Endleistung (%FTP)",
    repeat: "Wiederholungen",
    onDuration: "Belastungsdauer",
    offDuration: "Erholungsdauer",
    onPower: "Belastungsleistung (%FTP)",
    offPower: "Erholungsleistung (%FTP)",

    // Export
    readyToExport: "Bereit zum Exportieren?",
    downloadZwo: "Lade dein Training im .zwo-Format herunter",
    downloadBtn: ".zwo herunterladen",
    exporting: "Wird exportiert...",
    exportReady: "Bereit zum Exportieren?",
    exportReadyDesc: "Lade dein Training im .zwo-Format herunter",

    // Import instructions
    importTitle: "So importierst du dein Training",
    tip: "Tipp",
    note: "Hinweis",
    yourId: "deine ID",

    // Intervals.icu
    intervalsStep1: "Melde dich an bei",
    intervalsStep2: "Gehe zu Library → Workouts",
    intervalsStep3: "Klicke auf die Schaltfläche + Add oben rechts",
    intervalsStep4: "Wähle Import from File",
    intervalsStep5: "Wähle deine heruntergeladene .zwo-Datei",
    intervalsStep6: "Das Training erscheint in deiner Bibliothek, bereit zur Planung!",
    intervalsTip: "Du kannst die .zwo-Datei auch direkt auf einen Tag in deinem Kalender ziehen.",

    // TrainingPeaks
    tpStep1: "Melde dich an bei",
    tpStep2: "Gehe zu Workout Library (linkes Menü)",
    tpStep3: "Klicke auf Import Workouts",
    tpStep4: "Wähle Import from File",
    tpStep5: "Wähle deine .zwo-Datei",
    tpStep6: "Bestätige den Import und finde das Training in deiner Bibliothek",
    tpNote: "Der Import von .zwo-Dateien erfordert ein TrainingPeaks Premium-Konto.",

    // Zwift
    zwiftStep1: "Suche den Zwift Workouts-Ordner auf deinem Computer:",
    zwiftStep2: "Kopiere deine .zwo-Datei in diesen Ordner",
    zwiftStep3: "Starte Zwift und gehe zu Training → Custom Workouts",
    zwiftStep4: "Dein Training erscheint in der Liste, bereit zur Nutzung!",
    zwiftTip: "Starte Zwift neu, wenn das Training nicht sofort erscheint.",

    // Footer
    footerTagline: "ImageToWo — Trainingsbilder in .zwo-Dateien konvertieren",
    footerCompatible: "Kompatibel mit Zwift, Intervals.icu und TrainingPeaks",

    // Power zones
    z1: "Z1 Erholung",
    z2: "Z2 Ausdauer",
    z3: "Z3 Tempo",
    z4: "Z4 Schwelle",
    z5: "Z5 VO2max",

    // Quota
    quotaRemaining: "Analysen heute verbleibend",
    quotaExhausted: "Tageslimit erreicht",
    quotaResetIn: "Zurücksetzen in",
    quotaUnlimited: "Unbegrenzt",

    // Auth gate
    signInRequired: "Anmelden, um zu beginnen",
    signInRequiredDesc: "Melde dich mit deinem Google-Konto an, um Trainingsbilder hochzuladen und zu analysieren.",
    signInWithGoogle: "Mit Google anmelden",
  },

  nl: {
    // Header
    appName: "ImageToWo",
    newUpload: "Nieuwe upload",

    // Hero
    heroTitle: "Trainingsafbeeldingen omzetten",
    heroTitleHighlight: "naar .zwo-bestanden",
    heroDescription: "Upload een screenshot van je fietstraining en wij zetten het om naar een .zwo-bestand voor Zwift, Intervals.icu of TrainingPeaks.",

    // Uploader
    dropImage: "Sleep je trainingsafbeelding hierheen",
    dropHere: "Zet je afbeelding hier neer",
    maxSize: "JPEG, PNG, WebP tot",
    browse: "Bladeren",
    takePhoto: "Foto maken",
    analyzing: "Training analyseren...",

    // Features
    featureUploadTitle: "Afbeelding uploaden",
    featureUploadDesc: "Sleep & zet neer of maak een foto van je training",
    featureAITitle: "AI-analyse",
    featureAIDesc: "Onze AI extraheert automatisch de trainingsstructuur",
    featureExportTitle: "ZWO exporteren",
    featureExportDesc: "Download voor Zwift en andere platforms",

    // Loading
    loadingTitle: "Je training analyseren...",
    loadingSubtitle: "Dit kan een paar seconden duren",

    // Editor
    editWorkout: "Training bewerken",
    workoutName: "Trainingsnaam",
    workoutNamePlaceholder: "Mijn training",
    description: "Beschrijving (optioneel)",
    descriptionPlaceholder: "Optionele beschrijving...",
    steps: "stappen",
    total: "totaal",
    workoutPreview: "Trainingsvoorbeeld",
    hoverTip: "💡 Beweeg over intervallen om details te zien",
    workoutSteps: "Trainingsstappen",
    add: "Toevoegen:",
    confidence: "betrouwbaarheid",
    parsingWarnings: "Analysewaarschuwingen",

    // Step types
    warmup: "Opwarming",
    cooldown: "Afkoeling",
    steady: "Gelijkmatige inspanning",
    intervals: "Intervallen",
    interval: "Interval",
    freeride: "Vrij rijden",

    // Step fields
    duration: "Duur",
    power: "Vermogen (%FTP)",
    startPower: "Startvermogen (%FTP)",
    endPower: "Eindvermogen (%FTP)",
    repeat: "Herhalingen",
    onDuration: "Inspanningsduur",
    offDuration: "Rustduur",
    onPower: "Inspanningsvermogen (%FTP)",
    offPower: "Rustvermogen (%FTP)",

    // Export
    readyToExport: "Klaar om te exporteren?",
    downloadZwo: "Download je training in .zwo-formaat",
    downloadBtn: ".zwo downloaden",
    exporting: "Exporteren...",
    exportReady: "Klaar om te exporteren?",
    exportReadyDesc: "Download je training in .zwo-formaat",

    // Import instructions
    importTitle: "Hoe importeer je je training",
    tip: "Tip",
    note: "Opmerking",
    yourId: "jouw ID",

    // Intervals.icu
    intervalsStep1: "Log in op",
    intervalsStep2: "Ga naar Library → Workouts",
    intervalsStep3: "Klik op de knop + Add rechtsboven",
    intervalsStep4: "Selecteer Import from File",
    intervalsStep5: "Kies je gedownloade .zwo-bestand",
    intervalsStep6: "De training verschijnt in je bibliotheek, klaar om in te plannen!",
    intervalsTip: "Je kunt het .zwo-bestand ook direct naar een dag in je agenda slepen.",

    // TrainingPeaks
    tpStep1: "Log in op",
    tpStep2: "Ga naar Workout Library (linker menu)",
    tpStep3: "Klik op Import Workouts",
    tpStep4: "Selecteer Import from File",
    tpStep5: "Kies je .zwo-bestand",
    tpStep6: "Bevestig de import en vind de training in je bibliotheek",
    tpNote: "Het importeren van .zwo-bestanden vereist een TrainingPeaks Premium-account.",

    // Zwift
    zwiftStep1: "Zoek de Zwift Workouts-map op je computer:",
    zwiftStep2: "Kopieer je .zwo-bestand naar deze map",
    zwiftStep3: "Start Zwift en ga naar Training → Custom Workouts",
    zwiftStep4: "Je training verschijnt in de lijst, klaar voor gebruik!",
    zwiftTip: "Herstart Zwift als de training niet onmiddellijk verschijnt.",

    // Footer
    footerTagline: "ImageToWo — Trainingsafbeeldingen omzetten naar .zwo-bestanden",
    footerCompatible: "Compatibel met Zwift, Intervals.icu en TrainingPeaks",

    // Power zones
    z1: "Z1 Herstel",
    z2: "Z2 Duurzaamheid",
    z3: "Z3 Tempo",
    z4: "Z4 Drempel",
    z5: "Z5 VO2max",

    // Quota
    quotaRemaining: "analyses resterend vandaag",
    quotaExhausted: "Daglimiet bereikt",
    quotaResetIn: "Reset over",
    quotaUnlimited: "Onbeperkt",

    // Auth gate
    signInRequired: "Log in om te beginnen",
    signInRequiredDesc: "Log in met je Google-account om trainingsafbeeldingen te uploaden en te analyseren.",
    signInWithGoogle: "Inloggen met Google",
  },

  it: {
    // Header
    appName: "ImageToWo",
    newUpload: "Nuovo caricamento",

    // Hero
    heroTitle: "Trasforma le immagini di allenamento",
    heroTitleHighlight: "in file .zwo",
    heroDescription: "Carica uno screenshot del tuo allenamento in bici e lo convertiremo in un file .zwo per Zwift, Intervals.icu o TrainingPeaks.",

    // Uploader
    dropImage: "Trascina e rilascia l'immagine del tuo allenamento",
    dropHere: "Rilascia l'immagine qui",
    maxSize: "JPEG, PNG, WebP fino a",
    browse: "Sfoglia",
    takePhoto: "Scatta una foto",
    analyzing: "Analisi dell'allenamento in corso...",

    // Features
    featureUploadTitle: "Carica immagine",
    featureUploadDesc: "Trascina & rilascia o scatta una foto del tuo allenamento",
    featureAITitle: "Analisi IA",
    featureAIDesc: "La nostra IA estrae automaticamente la struttura dell'allenamento",
    featureExportTitle: "Esporta ZWO",
    featureExportDesc: "Scarica per Zwift e altre piattaforme",

    // Loading
    loadingTitle: "Analisi del tuo allenamento...",
    loadingSubtitle: "Potrebbero volerci alcuni secondi",

    // Editor
    editWorkout: "Modifica allenamento",
    workoutName: "Nome allenamento",
    workoutNamePlaceholder: "Il mio allenamento",
    description: "Descrizione (opzionale)",
    descriptionPlaceholder: "Descrizione opzionale...",
    steps: "passi",
    total: "totale",
    workoutPreview: "Anteprima allenamento",
    hoverTip: "💡 Passa il cursore sugli intervalli per vedere i dettagli",
    workoutSteps: "Passi dell'allenamento",
    add: "Aggiungi:",
    confidence: "affidabilità",
    parsingWarnings: "Avvisi di analisi",

    // Step types
    warmup: "Riscaldamento",
    cooldown: "Defaticamento",
    steady: "Sforzo costante",
    intervals: "Intervalli",
    interval: "Intervallo",
    freeride: "Libero",

    // Step fields
    duration: "Durata",
    power: "Potenza (%FTP)",
    startPower: "Potenza iniziale (%FTP)",
    endPower: "Potenza finale (%FTP)",
    repeat: "Ripetizioni",
    onDuration: "Durata lavoro",
    offDuration: "Durata recupero",
    onPower: "Potenza lavoro (%FTP)",
    offPower: "Potenza recupero (%FTP)",

    // Export
    readyToExport: "Pronto per esportare?",
    downloadZwo: "Scarica il tuo allenamento in formato .zwo",
    downloadBtn: "Scarica .zwo",
    exporting: "Esportazione in corso...",
    exportReady: "Pronto per esportare?",
    exportReadyDesc: "Scarica il tuo allenamento in formato .zwo",

    // Import instructions
    importTitle: "Come importare il tuo allenamento",
    tip: "Suggerimento",
    note: "Nota",
    yourId: "il tuo ID",

    // Intervals.icu
    intervalsStep1: "Accedi a",
    intervalsStep2: "Vai a Library → Workouts",
    intervalsStep3: "Clicca sul pulsante + Add in alto a destra",
    intervalsStep4: "Seleziona Import from File",
    intervalsStep5: "Scegli il tuo file .zwo scaricato",
    intervalsStep6: "L'allenamento appare nella tua libreria, pronto per essere programmato!",
    intervalsTip: "Puoi anche trascinare il file .zwo direttamente su un giorno nel tuo calendario.",

    // TrainingPeaks
    tpStep1: "Accedi a",
    tpStep2: "Vai a Workout Library (menu a sinistra)",
    tpStep3: "Clicca su Import Workouts",
    tpStep4: "Seleziona Import from File",
    tpStep5: "Scegli il tuo file .zwo",
    tpStep6: "Conferma l'importazione e trova l'allenamento nella tua libreria",
    tpNote: "L'importazione di file .zwo richiede un account TrainingPeaks Premium.",

    // Zwift
    zwiftStep1: "Trova la cartella Zwift Workouts sul tuo computer:",
    zwiftStep2: "Copia il tuo file .zwo in questa cartella",
    zwiftStep3: "Avvia Zwift e vai a Training → Custom Workouts",
    zwiftStep4: "Il tuo allenamento appare nell'elenco, pronto all'uso!",
    zwiftTip: "Riavvia Zwift se l'allenamento non appare immediatamente.",

    // Footer
    footerTagline: "ImageToWo — Converti immagini di allenamento in file .zwo",
    footerCompatible: "Compatibile con Zwift, Intervals.icu e TrainingPeaks",

    // Power zones
    z1: "Z1 Recupero",
    z2: "Z2 Resistenza",
    z3: "Z3 Tempo",
    z4: "Z4 Soglia",
    z5: "Z5 VO2max",

    // Quota
    quotaRemaining: "analisi rimanenti oggi",
    quotaExhausted: "Limite giornaliero raggiunto",
    quotaResetIn: "Ripristino tra",
    quotaUnlimited: "Illimitato",

    // Auth gate
    signInRequired: "Accedi per iniziare",
    signInRequiredDesc: "Accedi con il tuo account Google per caricare e analizzare le immagini di allenamento.",
    signInWithGoogle: "Accedi con Google",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
