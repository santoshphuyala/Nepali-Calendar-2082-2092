// Local Storage Database Manager
const DB = (() => {
  const STORAGE_KEYS = {
    INCOME: 'nepali_calendar_income',
    EXPENSE: 'nepali_calendar_expense',
    NOTES: 'nepali_calendar_notes',
    TASKS: 'nepali_calendar_tasks',
    SHOPPING: 'nepali_calendar_shopping',
    HOLIDAYS: 'nepali_calendar_holidays',
    SETTINGS: 'nepali_calendar_settings',
    YEARS: 'nepali_calendar_years'
  };

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  function getAll(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }

  function saveAll(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  function add(key, item) {
    const data = getAll(key);
    const newItem = { ...item, id: generateId(), createdAt: new Date().toISOString() };
    data.push(newItem);
    saveAll(key, data);
    return newItem;
  }

  function update(key, id, updates) {
    const data = getAll(key);
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updates, updatedAt: new Date().toISOString() };
      saveAll(key, data);
      return data[index];
    }
    return null;
  }

  function remove(key, id) {
    let data = getAll(key);
    data = data.filter(item => item.id !== id);
    saveAll(key, data);
    return true;
  }

  function getById(key, id) {
    const data = getAll(key);
    return data.find(item => item.id === id);
  }

  function query(key, filter) {
    const data = getAll(key);
    return data.filter(filter);
  }

  // Income operations
  const Income = {
    getAll: () => getAll(STORAGE_KEYS.INCOME),
    add: (item) => add(STORAGE_KEYS.INCOME, item),
    update: (id, updates) => update(STORAGE_KEYS.INCOME, id, updates),
    remove: (id) => remove(STORAGE_KEYS.INCOME, id),
    getById: (id) => getById(STORAGE_KEYS.INCOME, id),
    getByDate: (date) => query(STORAGE_KEYS.INCOME, item => item.date === date),
    getByDateRange: (startDate, endDate) => 
      query(STORAGE_KEYS.INCOME, item => item.date >= startDate && item.date <= endDate)
  };

  // Expense operations
  const Expense = {
    getAll: () => getAll(STORAGE_KEYS.EXPENSE),
    add: (item) => add(STORAGE_KEYS.EXPENSE, item),
    update: (id, updates) => update(STORAGE_KEYS.EXPENSE, id, updates),
    remove: (id) => remove(STORAGE_KEYS.EXPENSE, id),
    getById: (id) => getById(STORAGE_KEYS.EXPENSE, id),
    getByDate: (date) => query(STORAGE_KEYS.EXPENSE, item => item.date === date),
    getByDateRange: (startDate, endDate) => 
      query(STORAGE_KEYS.EXPENSE, item => item.date >= startDate && item.date <= endDate)
  };

  // Notes operations
  const Notes = {
    getAll: () => getAll(STORAGE_KEYS.NOTES),
    add: (item) => add(STORAGE_KEYS.NOTES, item),
    update: (id, updates) => update(STORAGE_KEYS.NOTES, id, updates),
    remove: (id) => remove(STORAGE_KEYS.NOTES, id),
    getById: (id) => getById(STORAGE_KEYS.NOTES, id),
    getByDate: (date) => query(STORAGE_KEYS.NOTES, item => item.date === date)
  };

  // Tasks operations
  const Tasks = {
    getAll: () => getAll(STORAGE_KEYS.TASKS),
    add: (item) => add(STORAGE_KEYS.TASKS, item),
    update: (id, updates) => update(STORAGE_KEYS.TASKS, id, updates),
    remove: (id) => remove(STORAGE_KEYS.TASKS, id),
    getById: (id) => getById(STORAGE_KEYS.TASKS, id),
    getByDate: (date) => query(STORAGE_KEYS.TASKS, item => item.date === date)
  };

  // Shopping operations
  const Shopping = {
    getAll: () => getAll(STORAGE_KEYS.SHOPPING),
    add: (item) => add(STORAGE_KEYS.SHOPPING, item),
    update: (id, updates) => update(STORAGE_KEYS.SHOPPING, id, updates),
    remove: (id) => remove(STORAGE_KEYS.SHOPPING, id),
    getById: (id) => getById(STORAGE_KEYS.SHOPPING, id),
    getPending: () => query(STORAGE_KEYS.SHOPPING, item => !item.purchased),
    getPurchased: () => query(STORAGE_KEYS.SHOPPING, item => item.purchased)
  };

  // Holidays operations
  const Holidays = {
    getAll: () => getAll(STORAGE_KEYS.HOLIDAYS),
    add: (item) => add(STORAGE_KEYS.HOLIDAYS, item),
    update: (id, updates) => update(STORAGE_KEYS.HOLIDAYS, id, updates),
    remove: (id) => remove(STORAGE_KEYS.HOLIDAYS, id),
    getByDate: (date) => query(STORAGE_KEYS.HOLIDAYS, item => item.date === date),
    bulkAdd: (holidays) => {
      const existing = getAll(STORAGE_KEYS.HOLIDAYS);
      const newHolidays = holidays.map(h => ({ ...h, id: generateId() }));
      saveAll(STORAGE_KEYS.HOLIDAYS, [...existing, ...newHolidays]);
      return newHolidays;
    }
  };

  // Settings operations
  const Settings = {
    get: () => {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : { theme: 'light' };
    },
    save: (settings) => {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    }
  };

  // Export/Import operations
  const DataManager = {
    exportAll: () => {
      return {
        income: Income.getAll(),
        expense: Expense.getAll(),
        notes: Notes.getAll(),
        tasks: Tasks.getAll(),
        shopping: Shopping.getAll(),
        holidays: Holidays.getAll(),
        settings: Settings.get(),
        exportDate: new Date().toISOString()
      };
    },
    importAll: (data) => {
      if (data.income) saveAll(STORAGE_KEYS.INCOME, data.income);
      if (data.expense) saveAll(STORAGE_KEYS.EXPENSE, data.expense);
      if (data.notes) saveAll(STORAGE_KEYS.NOTES, data.notes);
      if (data.tasks) saveAll(STORAGE_KEYS.TASKS, data.tasks);
      if (data.shopping) saveAll(STORAGE_KEYS.SHOPPING, data.shopping);
      if (data.holidays) saveAll(STORAGE_KEYS.HOLIDAYS, data.holidays);
      if (data.settings) Settings.save(data.settings);
    },
    clearAll: () => {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  };

  // Initialize default holidays
  function initializeDefaultHolidays() {
    const existing = Holidays.getAll();
    if (existing.length === 0) {
      const defaultHolidays = [
        { date: '2082/01/01', name: 'नयाँ वर्ष', type: 'public' },
        { date: '2082/01/11', name: 'लोकतन्त्र दिवस', type: 'public' },
        { date: '2082/02/03', name: 'कुशे औंशी', type: 'public' },
        { date: '2082/03/15', name: 'गणतन्त्र दिवस', type: 'public' },
        { date: '2082/05/03', name: 'जनै पूर्णिमा', type: 'public' },
        { date: '2082/06/08', name: 'तीज', type: 'public' },
        { date: '2082/06/23', name: 'दशैं', type: 'public' },
        { date: '2082/08/05', name: 'तिहार', type: 'public' },
        { date: '2082/09/01', name: 'माघे संक्रान्ति', type: 'public' },
        { date: '2082/11/07', name: 'होली', type: 'public' }
      ];
      defaultHolidays.forEach(h => Holidays.add(h));
    }
  }

  // Initialize on load
  initializeDefaultHolidays();

  return {
    Income,
    Expense,
    Notes,
    Tasks,
    Shopping,
    Holidays,
    Settings,
    DataManager
  };
})();