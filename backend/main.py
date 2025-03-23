from fastapi import FastAPI, UploadFile, File, Form, Query
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.vectorstores.faiss import FAISS
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
import os
import shutil
import uuid

app = FastAPI()

# Define upload folder path
UPLOAD_FOLDER = "backend/uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure the directory exists

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to restrict access if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize FAISS & Embeddings
embeddings = HuggingFaceEmbeddings(model_name="thenlper/gte-large")
index_path = "backend/faiss_index"

# Load or create FAISS index
if os.path.exists(index_path):
    vector_db = FAISS.load_local(index_path, embeddings=embeddings, allow_dangerous_deserialization=True)
else:
    vector_db = FAISS.from_texts(["dummy"], embedding=embeddings)
    vector_db.save_local(index_path)

@app.get("/")
async def home():
    """Root endpoint to check if API is running."""
    return {"message": "Welcome to the Image Search API!!!"}

@app.get("/backend/uploads/{filename}", response_class=FileResponse, summary="Serve an uploaded image", description="Retrieve and serve an image stored in the backend/uploads folder")
def serve_image(filename: str):
    """Serve the requested image."""
    try:
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        return FileResponse(file_path)
    except FileNotFoundError:
        return JSONResponse(content={"error": "File not found"}, status_code=404)

@app.post("/upload/")
async def upload_images(files: list[UploadFile] = File(...), tag: str = Form(...)):
    """Upload multiple images and store their vector representations with the same tag."""
    uploaded_files = []
    
    for file in files:
        file_extension = file.filename.split(".")[-1].lower()
        if file_extension not in ["png", "jpg", "jpeg"]:
            continue  # Skip invalid files
            
        # Generate unique filename and save file in uploads folder
        filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        print(f"File saved at: {file_path}")  # Debugging print
        
        # Store metadata in FAISS
        vector_db.add_texts(
            texts=[tag],
            metadatas=[{"tag": tag, "image_path": filename}],  # Save only filename
            ids=[str(uuid.uuid4())]
        )
        
        uploaded_files.append({
            "original_filename": file.filename,
            "saved_as": filename
        })
    
    # Save the updated vector database
    vector_db.save_local(index_path)
    
    return {
        "message": f"{len(uploaded_files)} images uploaded successfully",
        "uploaded_files": uploaded_files,
        "tag": tag
    }

@app.get("/search/")
async def search_images(query: str = Query(...), top_k: int = 2):
    """Retrieve images similar to a text query."""
    query_vector = embeddings.embed_query(query)  # Generate query embedding
    results = vector_db.similarity_search_by_vector(query_vector, k=top_k)

    retrieved_metadata = [
        {
            "tag": r.metadata["tag"],
            "image_path": f"/backend/uploads/{os.path.basename(r.metadata['image_path'])}"  # Ensure correct path
        }
        for r in results
    ]

    return {"query": query, "results": retrieved_metadata}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)   