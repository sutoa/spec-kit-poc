const TOKEN_KEY = 'accessToken';

export const authService = {
  getToken: (): string | null => {
    const encryptedToken = localStorage.getItem(TOKEN_KEY);
    if (encryptedToken) {
      try {
        return atob(encryptedToken); // Decode the token
      } catch (e) {
        console.error("Error decoding token:", e);
        authService.removeToken(); // Remove invalid token
        return null;
      }
    }
    return null;
  },

  setToken: (token: string): void => {
    // Basic obfuscation: encode the token before storing
    const encryptedToken = btoa(token);
    localStorage.setItem(TOKEN_KEY, encryptedToken);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Placeholder for login logic
  login: async (username, password) => {
    // This function will be implemented later to call the backend /token endpoint
    console.log(username, password); 
    // For now, let's simulate setting a token
    const fakeToken = 'fake-jwt-token';
    authService.setToken(fakeToken);
    return fakeToken;
  },

  logout: (): void => {
    authService.removeToken();
  }
};
