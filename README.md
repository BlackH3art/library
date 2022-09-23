# library

Virtual library API\
To test this application, first clone this repository:
```
git clone https://github.com/BlackH3art/library.git
```
Install all necessary dependencies:
```
npm install
```
After that you will have to create your own `.env` file and initialize connection with your own SQL data base:
```env
DB_HOST=""
DB_PORT=""
DB_USER=""
DB_PASSWORD=""
DB_NAME=""

SALT="long text strengthening user password"
SECRET="long secret text"
```

Now you can start application and send your first requests:
```
nest start
```


## Endpoints:
### `/user/register` - to create your user.
#### `POST`
Necessary data:
```json
{
    "name": "name",
    "login": "login",
    "password": "password",
    "type": "user"
}
```
Assign yourself a role `user` or `admin`.\
#

### `/auth/login` - to login to your created user or admin account.
#### `POST`
Necessary data:
```json
{
    "login": "login",
    "password": "password"
}
```
#

### `/auth/logout` - to logout from your account.
#### `GET`
#

### `/book` - to get all of books stored in library.
#### `GET`
Example response:
```json
[
    {
        "id": "f113628d-9422-4856-a22f-90723c75866d",
        "name": "Solidity Programming Essentials",
        "ISBN": "ISBN 978-1-78883-138-3",
        "author": "Ritesh Modi",
        "borrowed": false
    },
    {
        "id": "f8e6e22c-98f8-43bd-8765-75ac5a12b7b1",
        "name": "Blockchain. Podstawy technologii łańcucha bloków w 25 krokach",
        "ISBN": "ISBN: 978-83-283-8486-6",
        "author": "Daniel Drescher",
        "borrowed": true
    }
]
```
#

### `/book/available` - to get all of books that are available to borrow at the moment.
#### `GET`
Example response:
```json
[
    {
        "id": "f113628d-9422-4856-a22f-90723c75866d",
        "name": "Solidity Programming Essentials",
        "ISBN": "ISBN 978-1-78883-138-3",
        "author": "Ritesh Modi",
        "borrowed": false
    }
]
```
#

## Admin restricted endpoints:
### `/book` - to add book to library.
#### `POST`
Necessary data:
```json
{
    "title": "title",
    "ISBN": "ISBN identification number",
    "author": "author"
}
```
#

### `/book/:id` - to edit book.
#### `PATCH`
Necessary data:
```json
{
    "title": "title",
    "ISBN": "ISBN identification number",
    "author": "author"
}
```
#

### `/book/:id` - to delete book from library.
#### `DELETE`

#


## User restricted endpoints:
### `/book/borrow/:id` - to borrow certain book.
#### `PATCH`

#

### `/book/borrow/:id` - to return borrowed by user book.
#### `PATCH`

#





