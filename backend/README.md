## API Endpoint Reference

### **Existing Endpoints and Functionality:**

---

#### **`/threads`**
- **GET:** Retrieve all threads from the Thread database.

- **GET (with specified user ID):** Retrieve threads associated with a specific user.
  - *Example*: /threads?userid=123

- **POST:** Create a new thread in the Thread database.

---

#### **/threads/:threadId**
- **GET:** Retrieve a specific thread by its ID.

- **PUT:** Update a specific thread by its ID.

- **DELETE:** Delete a specific thread by its ID.
