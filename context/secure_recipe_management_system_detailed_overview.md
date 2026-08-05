# Secure Recipe Management System — Detailed Project Overview

**Repository:** [yassernamez03/Secure-Recipe-Management-System](https://github.com/yassernamez03/Secure-Recipe-Management-System)  
**Application names used in the interface:** Recipe Haven / RecipeBook / Recipe App  
**Project type:** Full-stack recipe-management web application with authentication, two-factor authentication, AI-assisted recipe creation, search, category management, user administration, and external API integrations  
**Analysis basis:** Full uploaded source archive, including Flask application code, MongoDB access logic, forms, templates, frontend JavaScript and CSS, AI recipe-generation utilities, external-service integrations, session configuration, and the repository README.

> This document is a project explanation for portfolio, resume, LinkedIn, and interview preparation. It focuses on what the system does, how its main workflows are structured, the technologies used, and the engineering skills demonstrated.

# Executive Summary

The **Secure Recipe Management System** is a Flask and MongoDB web application for creating, browsing, organizing, searching, editing, and sharing recipes.

The project combines a traditional CRUD application with authentication and AI-assisted content generation.

Its main capabilities include:

- User registration and login
- Password hashing
- Password-complexity validation
- Server-side sessions
- Session expiration
- Login rate limiting
- CSRF-protected forms and AJAX requests
- TOTP two-factor authentication
- QR-code-based authenticator enrollment
- Password recovery by email verification code
- Recipe creation
- AI-assisted recipe generation
- Recipe editing and deletion
- Recipe ownership
- Recipe browsing
- Recipe detail pages
- Search and filtering
- Cuisine/category management
- Administrative user management
- Groq LLM integration
- Pexels food-image integration
- Brevo/Sendinblue transactional email
- Responsive Jinja-based frontend
- Materialize CSS and Tailwind CSS interfaces
- Custom HTTP error pages

The project is structured as a server-rendered Flask application rather than a separate frontend and backend.

The browser communicates directly with Flask through:

```text
HTML form submissions
AJAX / Fetch requests
Query-string search parameters
Session cookies
```

Flask then connects to:

```text
MongoDB Atlas
Groq
Pexels
Brevo / Sendinblue
```

The central application idea is:

```text
Authenticated user
        │
        ▼
Browse or search recipes
        │
        ├── Open recipe
        ├── Create recipe manually
        └── Generate recipe with AI
                │
                ▼
        Review generated content
                │
                ▼
        Save recipe
                │
                ▼
        Edit or delete owned recipes
```

The application therefore demonstrates both conventional web-development skills and modern AI API integration.

# Repository Scale

Excluding the bundled virtual environment, filesystem session data, and compiled Python cache files, the main readable application source contains approximately:

| Source type | Files | Approximate lines |
|---|---:|---:|
| Python | 3 | 1,105 |
| HTML / Jinja | 23 | 1,035 |
| CSS | 2 | 3,354 |
| JavaScript | 2 | 237 |
| Markdown | 1 | 179 |
| **Total** | **31** | **~5,910** |

The main backend application is concentrated in:

```text
app.py
form.py
utils.py
```

The frontend is primarily represented by:

```text
templates/
static/css/
static/js/
```

# Repository Structure

```text
Secure-Recipe-Management-System/
├── app.py
├── form.py
├── utils.py
├── requirements.txt
├── README.md
├── templates/
│   ├── base.html
│   ├── homebase.html
│   ├── index.html
│   ├── login.html
│   ├── signup.html
│   ├── reset.html
│   ├── verify.html
│   ├── resetpassword.html
│   ├── enable_totp.html
│   ├── verify_totp.html
│   ├── recipes.html
│   ├── recipepage.html
│   ├── addrecipe.html
│   ├── editrecipe.html
│   ├── categories.html
│   ├── addcategory.html
│   ├── editcategory.html
│   ├── manage_users.html
│   ├── edit_user.html
│   └── errors/
│       ├── 400.html
│       ├── 403.html
│       ├── 404.html
│       └── 500.html
└── static/
    ├── css/
    │   ├── style.css
    │   └── homestyle.css
    ├── js/
    │   ├── script.js
    │   └── react.js
    └── res/
        ├── background image
        ├── logo / food image
        └── favicon
```

# Technology Stack

## Backend

- Python
- Flask 3
- Jinja2
- Werkzeug
- Flask-WTF
- WTForms
- Flask-Session
- Flask-Bcrypt
- Flask-Limiter
- Flask-Talisman
- Flask-QRcode
- PyOTP
- PyMongo
- BSON `ObjectId`
- python-dotenv
- Requests

# Database

- MongoDB Atlas
- PyMongo
- Document-oriented collections
- BSON object identifiers

# AI and External APIs

- Groq chat-completion API
- Mixtral-family model configuration in the source
- Pexels image-search API
- Brevo / Sendinblue transactional email API

# Frontend

- HTML
- CSS
- JavaScript
- Jinja templates
- Materialize CSS
- Tailwind CSS on public/authentication pages
- Google Material Icons
- jQuery
- Fetch API
- React browser scripts are included in the public layout, although the main interface remains Jinja-driven

# Application Security Features Used as Product Functionality

- bcrypt password hashing
- Password-complexity checks
- TOTP-based two-factor authentication
- QR-code enrollment
- CSRF protection
- Session expiration
- Server-side sessions
- Login rate limiting
- HTTP security headers through Flask-Talisman
- Recipe ownership checks

# High-Level Architecture

```text
                         Browser
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
      Jinja pages        HTML forms       Fetch / AJAX
          │                 │                 │
          └─────────────────┼─────────────────┘
                            ▼
                       Flask App
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
       ▼                    ▼                    ▼
   MongoDB Atlas         Groq API           Brevo API
   users                 recipe AI          password email
   recipes
   categories
                            │
                            ▼
                        Pexels API
                     recipe food photos
```

# Application Responsibilities

`app.py` acts as the central application controller.

It handles:

- Flask initialization
- Extension initialization
- MongoDB connection
- Session setup
- Authentication
- TOTP setup and verification
- Recipe routes
- Category routes
- User-management routes
- Password recovery
- Error handling

`form.py` contains:

- Signup form
- Login form
- Recovery form
- Verification-code form
- Password-reset form
- TOTP verification form
- Transactional email helper

`utils.py` contains:

- AI recipe generation
- Groq client usage
- Structured recipe prompt
- JSON parsing
- Pexels food-image search

# Main User Journey

A typical user journey is:

```text
Landing page
     │
     ├── Sign up
     │      │
     │      ▼
     │   Login
     │
     └── Existing member
            │
            ▼
          Login
            │
            ▼
      Optional / required
       TOTP workflow
            │
            ▼
       Recipe library
            │
   ┌────────┼──────────┐
   ▼        ▼          ▼
Search    Open       Add recipe
recipe    recipe        │
                       ├── Manual entry
                       └── AI generation
                              │
                              ▼
                         Review fields
                              │
                              ▼
                         Save recipe
```

# 1. Landing Page

The public landing page is branded as **Recipe Haven**.

Its main message is centered on:

- Discovering recipes
- Creating recipes
- Sharing recipes
- Supporting both experienced cooks and beginners

The landing page provides two primary calls to action:

```text
Get Started
Already a Member
```

These lead to:

```text
/signup
/login
```

The public-facing page uses a separate layout from the authenticated application.

## Public Layout

`homebase.html` provides:

- Application logo
- Theme switcher
- Login button
- Signup button
- Tailwind CSS
- Public-page stylesheet
- Browser JavaScript

# 2. Registration

Registration is implemented through `SignupForm`.

The user provides:

```text
Username
Email
Password
Password confirmation
```

# Registration Workflow

```text
Signup form
    │
    ▼
WTForms validation
    │
    ▼
Normalize email
    │
    ▼
Check password confirmation
    │
    ▼
Validate password requirements
    │
    ▼
Check duplicate email
    │
    ▼
Check duplicate username
    │
    ▼
Hash password with bcrypt
    │
    ▼
Create MongoDB user document
    │
    ▼
Redirect to login
```

# Password Requirements

The interface evaluates:

- Minimum length
- Uppercase character
- Lowercase character
- Number
- Special character

The browser also provides visual password feedback.

Example visual logic:

```text
Password entered
      │
      ▼
JavaScript evaluates rules
      │
      ├── ✓ requirement satisfied
      └── ✗ requirement missing
```

The JavaScript dynamically updates each requirement while the user types.

# User Document

A newly created user includes fields such as:

```json
{
  "_id": "MongoDB ObjectId",
  "username": "string",
  "email": "string",
  "password": "bcrypt hash",
  "created_at": "datetime",
  "last_login": "datetime",
  "role": "user"
}
```

TOTP-related properties are added when two-factor authentication is configured.

# 3. Login

Login uses:

- Email
- Password
- Flask-WTF form validation
- bcrypt password verification
- IP-based rate limiting
- Flask sessions

The login route has a request limit of:

```text
5 attempts per minute
```

in addition to the application's broader limiter configuration.

# Login Workflow

```text
Email + password
      │
      ▼
Normalize email
      │
      ▼
Find MongoDB user
      │
      ▼
Verify bcrypt password hash
      │
      ├── Invalid → display login error
      │
      └── Valid
             │
             ▼
        Evaluate TOTP state
             │
       ┌─────┼─────────┐
       ▼     ▼         ▼
 Setup    Verify      Standard
 TOTP     TOTP         login
       │     │          │
       └─────┼──────────┘
             ▼
      Initialize session
             │
             ▼
       Recipe library
```

# 4. Server-Side Sessions

The application uses `Flask-Session`.

The session backend is configured as:

```text
filesystem
```

Session-related application behavior includes:

- User identifier stored in session
- Login timestamp stored in session
- Permanent-session semantics
- One-hour application lifetime
- Automatic expiration check before requests

A session is initialized with:

```text
user ID
login timestamp
```

The application checks whether:

```text
current time - login time < configured session lifetime
```

When the session expires, the user is redirected to login.

# 5. TOTP Two-Factor Authentication

The project implements Time-Based One-Time Password authentication with:

- PyOTP
- QR-code generation
- Authenticator application enrollment
- Six-digit verification
- TOTP state in MongoDB
- TOTP verification state in the Flask session

# TOTP Enrollment Workflow

```text
User starts TOTP setup
        │
        ▼
Generate random Base32 secret
        │
        ▼
Store temporary secret in session
        │
        ▼
Create provisioning URI
        │
        ▼
Generate QR code
        │
        ▼
User scans with authenticator app
        │
        ▼
User enters 6-digit code
        │
        ▼
Verify code with PyOTP
        │
        ▼
Store TOTP configuration
```

# Provisioning URI

PyOTP creates an authenticator-compatible URI containing:

```text
Account identity
TOTP secret
Issuer: Recipe Manager
```

The QR-code extension converts that URI into an image that can be scanned by applications such as:

- Google Authenticator
- Microsoft Authenticator
- Authy
- compatible TOTP clients

# TOTP User Data

Depending on the setup path, user documents can include fields such as:

```text
totp_enabled
totp_secret
totp_backup_codes
totp_setup_date
totp_last_used
```

The setup flow also creates five short backup-code strings.

# TOTP Login Verification

When TOTP is enabled:

```text
Password accepted
      │
      ▼
Store pending TOTP user ID
      │
      ▼
Render verification page
      │
      ▼
User enters six-digit code
      │
      ▼
PyOTP validates code
      │
      ▼
Update last-login metadata
      │
      ▼
Create authenticated session
```

The session can record:

```text
role
totp_verified
totp_enabled
```

These values are also used by the interface for administrative navigation.

# 6. Password Recovery

Password recovery is implemented as a multi-step email verification flow.

The user:

1. Enters an email address.
2. Receives a six-digit code.
3. Enters the code in the application.
4. Enters a replacement password.
5. Returns to login.

# Recovery Workflow

```text
Password Recovery
       │
       ▼
Enter email
       │
       ▼
Find matching account
       │
       ▼
Generate six-digit code
       │
       ▼
Send code through Brevo
       │
       ▼
Verification page
       │
       ▼
Enter code
       │
       ▼
Password reset page
       │
       ▼
Hash new password
       │
       ▼
Update MongoDB
       │
       ▼
Return to login
```

# Transactional Email

`form.py` defines a `sendMail()` helper.

The email flow uses:

```text
Brevo / Sendinblue SMTP API
```

The helper sends:

- Sender metadata
- Recipient email
- Subject
- HTML content

The password-recovery route builds an HTML email containing the verification code.

# 7. Authenticated Application Layout

Authenticated users use `base.html`.

The navigation includes:

```text
Home
Manage Cuisines
New Recipe
Disconnect
```

An additional user-management option is displayed when the session represents an administrative user with the expected TOTP state.

The page also includes:

- Materialize CSS
- Google Material Icons
- Custom CSS
- CSRF token metadata
- JavaScript
- Banner area

# 8. Recipe Library

The main authenticated page is:

```text
/get_recipes
```

It acts as the central recipe-discovery page.

The page provides:

- Recipe cards
- Recipe images
- Cuisine labels
- Preparation times
- Detail-page links
- Search bar
- Advanced filters
- Edit controls for owned recipes
- Delete controls for owned recipes

# Recipe Card

A recipe card displays:

```text
Food image
Cuisine
Recipe title
Preparation time
View action
Optional edit/delete actions
```

Ownership determines whether edit and delete controls appear.

# 9. Recipe Search

The recipe page supports searching by:

```text
Recipe name
Preparation-time text
Cuisine/category
```

# Search Workflow

```text
User enters search criteria
        │
        ▼
GET /get_recipes
        │
        ▼
Build case-insensitive regular expressions
        │
        ▼
MongoDB query
        │
        ▼
Return matching recipes
        │
        ▼
Render recipe cards
```

# Search Interface

The interface contains:

## Main Search

A recipe-name field with examples such as:

```text
Chocolate Cake
Pasta
```

## Advanced Filters

Expandable filtering controls include:

```text
Preparation time
Cuisine
```

Preparation-time options are presented as:

```text
Any time
Under 15 mins
Under 30 mins
Under 1 hour
Under 2 hours
```

Cuisine options are dynamically loaded from MongoDB categories.

# 10. Recipe Data Model

A recipe document is built from the recipe form and contains fields conceptually similar to:

```json
{
  "_id": "MongoDB ObjectId",
  "user_id": "owner user ID",
  "recipe_name": "string",
  "category_name": "string",
  "recipe_intro": "string",
  "ingredients": "string",
  "description": "string",
  "preparation_time": "string",
  "photo_url": "string"
}
```

The application uses MongoDB's flexible document format rather than a relational recipe schema.

# Recipe Ownership

Every saved recipe receives:

```text
user_id = current session user ID
```

That identity is used when showing editing actions and when performing update/delete operations.

# 11. Manual Recipe Creation

The route:

```text
/add_recipe
```

renders the recipe-creation form.

The user can enter:

- Cuisine
- Recipe name
- Introduction
- Ingredients
- Cooking instructions
- Preparation time
- Photo URL

# Manual Creation Workflow

```text
Open New Recipe
       │
       ▼
Load categories from MongoDB
       │
       ▼
Complete recipe form
       │
       ▼
Submit form
       │
       ▼
Attach current user ID
       │
       ▼
Insert recipe into MongoDB
       │
       ▼
Return to recipe library
```

# 12. AI-Assisted Recipe Generation

One of the most distinctive project features is the AI recipe generator.

The `Add Recipe` page contains:

```text
Manual recipe form
        │
        └── OR
              │
              ▼
       Generate Recipe with AI
```

The user writes a natural-language prompt such as:

```text
vegetarian lasagna
```

The browser then requests structured recipe content from the Flask backend.

# AI Generation Architecture

```text
User prompt
    │
    ▼
Browser Fetch API
    │
    ▼
POST /generate_recipe_ajax
    │
    ▼
Flask generate_recipe()
    │
    ▼
Groq chat-completion API
    │
    ▼
Structured JSON recipe
    │
    ▼
Pexels image lookup
    │
    ▼
Recipe JSON returned to browser
    │
    ▼
Form fields automatically populated
    │
    ▼
User reviews / edits
    │
    ▼
Normal form submission
    │
    ▼
MongoDB
```

This architecture intentionally separates:

```text
AI generation
```

from:

```text
database persistence
```

The generated result fills the form, allowing the user to review the content before saving it.

# Structured AI Output

The AI prompt requests JSON with:

```text
recipe_name
category_name
recipe_intro
ingredients
description
preparation_time
photo_url
```

The allowed cuisine values requested in the system prompt include:

```text
Italian
French
Asian
American
Mexican
Mediterranean
```

# AI Model Request

The source configures:

- Chat-completion style request
- Structured system prompt
- User recipe prompt
- Temperature
- Maximum tokens
- Top-p sampling

The backend extracts the model response and parses it as JSON.

# JSON Cleanup

Before parsing, the utility accounts for responses that may contain:

```text
```json
...
```
```

It removes the Markdown fence and parses the remaining JSON string.

# 13. Pexels Food-Image Integration

After recipe content is generated, the application searches Pexels for a matching food photograph.

The search query is conceptually:

```text
<recipe name> food dish recipe
```

The request asks for:

- One photo
- Landscape orientation
- Large image size

If a matching image is found:

```text
Pexels image URL
```

replaces the placeholder image field generated by the language model.

# Combined AI + Image Flow

```text
Recipe request
      │
      ▼
Groq creates recipe metadata
      │
      ▼
Extract recipe name
      │
      ▼
Pexels searches food image
      │
      ▼
Merge image URL into recipe object
      │
      ▼
Return complete recipe to frontend
```

# 14. Browser-Side AI Form Population

The JavaScript attached to the AI-generation button:

1. Reads the user's recipe prompt.
2. Shows a loading state.
3. Retrieves the CSRF token.
4. Sends JSON to Flask.
5. Receives the generated recipe.
6. Normalizes the ingredients representation.
7. Updates the cuisine selector.
8. Fills the recipe fields.
9. Updates Materialize form labels.
10. Shows a success notification.

# Generated Form Fields

The AI response populates:

```text
Recipe name
Cuisine
Introduction
Ingredients
Instructions
Preparation time
Photo URL
```

The user can then edit any field before clicking:

```text
Add New Recipe
```

# 15. Recipe Detail Page

Each recipe has a dedicated page.

The detail page presents:

- Hero image
- Recipe name
- Preparation time
- Servings presentation
- Difficulty presentation
- Recipe introduction
- Ingredients
- Instructions
- Chef's tips
- Edit and delete actions for the recipe owner

# Detail Page Layout

```text
Hero image
   │
   ├── Recipe title
   └── Metadata
          │
          ▼
About this Recipe
          │
   ┌──────┴─────────┐
   ▼                ▼
Ingredients      Instructions
   │
   ▼
Chef's Tips
```

# 16. Recipe Editing

Owned recipes can be edited.

The edit page loads:

- Current recipe values
- Available categories

The update route writes fields such as:

```text
recipe_name
category_name
recipe_intro
ingredients
description
preparation_time
photo_url
```

# Edit Workflow

```text
Recipe page
      │
      ▼
Edit Recipe
      │
      ▼
Load current recipe
      │
      ▼
Modify fields
      │
      ▼
POST update
      │
      ▼
MongoDB update
      │
      ▼
Recipe library
```

# 17. Recipe Deletion

Recipe owners can delete their recipes.

The frontend presents a confirmation dialog before continuing.

The deletion process is:

```text
Select Delete
      │
      ▼
Browser confirmation
      │
      ▼
Flask checks recipe / user association
      │
      ▼
MongoDB delete
      │
      ▼
Success message
      │
      ▼
Recipe library
```

# 18. Cuisine / Category Management

The application stores cuisines in a separate MongoDB collection.

A category document has the basic structure:

```json
{
  "_id": "MongoDB ObjectId",
  "category_name": "string"
}
```

# Category Features

Users can:

- List cuisine categories
- Add a category
- Edit a category
- Delete a category

The categories also drive:

- Recipe creation select fields
- Recipe editing select fields
- Search filtering

# Category Workflow

```text
Manage Cuisines
      │
      ├── Add
      ├── Edit
      └── Delete
           │
           ▼
       MongoDB categories
           │
           ▼
Recipe forms and search filters
```

# 19. Administrative User Management

The project includes a user-management interface.

The administration page displays:

- Username
- Email
- Role
- Edit action
- Delete action

# User Roles

The interface supports:

```text
user
admin
```

# Edit User Workflow

```text
Manage Users
      │
      ▼
Select account
      │
      ▼
Edit User form
      │
      ├── Username
      ├── Email
      └── Role
              │
              ▼
       Update MongoDB
```

The user-management screen is integrated into the authenticated navigation and TOTP-aware session state.

# 20. Logout

Logout clears the Flask session.

Conceptually:

```text
Authenticated session
      │
      ▼
Disconnect
      │
      ▼
session.clear()
      │
      ▼
Login page
```

# 21. CSRF-Protected Forms and AJAX

Flask-WTF's CSRF protection is initialized globally.

The Jinja forms include:

```html
<input type="hidden" name="csrf_token" ...>
```

or WTForms-generated:

```text
form.csrf_token
```

The AI-generation AJAX request reads the token from a metadata element and sends it through:

```text
X-CSRFToken
```

This demonstrates integration of CSRF tokens across both:

```text
traditional HTML forms
AJAX / Fetch requests
```

# 22. Rate Limiting

The application initializes Flask-Limiter with IP-based client identification.

General limits are configured at the application level, while the login route has an additional tighter limit.

This demonstrates:

- Route-level throttling
- Default request limits
- IP-based request tracking
- Authentication-endpoint throttling

# 23. HTTP Security Headers

Flask-Talisman is configured to provide browser-facing security headers.

The project includes a Content Security Policy configuration covering:

```text
default sources
images
styles
scripts
fonts
network connections
```

This is part of the application's security-focused authentication and session design.

# 24. Custom Error Pages

The application registers custom handlers for:

```text
400 Bad Request
403 Forbidden
404 Not Found
500 Internal Server Error
```

The error handlers can return either:

```text
JSON
```

or:

```text
HTML error pages
```

depending on the request context.

This gives the application a cleaner experience than Flask's default error output.

# MongoDB Data Model

The application primarily uses three collections.

```text
users
recipes
categories
```

# Users Collection

Representative fields:

```text
_id
username
email
password
role
created_at
last_login
totp_enabled
totp_secret
totp_backup_codes
totp_setup_date
totp_last_used
```

Not every account necessarily contains every TOTP field.

# Recipes Collection

Representative fields:

```text
_id
user_id
recipe_name
category_name
recipe_intro
ingredients
description
preparation_time
photo_url
```

# Categories Collection

Representative fields:

```text
_id
category_name
```

# Data Relationships

Although MongoDB does not use SQL foreign keys, the application represents logical relationships.

```text
User
 │
 └── user_id
       │
       ▼
    Recipes

Category
 │
 └── category_name
       │
       ▼
    Recipes
```

User ownership is represented by the string value stored in:

```text
recipe.user_id
```

A category is associated with a recipe using:

```text
recipe.category_name
```

# Route Map

The Flask application exposes roughly thirty route handlers when helper and error functions are included.

Core user-facing routes include:

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/signup` | Registration |
| `/login` | Login |
| `/destroy` | Logout |
| `/recovery` | Password recovery |
| `/setup_totp` | Initial TOTP setup |
| `/enable_totp` | TOTP enrollment |
| `/verify_totp` | TOTP login verification |
| `/disable_totp` | Disable TOTP |
| `/get_recipes` | Recipe browsing and search |
| `/add_recipe` | Manual and AI-assisted recipe form |
| `/generate_recipe_ajax` | AI recipe generation |
| `/insert_recipe` | Save recipe |
| `/recipe_single/<id>` | Recipe detail |
| `/edit_recipe/<id>` | Edit form |
| `/update_recipe/<id>` | Save recipe changes |
| `/delete_recipe/<id>` | Delete recipe |
| `/categories` | Cuisine list |
| `/add_category` | Add cuisine form |
| `/insert_category` | Save cuisine |
| `/edit_category/<id>` | Edit cuisine |
| `/update_category/<id>` | Save cuisine changes |
| `/delete_category/<id>` | Delete cuisine |
| `/manage_users` | User-management page |
| `/edit_user/<id>` | Edit user |
| `/update_user/<id>` | Save user changes |
| `/delete_user/<id>` | Delete user |

# Template Architecture

The frontend uses two major Jinja layout templates.

# `homebase.html`

Used mainly for:

- Landing page
- Login
- Signup
- Password recovery
- TOTP pages

It includes:

- Tailwind CDN
- Public-site styling
- Navbar
- Theme switcher
- Authentication buttons

# `base.html`

Used mainly for:

- Recipe library
- Recipe details
- Recipe editing
- Category management
- User management

It includes:

- Materialize CSS
- Material Icons
- Custom application CSS
- Authenticated navigation
- CSRF metadata
- Shared JavaScript

# Frontend Styling

The repository includes two large stylesheets.

```text
static/css/homestyle.css
static/css/style.css
```

Together they account for more than three thousand lines of styling.

The design includes:

- Landing-page layout
- Forms
- Recipe cards
- Search interface
- Hero sections
- Recipe detail layout
- Category administration
- User administration
- Responsive behavior
- Buttons
- Navigation
- Loading states
- Theme elements
- Error messages

# JavaScript Responsibilities

`static/js/script.js` handles functionality such as:

- Password-requirement feedback
- Advanced-search expansion
- Materialize select initialization
- Sidenav initialization
- AI recipe-generation request
- AI generation loading state
- CSRF header retrieval
- Generated ingredient normalization
- Automatic form population
- Toast notifications
- Basic servings placeholder behavior

# External Integration Architecture

The project connects three major external services.

```text
                  Flask
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
      Groq        Pexels       Brevo
      LLM          Images       Email
```

# Groq

Purpose:

```text
Generate structured recipe content
```

Input:

```text
Natural-language recipe request
```

Output:

```text
Structured JSON recipe
```

# Pexels

Purpose:

```text
Find a representative food photograph
```

Input:

```text
Generated recipe name
```

Output:

```text
Image URL
```

# Brevo / Sendinblue

Purpose:

```text
Deliver password-recovery verification email
```

Input:

```text
Recipient email
Verification code
```

Output:

```text
Transactional email
```

# AI Recipe Generation — Detailed Example

A user might enter:

```text
Create a vegetarian lasagna
```

The application flow is:

```text
"vegetarian lasagna"
       │
       ▼
Flask API receives prompt
       │
       ▼
Groq system prompt:
"You are a professional chef..."
       │
       ▼
Model returns JSON
       │
       ├── recipe_name
       ├── category_name
       ├── recipe_intro
       ├── ingredients
       ├── description
       ├── preparation_time
       └── photo_url placeholder
       │
       ▼
Application searches Pexels
       │
       ▼
Real image URL added
       │
       ▼
Browser receives recipe
       │
       ▼
Form automatically filled
       │
       ▼
User reviews and edits
       │
       ▼
User manually submits
       │
       ▼
Recipe stored with user ownership
```

# Why the AI Workflow Is Useful

The design demonstrates how generative AI can augment a conventional web application without replacing normal CRUD workflows.

The AI acts as:

```text
content assistant
```

rather than:

```text
automatic database writer
```

The user remains responsible for the final save operation.

That interaction pattern is useful for:

- Recipe creation
- Product descriptions
- Content-authoring systems
- Draft generation
- CMS assistants
- Structured form completion

# Application State

The project uses several kinds of state.

## Persistent Database State

MongoDB stores:

- Users
- Recipes
- Categories
- Authentication-related metadata

## Server Session State

Flask-Session stores:

- Current user ID
- Login timestamp
- TOTP workflow values
- Role
- TOTP verification state

## Browser State

The browser temporarily holds:

- Form inputs
- Search filters
- AI-generation prompt
- Generated recipe before submission
- UI loading states

## External Service State

External APIs provide:

- Model responses
- Food-image search results
- Email delivery

# Important Application Workflows

# Workflow A — New User to First Recipe

```text
Landing page
    │
    ▼
Signup
    │
    ▼
Account inserted into MongoDB
    │
    ▼
Login
    │
    ▼
TOTP flow when applicable
    │
    ▼
Recipe library
    │
    ▼
New Recipe
    │
    ▼
Manual entry or AI generation
    │
    ▼
Save
```

# Workflow B — Recipe Discovery

```text
Recipe library
      │
      ▼
Enter keyword
      │
      ├── Recipe title
      ├── Prep time
      └── Cuisine
             │
             ▼
          MongoDB
             │
             ▼
        Matching cards
             │
             ▼
        Recipe detail
```

# Workflow C — AI Recipe Assistant

```text
Natural-language idea
        │
        ▼
Groq
        │
        ▼
Structured recipe JSON
        │
        ▼
Pexels photo
        │
        ▼
Prefilled recipe form
        │
        ▼
Human review
        │
        ▼
MongoDB insert
```

# Workflow D — Password Recovery

```text
Forgot password
       │
       ▼
Enter email
       │
       ▼
Six-digit verification code
       │
       ▼
Brevo transactional email
       │
       ▼
Verify code
       │
       ▼
Choose replacement password
       │
       ▼
Update account
```

# Workflow E — TOTP Login

```text
Email + password
       │
       ▼
Password verified
       │
       ▼
TOTP required
       │
       ▼
Authenticator code
       │
       ▼
PyOTP verification
       │
       ▼
Session initialized
       │
       ▼
Authenticated recipe interface
```

# Functional Areas Demonstrated

The repository covers several software-engineering domains.

## Web Application Development

- URL routing
- GET and POST handlers
- Template rendering
- Redirects
- Flash messages
- Session state
- Form processing

## Authentication

- Registration
- Login
- Password hashing
- Password requirements
- Session lifetime
- Logout

## Multi-Factor Authentication

- TOTP secret generation
- Provisioning URI
- QR code
- One-time code verification
- TOTP account metadata

## Database Development

- MongoDB connection
- Queries
- Inserts
- Updates
- Deletes
- Object IDs
- Flexible documents

## CRUD

- Recipe CRUD
- Category CRUD
- User administration

## AI Integration

- Prompt construction
- LLM API request
- Structured JSON output
- JSON parsing
- Form prepopulation
- Human review

## External APIs

- LLM service
- Image-search service
- Transactional email service

## Frontend Development

- Responsive pages
- Dynamic forms
- Search filters
- JavaScript events
- AJAX
- Loading states
- Toast notifications

# Engineering Skills Demonstrated

- Python
- Flask
- Flask routing
- Jinja2
- MongoDB
- MongoDB Atlas
- PyMongo
- BSON ObjectId
- Flask-WTF
- WTForms
- Flask-Session
- Flask-Bcrypt
- bcrypt
- PyOTP
- TOTP
- QR-code enrollment
- Flask-Limiter
- Flask-Talisman
- CSRF protection
- Password validation
- User sessions
- Role-based interface behavior
- CRUD application development
- REST-like JSON endpoints
- AJAX / Fetch API
- Groq API integration
- Generative AI
- Structured LLM output
- Prompt engineering
- JSON parsing
- Pexels API
- Brevo / Sendinblue API
- HTML
- CSS
- JavaScript
- Materialize CSS
- Tailwind CSS
- Responsive design
- Error handling
- Environment-variable configuration

# Project Highlights

The strongest portfolio points are:

1. **Full-stack implementation**  
   The project covers database persistence, application routing, templates, forms, frontend JavaScript, authentication, and third-party APIs.

2. **AI integrated into a real CRUD workflow**  
   The recipe generator is connected directly to an ordinary application feature rather than existing as an isolated chatbot.

3. **Structured LLM response handling**  
   The model is instructed to return a defined recipe schema that maps directly to form fields.

4. **Human-in-the-loop AI interaction**  
   Generated content is reviewed by the user before being persisted.

5. **Multi-factor authentication**  
   The project includes TOTP enrollment and verification with QR codes.

6. **MongoDB-backed ownership model**  
   Recipes are associated with their creator.

7. **Search and content organization**  
   Recipes can be searched and filtered by several fields.

8. **Multiple external-service integrations**  
   Groq, Pexels, and Brevo are integrated into separate workflows.

# Feature Matrix

| Area | Implemented feature |
|---|---|
| Public site | Landing page |
| Authentication | Signup |
| Authentication | Login |
| Authentication | Password hashing |
| Authentication | Password requirements |
| Authentication | Session expiration |
| Authentication | Logout |
| MFA | TOTP enrollment |
| MFA | QR code |
| MFA | Login code verification |
| Recovery | Email verification code |
| Recipes | Browse |
| Recipes | Search |
| Recipes | View detail |
| Recipes | Create |
| Recipes | Edit |
| Recipes | Delete |
| Recipes | Ownership |
| AI | Recipe generation |
| AI | Structured JSON |
| Media | Pexels image lookup |
| Categories | List |
| Categories | Create |
| Categories | Edit |
| Categories | Delete |
| Administration | List users |
| Administration | Edit user |
| Administration | Role field |
| Administration | Delete user |
| Frontend | Responsive templates |
| Frontend | Advanced filters |
| Frontend | Dynamic password feedback |
| Frontend | AJAX generation |
| Errors | 400 page |
| Errors | 403 page |
| Errors | 404 page |
| Errors | 500 page |

# Roadmap Listed in the Repository

The README identifies several planned features:

- Recipe ratings and reviews
- Search by ingredients
- REST API endpoints
- Saved or favorite recipes
- Automated tests

These are useful future directions for expanding the application.

# Potential Evolution of the Product

From a product perspective, the current system can naturally grow into a broader recipe-community platform.

Possible product extensions include:

```text
Current CRUD recipe system
        │
        ▼
Favorites and collections
        │
        ▼
Ratings and reviews
        │
        ▼
Ingredient-aware search
        │
        ▼
Meal planning
        │
        ▼
Shopping lists
        │
        ▼
Nutrition metadata
        │
        ▼
Public REST API
        │
        ▼
Mobile or SPA client
```

These ideas align with the application's existing data and user flows.

# Resume-Ready Project Title Options

Suitable titles include:

1. **Secure Recipe Management System**
2. **AI-Assisted Recipe Management Platform**
3. **Full-Stack Recipe Management Application**
4. **Recipe Haven — AI-Powered Recipe Platform**
5. **Flask and MongoDB Recipe Management System**

# Resume-Ready Description

**Secure Recipe Management System**

Developed a full-stack recipe-management platform using Python, Flask, MongoDB Atlas, Jinja2, JavaScript, and Materialize CSS. Implemented account registration and login, bcrypt password hashing, server-side sessions, TOTP two-factor authentication with QR-code enrollment, password recovery through transactional email, recipe and cuisine CRUD workflows, ownership-based recipe editing, advanced recipe search, and administrative user management. Integrated Groq to generate structured recipe content from natural-language prompts, Pexels to retrieve matching food images, and browser-side JavaScript to prefill editable recipe forms before persistence.

# Resume Bullet Version

- Built a full-stack Flask and MongoDB recipe-management application supporting user authentication, recipe CRUD, cuisine management, search, user administration, and responsive Jinja interfaces.
- Implemented TOTP-based two-factor authentication with PyOTP and QR-code enrollment, server-side session management, password-complexity validation, bcrypt hashing, CSRF-protected forms, and login rate limiting.
- Integrated the Groq API to transform natural-language prompts into structured recipe JSON containing names, cuisines, introductions, ingredients, preparation instructions, and cooking times.
- Connected Pexels image search to the AI-generation workflow to automatically retrieve relevant food photography for generated recipes.
- Developed a human-in-the-loop recipe-generation experience in JavaScript that asynchronously requests AI content, populates the recipe form, and allows users to review and edit results before saving.
- Designed MongoDB collections and CRUD workflows for users, recipes, and cuisine categories, associating recipe records with their creators.
- Implemented password recovery using six-digit verification codes delivered through the Brevo transactional-email API.
- Built recipe-search and filtering interfaces for recipe names, preparation times, and cuisine categories using MongoDB queries and responsive Materialize components.

# Concise Resume Version

Built an AI-assisted recipe-management platform with **Flask, MongoDB Atlas, Jinja2, JavaScript, Groq, Pexels, PyOTP, and Brevo**, featuring authentication, TOTP 2FA, password recovery, recipe/category CRUD, search, ownership-aware editing, user administration, and human-reviewed AI recipe generation.

# Portfolio Description

The Secure Recipe Management System is a full-stack Flask application for discovering, creating, organizing, and managing recipes. Users can register, authenticate, configure TOTP-based two-factor authentication, browse a shared recipe library, search by recipe attributes, create and manage recipes, and organize them by cuisine. The application includes an AI assistant powered by Groq that generates structured recipe content from natural-language prompts and enriches the result with food photography from Pexels. Generated content is placed into the standard recipe form for user review before it is saved to MongoDB.

# Compact Portfolio Description

Full-stack recipe platform built with **Python, Flask, MongoDB, Jinja2, JavaScript, Groq, Pexels, PyOTP, and Brevo**. Supports authentication, TOTP 2FA, password recovery, recipe and category CRUD, recipe search, user management, and AI-assisted recipe generation.

# LinkedIn Project Description

Developed a Flask and MongoDB recipe-management application combining traditional CRUD functionality with generative AI. The platform includes account registration, bcrypt authentication, TOTP two-factor authentication, password recovery, server-side sessions, recipe and cuisine management, recipe ownership, advanced search, and user administration. Integrated Groq for structured recipe generation, Pexels for food-image retrieval, and Brevo for transactional recovery emails, with Jinja, Materialize CSS, Tailwind CSS, and JavaScript providing the user interface.

# Interview Talking Points

## What is the project?

It is a full-stack Flask recipe-management application where authenticated users can browse a shared recipe library, search recipes, create recipes, edit or delete their own recipes, manage cuisine categories, and use an AI assistant to generate recipe drafts.

## What makes the project different from a standard CRUD application?

The application combines a normal recipe CRUD workflow with generative AI. A user can describe a dish in natural language, the backend requests structured JSON from Groq, Pexels supplies a matching food image, and JavaScript fills the regular recipe form so the user can review the generated content before saving it.

## How does the AI recipe generator work?

The browser sends the user's prompt to a Flask JSON endpoint. The backend gives Groq a system prompt defining a strict recipe schema. The response is cleaned and parsed as JSON. The recipe name is then used to search Pexels for a food image. The complete recipe object is returned to the browser and mapped into the form fields.

## Why use structured JSON from the LLM?

Structured output lets the application map AI-generated content directly to known fields:

```text
recipe name
cuisine
introduction
ingredients
instructions
preparation time
photo
```

This is more useful for application integration than receiving an unstructured paragraph.

## How is MongoDB used?

MongoDB stores three main types of records:

```text
users
recipes
categories
```

Recipes contain the creator's user identifier and fields such as name, cuisine, ingredients, instructions, preparation time, introduction, and image URL.

## How is authentication handled?

The project uses Flask sessions and bcrypt password hashes. Registration validates user input and password rules. Login verifies the password hash and then routes users through the TOTP flow when configured.

## How does two-factor authentication work?

PyOTP generates a Base32 secret. The application creates a provisioning URI and displays it as a QR code. The user scans it with an authenticator application and enters a six-digit code. Future login flows can require another generated TOTP code before the authenticated session is initialized.

## What external APIs are integrated?

Three main integrations are used:

```text
Groq → recipe generation
Pexels → food images
Brevo → password recovery emails
```

## How does recipe ownership work?

Each recipe stores the creating user's ID. The interface displays editing controls when the current user's session ID matches the recipe's owner ID, and backend recipe edit/delete operations use that ownership association.

## How does search work?

The recipe library accepts recipe name, preparation time, and category query parameters. Flask converts active values into case-insensitive regular expressions and queries MongoDB for matching recipe documents.

## What frontend technologies were used?

The application is server-rendered with Jinja templates and uses Materialize CSS for the authenticated interface, Tailwind on public/authentication layouts, custom CSS, Material Icons, and JavaScript for interactive features such as password feedback, filtering, and AI form generation.

# Skills Keywords for CV or ATS

```text
Python
Flask
MongoDB
MongoDB Atlas
PyMongo
Jinja2
JavaScript
HTML
CSS
Materialize CSS
Tailwind CSS
Generative AI
Groq API
LLM Integration
Prompt Engineering
Structured Outputs
REST APIs
AJAX
Fetch API
JSON
Bcrypt
TOTP
PyOTP
Two-Factor Authentication
Flask-WTF
WTForms
CSRF
Flask-Session
Flask-Limiter
Pexels API
Brevo API
CRUD
Authentication
Session Management
Web Development
NoSQL
Third-Party API Integration
```

# Suggested Resume Technology Line

**Technologies:** Python, Flask, MongoDB Atlas, PyMongo, Jinja2, JavaScript, Materialize CSS, Tailwind CSS, Groq API, Pexels API, Brevo API, PyOTP, Flask-WTF, Flask-Session, Flask-Bcrypt, Flask-Limiter.

# Suggested Portfolio Feature Line

**Key features:** AI-assisted recipe generation, structured LLM output, recipe search and filtering, user-owned recipe CRUD, cuisine management, TOTP 2FA, QR-code enrollment, password recovery, administrative user management, responsive Jinja interface, and external image/email integrations.

# Project Summary for a Technical Interview

The Secure Recipe Management System is a Flask monolith that demonstrates how to integrate user accounts, MongoDB CRUD operations, server-rendered views, JavaScript interactivity, and generative AI in one application.

Its technical flow can be summarized as:

```text
Flask routes
   │
   ├── Authentication and sessions
   ├── Recipe CRUD
   ├── Category CRUD
   ├── User administration
   ├── Password recovery
   └── TOTP
        │
        ▼
MongoDB persistence

AI flow
User prompt
   │
   ▼
Groq
   │
   ▼
Structured recipe
   │
   ▼
Pexels image
   │
   ▼
Browser form
   │
   ▼
Human review
   │
   ▼
MongoDB
```

The project demonstrates the ability to combine:

```text
traditional backend engineering
+
NoSQL data modeling
+
frontend interaction
+
authentication workflows
+
generative AI APIs
```

inside a coherent user-facing product.

# Final Project Positioning

A strong and accurate positioning is:

> An AI-assisted full-stack recipe-management platform built with Flask and MongoDB, combining secure account workflows, TOTP two-factor authentication, searchable recipe CRUD, cuisine management, user administration, transactional email, structured LLM recipe generation, and automatic food-image enrichment.

For a resume, the most valuable themes are:

```text
Full-stack Flask development
MongoDB CRUD and data modeling
Authentication and TOTP
Generative AI integration
Structured LLM output
External API integration
Responsive frontend development
Human-in-the-loop AI workflow
```

The project can therefore be presented not merely as a recipe website, but as a practical demonstration of integrating conventional web application architecture with AI-assisted content generation and multi-service API workflows.
