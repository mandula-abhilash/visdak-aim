# VISDAK AIM : Axios Interceptor Module

A production-ready Axios interceptor module with TypeScript support, providing robust API communication features including authentication, request/response interceptors, error handling, and token management.

## Features

- 🔐 Token-based authentication
- 🔄 Automatic retry mechanism for failed requests
- 🎯 Standardized request/response handling
- 🚨 Comprehensive error handling
- 📝 TypeScript support
- ⚙️ Configurable settings

## Installation

First, install the package:
```bash
npm install github:mandula-abhilash/visdak-aim
```

Since this library uses `axios` as a peer dependency, ensure it's installed:
```bash
npm install axios
```

## Usage

### Basic Setup

```ts
import { createAxiosInstance, tokenManager, ApiConfig } from 'visdak-aim';

const config: ApiConfig = {
  baseURL: 'https://api.example.com',
  timeout: 5000,
  retryCount: 3,
  retryDelay: 1000,
  onUnauthorized: () => {
    // Handle 401 errors (e.g., redirect to login)
    window.location.href = '/login';
  },
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
};

const api = createAxiosInstance(config);
```

### Token Management

```ts
// Set token after login
tokenManager.setToken('your-jwt-token');

// Get current token
const token = tokenManager.getToken();

// Remove token on logout
tokenManager.removeToken();
```

### Making API Calls

```ts
// GET request
try {
  const response = await api.get('/users');
  console.log(response.data);
} catch (error) {
  console.error(error);
}

// POST request
try {
  const response = await api.post('/users', {
    name: 'John Doe',
    email: 'john@example.com',
  });
  console.log(response.data);
} catch (error) {
  console.error(error);
}
```

### Retry Logic Example

```ts
const config: ApiConfig = {
  baseURL: 'https://api.example.com',
  retryCount: 3,
  retryDelay: 2000,
  onRetry: (retryCount) => {
    console.log(`Retry attempt: ${retryCount}`);
  },
};

const api = createAxiosInstance(config);
```

## API Response Structure

### Success Response

```ts
{
  status: 'success',
  data: {
    // Response data
  },
  message?: string
}
```

### Error Response

```ts
{
  status: 'error',
  message: string,
  error: {
    code: number,
    details?: string
  }
}
```

## Status Code Guidelines

| Status Code | Description                    | Usage                                    |
|-------------|--------------------------------|------------------------------------------|
| 200         | OK                             | Successful request                       |
| 201         | Created                        | Resource created successfully            |
| 204         | No Content                     | Successful request with no content       |
| 400         | Bad Request                    | Invalid request parameters               |
| 401         | Unauthorized                   | Missing or invalid authentication        |
| 403         | Forbidden                      | Insufficient permissions                 |
| 404         | Not Found                      | Resource not found                       |
| 409         | Conflict                       | Resource conflict                        |
| 500         | Internal Server Error          | Server-side error                        |
| 502         | Bad Gateway                    | Upstream server error                    |

## Configuration Options

| Option          | Type       | Description                                  | Default |
|-----------------|------------|----------------------------------------------|---------|
| baseURL         | string     | Base URL for API requests                    | -       |
| timeout         | number     | Request timeout in milliseconds              | 10000   |
| retryCount      | number     | Number of retry attempts                     | 3       |
| retryDelay      | number     | Delay between retries in milliseconds        | 1000    |
| onUnauthorized  | function   | Callback for 401 errors                      | -       |
| onForbidden     | function   | Callback for 403 errors                      | -       |
| defaultHeaders  | object     | Default headers for all requests             | {}      |

## Advanced Usage

### Custom Error Handling

```ts
const config: ApiConfig = {
  baseURL: 'https://api.example.com',
  onUnauthorized: () => {
    // Clear local storage
    localStorage.clear();
    // Redirect to login
    window.location.href = '/login';
  },
  onForbidden: () => {
    // Handle forbidden access
    window.location.href = '/forbidden';
  },
};
```

### With TypeScript

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

// GET request with type
const response = await api.get<User>('/user/1');
const user: User = response.data;

// POST request with type
const newUser = await api.post<User>('/users', {
  name: 'John Doe',
  email: 'john@example.com',
});
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details