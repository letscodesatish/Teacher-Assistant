import httpx
import os
from typing import List, Dict, Any

class WhatsAppGateway:
    def __init__(self):
        self.instance_id = os.getenv("ULTRAMSG_INSTANCE_ID")
        self.token = os.getenv("ULTRAMSG_TOKEN")
        self.base_url = f"https://api.ultramsg.com/{self.instance_id}"

    async def send_document(self, group_id: str, document_url: str, filename: str, caption: str) -> Dict[str, Any]:
        """
        Sends a document to a WhatsApp group using UltraMsg API.
        """
        if not self.instance_id or not self.token:
            return {"error": "UltraMsg credentials are missing in the .env file."}

        url = f"{self.base_url}/messages/document"
        payload = {
            "token": self.token,
            "to": group_id,
            "filename": filename,
            "document": document_url,
            "caption": caption
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(url, data=payload)
                try:
                    return response.json()
                except ValueError:
                    return {"error": f"Invalid response from WhatsApp Gateway. Status: {response.status_code}, Body: {response.text}"}
        except Exception as e:
            return {"error": f"Failed to connect to WhatsApp Gateway: {str(e)}"}

    async def fetch_groups(self) -> List[Dict[str, Any]]:
        """
        Fetches all available WhatsApp groups from the gateway.
        """
        url = f"{self.base_url}/groups"
        params = {
            "token": self.token
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.get(url, params=params)
            if response.status_code == 200:
                return response.json()
            return []

# Singleton instance
whatsapp_gateway = WhatsAppGateway()
