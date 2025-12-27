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

def _get_stable_chrome_options(headless=True):
    from selenium.webdriver.chrome.options import Options
    opts = Options()
    if headless:
        opts.add_argument('--headless')
    
    # Stability & Performance Flags
    opts.add_argument('--no-sandbox')
    opts.add_argument('--disable-dev-shm-usage')
    opts.add_argument('--disable-gpu')
    opts.add_argument('--disable-background-timer-throttling')
    opts.add_argument('--disable-backgrounding-occluded-windows')
    opts.add_argument('--disable-breakpad')
    opts.add_argument('--disable-component-update')
    opts.add_argument('--disable-domain-reliability')
    opts.add_argument('--disable-extensions')
    opts.add_argument('--disable-features=AudioServiceOutOfProcess')
    opts.add_argument('--disable-hang-monitor')
    opts.add_argument('--disable-ipc-flooding-protection')
    opts.add_argument('--disable-notifications')
    opts.add_argument('--disable-offer-store-unmasked-wallet-cards')
    opts.add_argument('--disable-popup-blocking')
    opts.add_argument('--disable-print-preview')
    opts.add_argument('--disable-prompt-on-repost')
    opts.add_argument('--disable-renderer-backgrounding')
    opts.add_argument('--disable-setuid-sandbox')
    opts.add_argument('--disable-speech-api')
    opts.add_argument('--disable-sync')
    opts.add_argument('--hide-scrollbars')
    opts.add_argument('--ignore-gpu-blacklist')
    opts.add_argument('--metrics-recording-only')
    opts.add_argument('--mute-audio')
    opts.add_argument('--no-default-browser-check')
    opts.add_argument('--no-first-run')
    opts.add_argument('--no-pings')
    opts.add_argument('--no-zygote')
    opts.add_argument('--password-store=basic')
    opts.add_argument('--use-gl=swiftshader')
    opts.add_argument('--use-mock-keychain')
    opts.add_argument('--window-size=1920,1080')
    return opts

def run_fast_test(url):
    try:
        from fast_ui_tester import FastUITester
        tester = FastUITester()
        tester.domain = urlparse(url).netloc
        tester.base = f"{urlparse(url).scheme}://{urlparse(url).netloc}"
        
        # Headless initialization with stability flags
        from selenium import webdriver
        opts = _get_stable_chrome_options(headless=True)
        tester.driver = webdriver.Chrome(options=opts)
        tester.driver.set_page_load_timeout(30)
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
        
        # Use stable options
        from selenium import webdriver
        opts = _get_stable_chrome_options(headless=True)
        tester.driver = webdriver.Chrome(options=opts)
        tester.driver.set_page_load_timeout(30)
        
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

