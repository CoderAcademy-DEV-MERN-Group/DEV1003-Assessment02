<!-- # DEV1003-Assessment02

Backend API for a Full Stack MERN project!

**Moderate security vulnerability from Validatorjs:**
`isURL` validator accepts some url formats which should not be accepted.
This occurs only through direct user entry of urls.
Applying a discrete protocol argument will negate this issue, currently being worked on in a PR on their repo further information and pull request [available here](https://github.com/validatorjs/validator.js/pull/2608)
Will update to latest version once fix has been completed

---

# Readme plan:

1. Explains all used technologies such as:
   - Dependent software and packages (at least FOUR external packages)
   - Hardware required
     - Hardware requirements: Modern computer with internet connection, sufficient storage for project and files.
     - Software requirements: node.js compatible OS (Windows, macOS, Linus), modern web browser (Chrome, Firefox, Safari, Edge), Node.JS runtime environment
   - Purpose of the chosen technology and comparisons to alternative technology choices:
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
2. An identification and explanation of the style guide -->

# The Century Screening Room Backend API

## Programming Style Guide

This project adheres to the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript), enforced through ESLint configuration and Prettier formatting to ensure quality and maintainability. This style guide allows our code to be more consistent, readable, predictable and efficient.

---

## 1. Technology Stack

### 1.1 Core Dependencies

### Node.js

