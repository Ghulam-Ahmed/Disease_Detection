import streamlit as st
from langchain_community.llms import Ollama
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
os.environ['OPENAI_API_KEY'] = os.getenv("OPENAI_API_KEY")

# Initialize the Ollama model with Gemma
llm = Ollama(model="gemma:2b")

# Streamlit UI
st.title("Langchain Server")

st.header("Essay Generator")
topic = st.text_input("Enter a topic for the essay:")
if st.button("Generate Essay"):
    if topic:
        essay = llm(prompt=topic, num_tokens=100)
        st.write(essay)