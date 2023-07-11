# Sunshine
Sunshine is a simple MongoDB ODM (object data modeling) made for 
Node.js to work with nosql Mongo database systems.

# Table of contents
1. [Installation](#installation)
2. [Import](#import)
3. [Usage](#usage)
   1. [Connection](#connection)
   2. [Model](#model)
      1. [Decorators](#decorators)
         1. [Data type decorators](#data-type-decorators)
            1. [objectid](#objectid)
            2. [number](#number)
            3. [text](#text)
            4. [boolean](#boolean)
            5. [email](#email)
            6. [date](#date)
         2. [Required decorator](#required-decorator)
         3. [Encrypted decorator](#encrypted-decorator)

## Installation
To work with Sunshine you must first have node installed on 
local machine. There must be some running mongo database to 
connect to:
1. [Docker](https://hub.docker.com/_/mongo)
2. [Localhost](https://www.mongodb.com/docs/manual/administration/install-community/)
3. Cloud (e.g. [MongoDB Atlas](https://www.mongodb.com/atlas/database))

## Import
The import can be done with ES6 standard:
```typescript
import { Sunshine } from 'sunshine-dao/lib';
```
Or with CommonJs standard:
```typescript
const Sunshine = require('sunshine-dao/lib');
```

## Usage
Sunshine is very easy to use object data modeling system designed
to be used with Node.js applications.

### Connection
Sunshine uses two ways of establishing a connection:
1. `connect()`
2. `connectUri()`

The `connect` method is requiring `hostname`, `username`, `password`,
`database` and optionally `encryptionKey`.
```typescript
import { Sunshine } from './Sunshine';

await Sunshine.connect('127.0.0.1', 'user', 'pass', 'test_db');
```

On the other hand, with `connectUri` you just pass connection
string to the method.
```typescript
import { Sunshine } from './Sunshine'

await Sunshine.connectURI('mongodb://127.0.0.1/test_db');
```

After successful connection, the `Sunshine` class is taking care
of active connection and is exposing some important methods:
1. `getConnection()` - Return mongo `Db` object which allows
direct access to all driver methods
2. `disconnect()`
3. `getEncryptionKey()`
4. `setEncryptionKey(key: string)`
5. `on(event: string, callback: (event) => void)` - Listen to
events from `eventEmitter`
6. `event(name: string, payload: any)` - Emit new event

### Model
Each collection in mongodb should be represented with one `Model`
class. Here is an example of model usage, but for examples take
a look at the `test` folder.

```typescript
import { ObjectId } from 'mongodb'
import { Collection, Model } from './Model'

@Collection('users')
export class User extends Model {
  _id: ObjectId;
  email: string;
  password: string;
  
  firstname?: string;
  lastname?: string;
}
```
Model class needs to have decorator `Collection()` where argument
passed is the name of collection in MongoDB. 

#### Decorators
Model has various decorators which are used for data validation
and speed up the development process. There are a couple of 
decorator types:
1. [Data type decorators](#data-type-decorators)
2. [Required decorator](#required-decorator)
3. [Encrypted decorator](#encrypted-decorator)

##### Data type decorators
There are multiple Data type decorators, but are all explained 
bellow.

##### objectid
This is just simple validation type where decorator is checking 
if specified field is valid `ObjectId`.
```typescript
class TestModel extends Model {
  
  @objectid()
  customer_id: ObjectId;  
}
```

##### number
Number data type decorator has multiple features. It is validating
if data passed in the variable is valid and also there is a 
possibility to specify `min`, `max` and `defaultValue` values.
```typescript
class TestModel extends Model {

  @number({ min: 10, max: 100, defaultValue: 0 })
  price: number; 
}
```
Values for `min` and `max` are validation values, when used will check each
time `save()` is called on the model class (e.g. `await user.save()`). On the other hand
`defaultValue` is not used for validation, but for adding value if one is missing before
storing object in the database.

##### text
Text decorator is validating if data passed is really of `string` type, and it has 
additional parameters `match` and `defaultValue` which can also be used.
```typescript
class TestModel extends Model {
  
  @text({ match: /^[^0-9]+$/, defaultValue: 'test' })
  name: string;  
}
```
In the text decorator `match` is used for validating strings based on the `RegExp`
provided as parameter and `defaultValue` is working the same way as `number` decorator.

##### boolean
This is just simple validation type where decorator is checking
if specified field is valid `boolean` type.
```typescript
class TestModel extends Model {
  
  @boolean()
  active: boolean;  
}
```

##### email
This is just simple validation type where decorator is checking
if specified field is valid `email` string type.
```typescript
class TestModel extends Model {
  
  @email()
  email: boolean;  
}
```

##### date
Date data type decorator has multiple features. It is validating
if data passed in the variable is valid and also there is a
possibility to specify `min`, `max` and `defaultValue` values.
```typescript
class TestModel extends Model {

  @date({
    min: new Date(1990, 0, 1),
    max: new Date(2010, 11, 31),
    defaultValue: new Date(2010, 0, 1)
  })
  birth_date: Date; 
}
```
The logic behind `min`, `max` and `defaultValue` is the same as on th `number` decorator

##### Required decorator
When specifying model for some database collection there is often requirement to check 
if some minimum fields are existing. For that `required` decorator is used.
```typescript
class TestModel extends Model {
  
  @required()
  @email()
  email: boolean;  
}
```

##### Encrypted decorator
There is also a possibility to encrypt some keys using `Encrypted` decorator.
```typescript
class TestModel extends Model {
  
  @Encrypted()
  wallet: boolean;  
}
```
When using `Encrypted` decorator each time you are saving item in the database or reading
from database the decorator is automatically encrypting and decrypting fields.
