from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import numpy as np
from PIL import Image
import io
import logging

app = FastAPI()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this to the correct origin of your React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your pretrained model (modify the path as needed)
model = load_model("D:\\models\\mobileNet\\BZQ.keras")

# Define your class names if needed
class_names = ['Atelectasis', 'Cardiomegaly', 'Effusion', 'OtherClass']

def preprocess_image(img):
    logger.info("Starting image preprocessing")
    img = img.convert('L')  # Convert the image to grayscale
    img = img.resize((256, 256))  # Resize to match the model's expected input shape
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=-1)  # Add channel dimension (for grayscale image)
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    img = img / 255.0  # Normalize the image
    logger.info("Image preprocessing completed")
    return img


@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        logger.info(f"Received file: {file.filename}")
        img = Image.open(io.BytesIO(await file.read()))
        processed_img = preprocess_image(img)
        prediction = model.predict(processed_img)
        logger.info(f"Prediction raw output: {prediction}")

        # Create a dictionary with class names and their corresponding probabilities
        prediction_dict = {class_names[i]: float(prediction[0][i]) for i in range(len(class_names))}
        
        logger.info(f"Predicted probabilities: {prediction_dict}")
        return {"predictions": prediction_dict}
    except Exception as e:
        logger.error(f"Error processing the image: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
