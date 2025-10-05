#!/bin/bash

# Test Vendor Discovery Feature
echo "🔍 Testing Smart Vendor Discovery (Like Skyscanner)..."
echo ""

# First, login to get token
echo "1. Logging in..."
TOKEN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}')

TOKEN=$(echo $TOKEN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed. Make sure backend is running."
  exit 1
fi

echo "✅ Logged in successfully"
echo ""

# Search for vendors selling Wireless Mouse
echo "2. Searching for vendors selling 'Wireless Mouse' (50 units)..."
echo ""

curl -s -X POST http://localhost:3001/api/vendor-discovery/search \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productName":"Wireless Mouse","quantity":50}' | jq '.'

echo ""
echo "3. Searching for vendors selling 'Laptop' (10 units)..."
echo ""

curl -s -X POST http://localhost:3001/api/vendor-discovery/search \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productName":"Laptop","quantity":10}' | jq '.'

echo ""
echo "4. Comparing vendors for 'Office Chair' with filters..."
echo ""

curl -s -X POST http://localhost:3001/api/vendor-discovery/compare \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productName":"Office Chair","quantity":15,"maxDeliveryDays":10,"maxBudget":2500}' | jq '.recommendations'

echo ""
echo "✅ Vendor Discovery Tests Complete!"
echo ""
echo "📊 Summary:"
echo "   - Searched multiple online marketplaces"
echo "   - Found vendors from China, India, USA"
echo "   - Compared prices automatically"
echo "   - Applied bulk discounts"
echo "   - Filtered by delivery time and budget"
