from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import cards, merchants, wallet, spending, recommendation, rewards, simulation

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Credit Card Recommendation & Optimization Platform MVP Backend API",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc"
)

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(cards.router, prefix=settings.API_V1_STR)
app.include_router(merchants.router, prefix=settings.API_V1_STR)
app.include_router(wallet.router, prefix=settings.API_V1_STR)
app.include_router(spending.router, prefix=settings.API_V1_STR)
app.include_router(recommendation.router, prefix=settings.API_V1_STR)
app.include_router(rewards.router, prefix=settings.API_V1_STR)
app.include_router(simulation.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "documentation": f"{settings.API_V1_STR}/docs"
    }
