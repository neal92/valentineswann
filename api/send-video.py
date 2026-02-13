from flask import Flask, request, jsonify
from mailjet_rest import Client
import os

app = Flask(__name__)

# Configuration Mailjet depuis les variables d'environnement Vercel
MAILJET_API_KEY = os.getenv('MAILJET_API_KEY')
MAILJET_API_SECRET = os.getenv('MAILJET_API_SECRET')
SENDER_EMAIL = os.getenv('SENDER_EMAIL')
SENDER_NAME = os.getenv('SENDER_NAME', 'Valentine')

def send_video_email(recipient_email):
    mailjet = Client(auth=(MAILJET_API_KEY, MAILJET_API_SECRET), version='v3.1')
    
    # URL de la vidéo hébergée sur Vercel
    video_url = "https://valentineswann.vercel.app/images/copy_0D1D9C86-499D-48C7-9495-5668E08709C0.MOV"
    
    email_data = {
        'Messages': [
            {
                "From": {
                    "Email": SENDER_EMAIL,
                    "Name": SENDER_NAME
                },
                "To": [
                    {
                        "Email": recipient_email
                    }
                ],
                "Subject": "Ta vidéo spéciale de Saint-Valentin ❤️",
                "HTMLPart": f"""
                <html>
                    <body style="font-family: Arial, sans-serif; background-color: #fff1f2; padding: 20px;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 20px; padding: 40px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                            <h1 style="color: #be123c; text-align: center; font-size: 32px;">❤️ Félicitations !</h1>
                            <p style="color: #881337; font-size: 18px; text-align: center; margin: 20px 0;">
                                Tu as réussi le quiz ! Voici ta vidéo spéciale de Saint-Valentin.
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="{video_url}" 
                                   style="background: linear-gradient(to right, #f43f5e, #ec4899); 
                                          color: white; 
                                          padding: 15px 30px; 
                                          text-decoration: none; 
                                          border-radius: 50px; 
                                          font-size: 18px;
                                          display: inline-block;">
                                    📹 Voir la vidéo
                                </a>
                            </div>
                            <p style="color: #9f1239; font-size: 14px; text-align: center; margin-top: 30px;">
                                Avec tout mon amour ❤️
                            </p>
                        </div>
                    </body>
                </html>
                """
            }
        ]
    }
    
    result = mailjet.send.create(data=email_data)
    return result

# Handler pour Vercel Serverless
def handler(request):
    if request.method != 'POST':
        return jsonify({'error': 'Method not allowed'}), 405
    
    try:
        data = request.get_json()
        recipient_email = data.get('email')
        
        if not recipient_email:
            return jsonify({'error': 'Email manquant'}), 400
        
        result = send_video_email(recipient_email)
        
        if result.status_code == 200:
            return jsonify({'success': True, 'message': 'Email envoyé avec succès'}), 200
        else:
            return jsonify({'error': 'Erreur lors de l\'envoi de l\'email'}), 500
            
    except Exception as e:
        print(f"Erreur: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Pour le développement local
@app.route('/api/send-video', methods=['POST'])
def send_video():
    return handler(request)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
