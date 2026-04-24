
# DiffiScore

🚀 **DiffiScore**

**Link to the video demonstration:**  
[Watch Here](https://drive.google.com/file/d/1hWx_WvTkvIpeKIa7PS-7jWUYRLmyi13n/view?usp=drive_link)

---

##  Introduction
Welcome to **Diffiscore**, a powerful platform for uploading, storing, and searching questions efficiently. Whether you're a student, teacher, or researcher, Diffiscore makes it easy to manage question banks.

---

##  Key Features

### **Uploading Questions:**
- Users can add multiple images with the same tag at once, making it easy for a professor to create an exam on a specific topic.
- Users can delete images after selection if an incorrect image is uploaded.

### **Searching and Accessing Questions:**
- Retrieve saved questions by clicking **"Search Questions"**, entering the tag, and specifying the number of questions.
- View questions in an organized manner with an expandable view.
- Access questions uploaded by others for a collaborative experience.
- Download images directly to your local device.

---

## 🛠️ Tech Stack

-  **FastAPI** - Backend framework
-  **FAISS** - Image embeddings and similarity search
-  **Hugging Face** - Text and image embeddings
-  **PIL (Pillow)** - Image processing
-  **Uvicorn** - FastAPI server
-  **React.js** - Frontend framework
-  **Axios** - API communication
-  **Tailwind CSS** - Modern UI styling
-  **Vite** - Optimized frontend development
-  **FAISS Vector Store** - Embedding storage
-  **Local Storage** - Image storage

---

##  Installation & Setup

###  Prerequisites
-  **Python 3.13+**
-  **FAISS Index** for efficient similarity search
-  **Hugging Face Transformers** for text processing
-  **React.js** for frontend
-  **FastAPI** as the backend framework

###  Installation Steps

1. **Clone the repository and Go to the Diffi Directory:**
   ```bash
   git clone https://github.com/Tanay-sheth/Diffi.git
   cd Diffi
   ```
2. **Create and activate a virtual environment(do this one after the other):**
   ctrl+shift+p
   python select interpreter
   create virtual env
   venv
   select your global python interpreter
   select Diffi/requirements.txt to install the req package
   
4. **Install React component:**
   ```bash
   cd frontend
   npm install react-router-dom react-dropzone lucide-react framer-motion @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons
   ```
5. **Run the backend server:**
   ```bash
   cd ..
   cd backend
   uvicorn main:app --reload
   ```
6. **Run the Frontend (Open a new terminal by the side)**
   ```bash
   cd Diffi/frontend
   npm start
   ```
7. **Open the website and start using DiffiScore!**

---

## 📂 Directory Structure

```
DiffiScore/
├── backend/
│   ├── __pycache__/
│   ├── backend/
│   │   ├── faiss_index/
│   │   └── uploads/
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── node_modules/
│   ├── public/
│   │   ├── images/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── downloadImage.js
│   │   │   ├── ImageDropArea.js
│   │   │   ├── logout.js
│   │   │   ├── Navbar.js
│   │   │   ├── Search.js
│   │   │   └── Upload.js
│   │   ├── pages/
│   │   │   ├── HomePage.js
│   │   │   ├── SearchPage.js
│   │   │   └── UploadPage.js
│   │   ├── App.css
│   │   ├── App.js
│   │   ├── App.test.js
│   │   ├── index.css
│   │   └── index.js
│   ├── .gitignore
│   ├── package-lock.json
│   ├── package.json
│   └── README.md
```

---

##  References

-  **[FastAPI Documentation](https://fastapi.tiangolo.com/)**
-  **[React Documentation](https://react.dev/learn)**
