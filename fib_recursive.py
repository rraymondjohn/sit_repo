import sys

def fib_recursive(n):
    if n == 0: # base case
        print("      fib_recursive(0) = 0")
        return 0
    if n == 1: # base case
        print("      fib_recursive(1) = 1")
        return 1
    print(f"fib_recursive({n}) = fib_recursive({n-1}) + fib_recursive({n-2})")
    temp_response = fib_recursive(n-1) + fib_recursive(n-2) 
    print(f"   fib_recursive ({n}) returns {temp_response}")
    return temp_response

fib_recursive(int(sys.argv[1]))
