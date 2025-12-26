"""
Lightning Fast UI Tester
Perfected version - more accurate, robust, and faster
"""
from urllib.parse import urlparse
import time
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.common.exceptions import TimeoutException, NoSuchElementException, InvalidElementStateException, ElementNotInteractableException
import json


class FastUITester:
    def __init__(self):
        self.driver = None
        self.visited = set()
        self.all_elements = []
        self.all_results = []
        self.domain = None
        self.base = None
        
    def initialize_browser(self):
        """Quickly initialize browser with minimal options for speed"""
        opts = Options()
        opts.add_argument('--no-sandbox')
        opts.add_argument('--disable-dev-shm-usage')
        opts.add_argument('--disable-blink-features=AutomationControlled')
        opts.add_argument('--disable-images')  # Faster: Skip image loading
        opts.add_argument('--disable-gpu')     # Speed up in headless-like mode
        opts.add_experimental_option('excludeSwitches', ['enable-logging'])
        self.driver = webdriver.Chrome(options=opts)
        self.driver.set_page_load_timeout(20)  # Reduced from 30 for speed
        self.driver.implicitly_wait(1)         # Shorter implicit wait
        self.driver.maximize_window()
    
    def scan_page(self, url):
        """Quickly scan page for testable elements - improved detection"""
        elements = []
        selectors = [
            ('input', 'input'),
            ('textarea', 'textarea'),
            ('select', 'select'),
            ('button', 'button'),
            ('a[href]', 'link')
        ]
        
        for selector, etype in selectors:
            try:
                for elem in self.driver.find_elements(By.CSS_SELECTOR, selector):
                    try:
                        if not elem.is_displayed() or not elem.is_enabled():
                            continue
                        
                        info = {
                            'type': etype,
                            'tag': elem.tag_name,
                            'selector': self._get_selector(elem),
                            'name': elem.get_attribute('name') or '',
                            'id': elem.get_attribute('id') or '',
                            'text': (elem.text or '').strip()[:50],
                            'page_url': url
                        }
                        
                        if etype == 'input':
                            info['input_type'] = elem.get_attribute('type') or 'text'
                            info['placeholder'] = elem.get_attribute('placeholder') or ''
                            info['readonly'] = bool(elem.get_attribute('readonly'))
                        elif etype == 'link':
                            info['href'] = elem.get_attribute('href') or ''
                        
                        if info['selector']:
                            elements.append(info)
                    except:
                        continue
            except:
                continue
        
        return elements
    
    def _get_selector(self, elem):
        """Generate more robust CSS selector"""
        try:
            # Prefer ID
            elem_id = elem.get_attribute('id')
            if elem_id:
                return f"#{elem_id}"
            
            # Then name
            elem_name = elem.get_attribute('name')
            if elem_name:
                return f"{elem.tag_name}[name='{elem_name}']"
            
            # Then class if unique
            elem_class = elem.get_attribute('class').strip().replace(' ', '.') if elem.get_attribute('class') else ''
            if elem_class:
                return f"{elem.tag_name}.{elem_class}"
            
            # Fallback to tag (less reliable, but fast)
            return elem.tag_name
        except:
            return None
    
    def generate_fast_scenarios(self, element):
        """Generate test scenarios using improved rules (NO LLM - instant)"""
        scenarios = []
        etype = element['type']
        selector = element['selector']
        elem_id = f"TEST_{len(self.all_results) + len(scenarios) + 1:04d}"
        
        if etype == 'input':
            input_type = element.get('input_type', 'text')
            if input_type in ['submit', 'button', 'reset']:  # Treat as buttons
                scenarios.append({
                    'scenario_id': f"{elem_id}_1",
                    'title': f"Click input button: {element.get('name', 'input')}",
                    'type': 'functional',
                    'action': 'click',
                    'selector': selector,
                    'test_data': ''
                })
            elif input_type in ['checkbox', 'radio']:
                scenarios.append({
                    'scenario_id': f"{elem_id}_1",
                    'title': f"Toggle {input_type}: {element.get('name', 'field')}",
                    'type': 'functional',
                    'action': 'check',
                    'selector': selector,
                    'test_data': ''
                })
            elif not element.get('readonly', False):
                # Valid input test
                scenarios.append({
                    'scenario_id': f"{elem_id}_1",
                    'title': f"Valid input test: {element.get('name', 'field')}",
                    'type': 'functional',
                    'action': 'fill',
                    'selector': selector,
                    'test_data': self._get_test_data(input_type, valid=True)
                })
                
                # Empty input test
                scenarios.append({
                    'scenario_id': f"{elem_id}_2",
                    'title': f"Empty input test: {element.get('name', 'field')}",
                    'type': 'negative',
                    'action': 'fill',
                    'selector': selector,
                    'test_data': ''
                })
                
                # Invalid input test (for specific types)
                if input_type in ['email', 'number', 'url']:
                    scenarios.append({
                        'scenario_id': f"{elem_id}_3",
                        'title': f"Invalid {input_type} test: {element.get('name', 'field')}",
                        'type': 'negative',
                        'action': 'fill',
                        'selector': selector,
                        'test_data': self._get_test_data(input_type, valid=False)
                    })
        
        elif etype == 'textarea':
            scenarios.append({
                'scenario_id': f"{elem_id}_1",
                'title': f"Valid textarea input: {element.get('name', 'field')}",
                'type': 'functional',
                'action': 'fill',
                'selector': selector,
                'test_data': 'Test text area content'
            })
        
        elif etype == 'select':
            scenarios.append({
                'scenario_id': f"{elem_id}_1",
                'title': f"Select dropdown: {element.get('name', 'select')}",
                'type': 'functional',
                'action': 'select',
                'selector': selector,
                'test_data': ''
            })
        
        elif etype == 'button':
            scenarios.append({
                'scenario_id': f"{elem_id}_1",
                'title': f"Click button: {element.get('text', 'button')[:30]}",
                'type': 'functional',
                'action': 'click',
                'selector': selector,
                'test_data': ''
            })
        
        elif etype == 'link':
            scenarios.append({
                'scenario_id': f"{elem_id}_1",
                'title': f"Click link: {element.get('text', 'link')[:30]}",
                'type': 'functional',
                'action': 'click',
                'selector': selector,
                'test_data': ''
            })
        
        return scenarios
    
    def _get_test_data(self, input_type, valid=True):
        """Get appropriate test data for input type - improved"""
        if not valid:
            invalid_data = {
                'email': 'invalid_email',
                'number': 'abc',
                'url': 'invalid_url',
                'tel': 'abc',
            }
            return invalid_data.get(input_type, 'invalid_data')
        
        valid_data = {
            'text': 'Test Input',
            'email': 'test@example.com',
            'password': 'TestPass123!',
            'number': '123',
            'tel': '1234567890',
            'url': 'https://example.com',
            'search': 'test query',
            'date': '2024-01-01',
            'color': '#ff0000'
        }
        return valid_data.get(input_type, 'Test Data')
    
    def execute_test(self, scenario, url):
        """Execute test quickly - with better error handling"""
        result = {
            'scenario_id': scenario['scenario_id'],
            'title': scenario['title'],
            'type': scenario['type'],
            'status': 'passed',
            'error': None,
            'execution_time': 0,
            'page_url': url
        }
        
        start = time.time()
        
        try:
            wait = WebDriverWait(self.driver, 2)  # Shorter timeout for speed
            elem = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, scenario['selector'])))
            
            # Scroll into view quickly
            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center', behavior: 'instant'});", elem)
            
            action = scenario['action']
            if action == 'click':
                elem = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, scenario['selector'])))
                elem.click()
            elif action == 'fill':
                elem.clear()
                elem.send_keys(scenario['test_data'])
            elif action == 'check':
                if not elem.is_selected():
                    elem.click()
            elif action == 'select':
                select_obj = Select(elem)
                if select_obj.options:
                    select_obj.select_by_index(min(1, len(select_obj.options) - 1))  # Safer index
                else:
                    raise Exception("No options in select")
            
            result['status'] = 'passed'
            
        except (TimeoutException, NoSuchElementException) as e:
            result['status'] = 'failed'
            result['error'] = "Element not found or timeout"
        except (InvalidElementStateException, ElementNotInteractableException) as e:
            result['status'] = 'failed'
            result['error'] = "Element not interactable"
        except Exception as e:
            result['status'] = 'failed'
            result['error'] = str(e)[:100]
        
        result['execution_time'] = round(time.time() - start, 2)
        return result
    
    def process_page(self, url, is_first=False):
        """Process page quickly - optimized"""
        print(f"\n{'='*60}")
        print(f"📄 Testing: {url}")
        print(f"{'='*60}")
        
        try:
            # Load page
            self.driver.get(url)
            time.sleep(0.2)  # Reduced minimal wait
            
            if is_first:
                print("  ⚠️  Handle cookies/login if needed, then press Enter...")
                input()
            
            self.visited.add(url)
            
            # Scan elements
            print("  🔍 Scanning elements...", end='', flush=True)
            elements = self.scan_page(url)
            print(f" Found {len(elements)}")
            
            if not elements:
                return []
            
            self.all_elements.extend(elements)
            
            # Generate scenarios instantly
            print("  🧪 Generating test scenarios...", end='', flush=True)
            all_scenarios = []
            for elem in elements:
                scenarios = self.generate_fast_scenarios(elem)
                all_scenarios.extend(scenarios)
            print(f" {len(all_scenarios)} scenarios")
            
            # Execute tests quickly
            print(f"  🚀 Executing {len(all_scenarios)} tests...")
            page_results = []
            
            for idx, scenario in enumerate(all_scenarios, 1):
                # Only reload if needed
                if self.driver.current_url != url:
                    self.driver.get(url)
                    time.sleep(0.1)  # Even shorter
            
                result = self.execute_test(scenario, url)
                page_results.append(result)
                self.all_results.append(result)
                
                status = "✓" if result['status'] == 'passed' else "✗"
                print(f"    [{idx}/{len(all_scenarios)}] {status} {scenario['title'][:50]}")
            
            passed = sum(1 for r in page_results if r['status'] == 'passed')
            failed = sum(1 for r in page_results if r['status'] == 'failed')
            print(f"  📊 Results: {passed} passed, {failed} failed")
            
            # Get links for crawling - faster fetching
            links = []
            if len(self.visited) < 10:
                try:
                    anchors = self.driver.find_elements(By.TAG_NAME, 'a')
                    for anchor in anchors[:50]:  # Limit to first 50 to speed up
                        href = anchor.get_attribute('href')
                        if href:
                            parsed = urlparse(href)
                            if parsed.netloc == self.domain and href not in self.visited:
                                links.append(href)
                except:
                    pass
            
            return list(set(links))[:5]
            
        except Exception as e:
            print(f"  ✗ Error: {str(e)[:100]}")
            self.visited.add(url)
            return []
    
    def _analyze_results(self):
        """Analyze test results to identify patterns and insights"""
        total = len(self.all_results)
        passed = [r for r in self.all_results if r['status'] == 'passed']
        failed = [r for r in self.all_results if r['status'] == 'failed']
        
        # Group by type
        by_type = {}
        for r in self.all_results:
            t = r.get('type', 'unknown')
            by_type[t] = by_type.get(t, {'passed': 0, 'failed': 0, 'total': 0})
            by_type[t]['total'] += 1
            if r['status'] == 'passed':
                by_type[t]['passed'] += 1
            else:
                by_type[t]['failed'] += 1
        
        # Group by page
        by_page = {}
        for r in self.all_results:
            page = r['page_url'].replace(self.base, '') or '/'
            by_page[page] = by_page.get(page, {'passed': 0, 'failed': 0, 'total': 0})
            by_page[page]['total'] += 1
            if r['status'] == 'passed':
                by_page[page]['passed'] += 1
            else:
                by_page[page]['failed'] += 1
        
        # Analyze error patterns - more categories
        error_patterns = {}
        for f in failed:
            error = f.get('error', 'Unknown error').lower()
            if 'not found' in error or 'element not found' in error:
                error_type = 'Element Not Found'
            elif 'timeout' in error:
                error_type = 'Timeout'
            elif 'not interactable' in error or 'not clickable' in error:
                error_type = 'Element Not Interactable'
            elif 'invalid element state' in error:
                error_type = 'Invalid Element State'
            else:
                error_type = 'Other Error'
            
            error_patterns[error_type] = error_patterns.get(error_type, 0) + 1
        
        # Analyze element types
        elements_by_type = {}
        for elem in self.all_elements:
            etype = elem.get('type', 'unknown')
            elements_by_type[etype] = elements_by_type.get(etype, 0) + 1
        
        return {
            'total': total,
            'passed': len(passed),
            'failed': len(failed),
            'pass_rate': round((len(passed) / total * 100) if total > 0 else 0, 1),
            'by_type': by_type,
            'by_page': by_page,
            'error_patterns': error_patterns,
            'elements_by_type': elements_by_type
        }
    
    def _get_overall_score(self, analysis):
        """Calculate overall score and grade"""
        pass_rate = analysis['pass_rate']
        
        if pass_rate >= 90:
            grade = 'A (Excellent)'
            score = '90-100%'
        elif pass_rate >= 80:
            grade = 'B (Good)'
            score = '80-89%'
        elif pass_rate >= 70:
            grade = 'C (Fair)'
            score = '70-79%'
        elif pass_rate >= 60:
            grade = 'D (Poor)'
            score = '60-69%'
        else:
            grade = 'F (Needs Significant Improvement)'
            score = '<60%'
        
        return score, grade
    
    def _get_summary_paragraph(self, analysis):
        """Generate small summary paragraph about the website"""
        pass_rate = analysis['pass_rate']
        total_pages = len(self.visited)
        total_elements = sum(analysis['elements_by_type'].values())
        failed = analysis['failed']
        
        summary = f"The tested website shows a pass rate of {pass_rate}%, with {total_elements} elements across {total_pages} page(s). "
        
        if failed == 0:
            summary += "No failures were detected, indicating strong UI stability. "
        elif failed < 5:
            summary += f"With only {failed} failures, the site demonstrates good overall functionality but could benefit from minor tweaks. "
        else:
            summary += f"However, {failed} failures suggest areas needing attention to improve user experience. "
        
        if analysis['error_patterns']:
            top_error = max(analysis['error_patterns'], key=analysis['error_patterns'].get)
            summary += f"The most common issue is '{top_error}', which may point to systematic problems in element visibility or interactivity."
        else:
            summary += "No recurring error patterns were identified."
        
        return summary
    
    def _get_strengths(self, analysis):
        """Identify website strengths"""
        strengths = []
        
        if analysis['pass_rate'] >= 90:
            strengths.append("Excellent overall functionality with high pass rate")
        elif analysis['pass_rate'] >= 75:
            strengths.append("Good core functionality across most elements")
        
        # Pages with high pass rate
        good_pages = [p for p, stats in analysis['by_page'].items() 
                      if stats['total'] > 0 and (stats['passed'] / stats['total']) >= 0.9]
        if good_pages:
            strengths.append(f"{len(good_pages)} page(s) with excellent performance (90%+ pass rate): {', '.join(good_pages[:3])}")
        
        # Element types with high pass rate
        for etype, stats in analysis['by_type'].items():
            if stats['total'] > 0:
                type_rate = (stats['passed'] / stats['total'])
                if type_rate >= 0.9:
                    strengths.append(f"Strong {etype} elements ({round(type_rate * 100)}% pass rate)")
        
        # Low error count
        if analysis['failed'] == 0:
            strengths.append("No detected failures - robust UI implementation")
        elif analysis['failed'] < 5:
            strengths.append("Minimal failures - stable user interface")
        
        # Good element coverage
        if sum(analysis['elements_by_type'].values()) >= 20:
            strengths.append("Comprehensive interactive elements handling")
        
        if not strengths:
            strengths.append("Basic functionality is present")
        
        return strengths
    
    def _get_weaknesses(self, analysis):
        """Identify website weaknesses"""
        weaknesses = []
        
        if analysis['pass_rate'] < 50:
            weaknesses.append("Low overall functionality - major UI issues detected")
        elif analysis['pass_rate'] < 75:
            weaknesses.append("Moderate functionality - several areas need improvement")
        
        # Pages with low pass rate
        poor_pages = [p for p, stats in analysis['by_page'].items() 
                      if stats['total'] > 0 and (stats['passed'] / stats['total']) < 0.7]
        if poor_pages:
            weaknesses.append(f"{len(poor_pages)} page(s) with poor performance (<70% pass rate)")
        
        # Element types with low pass rate
        for etype, stats in analysis['by_type'].items():
            if stats['total'] > 0:
                type_rate = (stats['passed'] / stats['total'])
                if type_rate < 0.7:
                    weaknesses.append(f"Weak {etype} elements ({round(type_rate * 100)}% pass rate - potential interactivity issues)")
        
        # Common error patterns
        if analysis['error_patterns']:
            for error_type, count in sorted(analysis['error_patterns'].items(), key=lambda x: x[1], reverse=True):
                if count > 0:
                    weaknesses.append(f"{error_type}: {count} occurrences - indicates systematic problems")
        
        if not weaknesses:
            weaknesses.append("No major weaknesses identified")
        
        return weaknesses
    
    def _get_recommendations(self, analysis):
        """Generate actionable recommendations for the website"""
        recommendations = []
        
        # Based on pass rate
        if analysis['pass_rate'] < 75:
            recommendations.append("Prioritize fixing failing interactions to improve user experience")
            recommendations.append("Conduct thorough UI review focusing on failed tests")
        
        # Based on error patterns
        if 'Element Not Found' in analysis['error_patterns']:
            count = analysis['error_patterns']['Element Not Found']
            recommendations.append(f"Address {count} missing elements - verify all interactive components are properly rendered")
        
        if 'Element Not Interactable' in analysis['error_patterns']:
            count = analysis['error_patterns']['Element Not Interactable']
            recommendations.append(f"Fix {count} non-interactable elements - ensure proper visibility, enable states, and z-index")
        
        if 'Timeout' in analysis['error_patterns']:
            count = analysis['error_patterns']['Timeout']
            recommendations.append(f"Resolve {count} timeout issues - optimize page load times and asynchronous operations")
        
        if 'Invalid Element State' in analysis['error_patterns']:
            count = analysis['error_patterns']['Invalid Element State']
            recommendations.append(f"Check {count} invalid state issues - ensure actions match element types (e.g., no filling buttons)")
        
        # Based on page performance
        poor_pages = [(p, stats) for p, stats in analysis['by_page'].items() 
                      if stats['total'] > 0 and (stats['passed'] / stats['total']) < 0.7]
        if poor_pages:
            recommendations.append(f"Focus improvements on {len(poor_pages)} underperforming pages")
            for page, _ in poor_pages[:3]:
                recommendations.append(f"  • Optimize {page}")
        
        # Element-specific
        for etype, stats in analysis['by_type'].items():
            if stats['total'] > 0 and (stats['passed'] / stats['total']) < 0.7:
                recommendations.append(f"Review {etype} implementations for better reliability")
        
        # General recommendations
        recommendations.append("Add client-side validation for inputs to prevent invalid submissions")
        recommendations.append("Ensure all elements have appropriate ARIA attributes for accessibility")
        recommendations.append("Implement error handling and user feedback for failed interactions")
        
        if not recommendations:
            recommendations.append("Maintain current implementation with regular monitoring")
        
        return recommendations
    
    def _get_detailed_scores(self, analysis):
        """Generate detailed separate scores"""
        detailed_scores = {}
        
        # Overall Score
        score, grade = self._get_overall_score(analysis)
        detailed_scores['Overall'] = f"{score} - {grade}"
        
        # By Element Type
        for etype, stats in analysis['by_type'].items():
            if stats['total'] > 0:
                rate = round((stats['passed'] / stats['total']) * 100, 1)
                detailed_scores[f"{etype.capitalize()} Elements"] = f"{rate}% ({stats['passed']}/{stats['total']})"
        
        # By Page
        for page, stats in analysis['by_page'].items():
            if stats['total'] > 0:
                rate = round((stats['passed'] / stats['total']) * 100, 1)
                short_page = page if len(page) <= 40 else page[:37] + "..."
                detailed_scores[f"Page: {short_page}"] = f"{rate}% ({stats['passed']}/{stats['total']})"
        
        return detailed_scores
    
    def generate_report(self):
        """Generate report focused on the tested website"""
        analysis = self._analyze_results()
        
        report = []
        report.append("=" * 90)
        report.append("WEBSITE UI TEST REPORT".center(90))
        report.append("=" * 90)
        report.append(f"Website: {self.base}")
        report.append(f"Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        report.append(f"Pages Tested: {len(self.visited)}")
        report.append("")
        
        # Overall Score
        report.append("─" * 90)
        report.append("OVERALL SCORE")
        report.append("─" * 90)
        score, grade = self._get_overall_score(analysis)
        report.append(f"{score} - {grade}")
        report.append("")
        
        # Summary Paragraph
        report.append("─" * 90)
        report.append("SUMMARY")
        report.append("─" * 90)
        report.append(self._get_summary_paragraph(analysis))
        report.append("")
        
        # Strengths
        report.append("─" * 90)
        report.append("STRENGTHS ✓")
        report.append("─" * 90)
        strengths = self._get_strengths(analysis)
        for idx, strength in enumerate(strengths, 1):
            report.append(f"{idx}. {strength}")
        report.append("")
        
        # Weaknesses
        report.append("─" * 90)
        report.append("WEAKNESSES ⚠")
        report.append("─" * 90)
        weaknesses = self._get_weaknesses(analysis)
        for idx, weakness in enumerate(weaknesses, 1):
            report.append(f"{idx}. {weakness}")
        report.append("")
        
        # Recommendations
        report.append("─" * 90)
        report.append("RECOMMENDATIONS")
        report.append("─" * 90)
        recommendations = self._get_recommendations(analysis)
        for idx, rec in enumerate(recommendations, 1):
            report.append(f"{idx}. {rec}")
        report.append("")
        
        # Detailed Scores
        report.append("─" * 90)
        report.append("DETAILED SCORES")
        report.append("─" * 90)
        detailed_scores = self._get_detailed_scores(analysis)
        for category, score in sorted(detailed_scores.items()):
            report.append(f"• {category}: {score}")
        report.append("")
        
        # Error Patterns
        if analysis['error_patterns']:
            report.append("─" * 90)
            report.append("ERROR PATTERNS")
            report.append("─" * 90)
            for error_type, count in sorted(analysis['error_patterns'].items(), key=lambda x: x[1], reverse=True):
                percentage = round((count / analysis['failed'] * 100) if analysis['failed'] > 0 else 0, 1)
                report.append(f"• {error_type}: {count} occurrences ({percentage}% of failures)")
            report.append("")
        
        # Failed Tests Details
        fails = [r for r in self.all_results if r['status'] == 'failed']
        if fails:
            report.append("─" * 90)
            report.append(f"FAILED TESTS DETAILS ({len(fails)} total)")
            report.append("─" * 90)
            for idx, fail in enumerate(fails[:30], 1):  # Show up to 30 failures
                report.append(f"\n{idx}. {fail['title']}")
                report.append(f"   Page: {fail['page_url'].replace(self.base, '') or '/'}")
                report.append(f"   Type: {fail.get('type', 'unknown').upper()}")
                report.append(f"   Error: {fail.get('error', 'Unknown error')}")
        report.append("")
        
        report.append("=" * 90)
        report.append("End of Report".center(90))
        report.append("=" * 90)
        
        # Save report
        filename = f"website_test_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write("\n".join(report))
        
        print(f"\n✅ Report saved to {filename}")
        return filename
    
    def run(self):
        """Main execution"""
        print("\n" + "="*80)
        print("⚡ LIGHTNING FAST UI TESTER ⚡".center(80))
        print("="*80)
        print("Minimal, streamlined testing for maximum speed")
        print("="*80 + "\n")
        
        try:
            url = input("🌐 Enter website URL: ").strip()
            if not url.startswith('http'):
                url = 'https://' + url
            
            self.domain = urlparse(url).netloc
            self.base = f"{urlparse(url).scheme}://{urlparse(url).netloc}"
            
            print(f"\n✅ Testing: {url}")
            print(f"🌐 Domain: {self.domain}\n")
            
            self.initialize_browser()
            
            # Single page or crawl
            choice = input("1. Single page\n2. Crawl (max 10 pages)\nChoice: ").strip()
            
            if choice == '2':
                queue = [(url, 0)]
                is_first = True
                
                while queue and len(self.visited) < 10:
                    curr, depth = queue.pop(0)
                    if curr in self.visited or depth > 2:
                        continue
                    
                    links = self.process_page(curr, is_first=is_first)
                    is_first = False
                    
                    for link in links:
                        if link not in [u for u, _ in queue] and link not in self.visited:
                            queue.append((link, depth + 1))
            else:
                self.process_page(url, is_first=True)
            
            self.driver.quit()
            
            # Generate report
            print("\n" + "="*80)
            print("📊 GENERATING REPORT")
            print("="*80)
            self.generate_report()
            
            # Summary
            total = len(self.all_results)
            passed = sum(1 for r in self.all_results if r['status'] == 'passed')
            print(f"\n✅ Testing Complete!")
            print(f"   Pages: {len(self.visited)}")
            print(f"   Tests: {total}")
            print(f"   Passed: {passed} ({round(passed/total*100, 1) if total > 0 else 0}%)")
            print(f"   Failed: {total - passed}")
            print("\n" + "="*80 + "\n")
            
        except KeyboardInterrupt:
            print("\n\n⚠️  Interrupted by user")
            if self.driver:
                self.driver.quit()
        except Exception as e:
            print(f"\n\n❌ Error: {str(e)}")
            if self.driver:
                self.driver.quit()
            import traceback
            traceback.print_exc()


if __name__ == "__main__":
    tester = FastUITester()
    tester.run()