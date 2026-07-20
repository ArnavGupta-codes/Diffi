import asyncio
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
with open("test.jpg", "rb") as f:
    response = client.post("/upload/", data={"tag": "test"}, files={"files": ("test.jpg", f, "image/jpeg")})
    print(response.status_code)
    print(response.text)
