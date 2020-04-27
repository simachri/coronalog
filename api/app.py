import os

import uvicorn
from fastapi import FastAPI, Request
# from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

from firebase_admin import initialize_app

from routes.api import router as apiRouter
from routes.auth import router as authRouter

# Initialize Firestore DB
firebase_app = initialize_app()

app = FastAPI()

# app.add_middleware(HTTPSRedirectMiddleware)

app.include_router(
    apiRouter,
    prefix='/api'
)

app.include_router(
    authRouter,
    prefix='/auth'
)

port = os.environ['PORT']
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=int(port))