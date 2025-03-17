# CS50W Final Project - CAPSTONE

# coXpense Project Overview
The **coXpense** application allows users to create collaborative activities with others to share expenses. Its goal is to facilitate joint expense management by enabling detailed tracking of each transaction, including the date, amount, person who made the expense, and participants sharing each expense. Additionally, the application generates a balance showing the expenses made by each user in the collaborative activity. It is a mobile-responsive and user-friendly application.

## Functionalities:

### 1. Registration is done through a form that anyone can complete.
This form is designed with controls to ensure that the information is entered correctly. It contains the following fields:
   
&nbsp;&nbsp; a. Username. This will be used along with the password to log in to the app. It will be the alias shown to other users. It is unique and can only be used by one user.  
&nbsp;&nbsp; b. First Name  
&nbsp;&nbsp; c. Last Name  
&nbsp;&nbsp; d. Email Address  
&nbsp;&nbsp; e. Password  
&nbsp;&nbsp; f. Profile Picture (optional field)


### 2. Users are organized into groups to share expenses.
 Any user can create a group and invite other users to join the same group. Groups contain the following information, organized by tabs:
 
 &nbsp;&nbsp; a. **Expenses**: This tab shows the group's expenses and buttons that allow any group member to add, modify, or delete expenses. Each expense contains the following information:  
 &nbsp;&nbsp;&nbsp;&nbsp; i. Expense Name  
 &nbsp;&nbsp;&nbsp;&nbsp; ii. Name of the user who paid  
 &nbsp;&nbsp;&nbsp;&nbsp; iii. Names of the users sharing the expense  
 &nbsp;&nbsp;&nbsp;&nbsp; iv. Amount  
 &nbsp;&nbsp;&nbsp;&nbsp; v. Expense date  
 
 &nbsp;&nbsp; b. **Balance**: This tab shows the list of group members and, for each member, the total expenses they have made and the total expenses they have shared. Thus, it calculates for each member whether they owe something to other members (they are in the negative) or if they are owed payments from others (they are in the positive).
 
 &nbsp;&nbsp; c. **Members**: This tab shows the members that make up the group, the invitations sent to other users to join the group, and a button to send invitations to more users.

### 3. Groups information.
When users log into the app, they see the list of groups they belong to and the list of invitations they have received to join other groups. Therefore, there will be two types of cards:

&nbsp;&nbsp; a. **Group cards**: contain the following elements:  
&nbsp;&nbsp;&nbsp;&nbsp; i. Group Name  
&nbsp;&nbsp;&nbsp;&nbsp; ii. Group creation date  
&nbsp;&nbsp;&nbsp;&nbsp; iii. Button that shows the tabs described in point 2  
&nbsp;&nbsp;&nbsp;&nbsp; iv. Button to edit the group name  
&nbsp;&nbsp;&nbsp;&nbsp; v. Button to delete the group, which will delete all group information for all its members  

&nbsp;&nbsp; b. **Invitation cards**: Any group member can invite any app user to be a new member of the group. As commented before, the users can see after logging in the invitations received and accept them or decline them. All the group members see if the invited user has become a member or the invitations has been declined. This cards contain the following elements:  
&nbsp;&nbsp;&nbsp;&nbsp; i. Group Name  
&nbsp;&nbsp;&nbsp;&nbsp; ii. User who invited you to the group  
&nbsp;&nbsp;&nbsp;&nbsp; iii. Date you were invited to the group  
&nbsp;&nbsp;&nbsp;&nbsp; iv. Button to accept the invitation  
&nbsp;&nbsp;&nbsp;&nbsp; v. Button to decline the invitation  

### 4. User profile management.
The user's profile picture is displayed in the app's header and can be clicked to access a form with the same fields as the registration form described in point 1.

# Distinctiveness and Complexity

## Project Distinction

