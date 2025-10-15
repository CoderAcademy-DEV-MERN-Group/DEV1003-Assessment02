# DEV1003 Assessment 02 - Construct a Back-End Web Application

Due date: 09/11/2025

## Back-End Design Brief

The project must contain a README which:

1. Explains all used technologies such as:
   - Dependent software and packages (at least FOUR external packages)
   - Hardware required
     - Hardware requirements: Modern computer with internet connection, sufficient storage for project and files.
     - Software requirements: node.js compatible OS (Windows, macOS, Linus), modern web browser (Chrome, Firefox, Safari, Edge), Node.JS runtime environment
   - Purpose of the chosen technology and comparisons to alternative technology choices:
     - React v Angular, Vue.js
       - React will be used to manage display, UI states, modals, forms, which are major concerns of our front end
       - React Hooks are a simple and easy to implement way of controlling states and modals
       - Angular has multiple ways of managing states and modals, but this requires multiple services and dependencies, making for overloaded boilerplate
       - Vue.js uses Options API and COmposition API which can be complex
     - Express v Django, Springboot
       - Express will be used to control routes, middleware, authentication and authorisation
       - Express is a well established industry standard, used by x% of developers
       - Django offers... however...
       - Springboot offer... however...
     - Mongoose & MongoDB v PostgreSQL & Marshmallow, alternative noSQL dbs
       - MongoDB offers flexible and scalable documents, and integrates well with JSON for our server and front-end
       - Mongoose offers strict validation schemas and sanitisation to avoid data corruption in our database
       - The combination of JSON native data and application level validation is exactly what our application needs
       - SQL databases such as PostgreSQL are not required for this application as strict relationships are not enforced, and preference for scalability and performance speed is more highly valued
       - Other noSQL databases offer similar flexibility however...
   - licensing of chosen technologies
2. An identification and explanation of the style guide

The application must:

1. Demonstrate usage of a defined style guide:
   - **Option one:** Reference an existing style guide in Readme
   - **Option two:** Create and explain your own invented style guide in Readme
     All code developed must meet the chosen style guide
2. DRY principles must be used across entire code base
3. Appropriate use of external libraries and packages (NPM)
4. Create secure web server endpoints using headers, body content, params and auth
5. Create endpoints using HTTP verbs for CRUD operations: GET POST PUT PATCH DELETE
6. Create tests covering app functions: (E.G CRUD operations should all have tests)
7. Appropriate use of error handling

---

## Back-End Rubric

1. **EXPLAINS the relevance and impact of the utilised hardware and software technologies within a software project. (15% - Priority High)**
   - Appropriate explanation of ALL hardware and software technologies used including ALL of the following: (can be lifted in part from existing planning docs. Deployment is not actually required by either assessment so not included here)
     - Industry relevance of chosen technology
       - Backend: Node.js & Express.js, MongoDB with Mongoose
       - Frontend: React
       - Security and testing: JWT, bcrypt, helmet, cors, jest
     - Comparisons to alternative technology choices
       - Backend: Django, Springboot, SQL databases, alternative noSQL
       - Frontend: Vue.js, Angular
       - Security and testing: ?
     - Purposes of chosen technologies
       - Backend: Node.js provides runtime environ, Express.js handles ... MongoDB provides... Mongoose ...
       - Frontend: React manages UI state, etc
       - Security: as above
     - Licensing of chosen technologies
       - Easy to figure out
2. **APPLIES established code style and conventions in the specified programming language consistently in all code produced (5% - Priority Low)**
   - Applies code style and convention consistently across ALL CODE produced with NO BREACHES
3. **APPLIES DRY coding principles to code (10% - Priority Medium)**
   - Applies DRY coding principles to the ENTIRE codebase
4. **UTILISES an external library with valid import statements and sensible usage of the library (5% - Priority Low)**
   - Correctly imports FOUR OR MORE relevant external libraries into the code, and uses all imported libraries appropriately
