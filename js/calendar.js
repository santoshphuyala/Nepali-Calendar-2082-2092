// Calendar Manager
const CalendarManager = (() => {
  let currentYear = null;
  let currentMonth = null;
  let selectedDate = null;

  function init() {
    console.log('CalendarManager.init() called');
    const today = NepaliDate.getTodayBS();
    currentYear = today.year;
    currentMonth = today.month;
    console.log('Current BS Date:', currentYear, currentMonth, today.day);
    
    renderMonthYearSelectors();
    renderCalendar();
    updateHeaderDates();
    
    // Load dashboard with slight delay to ensure DOM is ready
    setTimeout(() => {
      loadDashboardData();
    }, 100);
  }

  function renderMonthYearSelectors() {
    const monthSelect = document.getElementById('monthSelect');
    const yearSelect = document.getElementById('yearSelect');

    if (!monthSelect || !yearSelect) {
      console.error('Month/Year selectors not found!');
      return;
    }

    // Render months
    monthSelect.innerHTML = NepaliDate.nepaliMonths.map((month, index) => 
      `<option value="${index + 1}" ${index + 1 === currentMonth ? 'selected' : ''}>${month}</option>`
    ).join('');

    // Render years
    const years = NepaliDate.getSupportedYears();
    yearSelect.innerHTML = years.map(year => 
      `<option value="${year}" ${year === currentYear ? 'selected' : ''}>${year}</option>`
    ).join('');

    monthSelect.addEventListener('change', (e) => {
      currentMonth = parseInt(e.target.value);
      renderCalendar();
      loadDashboardData();
    });

    yearSelect.addEventListener('change', (e) => {
      currentYear = parseInt(e.target.value);
      renderCalendar();
      loadDashboardData();
    });
  }

  function renderCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    if (!calendarGrid) {
      console.error('Calendar grid element not found!');
      return;
    }

    console.log('Rendering calendar for:', currentYear, currentMonth);
    
    const calendar = NepaliDate.getMonthCalendar(currentYear, currentMonth);
    const today = NepaliDate.getTodayBS();
    const todayStr = NepaliDate.formatBS(today.year, today.month, today.day);

    let html = '<div class="calendar-header">';
    NepaliDate.nepaliDays.forEach(day => {
      html += `<div>${day}</div>`;
    });
    html += '</div><div class="calendar-days">';

    calendar.forEach(week => {
      week.forEach(day => {
        if (day === null) {
          html += '<div class="calendar-day empty-day"></div>';
        } else {
          const dateStr = NepaliDate.formatBS(day.bsYear, day.bsMonth, day.bsDay);
          const isToday = dateStr === todayStr;
          const isOtherMonth = day.bsMonth !== currentMonth;
          
          // Format AD date
          const adDate = day.adDate;
          const adDay = adDate.getDate();
          const adMonth = adDate.getMonth() + 1;
          
          // Get holidays for this date
          const holidays = DB.Holidays.getByDate(dateStr);
          
          // Get events for this date
          const income = DB.Income.getByDate(dateStr);
          const expense = DB.Expense.getByDate(dateStr);
          const notes = DB.Notes.getByDate(dateStr);
          const tasks = DB.Tasks.getByDate(dateStr);

          html += `
            <div class="calendar-day ${isToday ? 'today' : ''} ${isOtherMonth ? 'other-month' : ''}" 
                 data-date="${dateStr}">
              <div class="day-number">
                <span class="bs-day">${day.bsDay}</span>
                <span class="ad-day">${adDay}/${adMonth}</span>
              </div>
              ${holidays.map(h => `<div class="day-holiday">${h.name}</div>`).join('')}
              <div class="day-events">
                ${income.length > 0 ? `<span class="event-dot income" title="${income.length} आम्दानी"></span>` : ''}
                ${expense.length > 0 ? `<span class="event-dot expense" title="${expense.length} खर्च"></span>` : ''}
                ${notes.length > 0 ? `<span class="event-dot note" title="${notes.length} नोट"></span>` : ''}
                ${tasks.length > 0 ? `<span class="event-dot task" title="${tasks.length} कार्य"></span>` : ''}
              </div>
            </div>
          `;
        }
      });
    });

    html += '</div>';
    calendarGrid.innerHTML = html;

    console.log('Calendar HTML rendered');

    // Add click events to calendar days
    document.querySelectorAll('.calendar-day[data-date]').forEach(dayEl => {
      dayEl.addEventListener('click', () => {
        const date = dayEl.dataset.date;
        openDateDrawer(date);
      });
    });
  }

  function updateHeaderDates() {
    const today = new Date();
    const todayBS = NepaliDate.adToBS(today);
    
    const bsDateEl = document.getElementById('bsDate');
    const adDateEl = document.getElementById('adDate');
    
    if (bsDateEl) {
      bsDateEl.textContent = NepaliDate.formatBS(todayBS.year, todayBS.month, todayBS.day);
    }
    if (adDateEl) {
      adDateEl.textContent = NepaliDate.formatAD(today);
    }
  }

  function navigateMonth(direction) {
    currentMonth += direction;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    } else if (currentMonth < 1) {
      currentMonth = 12;
      currentYear--;
    }
    
    document.getElementById('monthSelect').value = currentMonth;
    document.getElementById('yearSelect').value = currentYear;
    renderCalendar();
    loadDashboardData();
  }

  function goToToday() {
    const today = NepaliDate.getTodayBS();
    currentYear = today.year;
    currentMonth = today.month;
    document.getElementById('monthSelect').value = currentMonth;
    document.getElementById('yearSelect').value = currentYear;
    renderCalendar();
    loadDashboardData();
  }

  function openDateDrawer(date) {
    selectedDate = date;
    const drawer = document.getElementById('dateDrawer');
    document.getElementById('drawerDate').textContent = date;
    
    // Load data for this date
    loadDrawerData(date);
    
    drawer.classList.add('active');
  }

  function closeDrawer() {
    document.getElementById('dateDrawer').classList.remove('active');
  }

  function loadDrawerData(date) {
    // Load income
    const income = DB.Income.getByDate(date);
    renderDrawerList('drawerIncomeList', income, 'income');

    // Load expenses
    const expenses = DB.Expense.getByDate(date);
    renderDrawerList('drawerExpenseList', expenses, 'expense');

    // Load notes
    const notes = DB.Notes.getByDate(date);
    renderDrawerList('drawerNotesList', notes, 'note');

    // Load tasks
    const tasks = DB.Tasks.getByDate(date);
    renderDrawerList('drawerTasksList', tasks, 'task');
  }

  function renderDrawerList(containerId, items, type) {
    const container = document.getElementById(containerId);
    
    if (items.length === 0) {
      container.innerHTML = '<p style="text-align:center; color: #999; padding: 2rem;">कुनै डाटा छैन</p>';
      return;
    }

    let html = '';
    items.forEach(item => {
      if (type === 'income' || type === 'expense') {
        html += `
          <div class="data-item">
            <div class="data-item-left">
              <div class="data-item-title">${item.category || 'अन्य'}</div>
              <div class="data-item-meta">${item.description || ''}</div>
            </div>
            <div class="data-item-right">
              <div class="data-item-amount ${type}">रु. ${item.amount.toLocaleString()}</div>
              <div class="data-item-actions">
                <button class="icon-btn delete" onclick="App.delete${type === 'income' ? 'Income' : 'Expense'}('${item.id}')">
                  <span class="material-icons">delete</span>
                </button>
              </div>
            </div>
          </div>
        `;
      } else if (type === 'note') {
        html += `
          <div class="note-card">
            <div class="note-header">
              <div class="note-title">${item.title}</div>
              <button class="icon-btn delete" onclick="App.deleteNote('${item.id}')">
                <span class="material-icons">delete</span>
              </button>
            </div>
            <div class="note-content">${item.content}</div>
          </div>
        `;
      } else if (type === 'task') {
        html += `
          <div class="data-item">
            <div class="data-item-left">
              <div class="data-item-title">${item.title}</div>
              <div class="data-item-meta">${item.reminder ? '⏰ ' + item.reminder : ''}</div>
            </div>
            <div class="data-item-actions">
              <button class="icon-btn delete" onclick="App.deleteTask('${item.id}')">
                <span class="material-icons">delete</span>
              </button>
            </div>
          </div>
        `;
      }
    });

    container.innerHTML = html;
  }

  function loadDashboardData() {
    loadMonthlySummary();
    loadRecentTransactions();
    loadRecentNotes();
    loadShoppingSummary();
  }

  function loadMonthlySummary() {
    const startDate = NepaliDate.formatBS(currentYear, currentMonth, 1);
    const lastDay = NepaliDate.getDaysInBSMonth(currentYear, currentMonth);
    const endDate = NepaliDate.formatBS(currentYear, currentMonth, lastDay);

    const income = DB.Income.getByDateRange(startDate, endDate);
    const expense = DB.Expense.getByDateRange(startDate, endDate);

    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
    const totalExpense = expense.reduce((sum, item) => sum + item.amount, 0);
    const balance = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0;

    const monthlyIncomeEl = document.getElementById('monthlyIncome');
    const incomeCountEl = document.getElementById('incomeCount');
    const monthlyExpenseEl = document.getElementById('monthlyExpense');
    const expenseCountEl = document.getElementById('expenseCount');
    const monthlyBalanceEl = document.getElementById('monthlyBalance');
    const savingsRateEl = document.getElementById('savingsRate');

    if (monthlyIncomeEl) monthlyIncomeEl.textContent = `रु. ${totalIncome.toLocaleString()}`;
    if (incomeCountEl) incomeCountEl.textContent = `${income.length} कारोबार`;
    if (monthlyExpenseEl) monthlyExpenseEl.textContent = `रु. ${totalExpense.toLocaleString()}`;
    if (expenseCountEl) expenseCountEl.textContent = `${expense.length} कारोबार`;
    if (monthlyBalanceEl) monthlyBalanceEl.textContent = `रु. ${balance.toLocaleString()}`;
    if (savingsRateEl) savingsRateEl.textContent = `${savingsRate}% बचत`;
  }

  function loadRecentTransactions() {
    const startDate = NepaliDate.formatBS(currentYear, currentMonth, 1);
    const lastDay = NepaliDate.getDaysInBSMonth(currentYear, currentMonth);
    const endDate = NepaliDate.formatBS(currentYear, currentMonth, lastDay);

    const income = DB.Income.getByDateRange(startDate, endDate);
    const expense = DB.Expense.getByDateRange(startDate, endDate);

    const transactions = [...income.map(i => ({...i, type: 'income'})), 
                          ...expense.map(e => ({...e, type: 'expense'}))]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5);

    const container = document.getElementById('recentTransactions');
    
    if (!container) return;
    
    if (transactions.length === 0) {
      container.innerHTML = '<p class="empty-state">कुनै कारोबार छैन</p>';
      return;
    }

    container.innerHTML = transactions.map(item => `
      <div class="transaction-item ${item.type}">
        <div class="transaction-icon">
          <span class="material-icons">${item.type === 'income' ? 'trending_up' : 'trending_down'}</span>
        </div>
        <div class="transaction-details">
          <div class="transaction-title">${item.category || 'अन्य'}</div>
          <div class="transaction-meta">${item.date} • ${item.description || ''}</div>
        </div>
        <div class="transaction-amount ${item.type}">
          ${item.type === 'income' ? '+' : '-'}रु. ${item.amount.toLocaleString()}
        </div>
      </div>
    `).join('');
  }

  function loadRecentNotes() {
    const startDate = NepaliDate.formatBS(currentYear, currentMonth, 1);
    const lastDay = NepaliDate.getDaysInBSMonth(currentYear, currentMonth);
    const endDate = NepaliDate.formatBS(currentYear, currentMonth, lastDay);

    const allNotes = DB.Notes.getAll();
    const notes = allNotes
      .filter(note => note.date >= startDate && note.date <= endDate)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 3);

    const container = document.getElementById('recentNotes');
    
    if (!container) return;
    
    if (notes.length === 0) {
      container.innerHTML = '<p class="empty-state">कुनै नोट छैन</p>';
      return;
    }

    container.innerHTML = notes.map(note => `
      <div class="note-card-mini ${note.reminder ? 'has-reminder' : ''}">
        <div class="note-header">
          <div class="note-title">${note.title}</div>
          <span class="note-date">${note.date}</span>
        </div>
        <div class="note-content">${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}</div>
        ${note.reminder ? `<div class="note-reminder-mini">⏰ ${new Date(note.reminder).toLocaleDateString('ne-NP')}</div>` : ''}
      </div>
    `).join('');
  }

  function loadShoppingSummary() {
    const allItems = DB.Shopping.getAll();
    const pending = allItems.filter(i => !i.purchased);
    const completed = allItems.filter(i => i.purchased);

    const pendingCountEl = document.getElementById('pendingShoppingCount');
    const completedCountEl = document.getElementById('completedShoppingCount');
    const totalCountEl = document.getElementById('totalShoppingCount');

    if (pendingCountEl) pendingCountEl.textContent = pending.length;
    if (completedCountEl) completedCountEl.textContent = completed.length;
    if (totalCountEl) totalCountEl.textContent = allItems.length;

    const container = document.getElementById('recentShopping');
    if (!container) return;
    
    const recentItems = pending.slice(0, 5);

    if (recentItems.length === 0) {
      container.innerHTML = '<p class="empty-state">किनमेल सूची खाली छ</p>';
      return;
    }

    container.innerHTML = recentItems.map(item => `
      <div class="shopping-item-mini">
        <input type="checkbox" class="shopping-checkbox" 
               onchange="App.toggleShoppingItem('${item.id}', this.checked)">
        <div class="item-details">
          <div class="item-name">${item.name}</div>
          ${item.quantity ? `<div class="item-quantity">${item.quantity}</div>` : ''}
        </div>
        ${item.estimatedPrice ? `<div class="item-price-mini">रु. ${item.estimatedPrice}</div>` : ''}
      </div>
    `).join('');
  }

  return {
    init,
    navigateMonth,
    goToToday,
    closeDrawer,
    renderCalendar,
    getSelectedDate: () => selectedDate,
    openDateDrawer,
    loadDashboardData
  };
})();

console.log('CalendarManager module loaded');