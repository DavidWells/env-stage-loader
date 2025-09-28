#!/bin/bash

# Script to run each test file individually to avoid environment pollution
# This ensures each test starts with a clean environment

echo "🧪 Running tests individually to avoid environment pollution..."
echo ""

# Directory containing test files
TEST_DIR="./tests"

# Initialize counters
total_tests=0
passed_tests=0
failed_tests=0
failed_files=()

# Loop through all .test.js files in the tests directory
for test_file in "$TEST_DIR"/*.test.js; do
    if [ -f "$test_file" ]; then
        echo "▶️  Running $(basename "$test_file")..."

        # Run the test file with node
        if node "$test_file"; then
            echo "✅ $(basename "$test_file") PASSED"
            ((passed_tests++))
        else
            echo "❌ $(basename "$test_file") FAILED"
            ((failed_tests++))
            failed_files+=("$(basename "$test_file")")
        fi

        ((total_tests++))
        echo ""
    fi
done

# Print summary
echo "📊 Test Summary:"
echo "   Total files: $total_tests"
echo "   Passed: $passed_tests"
echo "   Failed: $failed_tests"

if [ $failed_tests -gt 0 ]; then
    echo ""
    echo "❌ Failed test files:"
    for file in "${failed_files[@]}"; do
        echo "   - $file"
    done
    exit 1
else
    echo ""
    echo "🎉 All tests passed!"
    exit 0
fi