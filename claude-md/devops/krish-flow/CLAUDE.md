# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

KrishFlow is a Ruby on Rails 8 application for agricultural land leasing and financial returns tracking. It manages land leased from owners and subleased to farmers, with investment tracking and payment monitoring based on financial year snapshots.

## Key Commands

### Development
```bash
# Install dependencies
bundle install

# Database setup
rails db:create db:migrate db:seed

# Start server
rails server

# Run tests
rails test

# System tests
rails test:system

# Single test file
rails test test/models/person_test.rb

# Single test method
rails test test/models/person_test.rb:test_validation

# Security scan
bundle exec brakeman

# Code style check
bundle exec rubocop
```

### Database
```bash
# Create migration
rails generate migration MigrationName

# Reset database
rails db:drop db:create db:migrate db:seed

# Rails console
rails console
```

## Core Architecture

### Data Model Structure
The application uses a **Person-centric** approach where individuals can be both landowners and farmers:

- **Person**: Central entity for all individuals (landowners/farmers)
- **Land**: Physical land owned by a Person (landowner)
- **LeaseSnapshot**: Captures lease conditions per financial year per land
- **Payment**: Tracks payments against lease snapshots

### Key Model Relationships
```ruby
# Person can be both landowner and farmer
Person:
  has_many :owned_lands (as landowner)
  has_many :lease_snapshots (as farmer)

# Land belongs to one landowner, can have multiple lease snapshots
Land:
  belongs_to :landowner (Person)
  has_many :lease_snapshots
  has_many :farmers, through: :lease_snapshots

# LeaseSnapshot links land to farmer for specific financial year  
LeaseSnapshot:
  belongs_to :land
  belongs_to :farmer (Person)
  has_many :payments

# Payment belongs to one lease snapshot
Payment:
  belongs_to :lease_snapshot
```

### Financial Year Logic
- Financial year runs April-March (Indian fiscal year)
- Calculated automatically: `current_financial_year` method in Land model
- Format: "2024-25", "2025-26"
- Unique constraint: `[land_id, financial_year]`

### Land Size Conversion System
- **Input**: Supports both `bigha` and `biswa` units
- **Storage**: All sizes normalized to `biswas` for calculations
- **Conversion**: 1 bigha = 20 biswas
- **Auto-calculation**: `before_validation :calculate_size_in_biswas`

### Person Dual-Role System
- `Person.landowners` scope: People who own land
- `Person.farmers` scope: People who farm land
- Same person can be both landowner and farmer
- Helper methods: `is_landowner?`, `is_farmer?`

## Tech Stack

- **Framework**: Ruby on Rails 8 (Ruby 3.3.6)
- **Database**: PostgreSQL
- **Frontend**: Hotwire (Turbo/Stimulus)
- **Authentication**: Devise (configured but not implemented)
- **Pagination**: Kaminari
- **PDF Export**: Prawn + Prawn-table
- **Excel Export**: Caxlsx + Caxlsx_rails
- **Deployment**: Docker + Kamal

## Current Application State

### Implemented Features
- Complete CRUD for People, Lands, LeaseSnapshots, Payments
- Dashboard with summary metrics
- Reports with export functionality
- Nested routing: `lands/:id/lease_snapshots/:id/payments`

### Authentication Status
- Devise gem installed but **not configured**
- No User model or authentication routes
- Application currently **runs without authentication**
- UI prepared for authentication (commented out in layout)

### To Complete Devise Setup
```bash
rails generate devise:install
rails generate devise User
rails db:migrate
# Add devise_for :users to routes.rb
# Uncomment authentication UI in layouts/application.html.erb
```

## Development Notes

### Test Structure
- Rails default test suite with parallel execution
- Fixtures in `test/fixtures/`
- System tests use Capybara + Selenium

### Route Structure
- Nested resources: `lands > lease_snapshots > payments`
- Duplicate routes for lease_snapshots (both nested and standalone)
- Dashboard at root path
- Reports with export functionality

### Code Quality
- Brakeman for security scanning
- RuboCop Rails Omakase for code style
- Model validations with proper associations
- Scopes for common queries