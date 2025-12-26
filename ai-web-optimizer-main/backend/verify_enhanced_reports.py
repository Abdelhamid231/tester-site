from automation_wrapper import run_fast_test, run_pro_test
import sys
import io

# Ensure UTF-8
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print("Testing ENHANCED Fast UI Test...")
res_fast = run_fast_test("https://example.com")
print(f"Fast Test Result Details: {list(res_fast['results'].keys())}")
print(f"Fast Test Conclusion: {res_fast['results'].get('conclusion')}")

print("\nTesting ENHANCED Pro Test...")
res_pro = run_pro_test("https://example.com")
print(f"Pro Test Result Details: {list(res_pro['results'].keys())}")
print(f"Pro Test AI Conclusion: {res_pro['results'].get('conclusion')}")
