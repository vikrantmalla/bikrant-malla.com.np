#!/bin/bash

# Generate Prisma client
npx prisma generate

# Build the application
next build
