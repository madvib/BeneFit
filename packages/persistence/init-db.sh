#!/bin/bash
set -e

echo "🚀 Initializing local databases..."

# Clean previous state
echo "🧹 Cleaning..."
pnpm db:clean

# Apply Migrations
echo "🏗️  Applying migrations..."
pnpm db:migrate:activity_stream
pnpm db:migrate:discovery_index
pnpm db:migrate:static_content

# Seed Data
echo "🌱 Seeding data..."
pnpm db:seed

echo "✅ Database initialization complete!"
