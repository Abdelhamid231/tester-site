from automation_wrapper import run_fast_test, run_security_test, run_pro_test
import sys
import io

# Ensure UTF-8
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print("Testing Fast UI Test...")
res_fast = run_fast_test("https://google.com")
print(f"Fast Test Result: {res_fast}")

print("\nTesting Security Test...")
res_sec = run_security_test("https://google.com")
print(f"Security Test Result: {res_sec}")

print("\nTesting Pro Test...")
res_pro = run_pro_test("https://google.com")
print(f"Pro Test Result: {res_pro}")
