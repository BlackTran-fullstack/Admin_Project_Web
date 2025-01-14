# Project Web Documentation

## Introduction
This document provides an overview of the project, including setup instructions, usage, and other relevant information.

## Setup Instructions
1. Clone the repository: `git clone https://github.com/BlackTran-fullstack/Project_Web.git`
2. Install the necessary dependencies: `npm install` (in project folder)
3. Run the project: `npm start` and `npm run watch` (run in 2 terminals)

## Usage
Provide detailed instructions on how to use the project.

## License
Include the license information for the project.

## Code Documentation

### Overview
The `src` folder contains all the source code for the project. Below is a detailed description of each file and its functionality.

### File Descriptions

#### `src/index.js`
This is the main entry point of the application. It initializes the app and sets up the necessary
configurations.

#### `src/config/`
This folder includes configuration settings for the project, such as database connections and API keys.

#### `src/app/controllers/`
This folder contains the controller files, which handle the business logic for different parts of the application.

- **BrandsController.js**: Manages operations related to brands.
- **CategoriesController.js**: Manages operations related to categories.
- **OrdersControllers.js**: Manages operations related to orders.
- **ProductsController.js**: Manages operations related to products.
- **SiteControllers.js**: Manages general site operations and navigation.

#### `src/app/models/`
This folder includes the data models used in the application, defining the structure of the data and interactions with the database.

- **Brand.js**: Defines the data model for the `Brand` entity.
- **Cart.js**: Defines the data model for the `Cart` entity.
- **Categories.js**: Defines the data model for the `Categories` entity.
- **Product.js**: Defines the data model for the `Product` entity.
- **User.js**: Defines the data model for the `User` entity.

#### `src/routes/`
This folder contains the route definitions, mapping URLs to the corresponding controller functions.

- **brands.js**: Routes related to brands.
- **categories.js**: Routes related to categories.
- **index.js**: Main entry point for the route definitions.
- **orders.js**: Routes related to orders.
- **products.js**: Routes related to products.
- **site.js**: Routes related to general site pages.
- **users.js**: Routes related to users.

#### `src/middleware/`
This folder includes middleware functions that process requests before they reach the controllers.

- **multer.js**: Configures Multer for file uploads.
- **multerAvatar.js**: Configures Multer for avatar uploads.
- **paginated.js**: Handles pagination for API responses.
- **passport.js**: Handles authentication using Passport.js.

#### `src/public/`
This folder contains publicly accessible assets used by the application.

- **css/**: Contains CSS files.
- **img/**: Stores static images.
- **reset.css**: Resets default styling of HTML elements.
- **script/**: Contains JavaScript files.

#### `src/resources/`
This folder contains various resources used by the application, including stylesheets and other assets.

- **scss/**: Contains SCSS files for styling the application.
- **views/**: Contains Handlebars templates for rendering HTML views.

#### `src/util/`
This folder contains utility functions and helpers used throughout the project.

### Running the Code
To run the code, navigate to the `src` folder and execute the following command:
```bash
npm run dev