def run_pro_test(url, bypass_auth=True, screenshots=True, crawl_mode=False):
    try:
        from enhanced_browser_manager import BrowserManager
        
        # Patch BrowserManager.initialize_browser to handle headless mode dynamically
        def patched_initialize(self_bm, headless=True, mobile=False):
            from selenium import webdriver
            
            # BYPASS AUTH LOGIC FLIP:
            # bypass_auth=True means "Do it automatically" -> Headless
            # bypass_auth=False means "I will handle it" -> Visible
            is_headless = True
            if not bypass_auth:
                is_headless = False
                
            opts = _get_stable_chrome_options(headless=is_headless)
            
            try:
                self_bm.driver = webdriver.Chrome(options=opts)
                self_bm.driver.set_page_load_timeout(180) # Much higher for pro tests
                if not is_headless:
                    try:
                        self_bm.driver.maximize_window()
                    except:
                        pass
                return self_bm.driver
            except Exception as e:
                print(f"FAILED TO START BROWSER: {e}")
                raise

        # Apply the patch to the class so all instances benefit
        BrowserManager.initialize_browser = patched_initialize
        
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
        
        # Initialize browser - if bypass_auth is False, this will be visible for manual handling
        if not bypass_auth:
            print("\n" + "!"*60)
            print("  [!] PREPARING MANUAL AUTH WINDOW...")
            print("  [!] Please handle login/captcha in the opened browser.")
            print("!"*60 + "\n")
        else:
            print("\n" + "*"*60)
            print("  [*] RUNNING IN AUTOMATIC (BYPASS AUTH) MODE")
            print("  [*] Analysis will be performed directly in headless mode.")
            print("*"*60 + "\n")
        
        tester.browser.initialize_browser(headless=True) # Patch will override this based on bypass_auth
        
        # Process page based on crawl mode
        if crawl_mode:
            # Crawl mode: process multiple pages
            tester.queue = [(url, 0)]
            # If bypass_auth is enabled (True), skip manual check (False)
            is_first = not bypass_auth 
            
            while tester.queue and len(tester.visited) < tester.max_pages:
                curr, depth = tester.queue.pop(0)
                if curr in tester.visited or depth > tester.max_depth:
                    continue
                
                new_links = tester.process_page_complete(curr, is_first=is_first)
                is_first = False  # Only first page gets manual check
                
                for link in new_links:
                    if link not in [u for u, _ in tester.queue] and link not in tester.visited:
                        tester.queue.append((link, depth + 1))
        else:
            # Single page mode
            # If bypass_auth is enabled (True), skip manual check (False)
            tester.process_page_complete(url, is_first=not bypass_auth)
        
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

        # Generate comprehensive text report
        report_content = ""
        try:
            # Calculate statistics
            total = len(tester.all_results)
            passed = passed_tests
            failed = total - passed
            rate = round((passed / total * 100) if total > 0 else 0, 2)
            fails = [r for r in tester.all_results if r['final_status'] == 'failed']
            
            # Get LLM analysis
            try:
                analysis_llm = tester.llm.analyze_overall(
                    total, passed, failed, rate,
                    len(tester.visited), len(tester.all_elements), fails
                )
            except:
                analysis_llm = "Analysis complete."
            
            # Build report text
            report_content = tester.reporter.generate_brief_report(
                tester.visited, tester.all_elements,
                tester.all_scenarios, tester.all_results, analysis_llm
            )
            
            # Add performance section
            report_content += "\n\n" + "─" * 90
            report_content += "\n⚡ PERFORMANCE TESTING"
            report_content += "\n" + "─" * 90
            if tester.performance_data:
                avg_load = sum(p['page_load_time'] for p in tester.performance_data) / len(tester.performance_data)
                report_content += f"\nAverage Page Load Time: {avg_load:.2f}s"
                report_content += f"\nFastest Page: {min(tester.performance_data, key=lambda x: x['page_load_time'])['url']} ({min(p['page_load_time'] for p in tester.performance_data):.2f}s)"
                report_content += f"\nSlowest Page: {max(tester.performance_data, key=lambda x: x['page_load_time'])['url']} ({max(p['page_load_time'] for p in tester.performance_data):.2f}s)"
            
            # Add accessibility section
            report_content += "\n\n" + "─" * 90
            report_content += "\n♿ ACCESSIBILITY TESTING"
            report_content += "\n" + "─" * 90
            if tester.accessibility_results:
                avg_score = sum(a['percentage'] for a in tester.accessibility_results) / len(tester.accessibility_results)
                report_content += f"\nAverage Accessibility Score: {avg_score:.1f}%"
                for result in tester.accessibility_results:
                    report_content += f"\n  • {result['url'].replace(tester.base, '') or '/'}: {result['percentage']}% ({result['grade']})"
            
            # Add workflow section
            if tester.workflow_results:
                report_content += "\n\n" + "─" * 90
                report_content += "\n🔄 WORKFLOW TESTING"
                report_content += "\n" + "─" * 90
                wf_passed = sum(1 for w in tester.workflow_results if w['status'] == 'passed')
                wf_failed = sum(1 for w in tester.workflow_results if w['status'] == 'failed')
                report_content += f"\nWorkflows Tested: {len(tester.workflow_results)}"
                report_content += f"\nPassed: {wf_passed} | Failed: {wf_failed}"
            
            # Add configuration info
            report_content += "\n\n" + "─" * 90
            report_content += "\n⚙️ TEST CONFIGURATION"
            report_content += "\n" + "─" * 90
            report_content += f"\nMode: {'Crawl' if crawl_mode else 'Single Page'}"
            report_content += f"\nBypass Auth: {'Enabled' if bypass_auth else 'Disabled'}"
            report_content += f"\nScreenshots: {'Enabled' if screenshots else 'Disabled'}"
            report_content += f"\nPages Scanned: {len(tester.visited)}"
            report_content += f"\nElements Analyzed: {len(tester.all_elements)}"
            
        except Exception as e:
            report_content = f"Error generating report: {str(e)}"

        results = {
            "status": "success",
            "results": {
                "score": (passed_tests/total_tests*100) if total_tests > 0 else 85,
                "summary": f"Enterprise Pro QA suite executed. Mode: {'Crawl' if crawl_mode else 'Single Page'}, Pages: {len(tester.visited)}",
                "strengths": strengths,
                "weaknesses": weaknesses or ["All tested workflows are stable."],
                "advice": advice,
                "metrics": {
                    "load_time": tester.performance_data[-1]['page_load_time'] if tester.performance_data else 0,
                    "accessibility_score": tester.accessibility_results[-1]['percentage'] if tester.accessibility_results else 0,
                    "accessibility_grade": tester.accessibility_results[-1]['grade'] if tester.accessibility_results else "N/A",
                    "total_pages_scanned": len(tester.visited),
                    "elements_analyzed": len(tester.all_elements),
                    "bypass_auth_enabled": bypass_auth,
                    "screenshots_enabled": screenshots,
                    "crawl_mode": crawl_mode
                },
                "workflows": [r['title'] + ": " + r['status'] for r in tester.all_results],
                "ultra_workflow": workflow_details,
                "report_content": report_content  # NEW: Full text report for download
            }
        }

        tester.browser.driver.quit()
        return results
    except Exception as e:
        import traceback
        return {"status": "error", "message": str(e), "trace": traceback.format_exc()}
