from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image, UnidentifiedImageError
import io
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
import logging

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost", "http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load models
xray_model_path = r"C:\Users\DELL\Desktop\project\Models\Image Classification\best_model.keras"
disease_model_path = r"C:\Users\DELL\Desktop\project\Models\CNN Model\CNN-final-model.keras"

try:
    xray_model = load_model(xray_model_path)
    disease_model = load_model(disease_model_path)
    logger.info("Models loaded successfully")
except Exception as e:
    logger.error(f"Failed to load models: {e}")
    raise

# Class names
xray_class_names = ['Chest X-Ray', 'Random Image']
disease_class_names = ['Atelectasis', 'Cardiomegaly', 'Effusion', 'Normal']

def preprocess_image(image, model_type='xray'):
    if model_type == 'xray':
        image = image.convert('RGB')
        image = image.resize((150, 150))
    else:
        image = image.convert('L').resize((256, 256))
    image = img_to_array(image) / 255.0
    if model_type == 'disease':
        image = np.expand_dims(image, axis=(0, -1))
    else:
        image = np.expand_dims(image, axis=0)
    return image

@app.get("/")
async def root():
    return {"message": "Welcome to the X-ray and Disease Prediction Model"}

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        logger.info(f"Received file: {file.filename}")
        image = Image.open(io.BytesIO(await file.read()))
        
        # Step 1: Check if the image is an X-ray
        processed_image_xray = preprocess_image(image, model_type='xray')
        xray_prediction = xray_model.predict(processed_image_xray)
        xray_class = xray_class_names[int(np.round(xray_prediction)[0])]
        
        if xray_class == 'Chest X-Ray':
            # Step 2: Predict disease
            processed_image_disease = preprocess_image(image, model_type='disease')
            disease_prediction = disease_model.predict(processed_image_disease)
            disease_prediction_dict = {disease_class_names[i]: float(disease_prediction[0][i]) for i in range(len(disease_class_names))}
            
            # Find the highest prediction
            highest_prediction = max(disease_prediction_dict, key=disease_prediction_dict.get)
            
            # logger.info(f"Predicted class: {xray_class}, Disease predictions: {disease_prediction_dict}")
            return {
                "filename": file.filename,
                "predicted_class": xray_class,
                "disease_predictions": disease_prediction_dict,
                "highest_prediction": highest_prediction
            }
        else:
            logger.info(f"Predicted class: {xray_class} (Not a Chest X-Ray)")
            return {
                "filename": file.filename,
                "predicted_class": xray_class,
                "disease_predictions": "N/A",
                "highest_prediction": "N/A"
            }
    
    except UnidentifiedImageError:
        logger.error(f"Invalid image file: {file.filename}")
        raise HTTPException(status_code=400, detail="Invalid image file")
    except Exception as e:
        logger.error(f"Error processing file {file.filename}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)
