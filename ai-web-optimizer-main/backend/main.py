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

# Add V3 paths to sys.path
V3_PATH = r"c:\Users\PCB DZ\Desktop\Djo\NIT\Modules\L3\S5\SE\Projects\1st project\web-tester-main\V3"
PRO_TESTING_PATH = os.path.join(V3_PATH, "pro testing")
SECURITY_TEST_PATH = os.path.join(V3_PATH, "security test")
FAST_UI_TEST_PATH = os.path.join(V3_PATH, "simple_ui_test")

sys.path.append(V3_PATH)
sys.path.append(PRO_TESTING_PATH)
sys.path.append(SECURITY_TEST_PATH)
sys.path.append(FAST_UI_TEST_PATH)

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
    result = run_pro_test(request.url)
    if result["status"] == "error":
        raise HTTPException(status_code=500, detail=result["message"])
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
