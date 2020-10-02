## Gmail REST API

### Steps to Install and Use the API's

- First clone the repository

- Then on your terminal do **npm install** it will install all the packages from pakage.json

- Do **npm start** the server will start.

- Then you can access the server locally at http://localhost:3000/
   -  If you see  **Gmail Rest Api** as Output then everything is working fine
   
- Then go to this link **http://localhost:3000/api/auth/gmail** for authenticating using OAuth2

- When successfully logged in it will redirect it to new page.

- Then using postman you can make a POST request on **http://localhost:3000/api/sendemail** with {"email": "YOUR EMAIL HERE"} in body of the request.

- If you get **Email has been sent check your inbox!** then congrats your email has been successfully send to the given user.
