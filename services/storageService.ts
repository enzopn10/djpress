
import { User, PressKit } from '../types';
import { INITIAL_PRESS_KIT } from '../constants';

const USERS_KEY = 'djpress_users_v4';
const SESSION_KEY = 'djpress_session_v4';
const REMEMBERED_KEY = 'djpress_accounts_v4';

export const StorageService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  getPublicArtists: (): PressKit[] => {
    const users = StorageService.getUsers();
    // Only return users who have set up a bio AND have at least one press shot
    return users
      .filter(u => u.pressKit.bio && u.pressKit.bio.length > 50 && u.pressKit.photos.length > 0)
      .map(u => u.pressKit);
  },

  getRememberedAccounts: (): { email: string, name: string, avatar?: string }[] => {
    const data = localStorage.getItem(REMEMBERED_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUser: (user: User) => {
    const users = StorageService.getUsers();
    const index = users.findIndex(u => u.email === user.email);
    if (index > -1) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  getUserByEmail: (email: string): User | null => {
    const users = StorageService.getUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  getUserByUsername: (username: string): User | null => {
    const users = StorageService.getUsers();
    return users.find(u => u.pressKit.username.toLowerCase() === username.toLowerCase()) || null;
  },

  getCurrentSession: (): User | null => {
    const data = localStorage.getItem(SESSION_KEY);
    return data ? JSON.parse(data) : null;
  },

  login: (email: string): User => {
    let user = StorageService.getUserByEmail(email);
    const lowercaseEmail = email.toLowerCase();

    if (!user) {
      const username = lowercaseEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');
      user = {
        id: Math.random().toString(36).substr(2, 9),
        email: lowercaseEmail,
        isAdmin: lowercaseEmail === 'enzopn10@gmail.com',
        pressKit: { 
          ...INITIAL_PRESS_KIT, 
          username: username,
          displayName: username.toUpperCase(),
          contactEmail: lowercaseEmail,
          bio: "", 
          achievements: [],
          musicEmbeds: [],
          videos: [],
          photos: []
        },
        createdAt: new Date().toISOString()
      };
      StorageService.saveUser(user);
    }

    // Remember this account
    const remembered = StorageService.getRememberedAccounts();
    if (!remembered.find(a => a.email === lowercaseEmail)) {
      remembered.push({ 
        email: lowercaseEmail, 
        name: user.pressKit.displayName,
        avatar: user.pressKit.photos[0]?.url 
      });
      localStorage.setItem(REMEMBERED_KEY, JSON.stringify(remembered));
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(SESSION_KEY);
  },

  updatePressKit: (email: string, kit: PressKit) => {
    const user = StorageService.getUserByEmail(email);
    if (user) {
      user.pressKit = kit;
      StorageService.saveUser(user);
      
      const session = StorageService.getCurrentSession();
      if (session?.email === email) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      }

      // Update remembered avatar
      const remembered = StorageService.getRememberedAccounts();
      const accIdx = remembered.findIndex(a => a.email === email);
      if (accIdx > -1) {
        remembered[accIdx].avatar = kit.photos[0]?.url;
        remembered[accIdx].name = kit.displayName;
        localStorage.setItem(REMEMBERED_KEY, JSON.stringify(remembered));
      }
    }
  },

  deleteUser: (email: string) => {
    const users = StorageService.getUsers().filter(u => u.email !== email);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    
    const remembered = StorageService.getRememberedAccounts().filter(a => a.email !== email);
    localStorage.setItem(REMEMBERED_KEY, JSON.stringify(remembered));
  }
};
