from http.server import BaseHTTPRequestHandler
from mailjet_rest import Client
import json
import os

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Lire le body de la requête
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body.decode('utf-8'))
            
            recipient_email = data.get('email')
            
            if not recipient_email:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Email manquant'}).encode())
                return
            
            # Configuration Mailjet
            MAILJET_API_KEY = os.getenv('MAILJET_API_KEY')
            MAILJET_API_SECRET = os.getenv('MAILJET_API_SECRET')
            SENDER_EMAIL = os.getenv('SENDER_EMAIL')
            SENDER_NAME = os.getenv('SENDER_NAME', 'Valentine')
            
            mailjet = Client(auth=(MAILJET_API_KEY, MAILJET_API_SECRET), version='v3.1')
            
            # URL de la vidéo
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
            
            if result.status_code == 200:
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': True, 'message': 'Email envoyé avec succès'}).encode())
            else:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Erreur lors de l\'envoi'}).encode())
                
        except Exception as e:
            print(f"Erreur: {str(e)}")
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def do_OPTIONS(self):
        # Handle CORS preflight
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
