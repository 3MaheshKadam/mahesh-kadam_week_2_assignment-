
#Travel Listings Application
This is a Travel Listings Application built using React.js, Redux, Tailwind CSS, and Express.js (backend). The project allows users to browse, search, and create travel listings. It includes user authentication, a search feature, and a dashboard to view and manage listings.

Features

 User Authentication: Secure user login and sign-up functionality.
 Search Functionality: Users can search for travel listings using the search bar.
 Create Listings: Authenticated users can create new travel listings.
 Responsive Design: The UI is built with Tailwind CSS and is fully responsive for mobile, tablet, and desktop views.
 User Dashboard: Users can view their own listings in a dashboard, allowing them to manage and edit them.
 Profile: Display user's profile details including an avatar image.

 
Technologies Used

Frontend:
React.js
Redux (for state management)
Tailwind CSS (for styling)
React Router DOM (for navigation)
React Icons (for icons)
Backend:
Node.js with Express.js
MongoDB (for database)
Installation and Setup Instructions
Prerequisites
Make sure you have the following installed:

Node.js (v14 or above)
npm (v6 or above)
MongoDB
Steps to Run Locally
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/your-repo-name.git
Install dependencies for the client:

bash
Copy code
cd client
npm install
Install dependencies for the server:

bash
Copy code
cd ../api
npm install
Create .env file in the api directory with the following variables:

env
Copy code
MONGO_URI=your_mongo_database_url
JWT_SECRET=your_jwt_secret
Run the client:

bash
Copy code
cd client
npm start
Run the server:

bash
Copy code
cd ../api
npm run dev
Available Scripts
In the project directory, you can run:

Frontend (Client):

npm start to start the development server for the frontend.
Backend (API):

npm run dev to start the Express server in development mode.
Usage
Home Page: Users can browse existing travel listings.
Search: Use the search bar to find specific travel destinations or places.
User Registration/Login: Sign in to create and manage your own listings.
Create Listings: After logging in, users can create new travel listings via the "New Travel" button.
Profile: Click on the avatar in the header to view profile information.
Folder Structure
bash



.
├── client               # Frontend code
│   ├── src
│   │   ├── components   # Reusable UI components
│   │   ├── pages        # Application pages
│   │   ├── store        # Redux store and slices
│   │   └── App.js       # Main entry file
│   └── public           # Static files
│
├── api                  # Backend code (Express.js)
│   ├── models           # Mongoose models
│   ├── routes           # API routes
│   ├── controllers      # Logic for route handling
│   └── server.js        # Main server entry
└── README.md            # Project documentation


Screenshots
Home Page
![image](https://github.com/user-attachments/assets/5c4bf4e3-0873-4ea6-9814-7a61478df060)


User Profile
![image](https://github.com/user-attachments/assets/22e61283-67e7-476b-8cc1-c8413584b114)
![image](https://github.com/user-attachments/assets/abf0893d-8515-486f-8b6a-7c929ddfce9f)


Create Listing
![image](https://github.com/user-attachments/assets/f95c17f8-4944-4fc2-8a93-41e78ca1c2bd)

Update Listing ![image](https://github.com/user-attachments/assets/5ba15aa9-2d6c-4f9d-bcf9-735a104bf488)


Future Enhancements
Edit Listings: Allow users to edit their own travel listings.
Comments and Ratings: Enable users to leave comments and rate listings.
Admin Panel: Create an admin dashboard for managing all user listings.
