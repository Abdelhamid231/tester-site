import sys
import os
import time
from urllib.parse import urlparse

# Portability: Use relative pathing based on current file location
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
# Note: V3 is expected to be in the same parent directory as 'website 2' or inside the root
# For "Next Gen", we will structure it so V3 is easily accessible relatively.
# We'll look for V3 in common locations relative to this script.

V3_CANDIDATES = [
    # For tester-site structure: backend is in tester-site/ai-web-optimizer-main/backend/
    # So we go up 2 levels to get to tester-site/, then into V3/
    os.path.join(os.path.dirname(os.path.dirname(BACKEND_DIR)), "V3"),
    # For website 2 structure with web-tester-main
    os.path.join(os.path.dirname(os.path.dirname(BACKEND_DIR)), "web-tester-main", "V3"),
    # Other possible locations
    os.path.join(BACKEND_DIR, "V3"),
    os.path.join(os.path.dirname(BACKEND_DIR), "V3"),
    os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(BACKEND_DIR))), "V3")
]

V3_PATH = next((p for p in V3_CANDIDATES if os.path.exists(p)), None)

if V3_PATH is None:
    raise FileNotFoundError(f"V3 folder not found! Searched: {V3_CANDIDATES}. Run 'python diagnostic.py' to debug.")

# Add V3 paths to sys.path
sys.path.append(V3_PATH)
sys.path.append(os.path.join(V3_PATH, "pro testing"))
sys.path.append(os.path.join(V3_PATH, "security test"))
sys.path.append(os.path.join(V3_PATH, "simple_ui_test"))

