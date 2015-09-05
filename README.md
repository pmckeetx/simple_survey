# Simple Survey

Simple Survey is my interpretation of SumoMe's developer test. Simple Survey was written in Node.JS using the Express framework, SequelizeJS, MySQL and various other Node.js modules.

Simple Survey is just that. It's a simple survey tool. 

When a user visits the website, they will be presented with a random survey question. Once the user answers the question they then will be presented with a thank you message.

The admin can create survey questions and multiple choice answers. They also can view the the survey results.

## Prerequisites

### MySql

Simple survey relies on there being a MySql instance installed locally and running.

Here are directions to install MySql on [Linux](http://dev.mysql.com/doc/refman/5.7/en/linux-installation.html), [Mac](http://dev.mysql.com/doc/refman/5.7/en/osx-installation.html) and [Windows](http://dev.mysql.com/doc/refman/5.7/en/windows-installation.html).

Once you have a MySql install. Create a new database and name it 'simple_survey'. Also create a user for the database and set the password. Remeber these settings for later when we configure the application.

### Node.js

Simple Survey runs on [Node.js](https://nodejs.org).

To install Node.js, [download](https://nodejs.org/download/) and follow the install directions.


## Installation & Setup

Install node.js modules

```bash
$ npm install
```

Configure MySql connection. 

Open the ./config/config.json file in a text editor and enter the MySql database name, username and password.

```js
{
    "db": {
        "database": "[DATABASE NAME]",
        "username": "[USERNAME]",
        "password": "[PASSWORD]"
    }
}
```

## Starting the Application

```bash
$ node app.js
```

To view debug messages in the console.

```bash
$ DEBUG=simple_survey:* node app.js
```

Open [http://localhost:3000/admin](http://localhost:3000/admin) in your favorite web browser.

