import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('eduforge_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('eduforge_user', JSON.stringify(user));
    else localStorage.removeItem('eduforge_user');
  }, [user]);

  const login = (email, name) => {
    setUser({ id: crypto.randomUUID(), email, name: name || email.split('@')[0], avatar: null });
  };

  const loginWithGoogle = () => {
    setUser({ id: crypto.randomUUID(), email: 'student@university.edu', name: 'Student User', avatar: null });
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
