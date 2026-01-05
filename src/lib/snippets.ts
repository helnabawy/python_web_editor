export interface CodeSnippet {
  id: string
  name: string
  category: string
  description: string
  code: string
  tags?: string[]
}

export const CODE_SNIPPETS: CodeSnippet[] = [
  // Basic Patterns
  {
    id: 'hello-world',
    name: 'Hello World',
    category: 'Basic',
    description: 'Simple hello world program',
    code: `print("Hello, World!")`,
    tags: ['beginner', 'basic']
  },
  {
    id: 'for-loop',
    name: 'For Loop',
    category: 'Loops',
    description: 'Iterate over a range of numbers',
    code: `for i in range(10):
    print(i)`,
    tags: ['loop', 'iteration']
  },
  {
    id: 'while-loop',
    name: 'While Loop',
    category: 'Loops',
    description: 'Loop while condition is true',
    code: `count = 0
while count < 5:
    print(count)
    count += 1`,
    tags: ['loop', 'iteration']
  },
  {
    id: 'for-each',
    name: 'For Each Loop',
    category: 'Loops',
    description: 'Iterate over a list',
    code: `items = ["apple", "banana", "cherry"]
for item in items:
    print(item)`,
    tags: ['loop', 'iteration', 'list']
  },
  
  // Functions
  {
    id: 'simple-function',
    name: 'Simple Function',
    category: 'Functions',
    description: 'Define a simple function',
    code: `def greet(name):
    return f"Hello, {name}!"

print(greet("World"))`,
    tags: ['function', 'beginner']
  },
  {
    id: 'function-with-params',
    name: 'Function with Parameters',
    category: 'Functions',
    description: 'Function with multiple parameters and default value',
    code: `def calculate(a, b, operation="add"):
    if operation == "add":
        return a + b
    elif operation == "multiply":
        return a * b
    return None

result = calculate(5, 3)
print(result)`,
    tags: ['function', 'parameters']
  },
  {
    id: 'lambda',
    name: 'Lambda Function',
    category: 'Functions',
    description: 'Anonymous function example',
    code: `square = lambda x: x ** 2
print(square(5))`,
    tags: ['function', 'lambda', 'advanced']
  },
  {
    id: 'recursive-function',
    name: 'Recursive Function',
    category: 'Functions',
    description: 'Factorial calculation using recursion',
    code: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

print(factorial(5))`,
    tags: ['function', 'recursion', 'advanced']
  },
  
  // Data Structures
  {
    id: 'list-operations',
    name: 'List Operations',
    category: 'Data Structures',
    description: 'Common list operations',
    code: `numbers = [1, 2, 3, 4, 5]

# Add element
numbers.append(6)

# Remove element
numbers.remove(2)

# List comprehension
squared = [x ** 2 for x in numbers]

# Slicing
subset = numbers[1:4]

print(f"Original: {numbers}")
print(f"Squared: {squared}")
print(f"Subset: {subset}")`,
    tags: ['list', 'comprehension', 'slice']
  },
  {
    id: 'dict-operations',
    name: 'Dictionary Operations',
    category: 'Data Structures',
    description: 'Common dictionary operations',
    code: `person = {"name": "John", "age": 30, "city": "NYC"}

# Access values
print(person["name"])
print(person.get("age"))

# Add/update
person["email"] = "john@example.com"

# Iterate
for key, value in person.items():
    print(f"{key}: {value}")`,
    tags: ['dictionary', 'hash map']
  },
  {
    id: 'set-operations',
    name: 'Set Operations',
    category: 'Data Structures',
    description: 'Set operations for unique values',
    code: `set1 = {1, 2, 3, 4}
set2 = {3, 4, 5, 6}

# Union
union = set1 | set2

# Intersection
intersection = set1 & set2

# Difference
difference = set1 - set2

print(f"Union: {union}")
print(f"Intersection: {intersection}")
print(f"Difference: {difference}")`,
    tags: ['set', 'unique']
  },
  {
    id: 'list-stack',
    name: 'List as Stack',
    category: 'Data Structures',
    description: 'Using list as a stack (LIFO)',
    code: `stack = []

# Push
stack.append(1)
stack.append(2)
stack.append(3)

# Pop
print(stack.pop())  # 3
print(stack.pop())  # 2

print(stack)  # [1]`,
    tags: ['list', 'stack', 'LIFO']
  },
  {
    id: 'list-queue',
    name: 'List as Queue',
    category: 'Data Structures',
    description: 'Using deque as a queue (FIFO)',
    code: `from collections import deque

queue = deque([1, 2, 3])

# Enqueue
queue.append(4)
queue.append(5)

# Dequeue
print(queue.popleft())  # 1
print(queue.popleft())  # 2

print(list(queue))  # [3, 4, 5]`,
    tags: ['queue', 'deque', 'FIFO']
  },
  
  // String Operations
  {
    id: 'string-formatting',
    name: 'String Formatting',
    category: 'Strings',
    description: 'Various string formatting methods',
    code: `name = "Alice"
age = 25

# f-strings
print(f"Name: {name}, Age: {age}")

# format method
print("Name: {}, Age: {}".format(name, age))

# Old style
print("Name: %s, Age: %d" % (name, age))

# Multi-line f-string
message = f"""
Name: {name}
Age: {age}
Status: Active
"""
print(message)`,
    tags: ['string', 'formatting']
  },
  {
    id: 'string-methods',
    name: 'String Methods',
    category: 'Strings',
    description: 'Common string operations',
    code: `text = "  Hello, World!  "

# Strip whitespace
cleaned = text.strip()

# Convert case
upper = text.upper()
lower = text.lower()
title = text.title()

# Find and replace
replaced = text.replace("World", "Python")

# Split and join
words = "apple,banana,cherry".split(",")
joined = "-".join(words)

print(f"Cleaned: '{cleaned}'")
print(f"Upper: {upper}")
print(f"Replaced: {replaced}")
print(f"Joined: {joined}")`,
    tags: ['string', 'methods']
  },
  
  // Classes
  {
    id: 'simple-class',
    name: 'Simple Class',
    category: 'Classes',
    description: 'Basic class with methods',
    code: `class Dog:
    def __init__(self, name, age):
        self.name = name
        self.age = age
    
    def bark(self):
        return f"{self.name} says Woof!"
    
    def introduce(self):
        return f"I am {self.name}, {self.age} years old"

dog = Dog("Buddy", 3)
print(dog.bark())
print(dog.introduce())`,
    tags: ['class', 'OOP', 'beginner']
  },
  {
    id: 'class-inheritance',
    name: 'Class Inheritance',
    category: 'Classes',
    description: 'Inheritance with parent and child classes',
    code: `class Animal:
    def __init__(self, name):
        self.name = name
    
    def speak(self):
        return "Some sound"

class Dog(Animal):
    def speak(self):
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self):
        return f"{self.name} says Meow!"

dog = Dog("Buddy")
cat = Cat("Whiskers")

print(dog.speak())
print(cat.speak())`,
    tags: ['class', 'inheritance', 'OOP']
  },
  {
    id: 'class-with-props',
    name: 'Class with Properties',
    category: 'Classes',
    description: 'Class with getters and setters',
    code: `class Temperature:
    def __init__(self, celsius=0):
        self._celsius = celsius
    
    @property
    def celsius(self):
        return self._celsius
    
    @celsius.setter
    def celsius(self, value):
        if value < -273.15:
            raise ValueError("Temperature too low!")
        self._celsius = value
    
    @property
    def fahrenheit(self):
        return (self._celsius * 9/5) + 32

temp = Temperature(25)
print(f"{temp.celsius}°C = {temp.fahrenheit}°F")`,
    tags: ['class', 'properties', 'OOP']
  },
  
  // File Operations
  {
    id: 'read-file',
    name: 'Read File',
    category: 'File Operations',
    description: 'Read content from a file',
    code: `# Read entire file
with open("file.txt", "r") as f:
    content = f.read()
    print(content)

# Read line by line
with open("file.txt", "r") as f:
    for line in f:
        print(line.strip())`,
    tags: ['file', 'read', 'I/O']
  },
  {
    id: 'write-file',
    name: 'Write File',
    category: 'File Operations',
    description: 'Write content to a file',
    code: `# Write text
with open("output.txt", "w") as f:
    f.write("Hello, World!")
    f.write("\\nThis is a new line.")

# Append to file
with open("output.txt", "a") as f:
    f.write("\\nAppended line.")

# Write multiple lines
lines = ["Line 1", "Line 2", "Line 3"]
with open("output.txt", "w") as f:
    f.write("\\n".join(lines))`,
    tags: ['file', 'write', 'I/O']
  },
  {
    id: 'json-operations',
    name: 'JSON Operations',
    category: 'File Operations',
    description: 'Read and write JSON files',
    code: `import json

data = {
    "name": "John",
    "age": 30,
    "skills": ["Python", "JavaScript"]
}

# Write JSON
with open("data.json", "w") as f:
    json.dump(data, f, indent=2)

# Read JSON
with open("data.json", "r") as f:
    loaded_data = json.load(f)
    print(loaded_data["name"])`,
    tags: ['json', 'file', 'serialization']
  },
  
  // Exception Handling
  {
    id: 'try-except',
    name: 'Try-Except Block',
    category: 'Error Handling',
    description: 'Basic exception handling',
    code: `try:
    result = 10 / 0
except ZeroDivisionError as e:
    print(f"Error: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
else:
    print("No errors occurred")
finally:
    print("This always runs")`,
    tags: ['try-except', 'error handling']
  },
  {
    id: 'custom-exception',
    name: 'Custom Exception',
    category: 'Error Handling',
    description: 'Define and use custom exceptions',
    code: `class ValidationError(Exception):
    def __init__(self, message):
        self.message = message
        super().__init__(self.message)

def validate_age(age):
    if age < 0:
        raise ValidationError("Age cannot be negative")
    if age > 150:
        raise ValidationError("Age is too high")
    return True

try:
    validate_age(-5)
except ValidationError as e:
    print(f"Validation failed: {e.message}")`,
    tags: ['exception', 'custom error']
  },
  
  // Algorithms
  {
    id: 'binary-search',
    name: 'Binary Search',
    category: 'Algorithms',
    description: 'Efficient search in sorted array',
    code: `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1

sorted_list = [1, 3, 5, 7, 9, 11, 13]
result = binary_search(sorted_list, 7)
print(f"Found at index: {result}")`,
    tags: ['algorithm', 'search', 'divide and conquer']
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'Algorithms',
    description: 'Efficient sorting algorithm',
    code: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

numbers = [3, 6, 8, 10, 1, 2, 1]
sorted_numbers = quick_sort(numbers)
print(f"Sorted: {sorted_numbers}")`,
    tags: ['algorithm', 'sorting', 'divide and conquer']
  },
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'Algorithms',
    description: 'Simple sorting algorithm',
    code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

numbers = [64, 34, 25, 12, 22, 11, 90]
sorted_numbers = bubble_sort(numbers.copy())
print(f"Original: {numbers}")
print(f"Sorted: {sorted_numbers}")`,
    tags: ['algorithm', 'sorting', 'beginner']
  },
  {
    id: 'fibonacci',
    name: 'Fibonacci Sequence',
    category: 'Algorithms',
    description: 'Generate Fibonacci numbers',
    code: `def fibonacci(n):
    if n <= 0:
        return []
    elif n == 1:
        return [0]
    elif n == 2:
        return [0, 1]
    
    fib = [0, 1]
    for i in range(2, n):
        fib.append(fib[-1] + fib[-2])
    return fib

print(fibonacci(10))`,
    tags: ['algorithm', 'sequence', 'math']
  },
  
  // Data Processing
  {
    id: 'filter-map-reduce',
    name: 'Filter, Map, Reduce',
    category: 'Data Processing',
    description: 'Functional programming patterns',
    code: `from functools import reduce

numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Filter: Get even numbers
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))

# Map: Square each number
squared = list(map(lambda x: x ** 2, numbers))

# Reduce: Sum all numbers
total = reduce(lambda x, y: x + y, numbers)

print(f"Even: {even_numbers}")
print(f"Squared: {squared}")
print(f"Sum: {total}")`,
    tags: ['functional', 'filter', 'map', 'reduce']
  },
  {
    id: 'list-comprehensions',
    name: 'List Comprehensions',
    category: 'Data Processing',
    description: 'Concise list creation',
    code: `numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

# Basic comprehension
squared = [x ** 2 for x in numbers]

# With condition
even_squared = [x ** 2 for x in numbers if x % 2 == 0]

# Nested comprehension
matrix = [[i * j for j in range(1, 4)] for i in range(1, 4)]

# Dictionary comprehension
number_dict = {x: x ** 2 for x in range(1, 6)}

print(f"Squared: {squared}")
print(f"Even squared: {even_squared}")
print(f"Matrix: {matrix}")
print(f"Dict: {number_dict}")`,
    tags: ['comprehension', 'list', 'dictionary']
  },
  
  // Decorators
  {
    id: 'simple-decorator',
    name: 'Simple Decorator',
    category: 'Decorators',
    description: 'Function decorator example',
    code: `def timing_decorator(func):
    import time
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"{func.__name__} took {end - start:.4f} seconds")
        return result
    return wrapper

@timing_decorator
def slow_function():
    import time
    time.sleep(1)
    return "Done!"

result = slow_function()`,
    tags: ['decorator', 'advanced']
  },
  {
    id: 'decorator-with-params',
    name: 'Decorator with Parameters',
    category: 'Decorators',
    description: 'Decorator that accepts arguments',
    code: `def repeat_decorator(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat_decorator(3)
def greet():
    print("Hello!")

greet()  # Prints "Hello!" 3 times`,
    tags: ['decorator', 'advanced']
  },
  
  // Generators
  {
    id: 'generator-function',
    name: 'Generator Function',
    category: 'Generators',
    description: 'Yield values one at a time',
    code: `def count_down(n):
    while n > 0:
        yield n
        n -= 1

for num in count_down(5):
    print(num)  # Prints 5, 4, 3, 2, 1

# Generator expression
squares = (x ** 2 for x in range(5))
for square in squares:
    print(square)`,
    tags: ['generator', 'yield', 'advanced']
  },
  {
    id: 'infinite-generator',
    name: 'Infinite Generator',
    category: 'Generators',
    description: 'Generate infinite sequence',
    code: `def fibonacci_generator():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# Take first 10 Fibonacci numbers
fib = fibonacci_generator()
for _ in range(10):
    print(next(fib))`,
    tags: ['generator', 'infinite', 'advanced']
  },
  
  // Context Managers
  {
    id: 'context-manager',
    name: 'Custom Context Manager',
    category: 'Advanced',
    description: 'Create with statement context',
    code: `class Timer:
    import time
    def __enter__(self):
        self.start = time.time()
        return self
    
    def __exit__(self, *args):
        self.end = time.time()
        print(f"Elapsed: {self.end - self.start:.4f}s")

with Timer():
    import time
    time.sleep(1)`,
    tags: ['context manager', 'advanced']
  },
  
  // Testing
  {
    id: 'unit-test',
    name: 'Unit Test',
    category: 'Testing',
    description: 'Simple unit test example',
    code: `def add(a, b):
    return a + b

def test_add():
    assert add(2, 3) == 5
    assert add(-1, 1) == 0
    assert add(0, 0) == 0
    print("All tests passed!")

test_add()`,
    tags: ['test', 'unit test']
  },
]

export const CATEGORIES = Array.from(new Set(CODE_SNIPPETS.map(s => s.category))).sort()
