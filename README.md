# Sunshine
Sunshine is a simple MongoDB ODM (object data modeling) made for 
Node.js to work with nosql Mongo database systems.

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
  _id: ObjectId
  email: string
  password: string
  
  firstname?: string
  lastname?: string
}
```


