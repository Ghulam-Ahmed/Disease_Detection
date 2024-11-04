import warnings
from huggingface_hub import file_download

# Filter out the specific warning
warnings.filterwarnings("ignore", message="`resume_download` is deprecated.*", category=FutureWarning, module="huggingface_hub.file_download")

# Your existing code
# Loading the Vector Database
from langchain_community.embeddings import OllamaEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_community.llms import Ollama
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_core.prompts import ChatPromptTemplate
from langchain_huggingface import HuggingFaceEmbeddings  # Updated import

# Embedding # 02
persist_directory = "D:\\Uni Work\\FYP\\Integration\\chatbot\\AllMini-L6"
# vectorDB = Chroma(persist_directory=persist_directory, embedding_function=HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2"))
vectorDB = Chroma(persist_directory=persist_directory, embedding_function=OllamaEmbeddings(model="all-minilm:l6-v2"))

prompt = ChatPromptTemplate.from_template(
    template=("""
    You are a helpful assistant. You can answer questions about query.
    {context}

    Question:{input}
    """)
)

llm = Ollama(model="gemma:2b")

# prompt chain
doc_chain = create_stuff_documents_chain(llm, prompt)

# configures the vectorDB object to act as a retriever for finding similar items to a given query
retriever = vectorDB.as_retriever()

# combines the retriever and the document processing chain (doc_chain) into a single retrieval chain.
retrieval_chain = create_retrieval_chain(retriever, doc_chain)

# Function to get user input, process the query, and print the response
def query_retrieval_chain():
    while True:
        user_input = input("Enter your query (or type 'quit' to exit): ")
        if user_input.lower() == 'quit':
            break
        response = retrieval_chain.invoke({"input": user_input})
        print(response['answer'])

# Run the function to get user input and process the query
query_retrieval_chain()