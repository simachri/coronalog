import os

import uvicorn
from fastapi import FastAPI, Request, status, Response
from fastapi.responses import JSONResponse
# from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

from firebase_admin import initialize_app

from routes.api import router as apiRouter
from routes.auth import router as authRouter, generate_and_set_access_token
from auth.functions import authenticate_user_by_cookies, generate_error_dict
import errors
from jwt.exceptions import *

# Initialize Firestore DB
firebase_app = initialize_app()

app = FastAPI()

# app.add_middleware(HTTPSRedirectMiddleware)

# middleware to check for auth status on all /api routes
auth_routes = ['/api']
except_routes = ['/api/check', '/api/vendors']
@app.middleware('http')
async def check_auth_status(req: Request, call_next):
    cur_path = req.url.path
    # check if auth route is taken and no except route is taken
    if any( cur_path.startswith(p) for p in auth_routes ) and all( not cur_path.startswith(p) for p in except_routes ):
        try:
            user_id, user = authenticate_user_by_cookies(req.cookies)
            req.state.user_id = user_id
            req.state.username = user.username
        except (errors.UnverifiedRoleException) as err:
            print(err)
            return errors.NO_PERMISSION_RES()
        except (errors.InvalidAuthCookiesException, InvalidTokenError) as err:
            print(err)
            return errors.INVALID_TOKEN_RES()
        except Exception as err:
            print(err)
            return errors.SERVER_ERROR_RES()
    
    res: Response = await call_next(req)

    # if user needed to authenticate and status 200, issue new token
    if res.status_code == 200 and any( cur_path.startswith(p) for p in auth_routes ) and all( not cur_path.startswith(p) for p in except_routes ):
        generate_and_set_access_token(res, user_id, user)

    return res

@app.middleware('http')
async def beautify_server_errors(req: Request, call_next):
    res = await call_next(req)
    if res.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR:
        return errors.SERVER_ERROR_RES()
    else:
        return res

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