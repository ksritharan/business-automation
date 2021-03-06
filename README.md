# Business Automation

[About](#about)  
&nbsp;&nbsp;[Description](#description)  
&nbsp;&nbsp;[Technologies](#technologies)  
&nbsp;&nbsp;[Config](#config)  
&nbsp;&nbsp;[Run](#run)  
[Features](#features)  
&nbsp;&nbsp;[OAuth](#oauth)  
&nbsp;&nbsp;[Orders](#orders)  
&nbsp;&nbsp;[Queue](#queue)  
&nbsp;&nbsp;[Products](#products)  
&nbsp;&nbsp;[Boxes](#boxes)  
&nbsp;&nbsp;[Packaging](#packaging)  
&nbsp;&nbsp;[Printers](#printers)  
&nbsp;&nbsp;[Fulfillable](#fulfillable)  
&nbsp;&nbsp;[Exceptions](#exceptions)  
&nbsp;&nbsp;[Monitor](#monitor)  


## About
### Description
This project was created to help a small business called Tectle to automate their operations. It is a webserver that aids in managing orders, package calculations, creating shipping labels, sending tracking information, and managing manufacturing.
![tectle](https://github.com/ksritharan/business-automation/blob/master/static/img/tectle-menu.png)

### Technologies
This project was built using Python 3.8, Flask, sqlite3, jQuery, and [Spectre](https://github.com/picturepan2/spectre).
It communicates with the [Etsy API](https://www.etsy.com/developers/) and [Canada Post API](https://www.canadapost.ca/cpotools/apps/drc/home?execution=e2s1).

### Config
To configure the application you will need to edit the app.config.

app.config
```
PDF_FOLDER = C:\Users\kavin\Documents\Receipts
MAN_FOLDER = C:\Users\kavin\Documents\Manifests
API_KEY = NOT_THE_REAL_API_KEY
SHARED_SECRET = NOT_THE_REAL_SHARED_SECRET
SHOP_ID = NOT_THE_REAL_SHOP_ID
DEBUG = True
PRINTER_DEBUG = True
CP_AUTH_DEBUG = NOT_THE_REAL_CANADA_POST_BASIC_AUTH
CP_AUTH = NOT_THE_REAL_CANADA_POST_BASIC_AUTH
CP_SHOP = NOT_THE_REAL_CANADA_POST_SHOP
CP_CONTRACT = NOT_THE_REAL_CONTRACT_NUM
WEBFLOW_SITE_ID = NOT_THE_REAL_WEBFLOW_ID
WEBFLOW_TOKEN = NOT_THE_REAL_WEBFLOW_TOKEN
SLEEP_INTERVAL = 0.1
CP_INTERVAL = 0.5
GCODE_FOLDER = C:\Users\kavin\Documents\gcode files
PROD_SCRIPT = NOT_THE_REAL_PROD_SCRIPT_URL
SYS_FOLDER = C:\Users\kavin\Documents\sys files
VLC_LOCATION = C:\Program Files\VideoLAN\VLC\vlc.exe
```
PDF_FOLDER is the location where the shipping label pdf will be sent to. You can use a hot folder monitor to print the PDF automatically.  
API_KEY is the Etsy API key found on the developers API page.  
SHARED_SECRET is the Etsy API shared secret found on the developers API page.  
SHOP_ID is your Etsy shop id.  
DEBUG is a flag when set to True will allow operators to investigate issues without having impact on real orders.  
PRINTER_DEBUG is a flag when set to True will allow operators to investigate issues without having impact on the manufacturing.  
CP_AUTH_DEBUG is the base64 url safe encoded <username>:<password> of the development keys from the Canada Post API.  
CP_AUTH is the base64 url safe encoded <username>:<password> of the production keys from the Canada Post API.  
CP_SHOP is your Canada Post shop id.  
CP_CONTRACT is your contract number from Canada Post
WEBFLOW_SITE_ID is the Webflow site ID
WEBFLOW_TOKEN is the authorization token from Webflow
SLEEP_INTERVAL is the amount of time in seconds between polling the printers' statuses using [Duet3D gcode M408 S0](https://duet3d.dozuki.com/Wiki/Gcode#Section_M408_Report_JSON_style_response).
CP_INTERVAL is the minimum delay between requests to Canada Post API. See their API rates to find the number to use.
GCODE_FOLDER is the directory containing gcode files that will be uploaded, managed, and sent as requests to print on the Duet3D printers.
PROD_SCRIPT is the remote location of production scripts.
SYS_FOLDER is the directory containing system files that will be uploaded on the Duet3D printers.
VLC_LOCATION is the location of VLC so that it can be streamed.

### Run
Run the batch script run.bat which just runs the following:
```
python/python.exe app.py
```
Access the page at <your local ip>:<80>.
The python code will open the page in your default browser.

## Features
### OAuth
When loading the site for the first time you will be redirected to Etsy to confirm that the application can use its API to interact with your shop.
![oauth_img](https://raw.githubusercontent.com/ksritharan/business-automation/master/screenshots/etsy_login.PNG)
### Orders
From the order mangement page we can fetch new orders, monitor their status, create shipping labels, and send tracking information back to Etsy or Webflow depending on where it came from.
![orders_img](https://raw.githubusercontent.com/ksritharan/business-automation/master/screenshots/manage_orders.PNG)
#### Order Info
Scanning a shipping label with a USB barcode scanner on this page will show the contents and box type. This helps determine what should go in the box.
![orders1_img](https://raw.githubusercontent.com/ksritharan/business-automation/master/screenshots/manage_orders_1.PNG)
#### Manifest Info
To see what boxes and items are needed for a Canada Post delivery/pickup the PO number on the manifest can be scanned with a USB barcode scanner.
![orders2_img](https://raw.githubusercontent.com/ksritharan/business-automation/master/screenshots/manage_orders_2.PNG)

### Queue
From the queue management page we can see what items from the orders need to be printed. We can drag and drop items to a specific printer and start it to print the next item.
A print request is sent to the printer, but first we check if the latest gcode file that needs to be printed matches the latest in our database for this printer, if not, we upload the gcode file.
We can see the status of each of the prints and the availability of the printer. Once all the items for a receipt have been printed it is moved to the completed receipts column, and its status on the order management page will be updated to Printed.
![queue1_img](https://raw.githubusercontent.com/ksritharan/business-automation/master/screenshots/manage_printere_queue.PNG)
![queue2_img](https://raw.githubusercontent.com/ksritharan/business-automation/master/screenshots/manage_printere_queue_2.PNG)
![queue3_img](https://raw.githubusercontent.com/ksritharan/business-automation/master/screenshots/manage_printere_queue_3.PNG)
![queue4_img](https://raw.githubusercontent.com/ksritharan/business-automation/master/screenshots/manage_printere_queue_4.PNG)
![queue5_img](https://raw.githubusercontent.com/ksritharan/business-automation/master/screenshots/manage_printere_queue_5.PNG)
### Products
Here we configure what the package class is for the items on our Etsy page. A package class is simply a group of products that can be packaged the same way. For example, anything that is PB75*** refers to a planter that is 2.75 inches tall, for the purposes of packaging we can treat all variations of this as a "Small", and simplifies our packaging process. The SKUs are in reference to the SKUs of our Etsy items and are automatically decoded to build the Products table.
![products_img](https://raw.githubusercontent.com/ksritharan/business-automation/master/screenshots/product_config.PNG)
### Boxes
Here we can configure what boxes can be used in the packaging process. The "Update Shipping Costs" button performs multiple calls to the Canada Post API to determine the cost of shipping various weights of each box and the cost using Express Post/Small Packet (under 2kg). Note that this function may take long to complete and is re-runnable (such that it will populate values it does not have).
![box_img](https://raw.githubusercontent.com/ksritharan/business-automation/master/screenshots/box_config.PNG)
### Packaging
Here we configure different package configurations. The purpose of this page is to help construct the "bins" for the bin packing problem. Each row refers to package combinations for which we have the maximum allowed (fitting by size) for each package class.  
Huh?  
Let's say I have Box D. I can comfortably fit 6 small items into it. This record will imply that I can fit 5 small items, 4 small items, 3 small items ...  
So instead of adding 6 rows with all the configs, the code will add all 6 rows if you give it just the first one that says 6 smalls can fit in the box.  
Likewise, I can also fit 3 small items and 3 medium items into it and I'll make this a separate record. This will also imply that I can fit 3 smalls and 2 mediums, 3 smalls and 1 mediums, 2 small and 3 mediums, 1 small and 3 mediums, 2 smalls and 2 mediums, and so on ...  
So if we can find out the maxes, the code will decrease each value by 1 and add it as a possible way to package items.  
For package D, I see you have 4 smalls and 2 mediums and 2 smalls and 4 mediums, why did you need to include both?  
Well, the code only knows to subtract not add, so including only one of the configurations will not include the other.  

Aha! So if there is a combination that can't already be represented by a config and its implied configs, then it should be added!  
Ding! Ding!

![package_img](https://raw.githubusercontent.com/ksritharan/business-automation/master/screenshots/package_config.png)
### Printers
Here we can add, edit, and remove printers by URL. We can see their current status in the database (not realtime) and information about them.
![printers_img](https://raw.githubusercontent.com/ksritharan/business-automation/master/screenshots/printer_config.PNG)

### Fulfillable
In this section we determine what orders can be fulfilled depending on our current inventory. There are two policies that have been adopted and either can be used to select which orders are fulfilled. By prioritizing either fulfilling the oldest order first, or by fulfilling the most orders.
![fulfillable_img](https://raw.githubusercontent.com/ksritharan/business-automation/master/screenshots/fullfillable.PNG)

### Exceptions
In this section we can create queries that will help notify us if there are any issues in the current state of the system.
![fulfillable_img](https://raw.githubusercontent.com/ksritharan/business-automation/master/screenshots/exceptions.PNG)

### Monitor
Here we open a grid view of all the printers! Unfortunately, I'm not on site for this picture so you just see me!
![fulfillable_img](https://raw.githubusercontent.com/ksritharan/business-automation/master/screenshots/monitor.PNG)
