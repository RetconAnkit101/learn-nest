# Auth & Login Flow in Your NestJS App

You have two main flows:

1. **Login** – user sends email + password → gets a JWT.
2. **Protected routes** – user sends JWT → server verifies it and knows who they are.

---

## Part 1: Login flow (email + password → JWT)

When someone calls `POST /auth/login` with `email` and `password` in the body:

```
Client                    AuthController              LocalAuthGuard           LocalStrategy              AuthService              UserService
  |                              |                           |                         |                         |                         |
  |  POST /auth/login            |                           |                         |                         |                         |
  |  { email, password }         |                           |                         |                         |                         |
  |----------------------------->|                           |                         |                         |                         |
  |                              | UseGuards(LocalAuthGuard) |                         |                         |                         |
  |                              |-------------------------->|                         |                         |                         |
  |                              |                           |  passport 'local'       |                         |                         |
  |                              |                           |------------------------>|                         |                         |
  |                              |                           |                         |  validate(email, pwd)   |                         |
  |                              |                           |                         |------------------------>|                         |
  |                              |                           |                         |                         |  validateUser(email,pwd)|
  |                              |                           |                         |                         |------------------------>|  findByEmail(email)
  |                              |                           |                         |                         |<------------------------|
  |                              |                           |                         |                         |  compare(password, hash)|
  |                              |                           |                         |  return { id }          |                         |
  |                              |                           |                         |<------------------------|
  |                              |                           | req.user = { id }       |                         |                         |
  |                              |                           |<------------------------|                         |                         |
  |                              |  login(req.user.id)       |                         |                         |                         |
  |                              |---------------------------------------------------->|                         |
  |                              |                              JWT signed             |                         |                         |
  |                              |<----------------------------------------------------|                         |                         |
  |  { id, token }               |                           |                         |                         |                         |
  |<-----------------------------|                           |                         |                         |                         |
```

What each piece does:

1. **AuthController**  
   - Handles `POST /auth/login`.  
   - Uses `LocalAuthGuard`, so the request is not "yours" until the guard allows it.

2. **LocalAuthGuard**  
   - Uses Passport's `'local'` strategy.  
   - Reads `email` and `password` from the request body (because of `usernameField: 'email'` in LocalStrategy) and runs the local strategy.

3. **LocalStrategy**  
   - Receives `email` and `password` from the guard.  
   - Calls `authService.validateUser(email, password)`.  
   - If that returns a value, Passport puts it in `req.user`.  
   - If it throws (e.g. `UnauthorizedException`), the request fails and the controller never runs.

4. **AuthService.validateUser**  
   - Gets user by email via `userService.findByEmail(email)`.  
   - If no user → `UnauthorizedException("User not found")`.  
   - Compares password with stored hash using `compare(password, user.password)`.  
   - If mismatch → `UnauthorizedException('Invalid Credentials')`.  
   - If OK → returns `{ id: user.id }` → that becomes `req.user`.

5. **AuthController (after guard passes)**  
   - `req.user` is `{ id }`.  
   - Calls `authService.login(req.user.id)` → builds payload `{ sub: userId }`, signs it with JWT, returns the token string.  
   - Sends back `{ id, token }` to the client.

So: **Login = LocalAuthGuard + LocalStrategy + validateUser (AuthService + UserService) → then AuthService.login builds and returns the JWT.**

---

## Part 2: Protecting routes with JWT (e.g. GET /user/profile)

When someone calls `GET /user/profile` with header `Authorization: Bearer <token>`:

```
Client                    UserController             JwtAuthGuard              JwtStrategy
  |                              |                           |                         |
  |  GET /user/profile           |                           |                         |
  |  Authorization: Bearer <JWT> |                           |                         |
  |----------------------------->|                           |                         |
  |                              |  UseGuards(JwtAuthGuard)  |                         |
  |                              |-------------------------->|                         |
  |                              |                           |  passport 'jwt'         |
  |                              |                           |  - read token from      |
  |                              |                           |    Authorization header |
  |                              |                           |  - verify signature     |
  |                              |                           |  - decode payload       |
  |                              |                           |------------------------>|
  |                              |                           |                         |  validate(payload)
  |                              |                           |                         |  payload.sub = userId
  |                              |                           |                         |  return { id: payload.sub }
  |                              |                           |  req.user = { id }      |
  |                              |                           |<------------------------|
  |                              |  getProfile(req)          |                         |
  |                              |  userService.findOne(req.user.id)                   |
  |  profile data                |                           |                         |
  |<-----------------------------|                           |                         |
```

What each piece does:

1. **UserController**  
   - `GET /user/profile` is protected by `JwtAuthGuard`.  
   - If the guard allows the request, it uses `req.user.id` and calls `userService.findOne(req.user.id)`.

2. **JwtAuthGuard**  
   - Uses Passport's `'jwt'` strategy.  
   - Reads the token from `Authorization: Bearer <token>` (see `ExtractJwt.fromAuthHeaderAsBearerToken()` in JwtStrategy).  
   - Verifies and decodes the JWT using your `JWT_SECRET`.

3. **JwtStrategy**  
   - Receives the decoded payload (e.g. `{ sub: userId }`).  
   - `validate(payload)` returns `{ id: payload.sub }`.  
   - Passport sets `req.user = { id }`.

So: **Protected route = JwtAuthGuard + JwtStrategy → req.user.id is set → controller uses it (e.g. for profile).**

---

## Summary table

| Step | Where | What happens |
|------|--------|----------------|
| **Login** | Client | Sends `POST /auth/login` with `email` and `password`. |
| | LocalAuthGuard | Runs Passport `local` strategy. |
| | LocalStrategy | Calls `AuthService.validateUser(email, password)`. |
| | AuthService | Finds user by email, compares password with bcrypt. |
| | AuthService | If OK, returns `{ id }` → becomes `req.user`. |
| | AuthController | Calls `AuthService.login(req.user.id)` → returns JWT. |
| | Client | Stores the JWT (e.g. in memory or localStorage). |
| **Protected route** | Client | Sends e.g. `GET /user/profile` with `Authorization: Bearer <token>`. |
| | JwtAuthGuard | Runs Passport `jwt` strategy. |
| | JwtStrategy | Extracts token, verifies with `JWT_SECRET`, runs `validate(payload)`. |
| | | `req.user = { id: payload.sub }`. |
| | UserController | Uses `req.user.id` to load profile. |

---

## Concepts in one line

- **LocalStrategy** = "Check email + password and set `req.user` for this request."
- **JwtStrategy** = "Check JWT from header and set `req.user` for this request."
- **Guards** = "Run this Passport strategy before the controller; if it fails, the controller is never called."
- **AuthService** = "Validate credentials (validateUser) and create tokens (login)."
- **UserService** = "Talk to the DB (find by email, find by id, create user)."

So: **login** uses **email + password** and **local** strategy to set `req.user` and then issue a **JWT**. **Protected routes** use the **JWT** and **jwt** strategy to set `req.user` so you know who is calling.