5. **DEVELOPS a web server that uses industry-standard internet communication features (10% - Priority Medium)**
   - Correctly and sensibly uses ALL of the industry-standard features listed below in the code developed for the web server:
     - Headers (auth tokens, types, any other fun things)
     - Body Content (JSON EVERYWHERE)
     - Params (queries, searches, get/api/user.id)
     - Authorization (protected routes, features)
6. **DEVELOPS a web server that uses industry-standard internet communication protocols (10% - Priority Medium)**
   - COMPLETELY APPROPRIATE usage of industry-standard HTTP verbs, with NUMEROUS verbs implemented within the web server code appropriate for CRUD functionality - GET POST PUT PATCH DELETE, could use HEAD or others as bonus, but only the standards are required
   - Distinction requirement says "ONE OR TWO" verbs implemented within the web server code appropriate for CRUD functionality, so one would assume if all of ours are and they are the right verbs we're golden
7. **CREATES tests appropriate to essential application functionality (10% Priority Medium)**
   - Creates at least FIVE working tests for AT LEAST FOUR different functions required and used by the application
8. **CREATES an application which handles errors (15% - Priority High)**
   - Application handles ALL CATEGORIES of errors GRACEFULLY
     - Error handlers for foreseeable errors in general, specific errors on routes as custom, and general catch alls (404 route handler, server error handlers etc) should NEVER crash the application
9. **COLLABORATES professionally and efficiently with a team during a project (20% - Priority Very High)**
   - No time spent on this one, just the same peer review as usual

---

## Time Estimates by Rubric

### Combined README - Technologies & Hardware (25% total - 15% back-end + 10% front-end) - Priority High

**Estimate:** 3-4 hours (combined)  
**Tasks:**

- Single comprehensive technologies section
- Document full MERN stack with purposes
- Compare alternatives (React vs Angular, MongoDB vs PostgreSQL, etc.)
- Explain all licensing
- Document combined hardware/software requirements
- Cover both front-end and back-end dependencies

### Combined README Code Style Guide (10% total - 5% each) - Priority Medium

**Estimate:** 1-2 hours (combined)  
**Tasks:**

- Document single style guide approach for full stack
- Explain ESLint + Prettier configuration
- Cover both back-end and front-end conventions
- Document team adherence process

### 3. Applies DRY Principles (10%) - Priority High

**Estimate:** 2-3 hours  
**Tasks:**

- Identify code repetition opportunities
- Create reusable middleware functions
- Implement utility functions for common operations
- Refactor duplicate route logic

### 4. Utilizes External Libraries (5%) - Priority Medium

**Estimate:** 1-2 hours  
**Tasks:**

- Research and select 4+ relevant npm packages
- Implement bcrypt, JWT, Mongoose, Express middleware
- Document purposes and usage

### 5. Develops Web Server Communication (15%) - Priority High

**Estimate:** 4-5 hours  
**Tasks:**

- Implement headers, body, params, authorization
- Create request/response middleware
- Set up CORS and security headers
- Handle different content types

### 6. Develops HTTP Verbs for CRUD (10%) - Priority High

**Estimate:** 3-4 hours  
**Tasks:**

- Implement GET/POST/PUT/PATCH/DELETE routes
- Create full CRUD for users, movies, ratings
- Handle relationship endpoints (friendships)

### 7. Creates Tests (10%) - Priority Medium

**Estimate:** 2-3 hours  
**Tasks:**

- Set up testing framework (Jest/Mocha)
- Write 5+ tests for different functions
- Test CRUD routes and error cases
- Ensure test coverage for critical paths

### 8. Creates Error Handling (15%) - Priority High

**Estimate:** 3-4 hours  
**Tasks:**

- Implement global error handling middleware
- Create specific error types (validation, auth, not found)
- Handle database connection errors
- Set up graceful shutdown procedures

