import os
import warnings
from fastapi import FastAPI
from pydantic import BaseModel
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import Ollama
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_core.prompts import ChatPromptTemplate
from fastapi.middleware.cors import CORSMiddleware

warnings.filterwarnings("ignore", message="resume_download is deprecated.*", category=FutureWarning, module="huggingface_hub.file_download")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Set the persist directory, defaulting if the environment variable is not set
persist_directory = os.getenv("CHROMA_PERSIST_DIR", "D:\\Uni Work\\FYP\\Integration\\chatbot\\AllMini-L6")
vectorDB = Chroma(persist_directory=persist_directory, embedding_function=OllamaEmbeddings(model="all-minilm:l6-v2"))

# Refined prompt to be more specific about lung diseases and symptoms
prompt = ChatPromptTemplate.from_template(
    template=("""\
    You are an assistant specialized in lung diseases and their symptoms. You must only answer questions related to lung diseases and their symptoms. 
    If the question is unrelated to lung health, respond with: "I'm specialized in lung diseases and can only provide information related to that."
    
    {context}

    Question: {input}
    """)
)

llm = Ollama(model="gemma:2b")

doc_chain = create_stuff_documents_chain(llm, prompt)

retriever = vectorDB.as_retriever()

retrieval_chain = create_retrieval_chain(retriever, doc_chain)

class Query(BaseModel):
    input: str

@app.get("/query/")
def read_root():
    return {"message": "This endpoint only supports POST requests."}

@app.post("/query/")
def process_query(query: Query):
    # Define greeting and thank you keywords
    greeting_keywords = ["hi", "hello", "hey", "how are you", "how do you do", "what's up"]
    thank_you_keywords = ["thank you", "thanks", "much appreciated", "ok thank you"]

    # Normalize the input
    input_text = query.input.lower().strip()

    # Check if the input is exactly a greeting or closely resembles one
    if input_text in greeting_keywords:
        response = {"answer": "Hello! How can I assist you with your lung health concerns today?"}
    elif input_text in thank_you_keywords:
        response = {"answer": "You're welcome! If you have any questions about lung health, feel free to ask."}
    else:
        # Check if the input is related to lung health
        lung_keywords = ["cough", "wheezing", "breathing", "lungs", "asthma", "emphysema", "pneumonia", "chest", "dyspnea", "cyanosis", "tachypnea", "pleural", "atelectasis", "cardiomegaly"]
        
        if any(keyword in input_text for keyword in lung_keywords):
            response = retrieval_chain.invoke({"input": query.input})
        else:
            response = {"answer": "I'm specialized in lung diseases and can only provide information related to that."}

    return {"answer": response['answer']}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
