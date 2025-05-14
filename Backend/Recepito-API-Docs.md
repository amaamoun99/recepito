# Recepito Social Food App – API Documentation

> **Base URL:** `http://localhost:3000/api/v1`

---

## Authentication

### Register a New User
| Method | Endpoint        |
|--------|----------------|
| POST   | `/auth/signup` |

**Description:** Create a new user account.

**Request Body:**
```json
{
  "username": "foodie123",
  "email": "user@example.com",
  "password": "yourpassword",
  "profilePicture": "https://example.com/image.jpg" // optional
}
```

**Response:**
```json
{
  "status": "success",
  "token": "<JWT>",
  "data": {
    "user": {
      "id": "userId",
      "username": "foodie123",
      "email": "user@example.com",
      "profilePicture": "https://example.com/image.jpg"
    }
  }
}
```

---

### Login
| Method | Endpoint        |
|--------|----------------|
| POST   | `/auth/login`  |

**Description:** Authenticate a user and return a JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "<JWT>",
  "data": {
    "user": {
      "id": "userId",
      "username": "foodie123",
      "email": "user@example.com",
      "profilePicture": "https://example.com/image.jpg"
    }
  }
}
```

---

### Logout
| Method | Endpoint         |
|--------|-----------------|
| GET    | `/auth/logout`  |

**Description:** Logout the current user (clears JWT cookie).

**Response:**
```json
{
  "status": "success"
}
```

---

### Request Password Reset
| Method | Endpoint                |
|--------|------------------------|
| POST   | `/auth/forgotPassword` |

**Description:** Send a password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Token sent to email"
}
```

---

### Reset Password
| Method | Endpoint                      |
|--------|------------------------------|
| PATCH  | `/auth/resetPassword/{token}`|

**Description:** Reset a user's password using a valid reset token.

**Request Body:**
```json
{
  "password": "newpassword"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "<JWT>"
}
```

---

### Get Current User
| Method | Endpoint   |
|--------|------------|
| GET    | `/auth/me` |

**Description:** Get the profile of the currently authenticated user.

**Headers:**
```
Authorization: Bearer <JWT>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "userId",
      "username": "foodie123",
      "email": "user@example.com",
      "profilePicture": "https://example.com/image.jpg"
    }
  }
}
```

---

### Update Password
| Method | Endpoint             |
|--------|---------------------|
| PATCH  | `/auth/updatePassword` |

**Description:** Update the password for the currently authenticated user.

**Headers:**
```
Authorization: Bearer <JWT>
```

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

**Response:**
```json
{
  "status": "success",
  "token": "<JWT>"
}
```

---

## Users

### Get All Users
| Method | Endpoint   |
|--------|------------|
| GET    | `/users`   |

**Description:** Retrieve a list of all users.

**Headers:**
```
Authorization: Bearer <JWT>
```

**Response:**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "users": [
      {
        "id": "userId1",
        "username": "foodie123",
        "email": "user1@example.com"
      },
      {
        "id": "userId2",
        "username": "chefmaster",
        "email": "user2@example.com"
      }
    ]
  }
}
```

---

### Get Current User's Profile
| Method | Endpoint    |
|--------|-------------|
| GET    | `/users/me` |

**Description:** Get the profile of the currently authenticated user.

**Headers:**
```
Authorization: Bearer <JWT>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "userId",
      "username": "foodie123",
      "email": "user@example.com",
      "profilePicture": "https://example.com/image.jpg"
    }
  }
}
```

---

### Update Current User's Profile
| Method | Endpoint    |
|--------|-------------|
| PATCH  | `/users/me` |

**Description:** Update the profile of the currently authenticated user. Supports profile picture upload.

**Headers:**
```
Authorization: Bearer <JWT>
Content-Type: multipart/form-data
```

**Request Body Example:**
- `username` (string)
- `email` (string)
- `bio` (string)
- `location` (string)
- `profilePicture` (file)

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "userId",
      "username": "foodie123",
      "email": "user@example.com",
      "profilePicture": "https://example.com/image.jpg"
    }
  }
}
```

---

### Deactivate Current User's Account
| Method | Endpoint    |
|--------|-------------|
| DELETE | `/users/me` |

**Description:** Deactivate the currently authenticated user's account.

**Headers:**
```
Authorization: Bearer <JWT>
```

**Response:**
```json
{
  "status": "success",
  "data": null
}
```

---

### Get User by ID
| Method | Endpoint      |
|--------|--------------|
| GET    | `/users/{id}`|

**Description:** Retrieve a user's profile by their ID.

**Headers:**
```
Authorization: Bearer <JWT>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "userId",
      "username": "foodie123",
      "email": "user@example.com"
    }
  }
}
```

---

### Follow or Unfollow a User
| Method | Endpoint           |
|--------|-------------------|
| PATCH  | `/users/{id}/follow` |

**Description:** Follow or unfollow a user by their ID.

**Headers:**
```
Authorization: Bearer <JWT>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "userId",
      "following": ["otherUserId1", "otherUserId2"],
      "followers": ["followerId1"]
    }
  }
}
```

---

## Recipes

### Get All Recipes (Paginated)
| Method | Endpoint   |
|--------|------------|
| GET    | `/recipes` |

