"use client";
import React, { useState, useEffect } from "react";

interface DateRangePickerProps {
  initialStart: Date | null;
  initialEnd: Date | null;
  onSelect: (start: Date | null, end: Date | null) => void;
  onClose: () => void;
}

export default function DateRangePicker({ initialStart, initialEnd, onSelect, onClose }: DateRangePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [startDate, setStartDate] = useState<Date | null>(initialStart);
  const [endDate, setEndDate] = useState<Date | null>(initialEnd);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  useEffect(() => {
    if (initialStart) {
      setCurrentMonth(new Date(initialStart.getFullYear(), initialStart.getMonth(), 1));
    } else {
      setCurrentMonth(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    }
  }, [initialStart]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const prevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  const nextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (clickedDate: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    if (clickedDate < today) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(clickedDate);
      setEndDate(null);
      onSelect(clickedDate, null);
    } else if (startDate && !endDate) {
      if (clickedDate <= startDate) {
        setStartDate(clickedDate);
        onSelect(clickedDate, null);
      } else {
        setEndDate(clickedDate);
        onSelect(startDate, clickedDate);
        setTimeout(() => onClose(), 400); 
      }
    }
  };

  const handleMouseEnter = (date: Date) => {
    if (startDate && !endDate && date > startDate) {
      setHoverDate(date);
    } else {
      setHoverDate(null);
    }
  };

  const renderMonth = (monthOffset: number) => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + monthOffset;
    const date = new Date(year, month, 1);
    const correctedYear = date.getFullYear();
    const correctedMonth = date.getMonth();

    const monthName = date.toLocaleString('default', { month: 'long' });
    const daysInMonth = new Date(correctedYear, correctedMonth + 1, 0).getDate();
    const firstDay = new Date(correctedYear, correctedMonth, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${monthOffset}-${i}`} className="drp-day empty" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const iterDate = new Date(correctedYear, correctedMonth, i);
      iterDate.setHours(0, 0, 0, 0);
      const isPast = iterDate < today;
      const tTime = iterDate.getTime();
      const sTime = startDate?.getTime();
      const eTime = endDate?.getTime();
      const hTime = hoverDate?.getTime();

      const isStart = sTime === tTime;
      const isEnd = eTime === tTime;
      
      let inRange = false;
      if (sTime && eTime) {
        inRange = tTime > sTime && tTime < eTime;
      } else if (sTime && hTime && !eTime) {
        inRange = tTime > sTime && tTime <= hTime;
      }
      
      let cls = "drp-day";
      if (isPast) cls += " drp-disabled";
      let wrapCls = inRange ? "drp-in-range" : "";
      if (isStart && (eTime || hTime)) wrapCls += " drp-start-range";
      if (isEnd) wrapCls += " drp-end-range";

      days.push(
        <div
          key={`day-${monthOffset}-${i}`}
          className={wrapCls}
          onMouseEnter={() => !isPast && handleMouseEnter(iterDate)}
        >
          <div className={cls + (isStart ? " drp-selected" : "") + (isEnd ? " drp-selected" : "")} onClick={(e) => !isPast && handleDateClick(iterDate, e)}>
            <span>{i}</span>
          </div>
        </div>
      );
    }

    return (
      <div className="drp-month" key={`month-${monthOffset}`}>
        <div className="drp-month-idx">{monthName} {correctedYear}</div>
        <div className="drp-weekdays">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="drp-days">{days}</div>
      </div>
    );
  };

  return (
    <div className="drp-calendar" onClick={(e) => e.stopPropagation()}>
      <div className="drp-header">
        <button type="button" className="drp-btn" onClick={prevMonth}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
        </button>
        <button type="button" className="drp-btn" onClick={nextMonth}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
      <div className="drp-months-container">
        {renderMonth(0)}
        {renderMonth(1)}
      </div>
      <div className="drp-footer-mobile">
        <button type="button" className="btn-primary" onClick={onClose} style={{ width: '100%', marginTop: '20px' }}>Apply Dates</button>
      </div>
    </div>
  );
}
