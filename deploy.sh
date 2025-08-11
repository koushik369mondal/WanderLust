#!/usr/bin/env bash

# Render Deploy Script
# Usage: ./deploy.sh

echo "🚀 Starting Render deployment..."

# Check if RENDER_API_KEY is set
if [ -z "$RENDER_API_KEY" ]; then
    echo "❌ Error: RENDER_API_KEY environment variable is not set"
    echo "Please set it with: export RENDER_API_KEY=your_api_key"
    exit 1
fi

SERVICE_ID="srv-d0971eeuk2gs73a2m2og"

echo "📝 Triggering deployment for service: $SERVICE_ID"

# Trigger deployment
RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $RENDER_API_KEY" \
    -H "Content-Type: application/json" \
    https://api.render.com/v1/services/$SERVICE_ID/deploys)

echo "📋 Render API Response:"
echo "$RESPONSE"

# Check if deployment was successful
if echo "$RESPONSE" | grep -q '"id"'; then
    echo "✅ Deployment triggered successfully!"
else
    echo "❌ Deployment failed!"
    exit 1
fi
