# Déploiement unifié (Frontend + Backend)

## Structure du projet
```
app/
├── package.json           # Root package.json
├── vercel.json           # Config Vercel
├── api/                  # Backend (Vercel Serverless Functions)
│   ├── send-video.py
│   └── requirements.txt
├── frontend/             # React App
│   ├── package.json
│   ├── public/
│   └── src/
└── backend/              # Backend local pour dev (optionnel)
```

## Configuration Vercel

### 1. Variables d'environnement sur Vercel Dashboard

Va sur ton projet Vercel > Settings > Environment Variables et ajoute :

```
MAILJET_API_KEY=ta_mailjet_api_key
MAILJET_API_SECRET=ta_mailjet_secret_key
SENDER_EMAIL=ton@email.com
SENDER_NAME=Valentine
```

**Important** : Applique ces variables pour **Production**, **Preview** et **Development**

### 2. Déploiement

Le projet est configuré pour déployer automatiquement depuis GitHub. Quand tu push :

```bash
git add .
git commit -m "add email backend with serverless function"
git push origin main
```

Vercel va automatiquement :
1. Builder le frontend depuis `frontend/`
2. Créer la fonction serverless `/api/send-video` depuis `api/send-video.py`

### 3. Test local

**Frontend** :
```bash
cd frontend
yarn start
```

**Backend** :
```bash
cd backend
python send_email.py
```

Ajoute temporairement le proxy dans `frontend/package.json` pour le dev local :
```json
"proxy": "http://localhost:5000"
```

## URLs finales

- Frontend : `https://valentineswann.vercel.app`
- API : `https://valentineswann.vercel.app/api/send-video`

## Vérification Mailjet

Assure-toi que l'email expéditeur est vérifié dans Mailjet :
1. Va sur https://app.mailjet.com/
2. Account Settings > Sender Addresses
3. Vérifie ton email

C'est tout ! Le déploiement est unifié 🚀
