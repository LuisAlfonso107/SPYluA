// src/lib/database.ts - IndexedDB REAL para producción
class CyberDatabase {
  private dbName: string = 'CyberPunkDB';
  private version: number = 3;
  private db: IDBDatabase | null = null;

  private stores = {
    USERS: 'users',
    CONNECTIONS: 'connections',
    MESSAGES: 'messages',
    NOTIFICATIONS: 'notifications',
    EVENTS: 'events',
    GROUPS: 'groups',
    SETTINGS: 'settings'
  };

  async init(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(true);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(this.stores.USERS)) {
          const userStore = db.createObjectStore(this.stores.USERS, { keyPath: 'id' });
          userStore.createIndex('email', 'email', { unique: true });
          userStore.createIndex('username', 'username', { unique: true });
        }

        if (!db.objectStoreNames.contains(this.stores.MESSAGES)) {
          const msgStore = db.createObjectStore(this.stores.MESSAGES, { keyPath: 'id' });
          msgStore.createIndex('conversation', ['senderId', 'receiverId']);
          msgStore.createIndex('timestamp', 'timestamp');
        }

        if (!db.objectStoreNames.contains(this.stores.CONNECTIONS)) {
          const connStore = db.createObjectStore(this.stores.CONNECTIONS, { keyPath: 'id' });
          connStore.createIndex('userId', 'userId');
          connStore.createIndex('status', 'status');
        }

        ['NOTIFICATIONS', 'EVENTS', 'GROUPS', 'SETTINGS'].forEach(store => {
          if (!db.objectStoreNames.contains(this.stores[store as keyof typeof this.stores])) {
            db.createObjectStore(this.stores[store as keyof typeof this.stores], { keyPath: 'id' });
          }
        });
      };
    });
  }

  private async transaction(storeName: string, mode: IDBTransactionMode = 'readonly') {
    if (!this.db) await this.init();
    const transaction = this.db!.transaction(storeName, mode);
    return transaction.objectStore(storeName);
  }

  async add<T>(storeName: string, data: T): Promise<T> {
    const store = await this.transaction(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.add(data);
      request.onsuccess = () => resolve(data);
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(storeName: string, id: string): Promise<T | null> {
    const store = await this.transaction(storeName);
    return new Promise((resolve, reject) => {
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    const store = await this.transaction(storeName);
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async update<T>(storeName: string, id: string, updates: Partial<T>): Promise<T> {
    const store = await this.transaction(storeName, 'readwrite');
    return new Promise(async (resolve, reject) => {
      const current = await this.get<T>(storeName, id);
      if (!current) reject(new Error('Item not found'));
      
      const updated = { ...current, ...updates, updatedAt: new Date().toISOString() };
      const request = store.put(updated);
      request.onsuccess = () => resolve(updated as T);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, id: string): Promise<boolean> {
    const store = await this.transaction(storeName, 'readwrite');
    return new Promise((resolve, reject) => {
      const request = store.delete(id);
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  async getUserByEmail(email: string) {
    const store = await this.transaction(this.stores.USERS);
    return new Promise((resolve, reject) => {
      const index = store.index('email');
      const request = index.get(email);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getConversation(userId1: string, userId2: string) {
    const store = await this.transaction(this.stores.MESSAGES);
    return new Promise((resolve, reject) => {
      const index = store.index('conversation');
      const keyRange = IDBKeyRange.bound([userId1, userId2], [userId1, userId2]);
      const request = index.getAll(keyRange);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const database = new CyberDatabase();
export default database;