**Description:** Retrieve a paginated list of all recipes.

**Headers:**
```
Authorization: Bearer <JWT>
```

**Query Parameters:**
- `page` (integer)
- `limit` (integer)

**Response:**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "recipes": [
      {
        "id": "recipeId1",
        "title": "Spaghetti Carbonara",
        "author": { "id": "userId1", "username": "foodie123" },
        "imageUrl": "/uploads/recipes/recipe1.jpg",
        "ingredients": [
          { "name": "Spaghetti", "quantity": "200g" },
          { "name": "Eggs", "quantity": "2" }
        ],
        "instructions": ["Boil pasta", "Mix eggs and cheese", "Combine all"]
      }
    ]
  }
}
```

---

### Create a New Recipe
| Method | Endpoint   |
|--------|------------|
| POST   | `/recipes` |

**Description:** Share a new recipe with the community. Supports image upload, ingredients, and instructions.

**Headers:**
```
Authorization: Bearer <JWT>
Content-Type: multipart/form-data
```

**Request Body Example:**
- `title` (string, required)
- `description` (string, required)
- `cuisine` (string, required)
- `difficulty` (string, required: Easy, Medium, Hard)
- `servings` (integer, required)
- `cookingTime` (integer, required)
- `instructions` (array of strings, required)
- `ingredients` (array of objects: `{ name, quantity }`, required)
- `image` (file, optional)

**Response:**
```json
{
  "status": "success",
  "data": {
    "recipe": {
      "id": "recipeId1",
      "title": "Spaghetti Carbonara",
      "author": { "id": "userId1", "username": "foodie123" },
      "imageUrl": "/uploads/recipes/recipe1.jpg",
      "ingredients": [
        { "name": "Spaghetti", "quantity": "200g" },
        { "name": "Eggs", "quantity": "2" }
      ],
      "instructions": ["Boil pasta", "Mix eggs and cheese", "Combine all"]
    }
  }
}
```

---

### Get Recipe by ID
| Method | Endpoint        |
|--------|----------------|
| GET    | `/recipes/{id}`|

**Description:** Retrieve a specific recipe by its ID.

**Headers:**
```
Authorization: Bearer <JWT>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "recipe": {
      "id": "recipeId1",
      "title": "Spaghetti Carbonara",
      "author": { "id": "userId1", "username": "foodie123" },
      "imageUrl": "/uploads/recipes/recipe1.jpg",
      "ingredients": [
        { "name": "Spaghetti", "quantity": "200g" },
        { "name": "Eggs", "quantity": "2" }
      ],
      "instructions": ["Boil pasta", "Mix eggs and cheese", "Combine all"]
    }
  }
}
```

---

### Like or Unlike a Recipe
| Method | Endpoint           |
|--------|-------------------|
| PATCH  | `/recipes/{id}/like` |

**Description:** Like or unlike a recipe by its ID.

**Headers:**
```
Authorization: Bearer <JWT>
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "recipe": {
      "id": "recipeId1",
      "likes": ["userId1", "userId2"]
    },
    "isLiked": true,
    "likesCount": 2
  }
}
```

---

## Comments

### Get All Comments for a Recipe
| Method | Endpoint                    |
|--------|----------------------------|
| GET    | `/recipes/{recipeId}/comments` |

**Description:** Retrieve all comments for a specific recipe.

**Headers:**
```
Authorization: Bearer <JWT>
```

**Response:**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "comments": [
      {
        "id": "commentId1",
        "author": { "id": "userId1", "username": "foodie123" },
        "content": "Looks delicious!",
        "createdAt": "2024-05-01T12:00:00Z"
      }
    ]
  }
}
```

---

### Add a Comment to a Recipe
| Method | Endpoint                    |
|--------|----------------------------|
| POST   | `/recipes/{recipeId}/comments` |

**Description:** Add a comment to a specific recipe.

**Headers:**
```
Authorization: Bearer <JWT>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "This looks amazing!"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "comment": {
      "id": "commentId1",
      "author": { "id": "userId1", "username": "foodie123" },
      "content": "This looks amazing!",
      "createdAt": "2024-05-01T12:00:00Z"
    }
  }
}
```

---

### Update a Comment (Author Only)
| Method | Endpoint                |
|--------|------------------------|
| PATCH  | `/recipes/comments/{id}`|

**Description:** Update a comment you have made on a recipe.

**Headers:**
```
Authorization: Bearer <JWT>
Content-Type: application/json
```

**Request Body:**
```json
{
  "text": "Updated comment text."
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "comment": {
      "id": "commentId1",
      "content": "Updated comment text."
    }
  }
}
```

---

### Delete a Comment (Author Only)
| Method | Endpoint                |
|--------|------------------------|
| DELETE | `/recipes/comments/{id}`|

**Description:** Delete a comment you have made on a recipe.

**Headers:**
```
Authorization: Bearer <JWT>
```

**Response:**
```json
{
  "status": "success",
  "data": null
}
```

---

## Security

All endpoints (except registration, login, and password reset) require a JWT token in the `Authorization` header:
```
Authorization: Bearer <JWT>
```

---

> **Tip:**
> This Markdown file is ready for conversion to PDF or DOCX. Use a Markdown-to-PDF tool or copy into Word/Google Docs for beautiful printing. 