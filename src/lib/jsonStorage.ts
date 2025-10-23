import { Profile, Message, Task, Meeting, Attendance, Evaluation } from '@/types';

interface DatabaseSchema {
  profiles: Profile[];
  messages: Message[];
  tasks: Task[];
  meetings: Meeting[];
  attendance: Attendance[];
  evaluations: Evaluation[];
  user_roles: Array<{ user_id: string; role: string; created_at: string }>;
}

class JSONStorage {
  private dbName = 'hrm_database';
  private listeners: Set<(table: keyof DatabaseSchema) => void> = new Set();

  // Initialize database with empty data
  private getDatabase(): DatabaseSchema {
    const stored = localStorage.getItem(this.dbName);
    if (stored) {
      return JSON.parse(stored);
    }
    
    const emptyDb: DatabaseSchema = {
      profiles: [],
      messages: [],
      tasks: [],
      meetings: [],
      attendance: [],
      evaluations: [],
      user_roles: [],
    };
    
    this.saveDatabase(emptyDb);
    return emptyDb;
  }

  private saveDatabase(db: DatabaseSchema) {
    localStorage.setItem(this.dbName, JSON.stringify(db));
    this.notifyListeners();
  }

  // Subscribe to changes
  subscribe(listener: (table: keyof DatabaseSchema) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(table?: keyof DatabaseSchema) {
    this.listeners.forEach(listener => listener(table as any));
  }

  // Generic CRUD operations
  from<T extends keyof DatabaseSchema>(table: T) {
    const db = this.getDatabase();
    
    return {
      select: (columns = '*') => {
        return {
          eq: (column: string, value: any) => this.selectEq(table, column, value),
          order: (column: string, options?: { ascending?: boolean }) => 
            this.selectOrder(table, column, options),
          single: () => this.selectSingle(table),
          limit: (count: number) => this.selectLimit(table, count),
        };
      },
      insert: (data: any | any[]) => this.insert(table, data),
      update: (data: any) => ({
        eq: (column: string, value: any) => this.update(table, data, column, value),
      }),
      delete: () => ({
        eq: (column: string, value: any) => this.delete(table, column, value),
      }),
      upsert: (data: any, options?: { onConflict?: string }) => 
        this.upsert(table, data, options),
    };
  }

  private selectEq<T extends keyof DatabaseSchema>(
    table: T,
    column: string,
    value: any
  ) {
    const db = this.getDatabase();
    const results = db[table].filter((item: any) => item[column] === value);
    
    return {
      data: results,
      error: null,
      single: () => ({ data: results[0] || null, error: null }),
      order: (orderColumn: string, options?: { ascending?: boolean }) => {
        const sorted = [...results].sort((a: any, b: any) => {
          const aVal = a[orderColumn];
          const bVal = b[orderColumn];
          const direction = options?.ascending === false ? -1 : 1;
          return aVal > bVal ? direction : aVal < bVal ? -direction : 0;
        });
        return { data: sorted, error: null };
      },
    };
  }

  private selectOrder<T extends keyof DatabaseSchema>(
    table: T,
    column: string,
    options?: { ascending?: boolean }
  ) {
    const db = this.getDatabase();
    const sorted = [...db[table]].sort((a: any, b: any) => {
      const aVal = a[column];
      const bVal = b[column];
      const direction = options?.ascending === false ? -1 : 1;
      return aVal > bVal ? direction : aVal < bVal ? -direction : 0;
    });
    
    return { data: sorted, error: null };
  }

  private selectSingle<T extends keyof DatabaseSchema>(table: T) {
    const db = this.getDatabase();
    return { data: db[table][0] || null, error: null };
  }

  private selectLimit<T extends keyof DatabaseSchema>(table: T, count: number) {
    const db = this.getDatabase();
    return { data: db[table].slice(0, count), error: null };
  }

  private async insert<T extends keyof DatabaseSchema>(
    table: T,
    data: any | any[]
  ) {
    const db = this.getDatabase();
    const items = Array.isArray(data) ? data : [data];
    
    const newItems = items.map(item => ({
      ...item,
      id: item.id || `${table}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      created_at: item.created_at || new Date().toISOString(),
    }));

    (db[table] as any[]).push(...newItems);
    this.saveDatabase(db);
    this.notifyListeners(table);

    return { data: newItems, error: null };
  }

  private async update<T extends keyof DatabaseSchema>(
    table: T,
    updates: any,
    column: string,
    value: any
  ) {
    const db = this.getDatabase();
    const items = db[table] as any[];
    
    const updatedItems = items.map(item => 
      item[column] === value 
        ? { ...item, ...updates, updated_at: new Date().toISOString() }
        : item
    );

    (db[table] as any) = updatedItems;
    this.saveDatabase(db);
    this.notifyListeners(table);

    return { data: updatedItems.filter(item => item[column] === value), error: null };
  }

  private async delete<T extends keyof DatabaseSchema>(
    table: T,
    column: string,
    value: any
  ) {
    const db = this.getDatabase();
    const filtered = (db[table] as any[]).filter(item => item[column] !== value);
    
    (db[table] as any) = filtered;
    this.saveDatabase(db);
    this.notifyListeners(table);

    return { data: null, error: null };
  }

  private async upsert<T extends keyof DatabaseSchema>(
    table: T,
    data: any,
    options?: { onConflict?: string }
  ) {
    const db = this.getDatabase();
    const conflictKey = options?.onConflict || 'id';
    const items = db[table] as any[];
    
    const existingIndex = items.findIndex(
      item => item[conflictKey] === data[conflictKey]
    );

    if (existingIndex >= 0) {
      items[existingIndex] = {
        ...items[existingIndex],
        ...data,
        updated_at: new Date().toISOString(),
      };
    } else {
      items.push({
        ...data,
        id: data.id || `${table}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: data.created_at || new Date().toISOString(),
      });
    }

    this.saveDatabase(db);
    this.notifyListeners(table);

    return { data, error: null };
  }

  // Auth simulation
  auth = {
    signUp: async ({ email, password, options }: any) => {
      const db = this.getDatabase();
      const userId = `user_${Date.now()}`;
      
      const profile = {
        id: userId,
        email,
        full_name: options?.data?.full_name || email.split('@')[0],
        department: options?.data?.department || null,
        position: options?.data?.position || null,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        status: 'active',
        created_at: new Date().toISOString(),
      };

      db.profiles.push(profile);
      db.user_roles.push({
        user_id: userId,
        role: 'employee',
        created_at: new Date().toISOString(),
      });

      this.saveDatabase(db);
      localStorage.setItem('current_user', JSON.stringify({ ...profile, password }));

      return { 
        data: { user: profile, session: { user: profile } }, 
        error: null 
      };
    },

    signInWithPassword: async ({ email, password }: any) => {
      const db = this.getDatabase();
      const profile = db.profiles.find(p => p.email === email);
      
      if (!profile) {
        return { data: null, error: { message: 'Invalid credentials' } };
      }

      const userRole = db.user_roles.find(r => r.user_id === profile.id);
      const user = { ...profile, role: userRole?.role || 'employee' };

      localStorage.setItem('current_user', JSON.stringify({ ...user, password }));

      return { 
        data: { user, session: { user } }, 
        error: null 
      };
    },

    signOut: async () => {
      localStorage.removeItem('current_user');
      return { error: null };
    },

    getSession: async () => {
      const stored = localStorage.getItem('current_user');
      if (stored) {
        const user = JSON.parse(stored);
        return { data: { session: { user } }, error: null };
      }
      return { data: { session: null }, error: null };
    },

    onAuthStateChange: (callback: any) => {
      // Simple implementation
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
  };

  // Channel simulation for real-time
  channel(name: string) {
    return {
      on: (event: string, config: any, callback: any) => {
        return this;
      },
      subscribe: () => {
        return { unsubscribe: () => {} };
      },
    };
  }

  removeChannel(channel: any) {
    // No-op for JSON storage
  }

  // Export data
  exportToJSON() {
    const db = this.getDatabase();
    const dataStr = JSON.stringify(db, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `hrm-backup-${new Date().toISOString()}.json`;
    link.click();
  }

  // Import data
  importFromJSON(jsonData: string) {
    try {
      const data = JSON.parse(jsonData);
      this.saveDatabase(data);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}

export const jsonStorage = new JSONStorage();
