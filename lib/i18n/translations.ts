/**
 * Translations for ImageToWo
 * 
 * Supports English (en) and French (fr)
 */

export type Locale = "en" | "fr";

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
    
    // Authentication
    signInRequired: "Sign in to upload your workout image",
    signInRequiredDesc: "Authentication is required to use the AI-powered workout converter.",
    signInWithGoogle: "Sign in with Google",
    signedInAs: "Signed in as",
    signOut: "Sign out",

    // Onboarding
    onboardingStep1Title: "Welcome to ImageToWo!",
    onboardingStep1Desc: "Convert your cycling workout screenshots into structured .zwo files in seconds. Here's a quick guide to get you started.",
    onboardingStep2Title: "Upload a Workout Image",
    onboardingStep2Desc: "Drag & drop a screenshot or photo of your cycling workout. We support JPEG, PNG, and WebP images up to 10 MB.",
    onboardingStep3Title: "AI Parses Your Workout",
    onboardingStep3Desc: "Our AI reads the image and automatically extracts every interval, power target, and duration. You can then review and edit the result.",
    onboardingStep4Title: "Export & Import",
    onboardingStep4Desc: "Download your workout as a .zwo file and import it directly into Zwift, Intervals.icu, or TrainingPeaks.",
    onboardingSkip: "Skip",
    onboardingBack: "Back",
    onboardingNext: "Next",
    onboardingGetStarted: "Get Started",
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
    
    // Authentication
    signInRequired: "Connectez-vous pour uploader votre image de workout",
    signInRequiredDesc: "L'authentification est requise pour utiliser le convertisseur de workout IA.",
    signInWithGoogle: "Se connecter avec Google",
    signedInAs: "Connecté en tant que",
    signOut: "Se déconnecter",

    // Onboarding
    onboardingStep1Title: "Bienvenue sur ImageToWo !",
    onboardingStep1Desc: "Convertissez vos captures d'écran d'entraînement cycliste en fichiers .zwo structurés en quelques secondes. Voici un guide rapide pour démarrer.",
    onboardingStep2Title: "Uploadez une image de workout",
    onboardingStep2Desc: "Glissez-déposez une capture d'écran ou photo de votre entraînement vélo. Les formats JPEG, PNG et WebP jusqu'à 10 Mo sont acceptés.",
    onboardingStep3Title: "L'IA analyse votre workout",
    onboardingStep3Desc: "Notre IA lit l'image et extrait automatiquement chaque intervalle, puissance cible et durée. Vous pouvez ensuite vérifier et modifier le résultat.",
    onboardingStep4Title: "Exportez et importez",
    onboardingStep4Desc: "Téléchargez votre workout au format .zwo et importez-le directement dans Zwift, Intervals.icu ou TrainingPeaks.",
    onboardingSkip: "Passer",
    onboardingBack: "Retour",
    onboardingNext: "Suivant",
    onboardingGetStarted: "Commencer",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
