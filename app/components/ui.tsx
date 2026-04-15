// ── Shared Primitive Components & Styles ──────────────────────────────────────
"use client";
import React from "react";

export const GlobalStyles = () => (
    <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    body { font-family: 'Inter', -apple-system, sans-serif; background: #F0F2F5; color: #111827; font-size: 14px; line-height: 1.5; }

    .app-shell { display: flex; height: 100vh; overflow: hidden; }

    /* Sidebar */
    .sidebar { width: 220px; min-width: 220px; background: #0f1623; display: flex; flex-direction: column; height: 100vh; overflow: hidden; transition: width 0.25s ease, min-width 0.25s ease; flex-shrink: 0; position: relative; z-index: 10; }
    .sidebar.collapsed { width: 60px; min-width: 60px; }
    .sidebar-logo { display: flex; align-items: center; gap: 12px; padding: 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); overflow: hidden; white-space: nowrap; }
    .sidebar-logo-icon { width: 70px; height: 70px; margin: 0 auto; border-radius: 8px; background: #E4C581; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px; color: white; flex-shrink: 0; }
    .sidebar-logo-name { font-size: 13px; font-weight: 600; color: #f9fafb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sidebar-logo-sub { font-size: 11px; color: #E4C581; font-weight: 500; }
    .sidebar-nav { flex: 1; padding: 12px 8px; overflow-y: auto; }
    .nav-group-label { font-size: 10px; font-weight: 700; color: #4b5563; text-transform: uppercase; letter-spacing: 0.08em; padding: 8px 12px 4px; white-space: nowrap; overflow: hidden; }
    .sidebar.collapsed .nav-group-label { display: none; }
    .nav-item { display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 8px; cursor: pointer; font-size: 12.5px; font-weight: 500; color: #9ca3af; transition: background 0.15s, color 0.15s; white-space: nowrap; overflow: hidden; border: none; background: none; width: 100%; text-align: left; margin-bottom: 1px; }
    .nav-item:hover { background: rgba(255,255,255,0.05); color: #f9fafb; }
    .nav-item.active { background: #E4C581; color: #fff; }
    .nav-item-icon { flex-shrink: 0; display: flex; align-items: center; }
    .sidebar.collapsed .nav-item { justify-content: center; padding: 10px; }
    .sidebar.collapsed .nav-item-label { display: none; }
    .sidebar.collapsed .sidebar-logo-text { display: none; }
    .sidebar-footer { border-top: 1px solid rgba(255,255,255,0.07); padding: 12px 8px; }

    /* Main */
    .main-area { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-width: 0; }
    .topbar {
      position: sticky;
      top: 0;
      z-index: 30;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid rgba(229, 231, 235, 0.6);
      padding: 0 24px;
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-shrink: 0;
      transition: all 0.3s ease;
    }
    .topbar-left { display: flex; align-items: center; gap: 12px; }
    .topbar-breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #6b7280; }
    .breadcrumb-sep { display: none; } /* Removed from DOM, but keeping class for reference if needed */
    .topbar-breadcrumb-active { color: #111827; font-weight: 600; letter-spacing: -0.01em; display: flex; align-items: center; }
    .topbar-breadcrumb-active::before {
      content: "/";
      margin-right: 12px;
      color: #d1d5db;
      font-weight: 300;
    }
    @media (max-width: 640px) {
      .topbar-breadcrumb-active::before { display: none; }
    }
    .topbar-right { display: flex; align-items: center; gap: 20px; }
    
    .search-trigger {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      background: #f9fafb;
      cursor: pointer;
      font-size: 13px;
      color: #6b7280;
      transition: all 0.2s ease;
    }
    .search-trigger:hover {
      border-color: #E4C581;
      background: #fff;
      box-shadow: 0 4px 12px rgba(228, 197, 129, 0.12);
      color: #111827;
    }
    .search-trigger kbd {
      font-size: 11px;
      color: #9ca3af;
      background: #fff;
      border: 1px solid #e5e7eb;
      padding: 2px 6px;
      border-radius: 6px;
      font-family: inherit;
    }

    .topbar-info-badges { display: flex; align-items: center; gap: 16px; font-size: 13px; color: #4b5563; }
    .star-rating { color: #f59e0b; letter-spacing: 1px; }
    .location-text { font-weight: 500; }

    .live-badge { 
      display: flex; 
      align-items: center; 
      gap: 6px; 
      color: #16a34a; 
      font-weight: 600; 
      font-size: 12px; 
      padding: 4px 10px;
      background: #f0fdf4;
      border-radius: 20px;
      border: 1px solid #bbf7d0;
    }
    .live-dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; animation: pulse 2s infinite; }
    @keyframes pulse { 0%,100%{opacity:1; transform: scale(1);} 50%{opacity:0.4; transform: scale(1.2);} }
    .page-content { flex: 1; overflow-y: auto; padding: 28px 32px; }

    /* Cards */
    .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
    .card-header { padding: 16px 20px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; justify-content: space-between; }
    .card-body { padding: 20px; }
    .card-title { font-size: 15px; font-weight: 600; color: #111827; }
    .card-subtitle { font-size: 12px; color: #9ca3af; margin-top: 2px; }
    .page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px; }
    .page-title { font-size: 22px; font-weight: 700; color: #111827; }
    .page-sub { font-size: 13px; color: #6b7280; margin-top: 4px; }

    /* Forms */
    .field-label { display: block; font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
    .inp { width: 100%; padding: 9px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 13.5px; font-family: inherit; color: #111827; background: #fff; transition: border-color 0.15s, box-shadow 0.15s; outline: none; }
    .inp:focus { border-color: #E4C581; box-shadow: 0 0 0 3px rgba(212,175,55,0.12); }
    .inp::placeholder { color: #c4c4c4; }
    .inp-sm { padding: 6px 10px; font-size: 12.5px; }
    .inp-lg { padding: 12px 16px; font-size: 15px; }

    .sel { width: 100%; padding: 9px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 13.5px; font-family: inherit; color: #111827; background: #fff; outline: none; cursor: pointer; transition: border-color 0.15s; }
    .sel:focus { border-color: #E4C581; box-shadow: 0 0 0 3px rgba(212,175,55,0.12); }
    .textarea { width: 100%; padding: 9px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 13.5px; font-family: inherit; color: #111827; background: #fff; outline: none; resize: vertical; min-height: 72px; transition: border-color 0.15s; }
    .textarea:focus { border-color: #E4C581; box-shadow: 0 0 0 3px rgba(212,175,55,0.12); }

    /* Toggle */
    .toggle-wrap { display: flex; align-items: center; gap: 10px; }
    .toggle-track { position: relative; width: 44px; height: 24px; border-radius: 12px; cursor: pointer; transition: background 0.2s; border: none; padding: 0; flex-shrink: 0; }
    .toggle-thumb { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.25); transition: transform 0.2s; }
    .toggle-track.on { background: #E4C581; }
    .toggle-track.off { background: #d1d5db; }
    .toggle-track.on .toggle-thumb { transform: translateX(20px); }

    /* Buttons */
    .btn { display: inline-flex; align-items: center; gap: 6px; font-family: inherit; font-size: 13px; font-weight: 500; border-radius: 8px; border: none; cursor: pointer; transition: background 0.15s, box-shadow 0.15s, transform 0.1s; line-height: 1; white-space: nowrap; }
    .btn:disabled { opacity: 0.45; cursor: not-allowed; }
    .btn:active:not(:disabled) { transform: translateY(1px); }
    .btn-sm { padding: 7px 12px; font-size: 12px; }
    .btn-md { padding: 9px 16px; }
    .btn-lg { padding: 11px 20px; font-size: 14px; }
    .btn-primary { background: #E4C581; color: #fff; }
    .btn-primary:hover { background: #b8962d; }
    .btn-secondary { background: #fff; color: #374151; border: 1px solid #d1d5db; }
    .btn-secondary:hover { background: #f9fafb; }
    .btn-danger { background: #dc2626; color: #fff; }
    .btn-danger:hover { background: #b91c1c; }
    .btn-ghost { background: transparent; color: #6b7280; }
    .btn-ghost:hover { background: #f3f4f6; color: #111827; }
    .btn-outline { background: transparent; color: #E4C581; border: 1px solid #E4C581; }
    .btn-outline:hover { background: #fcf8ed; }
    .btn-success { background: #16a34a; color: #fff; }
    .btn-success:hover { background: #15803d; }
    .btn-warn { background: #d97706; color: #fff; }
    .btn-warn:hover { background: #b45309; }

    /* Badges */
    .badge { display: inline-block; padding: 3px 9px; border-radius: 6px; font-size: 11.5px; font-weight: 500; border: 1px solid transparent; }
    .badge-blue   { background: #fcf8ed;  color: #b8962d; border-color: #bfdbfe; }
    .badge-green  { background: #f0fdf4;  color: #15803d; border-color: #bbf7d0; }
    .badge-amber  { background: #fffbeb;  color: #92400e; border-color: #fde68a; }
    .badge-red    { background: #fef2f2;  color: #b91c1c; border-color: #fecaca; }
    .badge-gray   { background: #f9fafb;  color: #374151; border-color: #e5e7eb; }
    .badge-purple { background: #faf5ff;  color: #6b21a8; border-color: #e9d5ff; }
    .badge-indigo { background: #eef2ff;  color: #3730a3; border-color: #c7d2fe; }
    .badge-teal   { background: #f0fdfa;  color: #0f766e; border-color: #99f6e4; }
    .badge-rose   { background: #fff1f2;  color: #be123c; border-color: #fecdd3; }

    /* Grid helpers */
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    .grid-4 { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 16px; }
    .grid-kpi { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }

    /* KPI card */
    .kpi-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px 20px; }
    .kpi-label { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; }
    .kpi-value { font-size: 26px; font-weight: 700; line-height: 1; }
    .kpi-sub { font-size: 11.5px; color: #6b7280; margin-top: 6px; }

    /* Modal */
    .modal-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; padding: 20px; }
    .modal-box { background: #fff; border-radius: 16px; max-width: 600px; width: 100%; box-shadow: 0 25px 60px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto; }
    .modal-box-sm { max-width: 400px; }
    .modal-box-lg { max-width: 800px; }
    .modal-header { padding: 22px 24px 0; display: flex; align-items: center; justify-content: space-between; }
    .modal-title { font-size: 17px; font-weight: 700; color: #111827; }
    .modal-body { padding: 20px 24px; }
    .modal-footer { padding: 0 24px 22px; display: flex; gap: 10px; justify-content: flex-end; }
    .modal-close { background: none; border: none; cursor: pointer; color: #9ca3af; padding: 4px; border-radius: 6px; display: flex; }
    .modal-close:hover { background: #f3f4f6; color: #374151; }

    /* Search overlay */
    .search-overlay { position: fixed; inset: 0; z-index: 300; background: rgba(0,0,0,0.6); display: flex; align-items: flex-start; justify-content: center; padding-top: 80px; }
    .search-box { background: #fff; border-radius: 14px; width: 100%; max-width: 600px; box-shadow: 0 30px 80px rgba(0,0,0,0.3); overflow: hidden; }
    .search-input-wrap { display: flex; align-items: center; gap: 12px; padding: 16px 20px; border-bottom: 1px solid #f0f0f0; }
    .search-results { max-height: 400px; overflow-y: auto; }
    .search-result-item { display: flex; align-items: center; gap: 12px; padding: 12px 20px; cursor: pointer; border-bottom: 1px solid #f9fafb; transition: background 0.1s; }
    .search-result-item:hover { background: #f5f7ff; }
    .search-result-item:last-child { border-bottom: none; }
    .search-result-type { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; width: 70px; flex-shrink: 0; }
    .search-result-main { font-size: 13.5px; color: #111827; font-weight: 500; }
    .search-result-sub { font-size: 12px; color: #6b7280; }
    .search-empty { padding: 40px 20px; text-align: center; color: #9ca3af; }

    /* Booking calendar */
    .cal-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 2px; }
    .cal-header-cell { text-align: center; font-size: 11px; font-weight: 700; color: #6b7280; text-transform: uppercase; padding: 8px 0; }
    .cal-day { min-height: 86px; border-radius: 8px; border: 1px solid #e5e7eb; padding: 6px; background: #fafafa; position: relative; transition: background 0.1s; cursor: pointer; }
    .cal-day:hover { background: #f0f0f0; }
    .cal-day.today { border-color: #E4C581; background: #fcf8ed; }
    .cal-day.other-month { opacity: 0.4; }
    .cal-day-num { font-size: 12px; font-weight: 600; color: #374151; margin-bottom: 4px; }
    .cal-day.today .cal-day-num { color: #E4C581; }
    .cal-booking-chip { border-radius: 4px; padding: 2px 5px; font-size: 10.5px; font-weight: 500; color: #fff; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer; }

    /* Room cards */
    .room-card { margin-bottom: 12px; }
    .room-card-header { display: flex; align-items: flex-start; justify-content: space-between; padding: 18px 20px 14px; }
    .room-name { font-size: 16px; font-weight: 700; color: #111827; margin-right: 10px; }
    .room-attrs { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 6px 0; padding: 0 20px 12px; font-size: 12.5px; color: #6b7280; }
    .room-attr { display: flex; align-items: center; gap: 5px; }
    .room-amenities { padding: 10px 20px 16px; display: flex; flex-wrap: wrap; gap: 6px; border-top: 1px solid #f3f4f6; }
    .room-actions { display: flex; gap: 8px; flex-shrink: 0; }

    /* HK board */
    .hk-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
    .hk-card { border-radius: 10px; padding: 14px; border: 2px solid transparent; cursor: pointer; transition: all 0.15s; }
    .hk-card:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .hk-card.clean       { background: #f0fdf4; border-color: #86efac; }
    .hk-card.dirty       { background: #fef9c3; border-color: #fde047; }
    .hk-card.inspected   { background: #fcf8ed; border-color: #93c5fd; }
    .hk-card.dnd         { background: #faf5ff; border-color: #c4b5fd; }
    .hk-card.out-of-order{ background: #fef2f2; border-color: #fca5a5; }
    .hk-room-num { font-size: 20px; font-weight: 800; margin-bottom: 4px; }
    .hk-status-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }

    /* Pricing */
    .pricing-room { margin-bottom: 16px; }
    .pricing-header { background: #f9fafb; border-bottom: 1px solid #e5e7eb; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; }
    .pricing-body { padding: 20px; }
    .seasonal-row { display: grid; grid-template-columns: 2fr 1.5fr 1.5fr 1.4fr auto; gap: 10px; align-items: end; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 14px; margin-bottom: 8px; }
    .rule-row { display: flex; align-items: center; gap: 14px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; margin-bottom: 8px; }

    /* Availability */
    .avail-room { margin-bottom: 16px; }
    .avail-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
    .avail-bar { height: 4px; background: #e5e7eb; margin: 0 20px 20px; }
    .avail-bar-fill { height: 100%; border-radius: 2px; transition: width 0.3s; }
    .avail-body { padding: 0 20px 20px; }
    .avail-stats { display: flex; gap: 20px; flex-wrap: wrap; background: #f9fafb; border: 1px solid #f0f0f0; border-radius: 8px; padding: 10px 16px; margin-top: 12px; font-size: 12.5px; }
    .blackout-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
    .blackout-chip { display: flex; align-items: center; gap: 6px; background: #fef2f2; border: 1px solid #fecaca; color: #b91c1c; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 500; }

    /* Overview grid */
    .overview-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: #e5e7eb; }
    .overview-cell { background: #fff; padding: 16px 20px; }
    .overview-cell-label { font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
    .overview-cell-value { font-size: 14px; color: #111827; font-weight: 500; }

    /* Amenities */
    .amen-cat { margin-bottom: 10px; }
    .amen-cat-header { display: flex; align-items: center; gap: 10px; padding: 12px 20px; cursor: pointer; user-select: none; background: #fafafa; border-bottom: 1px solid #f0f0f0; }
    .amen-cat-header:hover { background: #f3f4f6; }
    .amen-cat-name { font-size: 14px; font-weight: 600; color: #111827; flex: 1; }
    .amen-cat-count { font-size: 11px; font-weight: 600; color: #6b7280; background: #e5e7eb; padding: 2px 8px; border-radius: 10px; }
    .amen-fac-list { padding: 12px 20px; }
    .amen-fac-item { display: flex; align-items: center; gap: 10px; padding: 7px 0; border-bottom: 1px solid #f5f5f5; }
    .amen-fac-item:last-child { border-bottom: none; }
    .amen-fac-name { flex: 1; font-size: 13.5px; color: #374151; }
    .amen-fac-actions { display: flex; gap: 4px; opacity: 0; transition: opacity 0.15s; }
    .amen-fac-item:hover .amen-fac-actions { opacity: 1; }
    .amen-add-row { display: flex; gap: 8px; align-items: center; padding: 10px 20px; border-top: 1px solid #f0f0f0; background: #fafafa; }
    .amen-picker { max-height: 320px; overflow-y: auto; }
    .amen-pick-cat { margin-bottom: 14px; }
    .amen-pick-cat-name { font-size: 11.5px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px; }
    .amen-pick-pills { display: flex; flex-wrap: wrap; gap: 6px; }
    .amen-pill { padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; cursor: pointer; border: 1.5px solid; transition: all 0.15s; }
    .amen-pill.off { border-color: #d1d5db; color: #6b7280; background: #fff; }
    .amen-pill.off:hover { border-color: #93c5fd; color: #b8962d; background: #fcf8ed; }
    .amen-pill.on { border-color: #E4C581; color: #fff; background: #E4C581; }

    /* Num input */
    .num-wrap { position: relative; display: flex; align-items: center; }
    .num-arrows { position: absolute; right: 4px; display: flex; flex-direction: column; gap: 1px; }
    .num-arrow { width: 20px; height: 16px; border: 1px solid #d1d5db; background: #f9fafb; border-radius: 4px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #6b7280; transition: background 0.1s; line-height: 1; padding: 0; }
    .num-arrow:hover { background: #e5e7eb; }

    /* Currency prefix */
    .prefix-input { display: flex; }
    .prefix-label { display: flex; align-items: center; padding: 9px 10px; background: #f3f4f6; border: 1px solid #d1d5db; border-right: none; border-radius: 8px 0 0 8px; font-size: 12px; font-weight: 600; color: #6b7280; white-space: nowrap; }
    .prefix-inp { border-radius: 0 8px 8px 0 !important; }

    /* Breakdown table */
    .breakdown-row { display: flex; align-items: center; gap: 16px; padding: 12px 20px; border-bottom: 1px solid #f3f4f6; font-size: 13px; }
    .breakdown-row:last-child { border-bottom: none; }

    /* Check-in wizard */
    .checkin-step { background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 16px; border: 2px solid #e5e7eb; }
    .checkin-step.active { border-color: #E4C581; background: #fcf8ed; }
    .checkin-step.done { border-color: #22c55e; background: #f0fdf4; }
    .step-num { width: 28px; height: 28px; border-radius: 50%; background: #e5e7eb; color: #6b7280; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; flex-shrink: 0; }
    .step-num.active { background: #E4C581; color: #fff; }
    .step-num.done { background: #22c55e; color: #fff; }

    /* QR display */
    .qr-box { width: 160px; height: 160px; border: 3px solid #111827; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 60px; background: #fff; }

    /* Meal plan card */
    .meal-card { border-radius: 12px; border: 2px solid #e5e7eb; padding: 20px; cursor: pointer; transition: all 0.15s; }
    .meal-card:hover { border-color: #93c5fd; box-shadow: 0 4px 12px rgba(59,130,246,0.15); }
    .meal-card.selected { border-color: #E4C581; background: #fcf8ed; }
    .meal-code { font-size: 28px; font-weight: 800; color: #E4C581; }
    .meal-name { font-size: 14px; font-weight: 600; color: #111827; margin-top: 4px; }
    .meal-desc { font-size: 12px; color: #6b7280; margin-top: 6px; line-height: 1.5; }
    .meal-price { font-size: 16px; font-weight: 700; color: #16a34a; margin-top: 10px; }

    /* Maintenance */
    .maint-row { padding: 12px 20px; border-bottom: 1px solid #f3f4f6; display: flex; align-items: flex-start; gap: 12px; }
    .maint-row:last-child { border-bottom: none; }

    /* Tabs */
    .tab-bar { display: flex; gap: 2px; background: #f3f4f6; padding: 4px; border-radius: 10px; margin-bottom: 20px; }
    .tab-btn { flex: 1; padding: 8px 14px; border-radius: 7px; border: none; background: none; font-size: 13px; font-weight: 500; color: #6b7280; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
    .tab-btn.active { background: #fff; color: #111827; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
    .tab-btn:hover:not(.active) { color: #374151; }

    /* Table */
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th { text-align: left; font-size: 11px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.06em; padding: 10px 16px; border-bottom: 2px solid #f0f0f0; background: #fafafa; }
    .data-table td { padding: 12px 16px; border-bottom: 1px solid #f5f5f5; font-size: 13px; color: #374151; vertical-align: middle; }
    .data-table tr:last-child td { border-bottom: none; }
    .data-table tr:hover td { background: #f9fafb; }
    .data-table tr.clickable { cursor: pointer; }

    /* Loyalty tier colors */
    .tier-Bronze   { background: #fdf4e7; color: #92400e; border: 1px solid #fde68a; }
    .tier-Silver   { background: #f3f4f6; color: #4b5563; border: 1px solid #d1d5db; }
    .tier-Gold     { background: #fefce8; color: #854d0e; border: 1px solid #fde047; }
    .tier-Platinum { background: #f0fdf4; color: #065f46; border: 1px solid #6ee7b7; }

    /* Utility */
    .flex { display: flex; } .flex-1 { flex: 1; } .items-center { align-items: center; }
    .items-start { align-items: flex-start; } .justify-between { justify-content: space-between; }
    .gap-6 { gap: 6px; } .gap-8 { gap: 8px; } .gap-10 { gap: 10px; } .gap-12 { gap: 12px; } .gap-16 { gap: 16px; }
    .mt-4 { margin-top: 4px; } .mt-8 { margin-top: 8px; } .mt-12 { margin-top: 12px; }
    .mt-16 { margin-top: 16px; } .mt-20 { margin-top: 20px; }
    .mb-4 { margin-bottom: 4px; } .mb-8 { margin-bottom: 8px; } .mb-12 { margin-bottom: 12px; }
    .mb-16 { margin-bottom: 16px; } .mb-20 { margin-bottom: 20px; }
    .w-full { width: 100%; } .text-sm { font-size: 12.5px; } .text-gray { color: #6b7280; }
    .text-blue { color: #E4C581; } .text-green { color: #16a34a; } .text-red { color: #dc2626; }
    .text-amber { color: #d97706; } .font-semibold { font-weight: 600; } .font-bold { font-weight: 700; }
    .truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .divider { height: 1px; background: #f0f0f0; margin: 20px 0; }
    .text-center { text-align: center; }
    .border-r { border-right: 1px solid #e5e7eb; }
    .rounded { border-radius: 8px; }
    .hide-tablet { display: flex; }
    @media (max-width: 900px) {
      .hide-tablet { display: none !important; }
    }

    .hide-mobile { display: inline; }
    @media (max-width: 640px) {
      .hide-mobile { display: none !important; }
    }

    /* ── Mobile hamburger button (hidden on desktop) ──────────────── */
    .mobile-menu-btn {
      display: none;
      align-items: center;
      justify-content: center;
      width: 38px; height: 38px;
      border: none; background: none;
      cursor: pointer; color: #374151;
      border-radius: 8px;
      flex-shrink: 0;
    }
    .mobile-menu-btn:hover { background: #f3f4f6; }

    /* Sidebar overlay (mobile only) */
    .sidebar-overlay {
      display: none;
      position: fixed; inset: 0; z-index: 40;
      background: rgba(0,0,0,0.45);
    }

    /* ── 900px — tablet breakpoint ───────────────────────────────── */
    @media (max-width: 900px) {
      .grid-4 { grid-template-columns: 1fr 1fr; }
      .grid-kpi { grid-template-columns: repeat(2, 1fr); }
      .room-attrs { grid-template-columns: 1fr 1fr; }
      .topbar { padding: 0 16px; }
      .page-content { padding: 20px 16px; }
      .seasonal-row { grid-template-columns: 1fr 1fr; }
    }

    /* ── 640px — mobile breakpoint ───────────────────────────────── */
    @media (max-width: 640px) {
      /* Off-canvas sidebar */
      .sidebar {
        position: fixed; top: 0; left: 0; height: 100%;
        z-index: 50; transform: translateX(-100%);
        transition: transform 0.25s ease, width 0.25s ease;
        width: 240px !important; min-width: 240px !important;
        box-shadow: 4px 0 20px rgba(0,0,0,0.3);
      }
      .sidebar.mobile-open { transform: translateX(0); }
      .sidebar.collapsed { transform: translateX(-100%); }
      .sidebar-overlay { display: block; }
      .sidebar-overlay.hidden { display: none; }

      /* Show hamburger, hide collapse toggle */
      .mobile-menu-btn { display: flex; }
      .sidebar-footer { display: none; }

      /* Nav item labels always visible on mobile drawer */
      .sidebar .nav-item-label { display: inline !important; }
      .sidebar .nav-item { justify-content: flex-start !important; padding: 9px 12px !important; }
      .sidebar .nav-group-label { display: block !important; }

      /* Main area takes full width */
      .main-area { width: 100%; }
      /* App shell: let fixed sidebar overlay */
      .app-shell { overflow: visible; }
      /* Hide search text label, keep icon only */
      .search-label-desktop { display: none; }

      /* Topbar compact */
      .topbar { padding: 0 12px; height: 56px; gap: 8px; }
      .topbar-breadcrumb { font-size: 14px; gap: 4px; }
      .topbar-right { gap: 8px; }
      /* Hide lower-priority topbar items on mobile */
      .topbar-right > span:not(.live-badge) { display: none; }
      
      .search-trigger { padding: 8px; border-radius: 10px; }

      /* Page content */
      .page-content { padding: 16px 12px; }

      /* Grids stack to single column */
      .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
      .grid-kpi { grid-template-columns: 1fr 1fr; }
      .overview-grid { grid-template-columns: 1fr; }
      .room-attrs { grid-template-columns: 1fr 1fr; }

      /* Page header: stack title + action button */
      .page-header { flex-direction: column; gap: 10px; align-items: flex-start; }

      /* Cards */
      .card-body { padding: 14px; }
      .card-header { padding: 12px 14px; }

      /* Tables: horizontal scroll */
      .table-scroll-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .card-body { overflow-x: auto; }
      .data-table th, .data-table td { padding: 10px 12px; font-size: 12px; white-space: nowrap; }


      /* Modals: full-screen on mobile */
      .modal-overlay { padding: 0; align-items: flex-end; }
      .modal-box { border-radius: 16px 16px 0 0; max-width: 100%; max-height: 92vh; width: 100%; }
      .modal-box-lg, .modal-box-sm { max-width: 100%; }

      /* Search overlay */
      .search-overlay { padding-top: 0; align-items: flex-start; }
      .search-box { border-radius: 0 0 14px 14px; max-width: 100%; }

      /* Pricing rows */
      .seasonal-row { grid-template-columns: 1fr; }
      .rule-row { flex-wrap: wrap; gap: 10px; }
      .pricing-header { flex-direction: column; gap: 8px; align-items: flex-start; }
      .pricing-body { padding: 14px; }

      /* Availability */
      .avail-header { flex-direction: column; gap: 6px; align-items: flex-start; }
      .avail-body { padding: 0 14px 14px; }
      .avail-bar { margin: 0 14px 14px; }

      /* Room card header */
      .room-card-header { flex-direction: column; gap: 10px; align-items: flex-start; padding: 14px 14px 10px; }
      .room-actions { width: 100%; justify-content: flex-end; }
      .room-attrs { padding: 0 14px 10px; }
      .room-amenities { padding: 8px 14px 14px; }

      /* HK grid */
      .hk-grid { grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); }

      /* Tabs: scrollable */
      .tab-bar { overflow-x: auto; flex-wrap: nowrap; -webkit-overflow-scrolling: touch; padding-bottom: 2px; }
      .tab-btn { flex: none; }

      /* KPI card font */
      .kpi-value { font-size: 20px; }
      .kpi-card { padding: 14px 16px; }

      /* Amenity manager */
      .amen-cat-header { padding: 10px 14px; }
      .amen-fac-list { padding: 8px 14px; }
      .amen-add-row { padding: 8px 14px; }

      /* Breakdown rows */
      .breakdown-row { flex-wrap: wrap; gap: 8px; padding: 10px 14px; font-size: 12px; }

      /* Maintenance rows */
      .maint-row { padding: 10px 14px; }

      /* Toggle label font */
      .toggle-wrap span { font-size: 12.5px; }

      /* Button sizes on mobile */
      .btn-lg { padding: 10px 16px; font-size: 13px; }

      /* Check-in steps */
      .checkin-step { padding: 16px; }
    }
  `}</style>
);

export const clamp = (v: number, mn: number, mx: number) => Math.min(Math.max(Number(v) || 0, mn), mx);
export const slugify = (s: string) => s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
export const uid = () => `id_${Math.random().toString(36).slice(2, 9)}`;
export const fmt = (n: number) => (n || 0).toLocaleString();
export const fmtDate = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
export const today = () => new Date().toLocaleDateString('en-CA');

type InpProps = { value?: string; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; placeholder?: string; className?: string; style?: React.CSSProperties; disabled?: boolean; autoFocus?: boolean; onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void; min?: string; max?: string; size?: "sm" | "md" | "lg"; };
export const Inp = ({ value, onChange, type = "text", placeholder, className = "", style, disabled, autoFocus, onKeyDown, min, max, size = "md" }: InpProps) => (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} className={`inp inp-${size} ${className}`} style={style} disabled={disabled} autoFocus={autoFocus} onKeyDown={onKeyDown} min={min} max={max} />
);

type NumInpProps = { value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; min?: number; max?: number; };
export const NumInp = ({ value, onChange, min = 0, max = 999999 }: NumInpProps) => {
    const change = (delta: number) => onChange({ target: { value: String(clamp(value + delta, min, max)) } } as React.ChangeEvent<HTMLInputElement>);
    return (
        <div className="num-wrap">
            <input type="number" value={value} onChange={onChange} min={min} max={max}
                style={{ width: "100%", padding: "9px 32px 9px 12px", border: "1px solid #d1d5db", borderRadius: 8, fontSize: 13.5, fontFamily: "inherit", outline: "none", background: "#fff" }}
                onFocus={e => (e.target.style.borderColor = "#E4C581")} onBlur={e => (e.target.style.borderColor = "#d1d5db")} />
            <div className="num-arrows">
                <button className="num-arrow" onClick={() => change(1)}>▲</button>
                <button className="num-arrow" onClick={() => change(-1)}>▼</button>
            </div>
        </div>
    );
};

type SelProps = { value: string; onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void; opts: (string | { v: string; l: string })[]; className?: string; style?: React.CSSProperties; };
export const Sel = ({ value, onChange, opts, className = "", style }: SelProps) => (
    <select value={value} onChange={onChange} className={`sel ${className}`} style={style}>
        {opts.map(o => typeof o === "string" ? <option key={o} value={o}>{o}</option> : <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
);

export const Toggle = ({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string; }) => (
    <div className="toggle-wrap">
        <button onClick={() => onChange(!checked)} className={`toggle-track ${checked ? "on" : "off"}`}>
            <span className="toggle-thumb" />
        </button>
        {label && <span style={{ fontSize: 13.5, color: "#374151" }}>{label}</span>}
    </div>
);

export const Btn = ({ children, onClick, variant = "primary", size = "md", disabled = false, style = {}, type = "button" }: { children: React.ReactNode; onClick?: (e?: any) => void; variant?: string; size?: string; disabled?: boolean; style?: React.CSSProperties; type?: "button" | "submit" | "reset"; }) => (
    <button onClick={onClick} disabled={disabled} style={style} className={`btn btn-${size} btn-${variant}`} type={type}>{children}</button>
);

export const Badge = ({ children, color = "gray" }: { children: React.ReactNode; color?: string; }) => (
    <span className={`badge badge-${color}`}>{children}</span>
);

export const FieldLabel = ({ children }: { children: React.ReactNode }) => <label className="field-label">{children}</label>;
export const Field = ({ label, children, style = {} }: { label?: string; children: React.ReactNode; style?: React.CSSProperties; }) => (
    <div style={style}>{label && <FieldLabel>{label}</FieldLabel>}{children}</div>
);

export const CurrencyInput = ({ currency, value, onChange }: { currency: string; value: number; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }) => (
    <div className="prefix-input">
        <span className="prefix-label">{currency}</span>
        <input type="number" value={value} min={0} onChange={onChange} className="inp prefix-inp" style={{ borderRadius: "0 8px 8px 0" }} />
    </div>
);

export const Confirm = ({ title, msg, onOk, onCancel }: { title?: string; msg: string; onOk: () => void; onCancel: () => void; }) => (
    <div className="modal-overlay" onClick={onCancel}>
        <div className="modal-box modal-box-sm" onClick={e => e.stopPropagation()} style={{ padding: 28 }}>
            <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{title || "Confirm"}</div>
            <div style={{ fontSize: 13.5, color: "#6b7280", lineHeight: 1.6, marginBottom: 22 }}>{msg}</div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                <Btn variant="secondary" onClick={onCancel}>Cancel</Btn>
                <Btn variant="danger" onClick={onOk}>Confirm</Btn>
            </div>
        </div>
    </div>
);

// Icons
export const Ic = {
    Dashboard: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></svg>,
    Bookings: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    CheckIn: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M15 3h6v18h-6" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>,
    Customers: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
    Rooms: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    Meals: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" /><line x1="7" y1="2" x2="7" y2="11" /><path d="M21 15a2 2 0 01-2 2H7l-4 4V9a2 2 0 012-2h14a2 2 0 012 2z" style={{ display: "none" }} /><path d="M18 2h-2a2 2 0 00-2 2v3a2 2 0 002 2h2V2z" /><line x1="18" y1="9" x2="18" y2="22" /></svg>,
    HK: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12" /></svg>,
    Maint: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>,
    Pricing: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>,
    Avail: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /><polyline points="9 16 11 18 15 14" /></svg>,
    Amenity: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
    Hotel: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 21V7l9-4 9 4v14" /><path d="M9 21V12h6v9" /></svg>,
    Plus: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
    Trash: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></svg>,
    Edit: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>,
    Chev: ({ r, l, u, d }: { r?: boolean; l?: boolean; u?: boolean; d?: boolean }) => {
        let pts = r ? "9 18 15 12 9 6" : "15 18 9 12 15 6";
        if (l) pts = "15 18 9 12 15 6";
        if (u) pts = "18 15 12 9 6 15";
        if (d) pts = "6 9 12 15 18 9";
        return <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points={pts} /></svg>;
    },
    Back: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" /></svg>,
    Search: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    QR: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="5" height="5" /><rect x="16" y="3" width="5" height="5" /><rect x="3" y="16" width="5" height="5" /><line x1="21" y1="16" x2="21" y2="21" /><line x1="16" y1="21" x2="21" y2="21" /><line x1="16" y1="16" x2="16" y2="16" /><line x1="11" y1="3" x2="11" y2="8" /><line x1="11" y1="16" x2="11" y2="21" /><line x1="3" y1="11" x2="8" y2="11" /><line x1="16" y1="11" x2="21" y2="11" /><line x1="11" y1="11" x2="11" y2="11" /></svg>,
    X: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
    Eye: () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
    Star: () => <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>,
    Crown: () => <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M2 20h20v2H2zm2-4V8l5 5 3-7 3 7 5-5v8z" /></svg>,
    Alert: () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
    Staff: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /><line x1="22" y1="11" x2="22" y2="17" /><line x1="19" y1="14" x2="25" y2="14" style={{ display: "none" }} /></svg>,
    Reports: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="8" y1="16" x2="8" y2="16" /><line x1="12" y1="14" x2="12" y2="16" /><line x1="16" y1="11" x2="16" y2="16" /><polyline points="3 9 9 9 12 5 15 13 18 9 21 9" style={{ display: "none" }} /><path d="M8 16v-4M12 16v-2M16 16v-5" /></svg>,
    LostFound: () => <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>,
};

export const statusColor: Record<string, string> = {
    confirmed: "blue", "checked-in": "green", "checked-out": "gray", cancelled: "red", "no-show": "amber", pending: "purple",
};

export const BOOKING_SOURCES = ["Direct", "Booking.com", "Expedia", "Agoda", "Walk-in", "Phone", "Corporate"];
export const DIETARY_PREFS = ["Veg", "Non-Veg", "Vegan", "Halal", "Jain", "Gluten-Free"];
export const LOYALTY_TIERS = ["Bronze", "Silver", "Gold", "Platinum"] as const;
export const PRIORITY_COLOR: Record<string, string> = { low: "gray", medium: "amber", high: "red" };
export const MAINT_STATUS_COLOR: Record<string, string> = { open: "red", "in-progress": "amber", resolved: "green", deferred: "gray" };
