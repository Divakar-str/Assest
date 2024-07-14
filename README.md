## Asset Management System

## Objective:
   The objective of this project is to build a node.js web application that will help a company track its assets which are being used by its employees. Assets include all tangible items like laptops, cell phones, modems, tools, etc

### Tech Stack:
   1. Node.js (express server)
   2. PostgreSQL DB
   3. Sequelize ORM
   4. Jade for HTML
   5. Bootstrap
   6. CSS
   7. DataTables.net (to display data in         tables)

## Features

- User Authentication using JWT tokens
- Asset Management (CRUD operations)
- Secure password handling with bcrypt
- Responsive UI with Bootstrap

## Prerequisites

- Node.js
- PostgreSQL

## Installation

1. Clone this repository
2. npm install
3. create .env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=myuser
   DB_PASSWORD=admin
   DB_NAME=mydatabase
   JWT_SECRET=your_jwt_secret

# Usage

 1.npm start
 2.Open your browser and navigate to           http://localhost:3000

# Default User

 Username: admin@gmail.com
 Password: admin
 
## Detailed Requirements:

1. Employee Master: Add/Edit/View all employees in the company. Provide filters for active/inactive employees along with search capabilities.

2. Asset Master: Add/Edit/View all assets in the company. Provide filters for asset type, search by make/model etc. Each asset should be identifiable by its serial number as well as unique id.

3. Asset Category Master: This will drive the various hardware types being used. Eg Laptop,

Mobile Phone, Screw Driver, Drill Machine etc.

4. Stock View: Bird's eye view of assets in stock (i.e, ready to give to any employee). Show totals by branch along with total value in footer.

5. Issue Asset: This page will allow users to issue an asset to an employee.

6. Return Asset: This page will allow users to get back an asset from an employee. Should capture reason for return (upgrade, repair, resignation etc).

7. Scrap Asset: This page will allow users to mark an asset as obsolete, following which those asset(s) should not be visible in any page except in reports.

8. Asset History: Allows users to view the entire history of an asset from its purchase to scrap. This helps to understand the utilization of money invested in it.




