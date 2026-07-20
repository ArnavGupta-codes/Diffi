from langchain_community.vectorstores.faiss import FAISS
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
import uuid

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
db = FAISS.from_texts(["test"], embedding=embeddings, metadatas=[{"votes": 0}])
doc_id = list(db.docstore._dict.keys())[0]
print("Before:", db.docstore._dict[doc_id].metadata)
db.docstore._dict[doc_id].metadata["votes"] += 1
print("After:", db.docstore._dict[doc_id].metadata)