- **Collaborative and Real-World Focus**: coXpense addresses a common, real-world problem: sharing and managing expenses transparently in group settings, such as for trips, roommates, or collaborative projects.
- **Technical Complexity**: The application goes beyond basic CRUD functionalities (Create, Read, Update, Delete) and incorporates multi-user management, roles, authentication, and authorization, adding an additional layer of control and customization depending on the context of each group.

## Technological Complexity

- **Django REST Framework (DRF)**: The creation of the API was made possible by mastering DRF, which enabled a well-structured and scalable backend. This facilitated the creation of custom serializers and views.
- **Serializers**: Django REST Framework’s serializers were essential for transforming complex model data into JSON formats, allowing smooth communication between the frontend and backend. Custom serializers were used to add additional logic when transforming data.
- **REST Calls**: coXpense uses a client-server architecture based on the REST protocol (Representational State Transfer), where the React frontend interacts with the backend through HTTP requests (GET, POST, PUT, DELETE). This approach offers flexibility and scalability to the application.
- **Dynamic REST Framework**: To optimize API responses, Dynamic REST Framework was used, allowing dynamic modification of fields and relationships returned based on the client's needs, improving the application's performance and efficiency.
- **Method Overriding**: Throughout development, method overriding was extensively used both in Django and DRF, allowing the customization of default behavior in views, serializers, and models. This was key to achieving the specific behavior required by coXpense.
- **React and Its Ecosystem**: The frontend of the application is built using React, a modern and highly dynamic framework. Functional components and hooks were used to manage state and side effects. Additionally, React contexts were fundamental for sharing states and functionalities across multiple components, such as managing user sessions and authentication data.
- **Component Library**: A UI component library like Chakra UI was integrated, facilitating the creation of modern and accessible interfaces. However, it also posed a challenge in terms of adapting and customizing the components to meet the application’s needs.
- **CORS Issues**: The project involved dealing with CORS (Cross-Origin Resource Sharing) issues. CORS is a security policy implemented by browsers that prevents restricted resources on a web page from being requested from another domain, which is a common challenge in client-server architectures like coXpense. Correct middleware configuration on the server was necessary to resolve this.
- **Authentication System**: The user authentication system was implemented using JSON Web Tokens (JWT), ensuring that only authenticated users could access and modify data. This also involved creating secure endpoints, protecting routes, and managing session persistence on the frontend.


# Technologies

