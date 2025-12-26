# Lightning Fast UI Tester

A minimal, streamlined version of the web tester optimized for **maximum speed**.

## Key Differences from Pro Testing

### ⚡ Speed Optimizations

1. **NO LLM Calls** - Uses instant rule-based test generation instead of slow AI calls
2. **No Advanced Features** - Removed accessibility testing, workflow testing, bug reports
3. **Minimal Waits** - Reduced all delays to absolute minimum (0.05s - 0.3s)
4. **Simple Execution** - Direct test execution without complex analysis
5. **Fast Reporting** - Simple text report generation

### Performance Comparison

- **Pro Testing**: ~5-10 minutes for 10 elements, 30 tests
- **Fast Tester**: ~30-60 seconds for 10 elements, 30 tests
- **Speed Improvement**: **10-20x faster**

### What It Does

✅ Scans pages for testable elements (inputs, buttons, links, selects)  
✅ Generates test scenarios instantly using rules  
✅ Executes tests quickly  
✅ Generates simple report  

### What It Doesn't Do

❌ AI-powered scenario generation (too slow)  
❌ Accessibility testing  
❌ Workflow testing  
❌ Detailed bug reports  
❌ Screenshots (unless critical)  
❌ LLM analysis  

## Usage

```bash
python fast_ui_tester.py
```

Enter the website URL and choose:
1. Single page testing
2. Crawl mode (max 10 pages for speed)

## Requirements

- Python 3.x
- Selenium
- ChromeDriver

```bash
pip install selenium
```

## Output

Generates a simple text report with:
- Test summary
- Pass/fail counts
- Failed test details
- Execution statistics

Perfect for quick testing when you need results fast!

