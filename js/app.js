// Main Application
const App = (() => {
  let currentPage = 'calendar';

  function init() {
    console.log('App.init() called');
    
    // Initialize calendar
    CalendarManager.init();
    
    // Setup event listeners
    setupEventListeners();
    
    // Load initial data
    loadPage('calendar');
    
    // Apply theme
    applyTheme();
    
    console.log('App initialized successfully');
  }

  function setupEventListeners() {
    // Menu toggle
    document.getElementById('menuBtn').addEventListener('click', () => {
      document.getElementById('sidenav').classList.add('active');
    });

    document.getElementById('closeSidenav').addEventListener('click', () => {
      document.getElementById('sidenav').classList.remove('active');
    });

    // Navigation
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        loadPage(page);
        document.getElementById('sidenav').classList.remove('active');
      });
    });

    // View all links
    document.querySelectorAll('.view-all').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        loadPage(page);
      });
    });

    // Calendar navigation
    document.getElementById('prevMonth').addEventListener('click', () => {
      CalendarManager.navigateMonth(-1);
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
      CalendarManager.navigateMonth(1);
    });

    document.getElementById('todayBtn').addEventListener('click', () => {
      CalendarManager.goToToday();
    });

    // FAB Menu
    const fabMain = document.getElementById('fabMain');
    const fabMenu = document.getElementById('fabMenu');
    
    fabMain.addEventListener('click', () => {
      fabMain.classList.toggle('active');
      fabMenu.classList.toggle('active');
    });

    document.querySelectorAll('.fab-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const action = option.dataset.action;
        handleQuickAction(action);
        fabMain.classList.remove('active');
        fabMenu.classList.remove('active');
      });
    });

    // Modal close
    document.getElementById('closeModal').addEventListener('click', () => {
      Utils.closeModal();
    });

    // Drawer
    document.getElementById('closeDrawer').addEventListener('click', () => {
      CalendarManager.closeDrawer();
    });

    // Drawer tabs
    document.querySelectorAll('.tab-btn').forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        switchDrawerTab(tabName);
      });
    });

    // Drawer add buttons
    document.getElementById('drawerAddIncome').addEventListener('click', () => {
      showIncomeForm(CalendarManager.getSelectedDate());
    });

    document.getElementById('drawerAddExpense').addEventListener('click', () => {
      showExpenseForm(CalendarManager.getSelectedDate());
    });

    document.getElementById('drawerAddNote').addEventListener('click', () => {
      showNoteForm(CalendarManager.getSelectedDate());
    });

    document.getElementById('drawerAddTask').addEventListener('click', () => {
      showTaskForm(CalendarManager.getSelectedDate());
    });

    // Page buttons
    const addIncomeBtn = document.getElementById('addIncomeBtn');
    if (addIncomeBtn) {
      addIncomeBtn.addEventListener('click', () => showIncomeForm());
    }

    const addExpenseBtn = document.getElementById('addExpenseBtn');
    if (addExpenseBtn) {
      addExpenseBtn.addEventListener('click', () => showExpenseForm());
    }

    const addNoteBtn = document.getElementById('addNoteBtn');
    if (addNoteBtn) {
      addNoteBtn.addEventListener('click', () => showNoteForm());
    }

    const addShoppingBtn = document.getElementById('addShoppingBtn');
    if (addShoppingBtn) {
      addShoppingBtn.addEventListener('click', () => showShoppingForm());
    }

    const addHolidayBtn = document.getElementById('addHolidayBtn');
    if (addHolidayBtn) {
      addHolidayBtn.addEventListener('click', () => showHolidayForm());
    }

    const importHolidayBtn = document.getElementById('importHolidayBtn');
    if (importHolidayBtn) {
      importHolidayBtn.addEventListener('click', () => {
        document.getElementById('csvFileInput').click();
      });
    }

    const csvFileInput = document.getElementById('csvFileInput');
    if (csvFileInput) {
      csvFileInput.addEventListener('change', (e) => {
        importHolidaysCSV(e.target.files[0]);
      });
    }

    const exportReportBtn = document.getElementById('exportReportBtn');
    if (exportReportBtn) {
      exportReportBtn.addEventListener('click', () => {
        const reportYear = document.getElementById('reportYear');
        const reportMonth = document.getElementById('reportMonth');
        if (reportYear && reportMonth) {
          exportMonthlyReport(parseInt(reportYear.value), parseInt(reportMonth.value));
        }
      });
    }

    const exportAllDataBtn = document.getElementById('exportAllDataBtn');
    if (exportAllDataBtn) {
      exportAllDataBtn.addEventListener('click', () => exportAllData());
    }

    const clearDataBtn = document.getElementById('clearDataBtn');
    if (clearDataBtn) {
      clearDataBtn.addEventListener('click', () => clearAllData());
    }

    // Theme selector
    document.querySelectorAll('input[name="theme"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const theme = e.target.value;
        setTheme(theme);
      });
    });

    // Close modal on backdrop click
    document.getElementById('modal').addEventListener('click', (e) => {
      if (e.target.id === 'modal') {
        Utils.closeModal();
      }
    });

    // Initialize report with current BS date
    const reportYear = document.getElementById('reportYear');
    const reportMonth = document.getElementById('reportMonth');
    if (reportYear && reportMonth) {
      const today = NepaliDate.getTodayBS();
      reportYear.value = today.year;
      reportMonth.value = today.month;
    }
  }

  function loadPage(page) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // Show selected page
    const targetPage = document.getElementById(page + 'Page');
    if (targetPage) {
      targetPage.classList.add('active');
    }
    
    // Update navigation
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.classList.remove('active');
      if (link.dataset.page === page) {
        link.classList.add('active');
      }
    });
    
    currentPage = page;
    
    // Load page data
    switch (page) {
      case 'income':
        loadIncomePage();
        break;
      case 'expense':
        loadExpensePage();
        break;
      case 'notes':
        loadNotesPage();
        break;
      case 'shopping':
        loadShoppingPage();
        break;
      case 'reports':
        loadReportsPage();
        break;
      case 'settings':
        loadSettingsPage();
        break;
    }
  }

  function handleQuickAction(action) {
    switch (action) {
      case 'income':
        showIncomeForm();
        break;
      case 'expense':
        showExpenseForm();
        break;
      case 'note':
        showNoteForm();
        break;
      case 'shopping':
        showShoppingForm();
        break;
    }
  }

  function switchDrawerTab(tabName) {
    document.querySelectorAll('.tab-btn').forEach(tab => {
      tab.classList.remove('active');
      if (tab.dataset.tab === tabName) {
        tab.classList.add('active');
      }
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    
    document.getElementById('drawer' + capitalize(tabName)).classList.add('active');
  }

  // Helper function to generate day options
  function generateDayOptions(year, month, selectedDay = 1) {
    const daysInMonth = NepaliDate.getDaysInBSMonth(year, month);
    let options = '';
    for (let i = 1; i <= daysInMonth; i++) {
      options += `<option value="${i}" ${i === selectedDay ? 'selected' : ''}>${i}</option>`;
    }
    return options;
  }

  // Setup BS Date Picker change handlers
  function setupBSDatePicker(prefix) {
    const yearSelect = document.getElementById(`${prefix}Year`);
    const monthSelect = document.getElementById(`${prefix}Month`);
    const daySelect = document.getElementById(`${prefix}Day`);
    
    if (!yearSelect || !monthSelect || !daySelect) return;
    
    const updateDays = () => {
      const year = parseInt(yearSelect.value);
      const month = parseInt(monthSelect.value);
      const currentDay = parseInt(daySelect.value);
      const daysInMonth = NepaliDate.getDaysInBSMonth(year, month);
      
      daySelect.innerHTML = '';
      for (let i = 1; i <= daysInMonth; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        if (i === currentDay && i <= daysInMonth) {
          option.selected = true;
        } else if (currentDay > daysInMonth && i === daysInMonth) {
          option.selected = true;
        }
        daySelect.appendChild(option);
      }
    };
    
    yearSelect.addEventListener('change', updateDays);
    monthSelect.addEventListener('change', updateDays);
  }

  // Income Functions with BS Date Picker
  function showIncomeForm(date = null) {
    const today = NepaliDate.getTodayBS();
    let selectedYear = today.year;
    let selectedMonth = today.month;
    let selectedDay = today.day;
    
    // Parse date if provided
    if (date) {
      const parts = date.split('/');
      if (parts.length === 3) {
        selectedYear = parseInt(parts[0]);
        selectedMonth = parseInt(parts[1]);
        selectedDay = parseInt(parts[2]);
      }
    }
    
    const years = NepaliDate.getSupportedYears();
    const yearOptions = years.map(y => `<option value="${y}" ${y === selectedYear ? 'selected' : ''}>${y}</option>`).join('');
    const monthOptions = NepaliDate.nepaliMonths.map((m, i) => 
      `<option value="${i + 1}" ${(i + 1) === selectedMonth ? 'selected' : ''}>${m}</option>`
    ).join('');
    
    const formHTML = `
      <form id="incomeForm">
        <div class="form-group">
          <label class="form-label">मिति (बि.सं.)</label>
          <div class="bs-date-picker">
            <select class="form-select bs-year" name="year" id="incomeYear" required>
              ${yearOptions}
            </select>
            <select class="form-select bs-month" name="month" id="incomeMonth" required>
              ${monthOptions}
            </select>
            <select class="form-select bs-day" name="day" id="incomeDay" required>
              ${generateDayOptions(selectedYear, selectedMonth, selectedDay)}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">रकम</label>
          <input type="number" class="form-input" name="amount" required min="0" step="0.01">
        </div>
        <div class="form-group">
          <label class="form-label">श्रेणी</label>
          <select class="form-select" name="category" required>
            <option value="">छान्नुहोस्</option>
            <option value="तलब">तलब</option>
            <option value="व्यवसाय">व्यवसाय</option>
            <option value="निवेश">निवेश</option>
            <option value="बोनस">बोनस</option>
            <option value="अन्य">अन्य</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">विवरण</label>
          <textarea class="form-textarea" name="description"></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn" onclick="Utils.closeModal()">रद्द गर्नुहोस्</button>
          <button type="submit" class="btn btn-primary">सुरक्षित गर्नुहोस्</button>
        </div>
      </form>
    `;
    
    Utils.openModal('नयाँ आम्दानी थप्नुहोस्', formHTML);
    
    setupBSDatePicker('income');
    
    document.getElementById('incomeForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const year = parseInt(formData.get('year'));
      const month = parseInt(formData.get('month'));
      const day = parseInt(formData.get('day'));
      
      const data = {
        date: NepaliDate.formatBS(year, month, day),
        amount: parseFloat(formData.get('amount')),
        category: formData.get('category'),
        description: formData.get('description')
      };
      
      DB.Income.add(data);
      Utils.closeModal();
      Utils.showToast('आम्दानी थपियो');
      CalendarManager.renderCalendar();
      CalendarManager.loadDashboardData();
      if (currentPage === 'income') loadIncomePage();
    });
  }

  function loadIncomePage() {
    const incomes = DB.Income.getAll();
    const total = incomes.reduce((sum, item) => sum + item.amount, 0);
    
    document.getElementById('totalIncome').textContent = Utils.formatCurrency(total);
    
    const list = document.getElementById('incomeList');
    if (incomes.length === 0) {
      list.innerHTML = '<p style="text-align:center; color: #999; padding: 2rem;">कुनै डाटा छैन</p>';
      return;
    }
    
    list.innerHTML = incomes.reverse().map(item => `
      <div class="data-item">
        <div class="data-item-left">
          <div class="data-item-title">${item.category}</div>
          <div class="data-item-meta">${item.date} • ${item.description || ''}</div>
        </div>
        <div class="data-item-right">
          <div class="data-item-amount income">${Utils.formatCurrency(item.amount)}</div>
          <div class="data-item-actions">
            <button class="icon-btn delete" onclick="App.deleteIncome('${item.id}')">
              <span class="material-icons">delete</span>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function deleteIncome(id) {
    Utils.confirm('के तपाई यो आम्दानी मेटाउन निश्चित हुनुहुन्छ?', () => {
      DB.Income.remove(id);
      Utils.showToast('आम्दानी मेटाइयो');
      CalendarManager.renderCalendar();
      CalendarManager.loadDashboardData();
      loadIncomePage();
    });
  }

  // Expense Functions with BS Date Picker
  function showExpenseForm(date = null) {
    const today = NepaliDate.getTodayBS();
    let selectedYear = today.year;
    let selectedMonth = today.month;
    let selectedDay = today.day;
    
    if (date) {
      const parts = date.split('/');
      if (parts.length === 3) {
        selectedYear = parseInt(parts[0]);
        selectedMonth = parseInt(parts[1]);
        selectedDay = parseInt(parts[2]);
      }
    }
    
    const years = NepaliDate.getSupportedYears();
    const yearOptions = years.map(y => `<option value="${y}" ${y === selectedYear ? 'selected' : ''}>${y}</option>`).join('');
    const monthOptions = NepaliDate.nepaliMonths.map((m, i) => 
      `<option value="${i + 1}" ${(i + 1) === selectedMonth ? 'selected' : ''}>${m}</option>`
    ).join('');
    
    const formHTML = `
      <form id="expenseForm">
        <div class="form-group">
          <label class="form-label">मिति (बि.सं.)</label>
          <div class="bs-date-picker">
            <select class="form-select bs-year" name="year" id="expenseYear" required>
              ${yearOptions}
            </select>
            <select class="form-select bs-month" name="month" id="expenseMonth" required>
              ${monthOptions}
            </select>
            <select class="form-select bs-day" name="day" id="expenseDay" required>
              ${generateDayOptions(selectedYear, selectedMonth, selectedDay)}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">रकम</label>
          <input type="number" class="form-input" name="amount" required min="0" step="0.01">
        </div>
        <div class="form-group">
          <label class="form-label">श्रेणी</label>
          <select class="form-select" name="category" required>
            <option value="">छान्नुहोस्</option>
            <option value="खाना">खाना</option>
            <option value="यातायात">यातायात</option>
            <option value="किनमेल">किनमेल</option>
            <option value="बिजुली">बिजुली/पानी</option>
            <option value="शिक्षा">शिक्षा</option>
            <option value="स्वास्थ्य">स्वास्थ्य</option>
            <option value="मनोरञ्जन">मनोरञ्जन</option>
            <option value="किस्ता">किस्ता/ऋण</option>
            <option value="अन्य">अन्य</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">विवरण</label>
          <textarea class="form-textarea" name="description"></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn" onclick="Utils.closeModal()">रद्द गर्नुहोस्</button>
          <button type="submit" class="btn btn-primary">सुरक्षित गर्नुहोस्</button>
        </div>
      </form>
    `;
    
    Utils.openModal('नयाँ खर्च थप्नुहोस्', formHTML);
    
    setupBSDatePicker('expense');
    
    document.getElementById('expenseForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const year = parseInt(formData.get('year'));
      const month = parseInt(formData.get('month'));
      const day = parseInt(formData.get('day'));
      
      const data = {
        date: NepaliDate.formatBS(year, month, day),
        amount: parseFloat(formData.get('amount')),
        category: formData.get('category'),
        description: formData.get('description')
      };
      
      DB.Expense.add(data);
      Utils.closeModal();
      Utils.showToast('खर्च थपियो');
      CalendarManager.renderCalendar();
      CalendarManager.loadDashboardData();
      if (currentPage === 'expense') loadExpensePage();
    });
  }

  function loadExpensePage() {
    const expenses = DB.Expense.getAll();
    const total = expenses.reduce((sum, item) => sum + item.amount, 0);
    
    document.getElementById('totalExpense').textContent = Utils.formatCurrency(total);
    
    const list = document.getElementById('expenseList');
    if (expenses.length === 0) {
      list.innerHTML = '<p style="text-align:center; color: #999; padding: 2rem;">कुनै डाटा छैन</p>';
      return;
    }
    
    list.innerHTML = expenses.reverse().map(item => `
      <div class="data-item">
        <div class="data-item-left">
          <div class="data-item-title">${item.category}</div>
          <div class="data-item-meta">${item.date} • ${item.description || ''}</div>
        </div>
        <div class="data-item-right">
          <div class="data-item-amount expense">${Utils.formatCurrency(item.amount)}</div>
          <div class="data-item-actions">
            <button class="icon-btn delete" onclick="App.deleteExpense('${item.id}')">
              <span class="material-icons">delete</span>
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function deleteExpense(id) {
    Utils.confirm('के तपाई यो खर्च मेटाउन निश्चित हुनुहुन्छ?', () => {
      DB.Expense.remove(id);
      Utils.showToast('खर्च मेटाइयो');
      CalendarManager.renderCalendar();
      CalendarManager.loadDashboardData();
      loadExpensePage();
    });
  }

  // Note Functions with BS Date Picker
  function showNoteForm(date = null) {
    const today = NepaliDate.getTodayBS();
    let selectedYear = today.year;
    let selectedMonth = today.month;
    let selectedDay = today.day;
    
    if (date) {
      const parts = date.split('/');
      if (parts.length === 3) {
        selectedYear = parseInt(parts[0]);
        selectedMonth = parseInt(parts[1]);
        selectedDay = parseInt(parts[2]);
      }
    }
    
    const years = NepaliDate.getSupportedYears();
    const yearOptions = years.map(y => `<option value="${y}" ${y === selectedYear ? 'selected' : ''}>${y}</option>`).join('');
    const monthOptions = NepaliDate.nepaliMonths.map((m, i) => 
      `<option value="${i + 1}" ${(i + 1) === selectedMonth ? 'selected' : ''}>${m}</option>`
    ).join('');
    
    const formHTML = `
      <form id="noteForm">
        <div class="form-group">
          <label class="form-label">मिति (बि.सं.)</label>
          <div class="bs-date-picker">
            <select class="form-select bs-year" name="year" id="noteYear" required>
              ${yearOptions}
            </select>
            <select class="form-select bs-month" name="month" id="noteMonth" required>
              ${monthOptions}
            </select>
            <select class="form-select bs-day" name="day" id="noteDay" required>
              ${generateDayOptions(selectedYear, selectedMonth, selectedDay)}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">शीर्षक</label>
          <input type="text" class="form-input" name="title" required>
        </div>
        <div class="form-group">
          <label class="form-label">विवरण</label>
          <textarea class="form-textarea" name="content" required></textarea>
        </div>
        <div class="form-group">
          <label class="form-label">रिमाइन्डर</label>
          <input type="datetime-local" class="form-input" name="reminder">
        </div>
        <div class="form-actions">
          <button type="button" class="btn" onclick="Utils.closeModal()">रद्द गर्नुहोस्</button>
          <button type="submit" class="btn btn-primary">सुरक्षित गर्नुहोस्</button>
        </div>
      </form>
    `;
    
    Utils.openModal('नयाँ नोट थप्नुहोस्', formHTML);
    
    setupBSDatePicker('note');
    
    document.getElementById('noteForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const year = parseInt(formData.get('year'));
      const month = parseInt(formData.get('month'));
      const day = parseInt(formData.get('day'));
      
      const data = {
        date: NepaliDate.formatBS(year, month, day),
        title: formData.get('title'),
        content: formData.get('content'),
        reminder: formData.get('reminder')
      };
      
      DB.Notes.add(data);
      Utils.closeModal();
      Utils.showToast('नोट थपियो');
      CalendarManager.renderCalendar();
      CalendarManager.loadDashboardData();
      if (currentPage === 'notes') loadNotesPage();
    });
  }

  function loadNotesPage() {
    const notes = DB.Notes.getAll();
    const grid = document.getElementById('notesList');
    
    if (notes.length === 0) {
      grid.innerHTML = '<p style="text-align:center; color: #999; padding: 2rem;">कुनै नोट छैन</p>';
      return;
    }
    
    grid.innerHTML = notes.reverse().map(note => `
      <div class="note-card ${note.reminder ? 'has-reminder' : ''}">
        <div class="note-header">
          <div class="note-title">${note.title}</div>
          <button class="icon-btn delete" onclick="App.deleteNote('${note.id}')">
            <span class="material-icons">delete</span>
          </button>
        </div>
        <div class="note-content">${note.content}</div>
        <div class="note-footer">
          <span>${note.date}</span>
          ${note.reminder ? `<span class="note-reminder">⏰ ${new Date(note.reminder).toLocaleString('ne-NP')}</span>` : ''}
        </div>
      </div>
    `).join('');
  }

  function deleteNote(id) {
    Utils.confirm('के तपाई यो नोट मेटाउन निश्चित हुनुहुन्छ?', () => {
      DB.Notes.remove(id);
      Utils.showToast('नोट मेटाइयो');
      CalendarManager.renderCalendar();
      CalendarManager.loadDashboardData();
      loadNotesPage();
    });
  }

  // Task Functions with BS Date Picker
  function showTaskForm(date = null) {
    const today = NepaliDate.getTodayBS();
    let selectedYear = today.year;
    let selectedMonth = today.month;
    let selectedDay = today.day;
    
    if (date) {
      const parts = date.split('/');
      if (parts.length === 3) {
        selectedYear = parseInt(parts[0]);
        selectedMonth = parseInt(parts[1]);
        selectedDay = parseInt(parts[2]);
      }
    }
    
    const years = NepaliDate.getSupportedYears();
    const yearOptions = years.map(y => `<option value="${y}" ${y === selectedYear ? 'selected' : ''}>${y}</option>`).join('');
    const monthOptions = NepaliDate.nepaliMonths.map((m, i) => 
      `<option value="${i + 1}" ${(i + 1) === selectedMonth ? 'selected' : ''}>${m}</option>`
    ).join('');
    
    const formHTML = `
      <form id="taskForm">
        <div class="form-group">
          <label class="form-label">मिति (बि.सं.)</label>
          <div class="bs-date-picker">
            <select class="form-select bs-year" name="year" id="taskYear" required>
              ${yearOptions}
            </select>
            <select class="form-select bs-month" name="month" id="taskMonth" required>
              ${monthOptions}
            </select>
            <select class="form-select bs-day" name="day" id="taskDay" required>
              ${generateDayOptions(selectedYear, selectedMonth, selectedDay)}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">शीर्षक</label>
          <input type="text" class="form-input" name="title" required>
        </div>
        <div class="form-group">
          <label class="form-label">रिमाइन्डर</label>
          <input type="datetime-local" class="form-input" name="reminder">
        </div>
        <div class="form-actions">
          <button type="button" class="btn" onclick="Utils.closeModal()">रद्द गर्नुहोस्</button>
          <button type="submit" class="btn btn-primary">सुरक्षित गर्नुहोस्</button>
        </div>
      </form>
    `;
    
    Utils.openModal('नयाँ कार्य थप्नुहोस्', formHTML);
    
    setupBSDatePicker('task');
    
    document.getElementById('taskForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const year = parseInt(formData.get('year'));
      const month = parseInt(formData.get('month'));
      const day = parseInt(formData.get('day'));
      
      const data = {
        date: NepaliDate.formatBS(year, month, day),
        title: formData.get('title'),
        reminder: formData.get('reminder'),
        completed: false
      };
      
      DB.Tasks.add(data);
      Utils.closeModal();
      Utils.showToast('कार्य थपियो');
      CalendarManager.renderCalendar();
      CalendarManager.loadDashboardData();
    });
  }

  function deleteTask(id) {
    Utils.confirm('के तपाई यो कार्य मेटाउन निश्चित हुनुहुन्छ?', () => {
      DB.Tasks.remove(id);
      Utils.showToast('कार्य मेटाइयो');
      CalendarManager.renderCalendar();
      CalendarManager.loadDashboardData();
    });
  }

  // Shopping Functions
  function showShoppingForm() {
    const formHTML = `
      <form id="shoppingForm">
        <div class="form-group">
          <label class="form-label">वस्तुको नाम</label>
          <input type="text" class="form-input" name="name" required>
        </div>
        <div class="form-group">
          <label class="form-label">परिमाण</label>
          <input type="text" class="form-input" name="quantity">
        </div>
        <div class="form-group">
          <label class="form-label">अनुमानित मूल्य</label>
          <input type="number" class="form-input" name="estimatedPrice" min="0" step="0.01">
        </div>
        <div class="form-actions">
          <button type="button" class="btn" onclick="Utils.closeModal()">रद्द गर्नुहोस्</button>
          <button type="submit" class="btn btn-primary">सुरक्षित गर्नुहोस्</button>
        </div>
      </form>
    `;
    
    Utils.openModal('नयाँ वस्तु थप्नुहोस्', formHTML);
    
    document.getElementById('shoppingForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        name: formData.get('name'),
        quantity: formData.get('quantity'),
        estimatedPrice: parseFloat(formData.get('estimatedPrice')) || 0,
        purchased: false,
        purchasePrice: 0
      };
      
      DB.Shopping.add(data);
      Utils.closeModal();
      Utils.showToast('वस्तु थपियो');
      loadShoppingPage();
      CalendarManager.loadDashboardData();
    });
  }

  function loadShoppingPage() {
    const items = DB.Shopping.getAll();
    const totalItems = items.length;
    const purchasedItems = items.filter(i => i.purchased).length;
    const pendingItems = totalItems - purchasedItems;
    
    document.getElementById('totalItems').textContent = totalItems;
    document.getElementById('purchasedItems').textContent = purchasedItems;
    document.getElementById('pendingItems').textContent = pendingItems;
    
    const list = document.getElementById('shoppingList');
    if (items.length === 0) {
      list.innerHTML = '<p style="text-align:center; color: #999; padding: 2rem;">कुनै वस्तु छैन</p>';
      return;
    }
    
    list.innerHTML = items.map(item => `
      <div class="shopping-item ${item.purchased ? 'purchased' : ''}">
        <input type="checkbox" class="shopping-checkbox" 
               ${item.purchased ? 'checked' : ''} 
               onchange="App.toggleShoppingItem('${item.id}', this.checked)">
        <div class="item-details">
          <div class="item-name">${item.name}</div>
          <div class="item-meta">
            ${item.quantity ? `<span class="item-quantity">${item.quantity}</span>` : ''}
            ${item.estimatedPrice ? ` • अनुमानित: रु. ${item.estimatedPrice}` : ''}
          </div>
        </div>
        ${item.purchasePrice > 0 ? `<div class="item-price">रु. ${item.purchasePrice}</div>` : ''}
        <button class="icon-btn delete" onclick="App.deleteShoppingItem('${item.id}')">
          <span class="material-icons">delete</span>
        </button>
      </div>
    `).join('');
  }

  function toggleShoppingItem(id, checked) {
    const item = DB.Shopping.getById(id);
    
    if (checked && !item.purchased) {
      const formHTML = `
        <form id="purchasePriceForm">
          <div class="form-group">
            <label class="form-label">किनमेल मूल्य</label>
            <input type="number" class="form-input" name="price" required min="0" step="0.01" 
                   value="${item.estimatedPrice || ''}" autofocus>
          </div>
          <div class="form-actions">
            <button type="button" class="btn" onclick="Utils.closeModal(); App.loadShoppingPage()">रद्द गर्नुहोस्</button>
            <button type="submit" class="btn btn-primary">सुरक्षित गर्नुहोस्</button>
          </div>
        </form>
      `;
      
      Utils.openModal('किनमेल मूल्य प्रविष्ट गर्नुहोस्', formHTML);
      
      document.getElementById('purchasePriceForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const price = parseFloat(new FormData(e.target).get('price'));
        
        DB.Shopping.update(id, { purchased: true, purchasePrice: price });
        
        const today = NepaliDate.getTodayBS();
        DB.Expense.add({
          date: NepaliDate.formatBS(today.year, today.month, today.day),
          amount: price,
          category: 'किनमेल',
          description: item.name
        });
        
        Utils.closeModal();
        Utils.showToast('किनमेल पूरा भयो र खर्चमा थपियो');
        loadShoppingPage();
        CalendarManager.renderCalendar();
        CalendarManager.loadDashboardData();
      });
    } else {
      DB.Shopping.update(id, { purchased: checked });
      loadShoppingPage();
      CalendarManager.loadDashboardData();
    }
  }

  function deleteShoppingItem(id) {
    Utils.confirm('के तपाई यो वस्तु मेटाउन निश्चित हुनुहुन्छ?', () => {
      DB.Shopping.remove(id);
      Utils.showToast('वस्तु मेटाइयो');
      loadShoppingPage();
      CalendarManager.loadDashboardData();
    });
  }

  // Settings Functions
  function showHolidayForm() {
    const formHTML = `
      <form id="holidayForm">
        <div class="form-group">
          <label class="form-label">मिति (YYYY/MM/DD)</label>
          <input type="text" class="form-input" name="date" required placeholder="2082/01/01">
        </div>
        <div class="form-group">
          <label class="form-label">बिदाको नाम</label>
          <input type="text" class="form-input" name="name" required>
        </div>
        <div class="form-group">
          <label class="form-label">प्रकार</label>
          <select class="form-select" name="type" required>
            <option value="public">सार्वजनिक बिदा</option>
            <option value="festival">चाड</option>
            <option value="other">अन्य</option>
          </select>
        </div>
        <div class="form-actions">
          <button type="button" class="btn" onclick="Utils.closeModal()">रद्द गर्नुहोस्</button>
          <button type="submit" class="btn btn-primary">सुरक्षित गर्नुहोस्</button>
        </div>
      </form>
    `;
    
    Utils.openModal('नयाँ बिदा थप्नुहोस्', formHTML);
    
    document.getElementById('holidayForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = {
        date: formData.get('date'),
        name: formData.get('name'),
        type: formData.get('type')
      };
      
      DB.Holidays.add(data);
      Utils.closeModal();
      Utils.showToast('बिदा थपियो');
      loadSettingsPage();
      CalendarManager.renderCalendar();
    });
  }

  function importHolidaysCSV(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvData = Utils.parseCSV(e.target.result);
        const holidays = csvData.map(row => ({
          date: row.date || row.Date,
          name: row.name || row.Name,
          type: row.type || row.Type || 'public'
        }));
        
        DB.Holidays.bulkAdd(holidays);
        Utils.showToast(`${holidays.length} बिदाहरू थपिए`);
        loadSettingsPage();
        CalendarManager.renderCalendar();
      } catch (error) {
        Utils.showToast('CSV फाइल पढ्न समस्या भयो');
        console.error(error);
      }
    };
    reader.readAsText(file);
  }

  function loadSettingsPage() {
    const holidays = DB.Holidays.getAll();
    const list = document.getElementById('holidaysList');
    
    if (holidays.length === 0) {
      list.innerHTML = '<p style="text-align:center; color: #999; padding: 1rem;">कुनै बिदा छैन</p>';
      return;
    }
    
    list.innerHTML = holidays.map(holiday => `
      <div class="holiday-item">
        <div>
          <strong>${holiday.name}</strong>
          <div style="font-size: 0.85rem; color: #666;">${holiday.date} • ${holiday.type}</div>
        </div>
        <button class="icon-btn delete" onclick="App.deleteHoliday('${holiday.id}')">
          <span class="material-icons">delete</span>
        </button>
      </div>
    `).join('');
  }

  function deleteHoliday(id) {
    Utils.confirm('के तपाई यो बिदा मेटाउन निश्चित हुनुहुन्छ?', () => {
      DB.Holidays.remove(id);
      Utils.showToast('बिदा मेटाइयो');
      loadSettingsPage();
      CalendarManager.renderCalendar();
    });
  }

  // Enhanced Report Functions
  function loadReportsPage() {
    const reportYear = document.getElementById('reportYear');
    const reportMonth = document.getElementById('reportMonth');
    
    if (reportYear && reportMonth) {
      const today = NepaliDate.getTodayBS();
      reportYear.value = today.year;
      reportMonth.value = today.month;
      
      generateMonthlyReport(today.year, today.month);
      
      // Setup event listeners for filters
      reportYear.addEventListener('change', () => {
        const year = parseInt(reportYear.value);
        const month = parseInt(reportMonth.value);
        generateMonthlyReport(year, month);
      });
      
      reportMonth.addEventListener('change', () => {
        const year = parseInt(reportYear.value);
        const month = parseInt(reportMonth.value);
        generateMonthlyReport(year, month);
      });
    }
  }

  function generateMonthlyReport(year, month) {
    const startDate = NepaliDate.formatBS(year, month, 1);
    const lastDay = NepaliDate.getDaysInBSMonth(year, month);
    const endDate = NepaliDate.formatBS(year, month, lastDay);
    
    const income = DB.Income.getByDateRange(startDate, endDate);
    const expense = DB.Expense.getByDateRange(startDate, endDate);
    const notes = DB.Notes.getAll().filter(n => n.date >= startDate && n.date <= endDate);
    const tasks = DB.Tasks.getAll().filter(t => t.date >= startDate && t.date <= endDate);
    
    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expense.reduce((sum, item) => sum + item.amount, 0);
    const balance = totalIncome - totalExpense;
    
    // Update summary
    document.getElementById('reportIncome').textContent = Utils.formatCurrency(totalIncome);
    document.getElementById('reportExpense').textContent = Utils.formatCurrency(totalExpense);
    document.getElementById('reportBalance').textContent = Utils.formatCurrency(balance);
    
    // Generate day-wise report table
    generateDayWiseTable(year, month, income, expense, notes, tasks);
    
    // Generate category breakdown
    generateCategoryBreakdown(income, expense);
  }

  function generateDayWiseTable(year, month, income, expense, notes, tasks) {
    const daysInMonth = NepaliDate.getDaysInBSMonth(year, month);
    const tableBody = document.getElementById('dayWiseTableBody');
    
    if (!tableBody) return;
    
    let html = '';
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = NepaliDate.formatBS(year, month, day);
      const dayIncome = income.filter(i => i.date === dateStr);
      const dayExpense = expense.filter(e => e.date === dateStr);
      const dayNotes = notes.filter(n => n.date === dateStr);
      const dayTasks = tasks.filter(t => t.date === dateStr);
      
      const totalDayIncome = dayIncome.reduce((sum, i) => sum + i.amount, 0);
      const totalDayExpense = dayExpense.reduce((sum, e) => sum + e.amount, 0);
      const dayBalance = totalDayIncome - totalDayExpense;
      
      // Get AD date for reference
      const adDate = NepaliDate.bsToAD(year, month, day);
      const adDateStr = `${adDate.getDate()}/${adDate.getMonth() + 1}`;
      
      html += `
        <tr class="${dayIncome.length > 0 || dayExpense.length > 0 || dayNotes.length > 0 || dayTasks.length > 0 ? 'has-activity' : ''}">
          <td class="day-cell">
            <strong>${day}</strong>
            <span class="ad-date-small">(${adDateStr})</span>
          </td>
          <td class="income-cell">
            ${totalDayIncome > 0 ? `
              <div class="amount-value income-amount">रु. ${totalDayIncome.toLocaleString()}</div>
              <div class="transactions-list">
                ${dayIncome.map(i => `<div class="transaction-detail">${i.category}: रु. ${i.amount.toLocaleString()}</div>`).join('')}
              </div>
            ` : '-'}
          </td>
          <td class="expense-cell">
            ${totalDayExpense > 0 ? `
              <div class="amount-value expense-amount">रु. ${totalDayExpense.toLocaleString()}</div>
              <div class="transactions-list">
                ${dayExpense.map(e => `<div class="transaction-detail">${e.category}: रु. ${e.amount.toLocaleString()}</div>`).join('')}
              </div>
            ` : '-'}
          </td>
          <td class="balance-cell ${dayBalance > 0 ? 'positive' : dayBalance < 0 ? 'negative' : ''}">
            ${dayBalance !== 0 ? `रु. ${dayBalance.toLocaleString()}` : '-'}
          </td>
          <td class="notes-cell">
            ${dayNotes.length > 0 ? `
              <div class="notes-count">${dayNotes.length} नोट</div>
              <div class="notes-list">
                ${dayNotes.map(n => `<div class="note-detail">${n.title}</div>`).join('')}
              </div>
            ` : '-'}
          </td>
          <td class="activities-cell">
            <div class="activity-indicators">
              ${dayTasks.length > 0 ? `<span class="activity-badge task-badge">${dayTasks.length} कार्य</span>` : ''}
            </div>
          </td>
        </tr>
      `;
    }
    
    // Add totals row
    const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = expense.reduce((sum, e) => sum + e.amount, 0);
    const totalBalance = totalIncome - totalExpense;
    
    html += `
      <tr class="totals-row">
        <td><strong>कुल</strong></td>
        <td class="income-cell"><strong class="income-amount">रु. ${totalIncome.toLocaleString()}</strong></td>
        <td class="expense-cell"><strong class="expense-amount">रु. ${totalExpense.toLocaleString()}</strong></td>
        <td class="balance-cell ${totalBalance > 0 ? 'positive' : totalBalance < 0 ? 'negative' : ''}">
          <strong>रु. ${totalBalance.toLocaleString()}</strong>
        </td>
        <td><strong>${notes.length} नोट</strong></td>
        <td><strong>${tasks.length} कार्य</strong></td>
      </tr>
    `;
    
    tableBody.innerHTML = html;
  }

  function generateCategoryBreakdown(income, expense) {
    const incomeCategoryEl = document.getElementById('incomeCategoryBreakdown');
    const expenseCategoryEl = document.getElementById('expenseCategoryBreakdown');
    
    if (!incomeCategoryEl || !expenseCategoryEl) return;
    
    // Income by category
    const incomeByCategory = {};
    income.forEach(i => {
      if (!incomeByCategory[i.category]) {
        incomeByCategory[i.category] = 0;
      }
      incomeByCategory[i.category] += i.amount;
    });
    
    const incomeTotal = income.reduce((sum, i) => sum + i.amount, 0);
    
    incomeCategoryEl.innerHTML = Object.keys(incomeByCategory).length > 0 ? 
      Object.entries(incomeByCategory)
        .sort((a, b) => b[1] - a[1])
        .map(([category, amount]) => {
          const percentage = ((amount / incomeTotal) * 100).toFixed(1);
          return `
            <div class="category-item">
              <div class="category-info">
                <span class="category-name">${category}</span>
                <span class="category-amount income-amount">रु. ${amount.toLocaleString()}</span>
              </div>
              <div class="category-bar-container">
                <div class="category-bar income-bar" style="width: ${percentage}%"></div>
              </div>
              <div class="category-percentage">${percentage}%</div>
            </div>
          `;
        }).join('') : '<p class="empty-state">कुनै डाटा छैन</p>';
    
    // Expense by category
    const expenseByCategory = {};
    expense.forEach(e => {
      if (!expenseByCategory[e.category]) {
        expenseByCategory[e.category] = 0;
      }
      expenseByCategory[e.category] += e.amount;
    });
    
    const expenseTotal = expense.reduce((sum, e) => sum + e.amount, 0);
    
    expenseCategoryEl.innerHTML = Object.keys(expenseByCategory).length > 0 ?
      Object.entries(expenseByCategory)
        .sort((a, b) => b[1] - a[1])
        .map(([category, amount]) => {
          const percentage = ((amount / expenseTotal) * 100).toFixed(1);
          return `
            <div class="category-item">
              <div class="category-info">
                <span class="category-name">${category}</span>
                <span class="category-amount expense-amount">रु. ${amount.toLocaleString()}</span>
              </div>
              <div class="category-bar-container">
                <div class="category-bar expense-bar" style="width: ${percentage}%"></div>
              </div>
              <div class="category-percentage">${percentage}%</div>
            </div>
          `;
        }).join('') : '<p class="empty-state">कुनै डाटा छैन</p>';
  }

  function exportMonthlyReport(year, month) {
    const monthName = NepaliDate.nepaliMonths[month - 1];
    const startDate = NepaliDate.formatBS(year, month, 1);
    const lastDay = NepaliDate.getDaysInBSMonth(year, month);
    const endDate = NepaliDate.formatBS(year, month, lastDay);
    
    const income = DB.Income.getByDateRange(startDate, endDate);
    const expense = DB.Expense.getByDateRange(startDate, endDate);
    const notes = DB.Notes.getAll().filter(n => n.date >= startDate && n.date <= endDate);
    const tasks = DB.Tasks.getAll().filter(t => t.date >= startDate && t.date <= endDate);
    
    const reportData = {
      period: `${monthName} ${year}`,
      summary: {
        totalIncome: income.reduce((sum, i) => sum + i.amount, 0),
        totalExpense: expense.reduce((sum, e) => sum + e.amount, 0),
        balance: income.reduce((sum, i) => sum + i.amount, 0) - expense.reduce((sum, e) => sum + e.amount, 0)
      },
      income: income,
      expense: expense,
      notes: notes,
      tasks: tasks,
      exportDate: new Date().toISOString()
    };
    
    Utils.downloadJSON(reportData, `monthly-report-${year}-${month}-${Date.now()}.json`);
    Utils.showToast('रिपोर्ट निर्यात भयो');
  }

  function exportAllData() {
    const data = DB.DataManager.exportAll();
    Utils.downloadJSON(data, `nepali-calendar-backup-${Date.now()}.json`);
    Utils.showToast('सम्पूर्ण डाटा निर्यात भयो');
  }

  function clearAllData() {
    Utils.confirm('के तपाई सबै डाटा मेटाउन निश्चित हुनुहुन्छ? यो कार्य पूर्ववत गर्न सकिँदैन!', () => {
      DB.DataManager.clearAll();
      Utils.showToast('सबै डाटा मेटाइयो');
      setTimeout(() => location.reload(), 1000);
    });
  }

  function setTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    DB.Settings.save({ theme });
  }

  function applyTheme() {
    const settings = DB.Settings.get();
    if (settings.theme === 'dark') {
      document.body.classList.add('dark-theme');
      const darkRadio = document.querySelector('input[name="theme"][value="dark"]');
      if (darkRadio) darkRadio.checked = true;
    }
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return {
    init,
    deleteIncome,
    deleteExpense,
    deleteNote,
    deleteTask,
    deleteShoppingItem,
    toggleShoppingItem,
    deleteHoliday,
    loadShoppingPage,
    showHolidayForm
  };
})();

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    App.init();
  });
} else {
  console.log('DOM already loaded, initializing app...');
  App.init();
}

console.log('App module loaded');