## Back-end 
- **Python**
- [Django](https://www.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Dynamic REST](https://github.com/AltSchool/dynamic-rest)

## Front-end
- **HTML**, **CSS**, and **JavaScript**
- [React](https://react.dev/) - JavaScript library
- [Vite](https://vite.dev/) - Bundler
- [Chakra UI](https://v2.chakra-ui.com/) - React components library

# Project Structure / Files
The capstone project consists of one app - **coXpense**.

## 1. Capstone
The main directory of the Django project.

### 1.1. settings.py
Primary configuration file for Django, containing options such as database settings, routes, applications, etc. Additional configurations have been added for the `django-cors-headers` package to enable CORS headers during development for HTTP requests from the Vite web application, as well as for `Django REST Framework (DRF)` and `Dynamic REST`.

## 2. coXpense
Django application containing the project's specific logic.

### 2.1. media
Directory for storing uploaded files, such as user images.

### 2.2. static/coXpense
Directory where the frontend will be stored when generated using the command `npm run build2django`.

### 2.3. admin.py
File where models are registered for Django administration.

### 2.4. apps.py
Application-specific configuration within the Django project. The `GroupAdmin` class has been added to improve the administration of coXpense groups.

### 2.5. models.py
Defines the data structures (models) that will be stored in the database. The built-in `User` model provided by Django has been used, and four new models have been defined: `UserProfile`, `Group`, `Invitation`, and `Expense`.

### 2.6. serializers.py
Defines the conversion of data between Python and JSON formats, used in the REST API. Five different serializers have been defined, one for each model, along with modifications to some of the serializer methods.

### 2.7. urls.py
Defines the specific URL routes for the coXpense application, including the routes provided by DRF.

### 2.8. utils.py
Contains utility functions and auxiliary logic used within the application.

### 2.9. views.py
Defines the application's views, handling HTTP requests and responses. Most views utilize Class-Based Views (CBV) since DRF is being used.

## 3. Frontend
Directory containing the source code for the frontend, developed with React.

### 3.1. public
Contains the application icon.

### 3.2. src
Directory with the source code for the frontend, including components and utilities for React.

#### 3.2.1. components
Contains React components that make up the user interface.

- **AuthContext.jsx**: Implements an authentication context in React to manage user state (ID and avatar) and persist state in localStorage.
- **Balance.jsx**: Displays the balance of a group using data retrieved from the backend, featuring visual indicators for positive and negative amounts.
- **CardList.jsx**: Lists expense cards for a group (description pending).
- **CardListWithTabs.jsx**: Displays a group name and a set of tabs, dynamically loading the group name from the backend.
- **Expenses.jsx**: Manages a group's expenses, allowing users to add, edit, and delete entries, fetching data from the API.
- **Groups.jsx**: Allows users to create, edit, and manage groups, showing invitations to join groups.
- **Login.jsx**: Enables users to log into the application by validating their credentials.
- **Members.jsx**: Manages group members, displaying current members and invitations, inviting new users.
- **NavbarWithUser.jsx**: Provides a navigation bar with user options, such as accessing the profile and logging out.
- **Profile.jsx**: Manages the display and editing of the user profile.
- **ProtectedRoute.jsx**: Protects application routes, ensuring only authenticated users can access them.
- **Signup.jsx**: Allows users to register, including field validation and the option to upload a profile image.
- **TitleUpdater.jsx**: Updates the page title according to the current route and group name.

#### 3.2.2. utils
Helper functions used in the frontend logic.

- **Constants.jsx**: Configures an Axios instance with automatic CSRF token management.
- **formatDate.jsx**: Formats a date according to the browser's locale settings.

#### 3.2.3. App.jsx
The root component of the React application.

#### 3.2.4. main.jsx
The entry point of the React application where the App component is mounted.

## 3.3. .gitignore
A list of files and folders that Git should ignore in the frontend.

## 3.4. eslint.config.js
ESLint configuration file to maintain code quality and style.

## 3.5. index.html
The main HTML page that serves the React application.

## 3.6. package.json
Contains the project's dependencies and Node.js scripts.

## 3.7. package-lock.json
Ensures specific versions of installed dependencies.

## 3.8. vite.config.js
Configuration for Vite, the build and development tool for the frontend.

## 4. .gitignore
A list of files and folders that Git should ignore throughout the entire project.


# How to run coXpense
To install the coXpense application, follow these steps:

1. Clone the repository:
```
   git clone --branch web50/projects/2020/x/capstone https://github.com/me50/carlosrova.git capstone
```
2. Navigate to the project directory:
```
cd capstone
```
3. Install the required dependencies:
```
pip install -r requirements.txt
```
4. Run migrations
```
py manage.py migrate
py manage.py makemigrations coXpense
py manage.py migrate coXpense
```
5. Run the application
```
python manage.py runserver
```


# Aditional Information:
Since Django listens on port 8000, the main routes for the project functionalities are:
- For login: http://localhost:8000/login
- For signup: http://localhost:8000/signup
- To view the groups the user belongs to or the invitations received: http://localhost:8000/
- To view the expenses tab of a group: http://localhost:8000/groups/{ groupID }/expenses
- To view the balance of a group: http://localhost:8000/groups/{ groupID }/balance
- To view the members tab of a group: http://localhost:8000/groups/{ groupID }/members
- To edit user information: http://localhost:8000/profile
- To query the API: http://localhost:8000/api/

Hope you enjoyed reading!!