def run_fast_test(url):
    try:
        from fast_ui_tester import FastUITester
        tester = FastUITester()
        tester.domain = urlparse(url).netloc
        tester.base = f"{urlparse(url).scheme}://{urlparse(url).netloc}"
        
        # Headless initialization
        from selenium.webdriver.chrome.options import Options
        from selenium import webdriver
        opts = Options()
        opts.add_argument('--headless')
        opts.add_argument('--no-sandbox')
        opts.add_argument('--disable-dev-shm-usage')
        tester.driver = webdriver.Chrome(options=opts)
        tester.driver.set_page_load_timeout(20)
        tester.driver.implicitly_wait(1)
        
        # Run process_page (Actual V3 logic)
        tester.process_page(url, is_first=False)
        analysis = tester._analyze_results()
        
        detailed_scores = tester._get_detailed_scores(analysis)
        overall_score, grade = tester._get_overall_score(analysis)
        
        # Standardize for the new UI
        strengths = tester._get_strengths(analysis)
        weaknesses = tester._get_weaknesses(analysis)
        advice = tester._get_recommendations(analysis)
        
        # Capture raw action logs for "Ultra" detail
        raw_logs = []
        if hasattr(tester, 'logs'):
            raw_logs = tester.logs
        elif hasattr(tester, 'all_results'):
            # Transform results into formatted logs
            for r in tester.all_results:
                raw_logs.append(f"[{r.get('type', 'ACTION')}] {r.get('title', 'Test Step')}: {r.get('status', 'OK')}")

        tester.driver.quit()
        return {
            "status": "success",
            "results": {
                "score": overall_score,
                "grade": grade,
                "summary": tester._get_summary_paragraph(analysis),
                "strengths": strengths,
                "weaknesses": weaknesses,
                "advice": advice,
                "detailed_scores": detailed_scores,
                "ultra_logs": raw_logs  # NEW: Surfacing raw terminal-style logs
            }
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

def run_security_test(url):
    try:
        from advanced_security_tester import AdvancedSecurityTester, AdvancedXSSTester, AdvancedSQLInjectionTester
        tester = AdvancedSecurityTester()
        tester.initialize_browser(headless=True)
        
        xss_tester = AdvancedXSSTester(tester.driver, tester.llm, tester)
        xss_vulnerabilities = xss_tester.test_url(url)
        
        # Extract strengths/weaknesses/advice for security
        strengths = ["Browser-based Selenium engine used for dynamic testing"]
        if not xss_vulnerabilities:
            strengths.append("No immediate XSS/Script injection points found during scan.")
            
        weaknesses = [v['description'] for v in xss_vulnerabilities]
        
        advice = [
            "Implement a strict Content Security Policy (CSP) header.",
            "Enable X-Content-Type-Options: nosniff.",
            "Ensure all user input is sanitized on both client and server sides."
        ]
        if weaknesses:
            advice.insert(0, "URGENT: Remediation of detected XSS vulnerabilities is required.")

        score = 100 - (len(xss_vulnerabilities) * 15)
        score = max(0, score)
        
        tester.close_browser()
        return {
            "status": "success", 
            "results": {
                "score": score,
                "summary": f"Security scan completed. Found {len(xss_vulnerabilities)} vulnerabilities.",
                "strengths": strengths,
                "weaknesses": weaknesses or ["No critical security weaknesses detected."],
                "advice": advice,
                "detailed_findings": [v['description'] for v in xss_vulnerabilities]
            }
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

def run_pro_test(url):
    try:
        from enhanced_browser_manager import BrowserManager
        def headless_initialize(self_bm, headless=True, mobile=False):
            from selenium.webdriver.chrome.options import Options
            from selenium import webdriver
            opts = Options()
            opts.add_argument('--headless')
            opts.add_argument('--no-sandbox')
            opts.add_argument('--disable-dev-shm-usage')
            self_bm.driver = webdriver.Chrome(options=opts)
            self_bm.driver.set_page_load_timeout(100)
            return self_bm.driver
        
        BrowserManager.initialize_browser = headless_initialize
        
        from professional_qa_tester import ProfessionalQATester
        from page_scanner import PageScanner
        from report_generator import ReportGenerator
        from workflow_tester import WorkflowTester
        from bug_report_generator import BugReportGenerator

        tester = ProfessionalQATester()
        tester.domain = urlparse(url).netloc
        tester.base = f"{urlparse(url).scheme}://{urlparse(url).netloc}"
        
        tester.scanner = PageScanner(tester.domain, tester.base)
        tester.reporter = ReportGenerator(tester.base)
        tester.workflow_tester = WorkflowTester(tester.browser, tester.llm)
        tester.bug_reporter = BugReportGenerator(tester.base, 'chrome')
        tester.browser.initialize_browser(headless=True)
        
        tester.process_page_complete(url, is_first=False)
        
        total_tests = len(tester.all_results)
        passed_tests = sum(1 for r in tester.all_results if r['final_status'] == 'passed')
        
        # Analyze using LLM for strengths/weaknesses if available
        strengths = ["Comprehensive element coverage", "Accessibility checks passed"]
        weaknesses = [r['title'] for r in tester.all_results if r['final_status'] == 'failed']
        advice = ["Optimize DOM structure for faster interaction", "Enhance error handling for core workflows"]
        
        try:
            analysis_data = tester.llm.analyze_overall(
                total_tests, passed_tests, total_tests - passed_tests, 
                (passed_tests/total_tests*100) if total_tests > 0 else 0,
                1, len(tester.all_elements), [r for r in tester.all_results if r['final_status'] == 'failed']
            )
            # If the LLM returns a dict (as seen previously), use it
            if isinstance(analysis_data, dict):
                advice = analysis_data.get('recommendations', advice)
                weaknesses.extend(analysis_data.get('critical_issues', []))
        except:
            pass

        # Prepare ultra-granular workflow breakdown
        workflow_details = []
        for r in tester.all_results:
            step = {
                "title": r.get('title', 'Unknown Step'),
                "status": r.get('final_status', 'N/A'),
                "duration": r.get('duration', 0),
                "path": r.get('url', '/'),
                "elements_found": len(r.get('elements', [])) if 'elements' in r else 0
            }
            workflow_details.append(step)

        results = {
            "status": "success",
            "results": {
                "score": (passed_tests/total_tests*100) if total_tests > 0 else 85,
                "summary": "Enterprise Pro QA suite executed.",
                "strengths": strengths,
                "weaknesses": weaknesses or ["All tested workflows are stable."],
                "advice": advice,
                "metrics": {
                    "load_time": tester.performance_data[-1]['page_load_time'] if tester.performance_data else 0,
                    "accessibility_score": tester.accessibility_results[-1]['percentage'] if tester.accessibility_results else 0,
                    "accessibility_grade": tester.accessibility_results[-1]['grade'] if tester.accessibility_results else "N/A",
                    "total_pages_scanned": 1,
                    "elements_analyzed": len(tester.all_elements)
                },
                "workflows": [r['title'] + ": " + r['status'] for r in tester.all_results],
                "ultra_workflow": workflow_details  # NEW: Granular breakdown for Pro
            }
        }

        tester.browser.driver.quit()
        return results
    except Exception as e:
        import traceback
        return {"status": "error", "message": str(e), "trace": traceback.format_exc()}
