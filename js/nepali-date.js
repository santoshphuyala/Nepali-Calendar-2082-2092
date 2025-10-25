// Nepali Date Converter and Calendar Data
const NepaliDate = (() => {
  // Nepali calendar data (2082-2092 BS)
  const nepaliCalendarData = {
    2082: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2084: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2085: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2086: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
    2087: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2088: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2089: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2090: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2091: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2092: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]
  };

  const nepaliMonths = [
    'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
    'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत्र'
  ];

  const nepaliDays = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिहि', 'शुक्र', 'शनि'];

  const englishMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Base reference date: 2082/01/01 BS = 2025/04/14 AD (Monday)
  const baseBS = { year: 2082, month: 1, day: 1 };
  const baseAD = new Date(2025, 3, 14); // April 14, 2025

  function getTotalDaysInBSYear(year) {
    if (!nepaliCalendarData[year]) return 0;
    return nepaliCalendarData[year].reduce((sum, days) => sum + days, 0);
  }

  function getDaysInBSMonth(year, month) {
    if (!nepaliCalendarData[year]) return 30;
    return nepaliCalendarData[year][month - 1] || 30;
  }

  function bsToAD(bsYear, bsMonth, bsDay) {
    let totalDays = 0;
    
    // Calculate days from base BS date to target BS date
    if (bsYear > baseBS.year) {
      // Add remaining days of base year
      for (let m = baseBS.month; m <= 12; m++) {
        if (m === baseBS.month) {
          totalDays += getDaysInBSMonth(baseBS.year, m) - baseBS.day;
        } else {
          totalDays += getDaysInBSMonth(baseBS.year, m);
        }
      }
      
      // Add days for intermediate years
      for (let y = baseBS.year + 1; y < bsYear; y++) {
        totalDays += getTotalDaysInBSYear(y);
      }
      
      // Add days for target year
      for (let m = 1; m < bsMonth; m++) {
        totalDays += getDaysInBSMonth(bsYear, m);
      }
      totalDays += bsDay;
    } else if (bsYear === baseBS.year) {
      if (bsMonth > baseBS.month) {
        for (let m = baseBS.month; m < bsMonth; m++) {
          if (m === baseBS.month) {
            totalDays += getDaysInBSMonth(bsYear, m) - baseBS.day;
          } else {
            totalDays += getDaysInBSMonth(bsYear, m);
          }
        }
        totalDays += bsDay;
      } else if (bsMonth === baseBS.month) {
        totalDays = bsDay - baseBS.day;
      }
    }
    
    const resultDate = new Date(baseAD);
    resultDate.setDate(resultDate.getDate() + totalDays);
    return resultDate;
  }

  function adToBS(adDate) {
    const diffTime = adDate - baseAD;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    let year = baseBS.year;
    let month = baseBS.month;
    let day = baseBS.day;
    let remainingDays = diffDays;
    
    if (diffDays >= 0) {
      // Add days
      day += remainingDays;
      
      while (day > getDaysInBSMonth(year, month)) {
        day -= getDaysInBSMonth(year, month);
        month++;
        if (month > 12) {
          month = 1;
          year++;
        }
      }
    } else {
      // Subtract days
      remainingDays = Math.abs(remainingDays);
      day -= remainingDays;
      
      while (day <= 0) {
        month--;
        if (month < 1) {
          month = 12;
          year--;
        }
        day += getDaysInBSMonth(year, month);
      }
    }
    
    return { year, month, day };
  }

  function formatBS(year, month, day) {
    return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
  }

  function formatAD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
  }

  function getTodayBS() {
    return adToBS(new Date());
  }

  function getMonthCalendar(year, month) {
    const daysInMonth = getDaysInBSMonth(year, month);
    const firstDayAD = bsToAD(year, month, 1);
    const firstDayOfWeek = firstDayAD.getDay(); // 0 = Sunday
    
    const calendar = [];
    let week = new Array(7).fill(null);
    let dayIndex = firstDayOfWeek;
    
    for (let day = 1; day <= daysInMonth; day++) {
      week[dayIndex] = {
        bsYear: year,
        bsMonth: month,
        bsDay: day,
        adDate: bsToAD(year, month, day)
      };
      
      dayIndex++;
      if (dayIndex === 7) {
        calendar.push(week);
        week = new Array(7).fill(null);
        dayIndex = 0;
      }
    }
    
    if (dayIndex > 0) {
      calendar.push(week);
    }
    
    return calendar;
  }

  return {
    nepaliMonths,
    nepaliDays,
    englishMonths,
    bsToAD,
    adToBS,
    formatBS,
    formatAD,
    getTodayBS,
    getMonthCalendar,
    getDaysInBSMonth,
    getTotalDaysInBSYear,
    getSupportedYears: () => Object.keys(nepaliCalendarData).map(Number)
  };
})();

console.log('NepaliDate module loaded');