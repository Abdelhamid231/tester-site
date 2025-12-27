import sys
import os

print("=" * 60)
print("AI WEB TESTER - DIAGNOSTIC CHECK")
print("=" * 60)
print()

# Check Python version
print(f"✓ Python Version: {sys.version}")
print()

# Check current directory
print(f"Current Directory: {os.getcwd()}")
print()

# Check backend directory
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
print(f"Backend Directory: {BACKEND_DIR}")
print()

# Check V3 candidates
V3_CANDIDATES = [
    os.path.join(os.path.dirname(os.path.dirname(BACKEND_DIR)), "web-tester-main", "V3"),
    os.path.join(BACKEND_DIR, "V3"),
    os.path.join(os.path.dirname(BACKEND_DIR), "V3"),
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(BACKEND_DIR))), "web-tester-main", "V3"),
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(BACKEND_DIR))), "V3")
]

print("Checking V3 Engine Locations:")
print("-" * 60)
v3_found = False
for i, path in enumerate(V3_CANDIDATES, 1):
    exists = os.path.exists(path)
    status = "✓ FOUND" if exists else "✗ NOT FOUND"
    print(f"{i}. {status}: {path}")
    if exists and not v3_found:
        v3_found = True
        V3_PATH = path
        print(f"   → Using this path!")

print()

if not v3_found:
    print("❌ ERROR: V3 folder not found in any expected location!")
    print()
    print("Expected structure:")
    print("  tester-site/")
    print("  ├── V3/                    ← V3 engines should be here")
    print("  │   ├── simple_ui_test/")
    print("  │   ├── security test/")
    print("  │   └── pro testing/")
    print("  └── ai-web-optimizer-main/")
    print("      └── backend/")
    print("          └── diagnostic.py  ← You are here")
    print()
    sys.exit(1)

# Check V3 subdirectories
print("Checking V3 Subdirectories:")
print("-" * 60)
required_dirs = ["simple_ui_test", "security test", "pro testing"]
all_found = True

for dir_name in required_dirs:
    dir_path = os.path.join(V3_PATH, dir_name)
    exists = os.path.exists(dir_path)
    status = "✓" if exists else "✗"
    print(f"{status} {dir_name}: {dir_path}")
    if not exists:
        all_found = False

print()

if not all_found:
    print("❌ ERROR: Some V3 subdirectories are missing!")
    sys.exit(1)

# Try importing the modules
print("Testing Module Imports:")
print("-" * 60)

sys.path.append(V3_PATH)
sys.path.append(os.path.join(V3_PATH, "pro testing"))
sys.path.append(os.path.join(V3_PATH, "security test"))
sys.path.append(os.path.join(V3_PATH, "simple_ui_test"))

modules_to_test = [
    ("fast_ui_tester", "FastUITester"),
    ("advanced_security_tester", "AdvancedSecurityTester"),
    ("professional_qa_tester", "ProfessionalQATester")
]

import_errors = []
for module_name, class_name in modules_to_test:
    try:
        module = __import__(module_name)
        cls = getattr(module, class_name)
        print(f"✓ {module_name}.{class_name}")
    except Exception as e:
        print(f"✗ {module_name}.{class_name} - ERROR: {str(e)}")
        import_errors.append((module_name, str(e)))

print()

if import_errors:
    print("❌ IMPORT ERRORS DETECTED:")
    for module, error in import_errors:
        print(f"  - {module}: {error}")
    print()
    print("Common fixes:")
    print("  1. Install missing dependencies: pip install -r requirements.txt")
    print("  2. Check that all V3 Python files are present")
    sys.exit(1)

# Check Selenium/Chrome
print("Checking Selenium & Chrome:")
print("-" * 60)
try:
    from selenium import webdriver
    from selenium.webdriver.chrome.options import Options
    print("✓ Selenium installed")
    
    # Try to create a headless Chrome instance
    opts = Options()
    opts.add_argument('--headless')
    opts.add_argument('--no-sandbox')
    opts.add_argument('--disable-dev-shm-usage')
    
    driver = webdriver.Chrome(options=opts)
    driver.quit()
    print("✓ Chrome/Chromium accessible")
except Exception as e:
    print(f"✗ Chrome/Selenium error: {str(e)}")
    print()
    print("Fix: Install Chrome or Chromium browser")
    sys.exit(1)

print()
print("=" * 60)
print("✅ ALL CHECKS PASSED - Backend should work correctly!")
print("=" * 60)
print()
print("Next steps:")
print("1. Start the backend: python main.py")
print("2. Start the frontend: npm run dev (from parent directory)")
print("3. Open http://localhost:5173 in your browser")
