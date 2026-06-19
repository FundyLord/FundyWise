from pathlib import Path
import sys

REPO_ROOT = Path(__file__).resolve().parents[2]

if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))

from fastapi import FastAPI
from app.db.database import engine
from app.api.groups import router as groups_router
from app.api.expenses import router as expenses_router
from app.api.settlement import router as settlement_router
from app.api.users import router as users_router

app = FastAPI(
    title="FundyWise API",
    version="1.0.0"
)

app.include_router(groups_router)
app.include_router(expenses_router)
app.include_router(settlement_router)
app.include_router(users_router)
@app.get("/health")
def health_check():
    return {"status": "healthy"}