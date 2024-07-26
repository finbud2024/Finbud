## API Endpoint Reference

### **Existing Endpoints and Functionality:**

---

#### **`/threads`**
- **GET:** Retrieve all threads from the Thread database.

- **GET (with specified user ID):** Retrieve threads associated with a specific user.
  - *Example*: /threads?userid=123

- **POST:** Create a new thread in the Thread database.

---

#### **`/threads/:threadId`**
- **GET:** Retrieve a specific thread by its ID.

- **PUT:** Update a specific thread by its ID.

- **DELETE:** Delete a specific thread by its ID.

---

#### **`/users`**
- **GET:** Retrieve all users from the User database.

- **POST:** Create a new user in the User database.
---

#### **`/users/:userId`**
- **GET:** Retrieve a specific user by its ID.

- **PUT:** Update a specific user by its ID.

- **DELETE:** Delete a specific user by its ID.
