# Microservices Practice

This is a sample application designed to practice microservices architecture with Kubernetes (K8s). The application provides a simple **JPG to PNG converter** using multiple services.

## Services Overview

### 1. **Gateway**  
   - Acts as the **entry point** to the system.  
   - Communicates with all other services.  

### 2. **Auth Service**  
   - Handles **user authentication** and generates **JWT tokens**.  
   - Connects to a **MySQL database** for user management.  

### 3. **Converter Service**  
   - Converts **JPG images to PNG format**.  
   - Retrieves files from a **MongoDB database** and stores the converted versions.  

### 4. **Frontend**  
   - A simple **React application**.  
   - Provides a **login page** and an **image conversion page**.  

### 5. **RabbitMQ**  
   - Acts as a **message queue** for triggering file conversion events asynchronously.  

