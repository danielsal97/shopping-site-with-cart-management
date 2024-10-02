# Shopping Site with Cart Management

This project is a shopping site with cart management features built using Angular and Firebase. The code base includes several components, services, and models to handle shopping cart functionality, user login, product display, and more.

## Project Setup

### Prerequisites

Before running the project, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (at least v14.0.0)
- [Angular CLI](https://angular.io/cli) (at least v12.0.0)
- [Firebase CLI](https://firebase.google.com/docs/cli)

### Getting Started

1. **Clone the repository:**
    ```bash
    git clone https://github.com/danielsal97/shopping-site-with-cart-management.git
    cd shopping-site-with-cart-management
    ```

2. **Install dependencies:**
    Install the project dependencies using npm.
    ```bash
    npm install
    ```

3. **Run the development server:**
    To serve the Angular app on your local machine, run:
    ```bash
    ng serve -o
    ```

    This command will automatically open the project in your default browser. By default, it will run on `http://localhost:4200`.

4. **Build the project:**
    To build the project for production, run:
    ```bash
    ng build
    ```

5. **Firebase Configuration:**
    The project uses Firebase for authentication and database. Make sure to configure Firebase correctly in the `firebase.json` and `src/environments/environment.ts` files.

6. **Deploy to Firebase:**
    To deploy the project to Firebase Hosting, run:
    ```bash
    firebase deploy
    ```
