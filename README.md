# Proyecto-Epilepsia

## Installation and initial configuration

The project uses a Docker Compose file to orchestrate all its necessary components. Docker Compose will initialize and configure containers for each necessary service with minimal user intervention.

### Step 1: Requirements

The user must have the **Docker Engine** and **Docker Compose** running on their machine. This can be verified by running `docker compose version`. Should the output not be something similar to `Docker Compose version v2.21.0`, the user must verify that both Docker Engine and Docker Compose are correctly installed in their machine. Docker Engine and Compose is included with typical Docker Desktop installations, or can be installed standalone.

[Instructions to install Docker Desktop \(Recommended for Windows and Mac users\)](https://docs.docker.com/get-docker/)

[Instructions to install Docker Engine (Recommended for Linux and WSL users)](https://docs.docker.com/engine/install/)

[Instructions to install Docker Compose for Docker Engine](https://docs.docker.com/compose/install/)

### Step 2: Run the Docker Compose file

Within the user's terminal that has access to `docker compose`, the user should run the following command:

- `docker-compose up`

[optional] If a specific docker compose .yml file should be used instead of the existing `docker-compose.yml`, the command should instead be `docker compose -f {CUSTOM_DOCKER_COMPOSE}.yml up`

### Step 3: Creating fake initial data

This step is **optional**. To populate the database with example data, follow these instructions:

Navigate to the backend folder using the command `cd bkAIEp/` and run the following terminal command:

- `npm run cli -- --seeder -d`

### Step 4: accessing the AI-Epilepsy service 

Using a web browser, navigate to http://localhost:5002