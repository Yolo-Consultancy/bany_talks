# Guide de Configuration YouTube — Dany Talks

Ce guide vous explique en détail comment lier votre chaîne YouTube **Bany Talks** à votre site d'émission directement depuis le code ou vos fichiers d'environnement (`.env`), sans aucune trace de formulaires ou boutons de connexion sur l'interface publique de vos auditeurs.

---

## 🚀 Fonctionnement de la Synchronisation Automatique

Lors de l'affichage du site par vos visiteurs, l'application effectue l'enchaînement d'actions suivant en arrière-plan (silencieusement) :
1. **Résolution des identifiants** : Elle cherche d'abord des variables d'environnement (`.env`), puis les constantes de votre code (`src/services/youtube.ts`), et enfin le cache local de votre navigateur.
2. **Récupération des Émissions** :
   - **Sans Clé API Google Cloud** : Elle interroge gratuitement la passerelle de flux RSS de votre chaîne pour extraire directement vos 12 dernières vidéos publiées.
   - **Avec Clé API Google Cloud** : Elle demande les données enrichies (miniatures haute résolution, compte exact de vues, durée exacte) via l'API officielle YouTube Data v3.
3. **Mise à Jour Instantanée** : La grille d'émissions est remplie avec vos contenus réels sans aucune action requise de votre part ! Si aucun identifiant n'est renseigné, le site affiche les conversations locales par défaut (`src/data.ts`).

---

## 🛠️ Méthode 1 : Configuration directe dans le code (Recommandé)

C'est la méthode la plus rapide. Vous pouvez modifier directement deux constantes configurées dans votre dossier de services :

1. Ouvrez le fichier suivant depuis votre éditeur :
   `src/services/youtube.ts`

2. Localisez le bloc de configuration en haut du fichier (lignes 8 à 9) :
   ```typescript
   export const DEFAULT_YOUTUBE_CHANNEL_ID = ''; // Renseignez l'ID de chaîne ici (ex: 'UConX6A...')
   export const DEFAULT_YOUTUBE_API_KEY = '';    // Optionnel : Clé API Google Cloud YouTube
   ```

3. Modifiez-les avec vos véritables identifiants :
   * **ID de votre Chaîne** : Remplacez par votre identifiant de chaîne YouTube complet (il commence toujours par `UC`). Exemple : `export const DEFAULT_YOUTUBE_CHANNEL_ID = 'UCXm66hscv_pW-i7dCg0W1HA';`
   * **Clé API (Optionnelle)** : Si vous possédez une clé API Google Cloud Console avec le service "YouTube Data API v3" activé, vous pouvez la coller ici pour activer le comptage des vues en temps réel. Sinon, laissez-la vide (`""`).

4. Enregistrez le fichier. C'est tout ! Votre site est synchronisé.

---

## 🌐 Méthode 2 : Variables d'Environnement (Idéal pour la mise en production)

Si vous préférez séparer vos configurations techniques ou garder vos clés secrètes à l'écart du code source, vous pouvez utiliser des variables d'environnement.

1. Créez ou ouvrez le fichier `.env` ou `.env.local` à la racine de votre projet.
2. Définissez les variables d'environnement suivantes comme ceci :
   ```env
   # Identifiant unique de votre chaîne YouTube Bany (commençant par UC)
   VITE_YOUTUBE_CHANNEL_ID="UCXm66hscv_pW-i7dCg0W1HA"

   # Clé d'API YouTube Google Cloud Console (Laisser vide si vous utilisez le flux RSS gratuit)
   VITE_YOUTUBE_API_KEY="AIzaSyA1..."
   ```
3. Sauvegardez le fichier et redémarrez votre serveur de développement local (`npm run dev`). L'application détectera automatiquement ces variables et chargera vos vidéos au démarrage.

---

## 🔍 Comment obtenir vos identifiants ?

### 1. Trouver l'ID de votre Chaîne YouTube (ID commençant par `UC`)
* Connectez-vous sur YouTube et visitez la page d'accueil de votre chaîne **Bany Talks**.
* Regardez l'adresse URL de votre navigateur. Elle peut ressembler à : `https://www.youtube.com/channel/UCXm66hscv_pW-i7dCg0W1HA` -> Votre ID est `UCXm66hscv_pW-i7dCg0W1HA`.
* Si votre URL contient un pseudonyme personnalisé (comme `youtube.com/@bany_talks`), vous pouvez cliquer avec le bouton droit de la souris sur la page de votre chaîne, choisir **Afficher le code source de la page** et faire une recherche (`Ctrl+F` ou `Cmd+F`) sur `"externalId"`. L'identifiant situé juste après correspond à votre ID.
* Vous pouvez également utiliser un outil en ligne rapide et gratuit en copiant votre pseudonyme `@` sur un site comme [CommentObtenirIDYouTube](https://commentobteniridyoutube.com).

### 2. Créer une clé d'API Google Cloud YouTube (Optionnel)
Si vous souhaitez afficher le compteur de vues et la durée exacte de chaque vidéo de manière automatisée :
1. Créez un projet gratuit sur la console de développeur [Google Cloud Console](https://console.cloud.google.com).
2. Recherchez et activez le service **YouTube Data API v3** sur votre projet.
3. Allez dans l'onglet **Identifiants** (Credentials), cliquez sur **Créer des identifiants** puis sélectionnez **Clé d'API**.
4. Copiez cette clé et placez-la dans vos variables `.env` ou votre code `src/services/youtube.ts`.

---

## 🎨 Pourquoi le panneau a été retiré de l'interface ?
Suite à votre demande, nous avons retiré entièrement le panneau "Lier ma chaîne" et le badge d'état pour **garantir une interface propre et professionnelle sans encombres visuels**.
- Plus aucun bouton ni encadré de configuration technique n'est visible par vos visiteurs.
- Le flux de données est 100% automatisé, évitant ainsi d'exposer publiquement vos clés d'API ou d'obliger vos utilisateurs à voir des configurations de développement.
