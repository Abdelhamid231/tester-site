from automation_wrapper import run_pro_test
import sys
import io

# Ensure UTF-8
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

print("Testing Focused Pro Test...")
# Using a simpler URL that should be faster
res_pro = run_pro_test("https://example.com")
print(f"Pro Test Result: {res_pro}")
