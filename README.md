# E-Commerce Web App 🛒✨ (A Fun Project!)

Welcome to this awesome e-commerce web app—a fun project built with **Next.js** on the frontend and **Django** on the backend! This app lets users shop, vendors sell, and everyone have a great time with features like Google Auth, Stripe payments, and a slick UI styled with Tailwind CSS. Let’s dive in! 🚀


## Features
- 🧑‍💼 User profiles for customers and vendors
- 🔐 Social authentication with Google Auth + JWT for secure logins
- 💳 Stripe payment integration for smooth and secure transactions
- 🏪 Multivendor support—multiple sellers, one platform!
- 📱 Responsive and beautiful frontend with Next.js and Tailwind CSS
- 🛠️ Robust backend API with Django and PostgreSQL

## Tech Stack
- **Frontend**: Next.js (React framework with TypeScript)
- **Backend**: Django (Python framework)
- **Database**: PostgreSQL
- **Authentication**: Google Auth (via Django Allauth) + JWT for API authentication
- **Payment**: Stripe
- **Styling**: Tailwind CSS



## Prerequisites
To get this fun project running, make sure you have:
- **Node.js** (v16 or higher) and **npm** or **yarn**
- **Python** (v3.8 or higher) and **pip**
- **PostgreSQL** (v12 or higher) installed and running
- **Virtualenv** (recommended for Python environment management)
- A **Stripe** account (for payment integration) and API keys
- A **Google Developer Console** project for Google Auth (with OAuth 2.0 credentials)

## Installation

### 1. Clone the Repository
Let’s get started by grabbing the code:
```bash
git clone https://github.com/Sudhir4500/ecommerce-1.git
cd ecommerce-1
```

### 2. Set Up the Backend (Django) 🐍
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install the Python dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```
4. Set up PostgreSQL:
   - Create a database in PostgreSQL:
     ```sql
     CREATE DATABASE ecommerce_db;
     ```
   - Update your `.env` file in the `backend` directory with your database and auth details:
     ```env
     SECRET_KEY=your_django_secret_key
     DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/ecommerce_db
     CLOUDINARY_URL=url
     GOOGLE_OAUTH2_KEY=your_google_oauth2_key
     GOOGLE_OAUTH2_SECRET=your_google_oauth2_secret
     STRIPE_SECRET_KEY=your_stripe_secret_key
     STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
     SECRET_KEY=your_jwt_secret_key
     ```
5. Run database migrations to set up the tables:
   ```bash
   python manage.py migrate
   ```
6. (Optional) Create a superuser to access the Django admin panel:
   ```bash
   python manage.py createsuperuser
   ```

### 3. Set Up the Frontend (Next.js) ⚛️
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend/multivendor
   ```
2. Install the Node.js dependencies:
   ```bash
   npm install  # Or: yarn install
   ```
3. Set up environment variables for the frontend. Create a `.env.local` file in the `frontend/multivendor` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend API URL
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

## Running the Project

### 1. Start the Backend (Django)
1. From the `backend` directory, fire up the Django server:
   ```bash
   python manage.py runserver
   ```
   The backend will be live at `http://localhost:8000`.

### 2. Start the Frontend (Next.js)
1. From the `frontend/multivendor` directory, launch the Next.js dev server:
   ```bash
   npm run dev  # Or: yarn dev
   ```
   The frontend will be ready at `http://localhost:3000`.

### 3. Access the Application 🎉
- Open your browser and go to `http://localhost:3000` to see the app in action!
- The backend API is at `http://localhost:8000/api`.
- Check out the Django admin panel at `http://localhost:8000/admin` (login with your superuser credentials).

## Contributing
Want to make this project even more fun? Here’s how to contribute:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature/your-cool-feature`).
3. Add your changes and commit them (`git commit -m "Added a cool feature!"`).
4. Push to your branch (`git push origin feature/your-cool-feature`).
5. Open a pull request—we’d love to see your ideas! 🌟

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

### Fun Notes:
- **Google Auth**: The app uses Google OAuth for social login, powered by Django Allauth. Make sure to set up your Google Developer Console project and grab your OAuth 2.0 credentials.
- **JWT**: JWT is used for API authentication, keeping things secure and stateless.
- **Stripe**: Stripe handles payments—test it out with Stripe’s test cards (e.g., `4242 4242 4242 4242`) in development mode.
- **Tailwind CSS**: The UI is styled with Tailwind CSS, so feel free to tweak the classes to make it even prettier! 🎨
