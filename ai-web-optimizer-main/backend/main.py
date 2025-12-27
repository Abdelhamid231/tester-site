from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import sys
import os
import io

# Ensure UTF-8 for stdout/stderr to handle emojis in V3 scripts
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
if sys.stderr.encoding != 'utf-8':
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

# Portability: Resolve V3 path relatively
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
V3_CANDIDATES = [
    # Primary candidate for tester-site: up 2 levels
    os.path.join(os.path.dirname(os.path.dirname(BACKEND_DIR)), "V3"),
    # Original web-tester structure
    os.path.join(os.path.dirname(os.path.dirname(BACKEND_DIR)), "web-tester-main", "V3"),
    os.path.join(BACKEND_DIR, "V3"),
    os.path.join(os.path.dirname(BACKEND_DIR), "V3"),
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(BACKEND_DIR))), "web-tester-main", "V3")
]
V3_PATH = next((p for p in V3_CANDIDATES if os.path.exists(p)), None)

if V3_PATH is None:
    print(f"ERROR: V3 folder not found! Searched: {V3_CANDIDATES}")
    print("Run 'python diagnostic.py' to debug.")
    sys.exit(1)

if V3_PATH is None:
    print(f"ERROR: V3 folder not found! Searched: {V3_CANDIDATES}")
    print("Run 'python diagnostic.py' to debug.")
    sys.exit(1)

sys.path.append(V3_PATH)
sys.path.append(os.path.join(V3_PATH, "pro testing"))
sys.path.append(os.path.join(V3_PATH, "security test"))
sys.path.append(os.path.join(V3_PATH, "simple_ui_test"))

from automation_wrapper import run_fast_test, run_security_test, run_pro_test

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalysisRequest(BaseModel):
    url: str
    bypass_auth: bool = True  # For Enterprise Pro
    screenshots: bool = True  # For Enterprise Pro
    crawl_mode: bool = False  # For Enterprise Pro (False = single page, True = crawl)

@app.get("/")
async def root():
    return {"status": "ok", "message": "AI Backend is running", "v3_path": V3_PATH}

@app.post("/analyze/initial")
async def analyze_initial(request: AnalysisRequest):
    return {"status": "success", "message": "Initial analysis is handled by primary service"}

@app.post("/analyze/fast")
async def analyze_fast(request: AnalysisRequest):
    result = run_fast_test(request.url)
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@app.post("/analyze/security")
async def analyze_security(request: AnalysisRequest):
    result = run_security_test(request.url)
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return result

@app.post("/analyze/pro")
async def analyze_pro(request: AnalysisRequest):
    result = run_pro_test(
        request.url,
        bypass_auth=request.bypass_auth,
        screenshots=request.screenshots,
        crawl_mode=request.crawl_mode
    )
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
