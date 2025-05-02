# Policy Management Service

A microservice for managing policies, tariffs, and rules in a utility management system.

## Features

- Policy Management
  - Create, read, update, and delete policies
  - Associate rules and tariffs with policies
  - Track policy status and effective dates

- Tariff Management
  - Define different types of tariffs (fixed, variable, tiered)
  - Set rates and conditions
  - Manage tariff periods

- Rule Management
  - Create complex business rules
  - Define conditions and actions
  - Set rule priorities

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the service directory:
   ```bash
   cd services/policy-management-service
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/policy-management
```

## Running the Service

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Policies
- `GET /api/policies` - Get all policies
- `GET /api/policies/:id` - Get a specific policy
- `POST /api/policies` - Create a new policy
- `PATCH /api/policies/:id` - Update a policy
- `DELETE /api/policies/:id` - Delete a policy

### Tariffs
- `GET /api/tariffs` - Get all tariffs
- `GET /api/tariffs/:id` - Get a specific tariff
- `POST /api/tariffs` - Create a new tariff
- `PATCH /api/tariffs/:id` - Update a tariff
- `DELETE /api/tariffs/:id` - Delete a tariff

### Rules
- `GET /api/rules` - Get all rules
- `GET /api/rules/:id` - Get a specific rule
- `POST /api/rules` - Create a new rule
- `PATCH /api/rules/:id` - Update a rule
- `DELETE /api/rules/:id` - Delete a rule

## Testing

Run tests:
```bash
npm test
```

## License

MIT 