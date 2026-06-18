from fastapi import FastAPI
from app.db.database import engine
from app.api.groups import router as groups_router
from app.api.expenses import router as expenses_router


app = FastAPI(
    title="FundyWise API",
    version="1.0.0"
)

app.include_router(groups_router)
app.include_router(expenses_router)


@app.get("/health")
def health_check():
    return {"status": "healthy"}