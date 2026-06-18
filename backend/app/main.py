from fastapi import FastAPI
from app.db.database import engine


app = FastAPI(
    title="FundyWise API",
    version="1.0.0"
)

@app.get("/health")
def health_check():
    return {"status": "healthy"}