### 9. Team Collaboration (20%) - Ongoing

- No time, ongoing throughout project

---

# DEV1003 Assessment 03 - Construct a Front-End Web Application

## Front-End Design Brief

The Front-end application must:

1. Demonstrate usage of a defined style guide:
   - **Option one:** Reference an existing style guide in Readme
   - **Option two:** Create and explain your own invented style guide in Readme
     All code developed must meet the chosen style guide
2. DRY principles must be used across entire code base
3. Appropriate use of external libraries and packages (NPM)
4. Appropriately use semantic HTML, keeping accessibility features in mind (alt texts, labels etc for screen readers)
5. Demonstrate responsive web design for at least 2 different devices
6. Create tests covering functionalities of the app (eg. each component should have an associated test)
7. Use appropriate error handling throughout the code

Readme matches the Back-End brief so nothing new there

---

## Front-End Rubric

1. **README RUBRIC SAME AS BACK END ASSESSMENT (15%, Priority High)**
2. **CODE STYLE RUBRIC SAME AS BACK END ASSESSMENT (5% - Priority Low)**
3. **DRY RUBRIC SAME AS BACK END ASSESSMENT (10% - Priority Medium)**
4. **EXTERNAL LIBRARY RUBRIC SAME AS BACK END ASSESSMENT (5% - Priority Low)**
5. **UTILISES HTML5 semantic elements to add meaning and cater for accessibility (10% - Priority Medium)**
   - Utilises HTML5 semantic elements in a way that SUBSTANTIALLY adds meaning and caters to accessibility (container names and ids, alt text all has to be meaningfully named etc)
6. **UTILISES CSS to create responsive web page elements that function properly across multiple screen types & resolutions (20% - Priority Very High)**
   - Utilises CSS to create responsive web page elements that COMPLETELY function across multiple different screen types and resolutions (We planned for 3 so lets do 3)
7. **CREATES tests appropriate to essential application functionality (10% - Priority Medium)**
   - Creates at least FIVE working tests for AT LEAST FOUR different functions required and used by the application
8. **ERROR HANDLING RUBRIC SAME AS BACK END ASSESSMENT (10% - Priority Medium)**
9. **COLLAB RUBRIC SAME AS BACK END ASSESSMENT (20% - Priority Very High)**

---

### Time Estimates

### Combined README - See Above

### 1. Applies DRY Principles (10%) - Priority High

**Estimate:** 2-3 hours  
**Tasks:**

- Create reusable React components
- Implement custom hooks for shared logic
- Abstract common UI patterns
- Refactor duplicate state logic

### 2. Utilizes External Libraries (5%) - Priority Medium

**Estimate:** 1-2 hours  
**Tasks:**

- Research and select 4+ React packages
- Implement React Router, styling libraries, UI kits
- Document purposes and integration

### 3. Utilizes Semantic HTML & Accessibility (10%) - Priority High

**Estimate:** 2-3 hours  
**Tasks:**

- Implement proper HTML5 semantic elements
- Add ARIA labels and accessibility features
- Ensure keyboard navigation
- Test with screen readers

### 4. Creates Responsive Design (15%) - Priority High

**Estimate:** 6-8 hours  
**Tasks:**

- Implement CSS Grid/Flexbox layouts
- Test on 3+ device types (mobile, tablet, desktop)
- Create responsive navigation and components
- Ensure touch-friendly interactions

### 5. Creates Tests (10%) - Priority Medium

**Estimate:** 2-3 hours  
**Tasks:**

- Set up React Testing Library
- Write 5+ tests for different components
- Test user interactions and state changes
- Ensure component rendering tests

### 6. Creates Error Handling (10%) - Priority High

**Estimate:** 2-3 hours  
**Tasks:**

- Implement API error boundaries
- Create user-friendly error messages
- Handle loading and empty states
- Set up offline detection

### 7. Team Collaboration (25%)

- No time, ongoing throughout project
