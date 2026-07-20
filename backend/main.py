from fastapi import FastAPI, UploadFile, File, Form, Query
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from langchain_community.vectorstores.faiss import FAISS
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
import os
import shutil
import uuid
import time

app = FastAPI()

# Resolve paths relative to this file's directory so the server works
# regardless of where it's launched from (project root, backend/, etc.)
# uploads/ and faiss_index/ sit as siblings next to main.py
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
INDEX_PATH = os.path.join(BASE_DIR, "faiss_index")

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for local dev; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize FAISS & Embeddings
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")


def load_or_create_faiss():
    """Load existing FAISS index or create a fresh one.
    Auto-recovers from dimension mismatches by recreating the index."""
    if os.path.exists(INDEX_PATH):
        try:
            db = FAISS.load_local(INDEX_PATH, embeddings=embeddings, allow_dangerous_deserialization=True)
            # Verify dimensions match by doing a test embed
            test_vec = embeddings.embed_query("test")
            if db.index.d != len(test_vec):
                raise ValueError(f"Dimension mismatch: index={db.index.d}, model={len(test_vec)}")
            print(f"Loaded FAISS index from {INDEX_PATH} (dim={db.index.d}, count={db.index.ntotal})")
            return db
        except Exception as e:
            print(f"Failed to load FAISS index: {e}")
            print("Deleting corrupt index and creating a fresh one...")
            shutil.rmtree(INDEX_PATH, ignore_errors=True)

    # Create a fresh index
    db = FAISS.from_texts(["dummy"], embedding=embeddings)
    db.save_local(INDEX_PATH)
    print(f"Created fresh FAISS index at {INDEX_PATH}")
    return db


vector_db = load_or_create_faiss()


@app.get("/")
async def home():
    """Root endpoint to check if API is running."""
    return {"message": "Welcome to the Image Search API!!!"}


@app.get("/backend/uploads/{filename}", response_class=FileResponse,
         summary="Serve an uploaded image",
         description="Retrieve and serve an image stored in the uploads folder")
def serve_image(filename: str):
    """Serve the requested image."""
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    if not os.path.exists(file_path):
        return JSONResponse(content={"error": "File not found"}, status_code=404)
    return FileResponse(file_path)


@app.post("/upload/")
def upload_images(files: list[UploadFile] = File(...), tag: str = Form(...), answer: str = Form(None)):
    """Upload multiple images and store their vector representations with the same tag."""
    global vector_db
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

        print(f"File saved at: {file_path}")

        doc_id = str(uuid.uuid4())
        # Store metadata in FAISS
        metadata = {
            "tag": tag, 
            "image_path": filename,
            "id": doc_id,
            "votes": 0,
            "timestamp": time.time()
        }
        if answer:
            metadata["answer"] = answer

        try:
            vector_db.add_texts(
                texts=[tag],
                metadatas=[metadata],
                ids=[doc_id]
            )
        except Exception as e:
            print(f"FAISS add failed: {e}. Recreating index...")
            vector_db = load_or_create_faiss()
            vector_db.add_texts(
                texts=[tag],
                metadatas=[metadata],
                ids=[doc_id]
            )

        uploaded_files.append({
            "original_filename": file.filename,
            "saved_as": filename
        })

    # Save the updated vector database
    vector_db.save_local(INDEX_PATH)

    return {
        "message": f"{len(uploaded_files)} images uploaded successfully",
        "uploaded_files": uploaded_files,
        "tag": tag
    }

@app.post("/vote/{doc_id}")
def vote(doc_id: str, action: str = Query(...)):
    """Upvote or downvote an image."""
    global vector_db
    if doc_id not in vector_db.docstore._dict:
        return JSONResponse(content={"error": "Document not found"}, status_code=404)
        
    doc = vector_db.docstore._dict[doc_id]
    if action == "upvote":
        doc.metadata["votes"] = doc.metadata.get("votes", 0) + 1
    elif action == "downvote":
        doc.metadata["votes"] = doc.metadata.get("votes", 0) - 1
    else:
        return JSONResponse(content={"error": "Invalid action"}, status_code=400)
        
    vector_db.save_local(INDEX_PATH)
    return {"message": "Vote recorded", "votes": doc.metadata["votes"]}


@app.get("/search/")
def search_images(query: str = Query(...), top_k: int = 5, sort_by: str = Query("relevance")):
    """Retrieve images similar to a text query."""
    query_vector = embeddings.embed_query(query)
    
    # If sorting by something other than relevance, fetch more results to sort
    fetch_k = max(top_k * 3, 20) if sort_by != "relevance" else top_k + 1
    
    results_with_scores = vector_db.similarity_search_with_score_by_vector(query_vector, k=fetch_k)

    retrieved_metadata = []
    for r, score in results_with_scores:
        if "image_path" in r.metadata and score < 1.5:
            item = {
                "id": r.metadata.get("id"),
                "tag": r.metadata.get("tag", "Unknown"),
                "image_path": f"/backend/uploads/{os.path.basename(r.metadata['image_path'])}",
                "votes": r.metadata.get("votes", 0),
                "timestamp": r.metadata.get("timestamp", 0)
            }
            if "answer" in r.metadata:
                item["answer"] = r.metadata["answer"]
            retrieved_metadata.append(item)

    # Sort results
    if sort_by == "newest":
        retrieved_metadata.sort(key=lambda x: x.get("timestamp", 0), reverse=True)
    elif sort_by == "most_voted":
        retrieved_metadata.sort(key=lambda x: x.get("votes", 0), reverse=True)
        
    # Return top_k
    return {"query": query, "results": retrieved_metadata[:top_k]}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)