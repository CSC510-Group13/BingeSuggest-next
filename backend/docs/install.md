# Steps for setting up the repository and running the web app

## Step 1: Git Clone the Repository
  
    git clone https://github.com/CSC510-Group13/PopcornPicks.git
    
  (OR) Download the .zip file on your local machine from the following link
  
    https://github.com/CSC510-Group13/PopcornPicks/

## EDIT: While trying to install this on my Mac, I found I needed to run the following (I have Homebrew installed) in order to complete step 2

    brew install mysql pkg-config
    pip install mysqlclient

## Step 2: Install the required packages by running the following command in the terminal
   
    pip install -r requirements.txt

## Step 3: MySQL Install
   Download and Install [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)

## Step 4: Installing MySQL Community Server

   Download and Install [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) with the following install selections:

   In the `Type and Networking` tab, select config type as **Server Computer**
   
   All other menus, use default settings. If you create a root password, be sure not to lose it!

   Click `Execute` button on the bottom of the window to start the MySQL Service.

## Step 5: Setting up MySQL Workbench
 1. Launch MySQL Workbench
 2. Under MySQL Connections, Right click in the whitespace. Select `Rescan for Local MySQL Instances`. It should detect the server established in the previous step.
 3. Select the discovered Local instance and enter your password if created in server setup.
 4. Click `File` > `Open SQL Script` then select `init.sql` in the `PopcornPicks/src` directory. This will create the tables required for the application's persistence.
 5. Repeat above step for `movies.sql` file located in the `PopcornPicks/src` directory. This may take a few minutes.
 6. Create .env file in the `PopcornPicks/src/recommenderapp` directory and add the following lines:
 
    ```
    DB_USER = 'root'
    DB_PASSWORD = 'your_password'
    DB_HOST = 'localhost'
    DB_NAME = 'PopcornPicksDB'
    
    OMDB_API_KEY = <your_omdb_api_key>
    
    SENDER_EMAIL = <your_sender_email>
    SENDER_EMAIL_PASSWORD = <your_sender_email_password>
    SMTP_SERVER = "smtp.gmail.com"
    SMTP_PORT = 587
    ```
    
    Replace `your_password` with the password you created during MySQL Server setup. 
    Replace `<your_omdb_api_key>` with your own API key from [OMDb API](http://www.omdbapi.com/).
    Replace `<your_sender_email>` with the email address you created for the email notifier feature.
    Replace `<your_sender_email_password>` with the password for the email address you created for the email notifier feature.
   
## Step 6: Python Packages
   Run the following command in the terminal
    
    cd src/recommenderapp
    python app.py
   
    
## Step 7: Open the URL in your browser 

      http://127.0.0.1:5000/


**NOTE: For the email notifier feature - create a new gmail account, replace the sender_email variable with the new email and sender_password variable with its password (2 factor authentication) in the utils.py file (function: send_email_to_user(recipient_email, categorized_data)).**
