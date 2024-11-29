# VISDAK AIM: Axios Interceptor Module

A production-ready Axios interceptor module providing robust API communication features including authentication, request/response interceptors, error handling, and token management.

## Features

- 🔐 **Token-based Authentication**: Easily manage authentication tokens.
- 🔄 **Automatic Retry Mechanism**: Retries failed requests based on configuration.
- 🎯 **Standardized Request/Response Handling**: Consistent API interactions.
- 🚨 **Comprehensive Error Handling**: Graceful error management and callbacks.
- ⚙️ **Configurable Settings**: Flexible setup to suit various project needs.

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

```javascript
import { createAxiosInstance } from 'visdak-aim';

const api = createAxiosInstance({
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
});
```

### Token Management

```javascript
import { tokenManager } from 'visdak-aim';

// Set token after login
tokenManager.setToken('your-jwt-token');

// Get current token
const token = tokenManager.getToken();

// Remove token on logout
tokenManager.removeToken();
```

### Making API Calls

```javascript
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

```javascript
const api = createAxiosInstance({
  baseURL: 'https://api.example.com',
  retryCount: 3,
  retryDelay: 2000,
  onRetry: (retryCount) => {
    console.log(`Retry attempt: ${retryCount}`);
  },
});
```

## API Response Structure

### Success Response

```javascript
{
  status: 'success',
  data: {
    // Response data
  },
  message: 'Request successful',
}
```

### Error Response

```javascript
{
  status: 'error',
  message: 'An error occurred',
  error: {
    code: 400,
    details: 'Invalid request parameters',
  },
}
```

## Status Code Guidelines

| Status Code | Description           | Usage                                     |
|-------------|-----------------------|-------------------------------------------|
| 200         | OK                    | Successful request                        |
| 201         | Created               | Resource created successfully             |
| 204         | No Content            | Successful request with no content        |
| 400         | Bad Request           | Invalid request parameters                |
| 401         | Unauthorized          | Missing or invalid authentication         |
| 403         | Forbidden             | Insufficient permissions                  |
| 404         | Not Found             | Resource not found                        |
| 409         | Conflict              | Resource conflict                         |
| 500         | Internal Server Error | Server-side error                         |
| 502         | Bad Gateway           | Upstream server error                     |

## Configuration Options

| Option          | Type     | Description                                   | Default |
|-----------------|----------|-----------------------------------------------|---------|
| `baseURL`       | `string` | Base URL for API requests                     | -       |
| `timeout`       | `number` | Request timeout in milliseconds               | `10000` |
| `retryCount`    | `number` | Number of retry attempts                      | `3`     |
| `retryDelay`    | `number` | Delay between retries in milliseconds         | `1000`  |
| `onUnauthorized`| `function`| Callback for 401 Unauthorized errors         | -       |
| `onForbidden`   | `function`| Callback for 403 Forbidden errors            | -       |
| `onRetry`       | `function`| Callback for each retry attempt              | -       |
| `defaultHeaders`| `object` | Default headers for all requests              | `{}`    |

## Advanced Usage

### Custom Error Handling

```javascript
const api = createAxiosInstance({
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
});
```

### Custom Token Manager

If you're using the module in a non-browser environment (e.g., Node.js), `localStorage` won't be available. You can provide a custom token manager.

```javascript
import { setCustomTokenManager } from 'visdak-aim';

const customTokenManager = {
  getToken: () => {
    // Implement your token retrieval logic
    return myCustomStorage.get('authToken');
  },
  setToken: (token) => {
    // Implement your token storage logic
    myCustomStorage.set('authToken', token);
  },
  removeToken: () => {
    // Implement your token removal logic
    myCustomStorage.remove('authToken');
  },
};

setCustomTokenManager(customTokenManager);
```

### Handling Token Refresh

```javascript
const onUnauthorized = async () => {
  try {
    const refreshToken = tokenManager.getToken(); // Assume this stores the refresh token
    const response = await api.post('/refresh-token', { refreshToken });
    const newAccessToken = response.data.data.accessToken;
    tokenManager.setToken(newAccessToken);
    console.log('Token refreshed successfully');
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Handle failed token refresh (e.g., redirect to login)
    window.location.href = '/login';
  }
};

const api = createAxiosInstance({
  baseURL: 'https://api.example.com',
  onUnauthorized,
});
```

## Token Management in Node.js

Since `localStorage` is not available in Node.js, you must set up a custom token manager when using the module in a Node.js environment.

```javascript
import { setCustomTokenManager } from 'visdak-aim';

const customTokenManager = {
  getToken: () => {
    return myNodeStorage.get('authToken');
  },
  setToken: (token) => {
    myNodeStorage.set('authToken', token);
  },
  removeToken: () => {
    myNodeStorage.remove('authToken');
  },
};

setCustomTokenManager(customTokenManager);
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details

---

Feel free to reach out if you have any questions or need further assistance!