- **Industry Relevance**: As of the most recent [Stack Overflow Survey](https://survey.stackoverflow.co/2025/technology/) Node.js remains the most used JS runtime environment, both amongst professional developers and student developers, with 48% of developers having used it extensively in their projects. Node.js has wide community support, and is still the most accessible runtime environment, no matter what JS framework you are using for your API. Node is also open source, allowing for flexible use and project specific manipulation.
- **Purpose & Usage**: Node.js executes all server-side Javascript. It essentially allows all of our coded .js files to run without the need for a browser to interpret JS language. Node.js allows us to develop our entire stack using unified JavaScript code, unlike other runtime environments which may fragment development into separate languages.
- **Comparison**:
  - **Deno**: A newer JS runtime by the same creator as Node.js, with built in TypeScript support. The ecosystem itself is smaller, with less support and community use. Though it includes more built in packages, it is not well maintained. Node.js better serves our application due to wide community support and thorough documentation.
  - **Bun**: A smaller but all-in-one JS toolkit, it is written in Zig (a newer systems programming language) which offers better performance in comparison to Node's C++ architecture. Again, the ecosystem and community support for Bun is not wide, and it does involve a higher learning curve than Node.js, and can be difficult to troubleshoot due to lower uptake across the dev community.
- **License**: MIT License

#### Express.js

- **Industry Relevance:** As of the most recent [State of Javascript Survey](https://2024.stateofjs.com/en-US/other-tools/#backend_frameworks) Express.js is still the most used back-end framework, with 68% of respondents having used it in their development. It is still the foundation for many other frameworks (Nest.js, Feathers, LoopBack) and has a huge amount of accessible documentation and community support.
- **Purpose & Usage:** Express.js serves as the back-end web framework for our Single Page Application (SPA) for routing, middleware, and API endpoint management. It facilitates communication between the front-end client and our MongoDB database.
- **Comparison:**
  - **Django**: A Python based web framework which is not applicable for our MERN stack architecture plan. Django APIs tend to have more boilerplate, and work more seamlessly with SQL databases, as opposed to our MongoDB NoSQL database.
  - **Spring Boot**: A Java based framework that requires more configuration, and has a steeper learning curve. It has many powerful in built libraries which can be implemented easily in enterprise applications, however it's heavier than needed for our MERN stack, and would likely introduce unnecessary complexity.
  - **Next.js**: A React-based full-stack framework with limited back-end capabilities. Our architecture plan relies on separation of concerns to ensure security and database integrity, and though capable, Next.js offers less back-end API flexibility compared to a dedicated Express.js back-end.
  - **Nest.js**: A TypeScript based framework built on Express that provides more structure, but adds layers of abstraction which, due to the scope and scale of our application, are not necessary and would lead to over-engineered boilerplate.
- **License:** MIT License

#### MongoDB & Mongoose

- **Industry Relevance:** As of the most recent [Stack Overflow Developer Survey](https://survey.stackoverflow.co/2024/technology#most-popular-technologies-database) MongoDB is the highest ranked NoSQL database, with 24.8% of developers using it in their development. It is also the most used amongst those learning to code. It has strong community support and well written comprehensive documentation. Mongoose ODM is widely used, reaching over 5million weekly downloads on npm, and its support of schema enforcement and middleware hooks provide high data integrity standards which MongoDB's native drivers lack.
- **Purpose & Usage:** MongoDB serves as our primary database, while Mongoose uses schema and middleware hooks to sanitise and protect our data integrity. This allows us to enforce data hashing for private information, as well as protecting our database from malicious data injection.
- **Comparison:**
  - **SQL Databases**: SQL databases enforce greater data protection, and enforced relationships. Using a noSQL database is more appropriate for our application, allowing for flexible documents, faster queries, and better long term scalability. The MERN stack's shared JavaScript ecosystem (MongoDB, Express, React, Node) allows more natural development cycle, with Mongoose providing seamless MongoDB integration.
  - **Redis**: A key-value in-memory NoSQL storage system. Redis is the fastest option for caching and session management, however that data is ephemeral. Our application requires persistent, frequently updated user documents and movie information, that demand reliable data persistence. Persistent data is also more aligned with our front-end state requirements.
  - **Cassandra**: A wide-column storage system designed for massively scalable implementation across multiple data centres. Write heavy applications are more suited to Cassandra, however complex setup and eventual consistency model (updates are not always real-time in every node) make it less appropriate for our application. MongoDB also provides more document flexibility, better real-time updates (ratings are immediate for all users) and a more developer friendly query interface.
  - **Firebase/Firestore** Google's managed NoSql database, with real-time features, widely used in mobile applications. While the features available in Firebase Firestore are powerful, it is also locked to the vendor, and requires ongoing costs for use.
- **License:**
  - **Mongoose**: MIT License
  - **MongoDB**: Apache 2.0

#### JSON Web Tokens

- **Industry Relevance:** JSON Web Token (JWT) is widely used, with nearly 20million weekly downloads on npm. It is also one of the most starred authentication libraries on GitHub, showing massive community adoption and support. JWT is also supported by all major cloud providers (AWS, Google Cloud, Azure), and is defined by the [IETF](https://datatracker.ietf.org/doc/html/rfc7519) ensuring compatibility across multiple platforms.
- **Purpose & Usage:** JWT creates secure authentication tokens, which are used across all authorised routes in our application. A securely stored encryption key ensures encrypted payloads are never exposed unintentionally.
- **Comparison:**
  - **Session Based Authentication**: Authentication is managed through the server-side database. This is more secure for sensitive data as it held in the database, but creates extra storage on databases, as well as bottlenecking of connections as the application scales. JWT works for our application's scale and current security requirements.
  - **OAuth 2.0 / OpenID Connect**: Authentication via third party access, which can use JWT to manage the access tokens securely. While this is a common modern approach to authentication, it does not necessarily suit our application's current needs.
  - **PASETO**: A more recent alternative to JWT, which addresses some security concerns associated with JWT. Currently it is not as widely used or supported as JWT, but offers more comprehensive security via mandatory strong encryption, and protection against algorithm confusion attacks. For the current level of traffic and users to our application we do not require this level of security.
- **License:** MIT License

#### bcrypt

- **Industry Relevance:** bcrypt is a popular hashing package, with more than 2million weekly downloads, and wide use and support across the community. It is slowly being replaced by more modern and secure frameworks, however it is currently still the fastest method of hashing, and given sufficient work factors (12 in our application) is still considered secure by OWASP.
- **Purpose & Usage:** bcrypt is used to securely hash passwords before storage in our database. This ensures that passwords are never stored in plain text format. bcrypt is also used to compare passwords upon login. Passwords are further secured by never being included in responses to users in either form.
- **Comparison:**
  - **Argon2**: Winner of Password Hashing Competition, is considered the most secure modern option. The process requires more computational memory and resources, and is not required for the current scale of our application.
  - **Scrypt**: Designed to be memory-hard, and more resistant to memory attacks. However much more complex to implement with a much higher learning curve. This may be implemented before v1.0.0 of our application to address any security concerns.
  - **PBKDF2**: Incredibly robust levels of work-factors, intended for enterprise level security. More complex to implement, and far beyond the level of security we need in our application at this stage.
- **License:** MIT License

### 1.2 External Packages

- **cors**: Enables cross-origin resource sharing to allow frontend-backend communication from different domains
- **dotenv**: Loads environment variables from .env file for secure configuration management
- **helmet**: Sets security headers to protect against common web vulnerabilities
- **node-fetch**: Provides HTTP client functionality for making API requests to external services
- **tsx**: Enables TypeScript execution and hot reloading during development
- **validator**: Performs data validation and sanitization on user inputs and API data

### 1.2 Development Dependencies

- **faker**: Generates realistic fake data for testing and database seeding
- **jest**: Provides testing framework for unit and integration tests with coverage reporting
- **eslint**: Identifies and fixes code quality issues according to style guide rules
- **mongodb-memory-server**: Creates in-memory MongoDB instances for isolated testing
- **prettier**: Formats code automatically to maintain consistent styling
- **supertest**: Tests HTTP endpoints and API responses with fluent assertions

### 1.3 Hardware Requirements

- Modern computer with internet connection
- Disk space: ~500MB including dependencies

### 1.4 Software Requirements

- **Development:** VSCode or similar editing software
- **Runtime:** Node.js compatible OS (Windows, macOS, Linux)
- **Environment:** Node.js runtime environment
- **Testing:** Bruno/Insomnia for HTTP requests

### 1.5 Licensing

| Package                   | License      |
| ------------------------- | ------------ |
| @faker-js/faker           | MIT          |
| @jest/globals             | MIT          |
| bcrypt                    | MIT          |
| cors                      | MIT          |
| dotenv                    | BSD-2-Clause |
| eslint-config-airbnb-base | MIT          |
| eslint-config-prettier    | MIT          |
| eslint-plugin-import      | MIT          |
| eslint-plugin-prettier    | MIT          |
| eslint                    | MIT          |
| express                   | MIT          |
| helmet                    | MIT          |
| jest                      | MIT          |
| jsonwebtoken              | MIT          |
| mongodb-memory-server     | MIT          |
| mongodb                   | Apache-2.0   |
| mongoose                  | MIT          |
| node-fetch                | MIT          |
| prettier                  | MIT          |
| supertest                 | MIT          |
| tsx                       | MIT          |
| validator                 | MIT          |

---

## 2. Running the Application

### 2.1 Installation

1. Clone the repository
2. Install the dependencies:

```bash
npm install
```

3. Set up .env variables by following the .env.example file

### 2.2 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server  
- `npm test` - Run test suite
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage reporting
- `npm run seed:movies` - Seed local database with movie data
- `npm run seed:movies:deployed` - Seed production database
- `npm run lint` - Check code for style issues
- `npm run lint-fix` - Automatically fix linting errors
- `npm run format` - Format code with Prettier

---

## 3. Future Development

### 3.1 Contributing

- **Branching and Forking**: Fork the repository and create feature branches from `main` using descriptive names (`feature/user-auth`, `fix/rating-bug`)
- **Conventional Commits**: Follow conventional commit format (`feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`, `chore:`) for clear commit history
- **Pull Requests**: Pull requests with no explanation will not be merged, please leave detailed comments in your code!
- **Issues**: Issues must be clear and concise, vague issues are non-issues!

### 3.2 Version Pipeline

**Current Version:**

**V.0.1.0** - Core functionality created and tested

- User authentication/authorisation & profiles
- Reel Canon with 100 movies
- Rating system & progress tracking
- Basic friend system
- Leaderboard

**Planned Releases:**

**V.0.2.0** - Custom lists

- User-created custom lists
- List sharing between friends
- List subscriptions without friendship
- List comparison features

**V.0.3.0** - Recommendation Engine

- Smart movie suggestions
- Friend-based recommendations
- "Next to watch" features

**V.0.4.0** - Achievements & Advanced Leaderboards

- Genre-specific leaderboards
- Enhanced leaderboards accounting for social features
- Challenge system
  - Trophies based on Genre
  - Base trophy implementation for Reel Canon completion

**V.0.5.0** - Enhanced Social & Notification System

- Movie discussions and user reviews
- Social interactions
- Notifications for friend requests

**V.1.0.0** - Production release

- Real-time notifications
- Production optimization
