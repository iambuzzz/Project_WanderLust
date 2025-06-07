# Travello

Travello is a web application designed to help users discover and list accommodations, similar to Airbnb. It allows users to browse various listings, add their own, and review existing ones. This project is built primarily with Node.js, Express, and MongoDB.

---

## Table of Contents

* [Features](#features)
* [Technologies Used](#technologies-used)
* [Getting Started](#getting-started)
    * [Prerequisites](#prerequisites)
    * [Installation](#installation)
* [Project Structure](#project-structure)
* [Usage](#usage)
* [Styling](#styling)
* [Form Validations & Error Handling](#form-validations--error-handling)
* [Reviews System](#reviews-system)
* [Express Routers](#express-routers)
* [Session Management & Flash Messages](#session-management--flash-messages)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)

---

## Features

**Phase 1: Core Listing Functionality**
* **View All Listings:** Browse a comprehensive list of available accommodations.
* **Show Individual Listing:** View detailed information about a specific listing.
* **Add New Listing:** Create and submit new accommodation listings through a dedicated form.
* **Edit Listing:** Modify existing listing details.
* **Delete Listing:** Remove listings from the database.

**Phase 2: Reviews & Advanced Features**
* **Add Reviews:** Submit comments and ratings for individual listings.
* **Delete Reviews:** Remove reviews associated with a listing.
* **Relationship Management:** Reviews are linked to listings, ensuring data integrity.
* **Client-Side Form Validation:** Basic validation on forms using Bootstrap.
* **Server-Side Form Validation:** Robust data validation using **Joi** to ensure data integrity before saving to the database.
* **Custom Error Handling:** Graceful display of errors with custom error pages.
* **Express Routers:** Organized routing structure for better code management.
* **Session Management:** Maintain user sessions and store temporary data.
* **Flash Messages:** Display one-time notification messages to users (e.g., "Listing created successfully!").

---

## Technologies Used

* **Node.js:** JavaScript runtime.
* **Express.js:** Web application framework for Node.js.
* **MongoDB:** NoSQL database for storing application data.
* **Mongoose:** ODM (Object Data Modeling) library for MongoDB and Node.js.
* **EJS (Embedded JavaScript):** Templating engine for rendering dynamic HTML.
* **EJS-Mate:** Layout and partials helper for EJS.
* **Nodemon:** Utility that monitors for changes in your source and automatically restarts your server.
* **Joi:** Schema description language and data validator for JavaScript.
* **Bootstrap:** Front-end framework for responsive and stylish UI components.
* **Font Awesome:** Icon library.
* **Connect-Flash:** Middleware for storing flash messages in the session.
* **Express-Session:** Middleware for managing sessions.
* **Cookie-Parser:** Middleware to parse cookies.

---

## Getting Started

Follow these steps to set up and run the Travello project on your local machine.

### Prerequisites

Make sure you have the following installed:

* **Node.js**: [Download and Install Node.js](https://nodejs.org/en/download/)
* **npm**: Comes with Node.js.
* **MongoDB**: [Install MongoDB Community Edition](https://docs.mongodb.com/manual/installation/)
* **Git**: [Download and Install Git](https://git-scm.com/downloads)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone [https://github.com/iambuzzz/Travello.git](https://github.com/iambuzzz/Travello.git)
    cd Travello
    ```

2.  **Initialize npm and install dependencies:**

    ```bash
    npm init -y # If you haven't already
    npm install express mongoose ejs nodemon ejs-mate joi connect-flash express-session cookie-parser
    ```

3.  **Connect to MongoDB:**
    Ensure your MongoDB server is running. The application will attempt to connect to a database named `wanderlust`.

4.  **Insert Sample Data (Optional but Recommended):**
    To populate your database with initial listings, run the `init/index.js` script:

    ```bash
    node init/index.js
    ```
    This script will first clear existing data in the `listings` collection and then insert the sample data from `init/data.js`.

5.  **Run the development server:**

    ```bash
    nodemon app.js
    ```
    (Or `node app.js` if you don't have nodemon installed globally or prefer not to use it.)

    The application should now be running at `http://localhost:8080/`.

---

## Project Structure
```
Travello/
├── public/                 # Static assets (CSS, JavaScript)
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── views/                  # EJS templates
│   ├── layouts/            # Boilerplate and shared layouts
│   │   ├── boilerplate.ejs
│   │   └── includes/
│   │       ├── navbar.ejs
│   │       └── footer.ejs
│   ├── listings/           # Templates for listing-related views
│   │   ├── index.ejs
│   │   ├── show.ejs
│   │   ├── new.ejs
│   │   └── edit.ejs
│   └── errors/             # Error pages
│       └── error.ejs
├── models/                 # Mongoose schemas and models
│   ├── listing.js
│   └── review.js
├── routes/                 # Express router modules
│   ├── listingg.js         # Routes for listings
│   └── revieww.js          # Routes for reviews
├── utils/                  # Utility functions and custom error classes
│   ├── wrapAsync.js        # Helper for handling async errors
│   └── MyError.js          # Custom error class
├── init/                   # Script for initializing database with sample data
│   ├── index.js
│   └── data.js
├── schema.js               # Joi schemas for server-side validation
├── app.js                  # Main application entry point
├── package.json
└── README.md
```
---

## Usage

* **Homepage (`/listings`):** View all available listings.
* **View Details (`/listings/:id`):** Click on a listing card to see its full details, including existing reviews.
* **Add New Listing (`/listings/new`):** Fill out the form to create a new accommodation listing.
* **Edit Listing (`/listings/:id/edit`):** Access the edit form for a specific listing.
* **Submit Review (`/listings/:id/reviews`):** On a listing's detail page, use the form to add a new review.

---

## Styling

The project uses **Bootstrap** for its responsive design and UI components.
* **EJS-Mate** is integrated to manage `boilerplate.ejs` layout, ensuring consistent headers, footers, and other structural elements across all pages.
* A `public` folder serves static assets like custom CSS (`public/css/style.css`) and JavaScript (`public/js/script.js`).
* **Font Awesome** is used for various icons in the application.

---

## Form Validations & Error Handling

To ensure data integrity and a smooth user experience:

* **Client-Side Validation:** Implemented using Bootstrap's form validation features, providing immediate feedback to the user before form submission. This is handled by `public/js/script.js`.
* **Server-Side Validation:** Utilizes the **Joi** package to define and validate schemas for incoming request bodies. This prevents malformed data from being saved to the database, even if a user bypasses client-side validation (e.g., using tools like Hoppscotch).
    * The `schema.js` file defines the validation schemas for listings and reviews.
    * `validateListing` and `validateReview` middleware functions are used in the routes to apply these Joi schemas.
* **Custom Error Handling:**
    * `utils/wrapAsync.js` is a utility to wrap asynchronous route handlers, simplifying error propagation.
    * `utils/MyError.js` defines a custom `MyError` class for creating standardized error objects with status codes and messages.
    * A global error handling middleware in `app.js` catches errors and renders a user-friendly `errors/error.ejs` page, displaying relevant status codes and messages.
    * A `404 Page Not Found` error is handled for any unmatched routes.

---

## Reviews System

* **One-to-Many Relationship:** Listings can have multiple reviews. This relationship is established using Mongoose's `ObjectId` and `ref` in the `listing.js` schema.
* **Review Model:** A separate `review.js` model stores review details (comment, rating, creation date).
* **Review Creation:** A form on the individual listing's `show.ejs` page allows users to submit new reviews, which are then linked to that specific listing.
* **Review Deletion:** Reviews can be deleted from a listing's detail page. A Mongoose `post` middleware on the `listingSchema` ensures that when a listing is deleted, all its associated reviews are also automatically removed from the database, preventing orphaned data.

---

## Express Routers

The project utilizes **Express Routers** to modularize and organize the application's routes. Instead of having all routes in `app.js`, they are separated into dedicated files:

* `routes/listingg.js`: Handles all routes related to listings (index, show, new, create, edit, update, delete).
* `routes/revieww.js`: Manages routes for reviews (create, delete).

This approach makes the codebase cleaner, more maintainable, and easier to scale.

---

## Session Management & Flash Messages

* **Express-Session:** Used to manage user sessions. A `connect.sid` cookie is set in the browser to track user sessions. Session data, including a secret key, expiration, and `httpOnly` flag for security, is configured in `app.js`.
* **Connect-Flash:** Integrated to provide one-time "flash" messages. For example, after successfully creating a new listing, a "New listing created!" message can be displayed to the user, which disappears upon page refresh. These messages are stored in the session temporarily and then cleared after being displayed.

---

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please:

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## License

This project is licensed under the MIT License - see the `LICENSE` file for details. (Note: You may need to create a `LICENSE` file in your repository if it doesn't exist.)

---

## Contact

**Ambuj Jaiswal** - [iambuzzz](https://github.com/iambuzzz)

---
