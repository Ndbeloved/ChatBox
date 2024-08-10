# Chat App API

Welcome to the Chat App API! This API allows you to integrate chat functionality into your applications. It includes user management, chat rooms, messaging, and real-time communication using WebSockets. This API is built with TypeScript.

## Overview

The Chat App API provides endpoints for managing users, chat rooms, and messages. It also supports real-time messaging using WebSockets, ensuring efficient and responsive communication. The API is designed to be flexible, secure, and easy to integrate into any application.


### User Management

#### Create User

- **Endpoint**: `POST /api/users`
- **Description**: This endpoint creates a new user in the system.
- **Request Body**:
```json
{
"username": "string",
"password": "string",
"displayName": "string"
}
```


- **Response**:
```json
{
  "userId": "string",
  "username": "string"
}
```


#### Get User By ID

- **Endpoint**: `GET /api/users/:id`
- **Description**: Retrieve the details of a specific user by their ID.

- **Response**:
```json
{
  "userId": "string",
  "username": "string",
  "displayName" : "string"
}
```