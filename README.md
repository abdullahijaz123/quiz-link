# Quiz Link Backend

## Setup

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Seed Database** (Populates Admin and Departments)
    ```bash
    node src/utils/seed.js
    ```

3.  **Run Server**
    ```bash
    npm start
    # or
    node src/server.js
    ```

## Default Credentials (Admin)

-   **Email**: `admin@quizlink.com`
-   **Password**: `adminpassword`

## API Endpoints

### Authentication

#### 1. Register Student
*   **Endpoint**: `POST /api/auth/register`
*   **Description**: Register a new student account.
*   **Header**: `Content-Type: application/json`
*   **Payload**:
    ```json
    {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "password123",
        "departmentId": "695acb9435528a7ea089a0a0" // Get ID from DB after seeding or Admin API
    }
    ```
*   **Response**: Returns JWT Token and User info.

#### 2. Login
*   **Endpoint**: `POST /api/auth/login`
*   **Description**: Login for Admin, Teacher, or Student.
*   **Header**: `Content-Type: application/json`
*   **Payload**:
    ```json
    {
        "email": "admin@quizlink.com",
        "password": "adminpassword"
    }
    ```
*   **Response**:
    ```json
    {
        "token": "<JWT_TOKEN>",
        "user": {
            "id": "...",
            "name": "Admin User",
            "email": "admin@quizlink.com",
            "role": "admin"
        }
    }
    ```

### Departments

#### 1. Get All Departments
*   **Endpoint**: `GET /api/departments`
*   **Description**: Get a list of all available departments.
*   **Access**: Public
*   **Response**:
    ```json
    [
        {
            "_id": "...",
            "name": "Computer Science",
            "code": "CS"
        },
        ...
    ]
    ```

### User Management

#### 1. Add Teacher (Admin Only)
*   **Endpoint**: `POST /api/users/teacher/add`
*   **Description**: Create a new teacher account.
*   **Access**: Private (Admin Only) - Requires JWT in Header (`Authorization: <TOKEN>`)
*   **Payload**:
    ```json
    {
        "name": "Teacher Name",
        "email": "teacher@quizlink.com",
        "password": "password123",
        "departmentId": "..." // Optional
    }
    ```
*   **Response**:
    ```json
    {
        "msg": "Teacher created successfully",
        "user": { ... }
    }
    ```

#### 2. Delete Teacher (Admin Only)
*   **Endpoint**: `DELETE /api/users/teacher/delete/:id`
*   **Description**: Delete a teacher account by ID.
*   **Access**: Private (Admin Only) - Requires JWT in Header (`Authorization: <TOKEN>`)
*   **Response**:
    ```json
    {
        "msg": "Teacher removed"
    }
    ```
-   `src/server.js`: App entry point.
-   `src/config/`: DB and Passport configuration.
-   `src/models/`: Mongoose schemas (User, Department).
-   `src/controllers/`: Logic for routes.
-   `src/routes/`: API endpoint definitions.
-   `src/utils/`: Helper scripts (seeding).

### Quiz Management

#### 1. Create Quiz (Teacher/Admin)
*   **Endpoint**: `POST /api/quizzes/create`
*   **Access**: Private (Teacher/Admin)
*   **Payload**:
    ```json
    {
        "title": "Math Quiz 1",
        "description": "Algebra Basics",
        "departmentId": "...",
        "questions": [
            {
                "questionText": "What is 2+2?",
                "options": [
                    { "key": "a", "text": "3" },
                    { "key": "b", "text": "4" }
                ],
                "correctAnswer": "b"
            }
        ]
    }
    ```
*   **Response**: Returns created Quiz object.

#### 2. Delete Quiz (Teacher/Admin)
*   **Endpoint**: `DELETE /api/quizzes/delete/:id`
*   **Access**: Private (Teacher/Admin) - *Note: Teachers can only delete their own quizzes.*
*   **Response**: `{"msg": "Quiz removed"}`

#### 3. Assign Quiz (Teacher/Admin)
*   **Endpoint**: `POST /api/quizzes/assign`
*   **Access**: Private (Teacher/Admin)
*   **Payload**:
    ```json
    {
        "quizId": "...",
        "studentId": "..."
    }
    ```
*   **Response**: Returns Assignment object.
    *   *Error*: Returns 400 if Student is in a different Department.
