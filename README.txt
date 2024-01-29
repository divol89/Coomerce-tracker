
WooCommerce and Firebase Integration Documentation


System Architecture
The integration is based on the following key components:

WooCommerce: The e-commerce platform used to manage the online store, products, sales, and customers.
Firebase: Used for storing sales data and managing email sending.
WooCommerce Webhook: Enables real-time communication between WooCommerce and Firebase when sales are completed.
Firebase Functions: Used to process sales data and send daily email summaries.
Data Flow
Firebase SDK in WordPress: Firebase SDK code is included in the WordPress header.php file to establish the initial connection with Firebase.


Webhook in WooCommerce: A webhook is set up in WooCommerce to send data to Firebase each time a sale is completed.
Firebase Function for Sales Processing: A function deployed from VS Code listens for data sent by the webhook and stores it in the Firebase database.
Data Storage: Sales data is stored in a Firebase database, organized by date and other relevant criteria.
Daily Summary Function: A second Firebase function is triggered at the end of the day to send an email with the daily sales summary to the store administrators.
Setup


WooCommerce Setup

WooCommerce Installation: Ensure WooCommerce is installed and configured on your WordPress site.
Webhook Creation: Go to WooCommerce > Settings > Advanced > Webhooks and create a new webhook:
Name: "Completed Sale to Firebase" (or a descriptive name).
Status: Active.
Topic: "Order updated".(then on your function filter the others with status completed and it will works perfectly.)
Delivery URL: URL of the Firebase function that will process the sales data.(after deploying de function on firebase)
Delivery Method: Webhook.

Firebase Setup
Firebase Project Creation: Create a new project in Firebase and follow the instructions to initialize it.

Functions Deployment:
Use the VS Code terminal to deploy Firebase functions with firebase deploy.
Ensure the functions are set up to process webhook data and to send the daily email.

Accessing and Interpreting Sales Data

Firebase Console: Access the Firebase console to view the database.
Data Structure: Sales data is stored with date tags, order IDs, product details, and quantities.
Data Interpretation: Use Firebase tools or query the database directly to generate sales reports or analyses.

Maintenance and Support
WooCommerce and Firebase SDK Updates: Keep WooCommerce and the Firebase SDK updated to ensure compatibility.
Firebase Functions Monitoring: Regularly review Firebase functions for any errors or warnings.
Security: Ensure access and permissions to the Firebase database are correctly set up to protect sales data.

Of coruse this is one way , other is to create user friendly advanced interface where you can run your  functions locally on your own app and
build nice desing interface with next.js ,react,etc.


IMPORTAN NOTE: YOU NEED TO  HAVE PAYMENT Method ACTIVEVATED ON YOUR FIREBASE TO STORE FUNCTIONS OTHERWISE YOU WILL GET REGJECTED WITH THIS ERROR : josealmontecolon@MacBook-Air-de-jose mi-proyecto-firebase % firebase deploy

=== Deploying to 'salestrack-e4495'...

i  deploying functions
Running command: npm --prefix "$RESOURCE_DIR" run lint

> lint
> eslint .

✔  functions: Finished running predeploy script.
i  functions: preparing codebase default for deployment
i  functions: ensuring required API cloudfunctions.googleapis.com is enabled...
i  functions: ensuring required API cloudbuild.googleapis.com is enabled...
i  artifactregistry: ensuring required API artifactregistry.googleapis.com is enabled...
⚠  functions: missing required API cloudbuild.googleapis.com. Enabling now...
⚠  artifactregistry: missing required API artifactregistry.googleapis.com. Enabling now...
✔  functions: required API cloudfunctions.googleapis.com is enabled

Error: Your project salestrack-e4495 must be on the Blaze (pay-as-you-go) plan to complete this command. Required API artifactregistry.googleapis.com can't be enabled until the upgrade is complete. To upgrade, visit the following URL:

https://console.firebase.google.com/project/salestrack-e4495/usage/details

Having trouble? Try firebase [command] --help
josealmontecolon@MacBook-Air-de-jose mi-proyecto-firebase % NOTE




i want also to say that i combined the emulator with the firestore database to test and it worked you can purchase any product on the website and test the code
for that i created a free app product that you can purchase for 00.



to test the functions 

in the terminal :

1.firebase emulators:start

2.installed ngrok 

3. ngrok http 5001 on the terminal.


after that you  purchase the product  (cost its 0.00 for testing purpose)

https://sukcesmedia.pl/product/aplikacja-sukces-media/

dont forget to login with your firebase on your vs code terminal it will create automatically firestore database and store there the last purchase and you can go and check and do what ever you want with this data .


I really enjoyed doing this retification as i forgot about firestore EMULATOR .thanks