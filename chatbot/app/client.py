import streamlit as st
import requests

def get_ollama_response(input_text):
    response = requests.post("http://localhost:8000/essay/invoke", json={'input':{'topic': input_text}})
    return response.json()['output']['content']

    st.title("Langchain demo with openai Gemma:2b APi CHains")
    input_text= st.text_input("Ask Me")
    

    if input_text:
        st.write(get_ollama_response(input_text))