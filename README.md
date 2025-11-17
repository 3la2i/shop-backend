# Backend Setup

## Database Configuration

This backend uses MongoDB with Mongoose for database operations.

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shopManagement
```

### MongoDB Connection

The database connection is configured in `config/db.js` and automatically connects when the server starts.

### Running the Server

```bash
npm run dev
```

The server will start on the specified PORT and connect to MongoDB automatically. 