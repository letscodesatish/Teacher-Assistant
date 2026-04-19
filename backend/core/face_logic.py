import numpy as np
try:
    from deepface import DeepFace
    DEEPFACE_AVAILABLE = True
except ImportError:
    print("Warning: DeepFace not found. Using mock face recognition.")
    DEEPFACE_AVAILABLE = False
import cv2
from typing import List, Dict, Optional
import json

class FaceManager:
    def __init__(self, model_name: str = "Facenet512"):
        self.model_name = model_name

    def get_embedding(self, img_bytes: bytes) -> Optional[List[float]]:
        """
        Generates a face embedding from raw image bytes.
        """
        if not DEEPFACE_AVAILABLE:
            # Return a consistent mock embedding for demo if no deepface
            return [0.5] * 512

        try:
            # Convert bytes to numpy array
            nparr = np.frombuffer(img_bytes, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            embedding_objs = DeepFace.represent(
                img_path=img, 
                model_name=self.model_name,
                enforce_detection=True,
                detector_backend='opencv'
            )
            return embedding_objs[0]["embedding"]
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return None

    def verify_faces(self, scan_embedding: List[float], student_embeddings: List[Dict], threshold: float = 0.4) -> Optional[int]:
        """
        Matches a scanned embedding against a list of student embeddings.
        student_embeddings: list of dicts like {'student_id': 1, 'embedding': [0.1, ...]}
        """
        best_match_id = None
        min_dist = float('inf')

        for record in student_embeddings:
            db_embedding = record['embedding']
            dist = self.calculate_distance(scan_embedding, db_embedding)
            if dist < threshold and dist < min_dist:
                min_dist = dist
                best_match_id = record['student_id']
        
        return best_match_id

    @staticmethod
    def calculate_distance(v1: List[float], v2: List[float]) -> float:
        v1, v2 = np.array(v1), np.array(v2)
        # Cosine distance
        return 1 - (np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)))
