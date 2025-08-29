import torch
import torch.nn as nn
from torchvision.models import resnet50
import torchvision.transforms as transforms
from PIL import Image
import io

class DeepfakeDetector(nn.Module):
    def __init__(self):
        super(DeepfakeDetector, self).__init__()
        self.resnet = resnet50(weights=None)
        num_ftrs = self.resnet.fc.in_features
        self.resnet.fc = nn.Identity()
        self.classifier = nn.Sequential(
            nn.Linear(num_ftrs, 512),
            nn.ReLU(),
            nn.BatchNorm1d(512),
            nn.Dropout(0.3),
            nn.Linear(512, 1),
            nn.Sigmoid()
        )
        
    def forward(self, x):
        features = self.resnet(x)
        output = self.classifier(features)
        return output

class ModelLoader:
    def __init__(self, model_path: str):
        self.device = torch.device("cpu")
        self.model = self._load_model(model_path)
        self.transform = self._get_transform()

    def _load_model(self, model_path: str) -> DeepfakeDetector:
        model = DeepfakeDetector().to(self.device)
        model.load_state_dict(torch.load(model_path, map_location=self.device))
        model.eval()
        print("✅ AI Model loaded successfully.")
        return model

    def _get_transform(self):
        return transforms.Compose([
            transforms.Resize((256, 256)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])

    def predict(self, image_bytes: bytes) -> dict:
        image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
        image_tensor = self.transform(image).unsqueeze(0).to(self.device)
        
        with torch.no_grad():
            output = self.model(image_tensor)
            confidence = output.item()

        label = "Real" if confidence > 0.5 else "Fake"
        
        return {
            "label": label,
            "confidence_real": confidence,
            "confidence_fake": 1.0 - confidence
        }

detector = ModelLoader(model_path="models_weights/140K_resnet50_model.pth")