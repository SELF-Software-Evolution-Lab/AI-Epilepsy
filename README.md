# Proyecto-Epilepsia

## Installation and initial configuration

The project uses a Docker Compose file to orchestrate all its necessary components. Docker Compose will initialize and configure containers for each necessary service with minimal user intervention.

### Step 1: Requirements

Downloading the repository will be easier with Git installed. To download Git, go to the following site:

- https://git-scm.com


The user must have the **Docker Engine** and **Docker Compose** running on their machine. This can be verified by running `docker compose version`. Should the output not be something similar to `Docker Compose version v2.21.0`, the user must verify that both Docker Engine and Docker Compose are correctly installed in their machine. Docker Engine and Compose is included with typical Docker Desktop installations, or can be installed standalone.

[Instructions to install Docker Desktop \(Recommended for Windows and Mac users\)](https://docs.docker.com/get-docker/)

[Instructions to install Docker Engine (Recommended for Linux and WSL users)](https://docs.docker.com/engine/install/)

[Instructions to install Docker Compose for Docker Engine](https://docs.docker.com/compose/install/)

### Step 2: Clone repository

Download the repository

- Go to the terminal (If you are not acquainted with this term, feel free to look it by yourself)

- git clone https://github.com/SELF-Software-Evolution-Lab/AI-Epilepsy.git

### Step 3: Run the Docker Compose file

Within the user's terminal that has access to `docker compose`, the user should run the following command:

- `docker-compose up`

[optional] If a specific docker compose .yml file should be used instead of the existing `docker-compose.yml`, the command should instead be `docker compose -f {CUSTOM_DOCKER_COMPOSE}.yml up`

[optional] If the user wants to leave the services running in the background, and not have them terminate upon closing the active terminal window, they must add a `-d` flag to the end of the command.

### Step 4: Creating fake initial data

This step is **optional**. To populate the database with example data, follow these instructions:

1) Install Node.js on your machine. LTS versions are recommended (20.10.0 at the time of writing). [Download links can be found here](https://nodejs.org/en/download).
2) Navigate to the backend folder using the command `cd bkAIEp/` and run the following terminal command: `npm i` to install all required dependencies.
3) Run the following command: `npm run cli -- --seeder -d`

### Step 5: accessing the AI-Epilepsy service

Using a web browser, navigate to http://localhost:5002

Congrats, you finally made it 🎉

### Step 6: turning off all services

In the root folder of the project, run the following command:

`docker-compose down`

## Optional configuration

The Docker Compose template will run the project using default local-oriented values. If the user needs to modify some of these values, they will have to create a `.env` file between Step 2 and Step 3.

Copy the existing `.env` file template:

`cp .env.template .env`

Edit the desired values within the `.env` file using a text editor

`nano .env`, `vim .env`, etc.

Finally, you can continue running the `docker-compose.yml` file as demonstrated in Step 3


## Entities and CRUD

To be able of creating new Entities for Users or roles you can either insert them via Seeder or POST request.

For create them via seeder you need to follow the next steps:

Run the command 

npm run cli -- --factory --seeder <name-for-the-seeder>

This would create a file named <name-for-the-seeder> on the 
AI-Epilepsy/bkAIEp/src/seeders folder.

Edit the run function containing something like this:

const users = [
  {
    username: 'admin',
    password: 'admin',
    first_name: 'admin',
    position: 'admin',
    role_id: null,
    role: 'admin'
  },
  {
    username: 'doctor',
    password: 'doctor',
    first_name: 'doctor',
    position: 'doctor',
    role_id: null,
    role: 'doctor'
  }
]

for (const user of users) {
  const role = roles.find(_r=> _r.name === user.role)
  delete user.role
  user.role_id = role['id']
  const exists = await User.findOne({
    where: {
      username: user.username
    }
  })
}

as for the roles

const permissions = [
  {
    module: '<module_name>',
    access: '<module_access_name>',
    roles: ['role']
  }
]

const roles = [
  {
    name: 'role'
  }
]

for (const role of roles) {
  const exists = await Role.findOne({
    where: {
      name: role.name
    }
  })
  let _role = exists
  if(exists){
    await Role.update(role, { where: { name: role.name }})
    role['id'] = exists.dataValues.id
  } else {
    _role = await Role.create(role)
    role['id'] = _role.dataValues.id
  }
}

for (const permission of permissions) {
  const _roles = permission.roles

  delete permission.roles

  const exists = await Permission.findOne({
    where: {
      access: permission.access
    }
  })
  let _permission = exists
  if(exists){
    await Permission.update(permission, { where: { access: permission.access }})
    permission['id'] = exists.dataValues.id
  } else {
    _permission = await Permission.create(permission)
    permission['id'] = _permission.dataValues.id
  }

  const __p = await Permission.findOne({
    where: {
      id: permission['id']
    }
  })

  for (const role of _roles) {
    const _role = roles.find(_r=>_r.name === role)
    const __r = await Role.findOne({
      where: {
        id: _role['id']
      }
    })

    await __r['addPermission'](__p, { through: { selfGranted: false } })
  }

  const users = [
    {
      username: 'admin',
      password: 'admin',
      first_name: 'admin',
      position: 'admin',
      role_id: null,
      role: 'admin'
    },
    {
      username: 'doctor',
      password: 'doctor',
      first_name: 'doctor',
      position: 'doctor',
      role_id: null,
      role: 'doctor'
    },
    {
      username: 'nurse',
      password: 'nurse',
      first_name: 'nurse',
      position: 'nurse',
      role_id: null,
      role: 'nurse'
    }
  ]

  for (const user of users) {
    const role = roles.find(_r=> _r.name === user.role)
    delete user.role
    user.role_id = role['id']
    const exists = await User.findOne({
      where: {
        username: user.username
      }
    })

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(user.password, salt)

    user.password = hash

    let _user = exists

    if(exists){
      await User.update(user, { where: { username: user.username }})
      user['id'] = exists.dataValues.id
    } else {
      _user = await User.create(user)
      user['id'] = _user.dataValues.id
    }
  }
}

after testing and validating you must run

npm run cli -- --seeder <name-for-the-seeder>

Parallel, as was mention before you can add entities via POST request to the endpoint 

{{URL}}/api/users/create - POST

Request Headers

Content-Type: application/json
User-Agent: PostmanRuntime/7.36.0
Accept: */*
Cache-Control: no-cache
Postman-Token: b094dd76-3330-442b-aa60-e41ecc20221e
Host: localhost:5001
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Authorization: <TOKEN>

Request Body

{
    "username": "admin",
    "password": "admin",
    "first_name": "admin",
    "position": "admin",
    "role_id": null,
    "role": "admin"
}

this work exactly the same for all entities and you can find more about the process on the seeder initSeeder

## Technologies 

### JWT - Middleware

JWT, which stands for JSON Web Token, is a security pattern commonly used for authentication and authorization in web development. It is a compact, URL-safe means of representing claims between two parties. JWTs are often used to secure the transmission of information between parties in a way that can be verified and trusted.

JWTs allow for stateless authentication, meaning that the server does not need to store the user's session information. Instead, the necessary information is contained within the JWT itself. This aligns well with the nature of middleware in Express, where each request can be independently processed.

Therefore, it was implemented via authMiddleware, where you would see its validation and management

it is important to include JWT_SECRET on your .env file to change the default secret

A JSON Web Token (JWT) is a compact, URL-safe means of representing claims to be transferred between two parties. It's commonly used for authentication and authorization purposes in web development. JWTs consist of three parts: a header, a payload, and a signature. These three parts are concatenated with dots (.) to form the complete JWT.

The header typically consists of two parts: the type of the token, which is JWT, and the signing algorithm being used, such as SHA256 or RSA. The header is then Base64Url encoded.

The second part of the token is the payload, which contains the claims. Claims are statements about an entity (typically, the user) and additional data.

In this case we used the library method for creating the toking call sign

return jwt.sign({ user: user.id }, config.jwt, {
  expiresIn: '30d'
})

For the creation of the secret 

- Use a Cryptographically Secure Random Number Generator (CSPRNG):

Use a secure source of randomness to generate your secret. This ensures that the secret is unpredictable and resistant to guessing attacks.

- Length of the Secret:

A longer secret generally provides more security. It is recommended to use a secret with a length of at least 256 bits (32 bytes). Many libraries and frameworks recommend 512 bits (64 bytes) or more.

- Use a Key Management System:

If possible, leverage a key management system to handle key generation and storage. Key management systems help to securely store and distribute keys, reducing the risk of exposure.

- Avoid Hardcoding Secrets in Source Code:

Never hardcode secrets directly into your source code or configuration files. Instead, use environment variables or a secure configuration mechanism to keep secrets separate from your codebase.

- Regularly Rotate Secrets:

Periodically change your JWT secret. This practice limits the exposure time if a secret is compromised. Rotate secrets based on your security policy.

- Consider Encryption:

If confidentiality is a concern, consider using an encrypted key or a key derived from a password using a secure key derivation function (KDF).

- Protect Against Information Leakage:

Ensure that your secret is not accidentally leaked through error messages, logs, or other information disclosure mechanisms.

### sequelize

Sequelize is a popular Object-Relational Mapping (ORM) library for Node.js, designed to work with relational databases such as PostgreSQL, MySQL, SQLite, and MSSQL. ORM libraries provide a higher-level abstraction over databases, allowing developers to interact with databases using JavaScript or TypeScript code instead of raw SQL queries. Sequelize facilitates database operations by providing an easy-to-use API and a set of features for defining models, relationships, and performing CRUD (Create, Read, Update, Delete) operations.

as for the .env

DB_HOST for host
DB_NAME for name of the db
DB_USERNAME for the user
DB_PASSWORD for the user

### bcryptjs

As for the storing of passwords it was decided to go with bcryptjs to hash the password and storing it 

### chalk

It is use to give color to some consoles, mainly on cli script

### cors

To avoid CORS error

### dotenv

To load environment variables

### moment

for extended date management

## ora

For interactive consoles


## Scripts

### cli - backend

#### --factory

It is for creating the files following file system

npm run cli -- --factory -d? -r? -c? -s? -m? --seeder? -n <name>

-n <name> it is the name of the files to be created

-d is the same than sending  -r? -c? -s? it would create the files for route, controller and service for the -n (name) given

-r it would create a route for the -n (name) given and change the index.ts for routes import
on the folder would be created:
AI-Epilepsy/bkAIEp/src/app/routes/<name>Route.ts
and in the index file of the very same folder, it would import and add to the server the new file created

-c it would create a controller for the -n (name) given on the folder as shown bellow
AI-Epilepsy/bkAIEp/src/app/controllers/<name>/<name>Controller.ts

-s it would create a service for the -n (name) given on the folder as shown bellow
AI-Epilepsy/bkAIEp/src/app/controllers/<name>/<name>Controller.ts
-m it would create a model for the -n (name) given and change the index.ts for models import
AI-Epilepsy/bkAIEp/src/app/models/<name>Route.ts
and in the index file of the very same folder, it would import and add  the model easy import to the application

--seeder it would create a seeder on bkAIEp/src/seeders

Example

npm run cli -- --factory -d -m -n message

this would create route, controller, service and model call messages

#### --seeder

In the context of database development or testing, a "seeder" is a script that populates the database with initial data or new data. Seeders are used to create a consistent and known dataset for application testing or when setting up a new environment or even adding either fixing data on production environment.

--seeder <name>? -x? -d? -f?

<name> Name of the seeder to be run
-x if you want to run them all
-d for running development seeders
-f to force the running (use it under you own responsibility)

Example

npm run cli -- --seeder initSeeder -f

this would run the seeder name initSeeder located in bkAIEp/src/seeders/initSeeder.ts and it is going to run forced, therefore, even if this was run before it would be rerun

