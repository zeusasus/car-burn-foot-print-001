import { useState, useEffect } from "react";
import { playClick } from "../utils/audio";
import { DrillIcon, GlassesIcon, SpiralIcon } from "./icons";

function History({ userData }) {
  const [history, setHistory] = useState([]);
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterCategory, setFilterCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [showTutorial, setShowTutorial] = useState(
    !localStorage.getItem("tutorial_history_completed")
  );
  const [tutorialStep, setTutorialStep] = useState(1);

  const nextTutorial = () => {
    playClick();
    if (tutorialStep === 3) {
      setShowTutorial(false);
      localStorage.setItem("tutorial_history_completed", "true");
    } else {
      setTutorialStep(tutorialStep + 1);
    }
  };

  const country = userData?.country || "India";
  const avgCO2 = userData?.avgCO2 || 5.2;
  const userName = userData?.name || "User";

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("history") || "[]");
    setHistory(saved);
  }, []);

  const getDayTotal = (entry) => {
    if (entry.netEmissions !== undefined) return entry.netEmissions;
    return Object.entries(entry)
      .filter(([k]) => k !== "date" && k !== "timestamp" && k !== "checksum" && k !== "fulfilledPledgeIds" && k !== "grossEmissions" && k !== "appliedOffset" && k !== "netEmissions")
      .reduce((sum, [, v]) => sum + (typeof v === "number" ? v : 0), 0);
  };

  const getWeeklyAvg = () => {
    if (history.length === 0) return 0;
    const sum = history.reduce((s, day) => s + getDayTotal(day), 0);
    return sum / history.length;
  };

  const userWeeklyAvg = getWeeklyAvg();

  const getBestRecord = () => {
    if (history.length === 0) return 0;
    const totals = history.map(day => getDayTotal(day)).filter(t => t > 0);
    if (totals.length === 0) return 0;
    return Math.min(...totals);
  };

  const bestRecord = getBestRecord();

  const calculateAchievements = () => {
    let goldCount = 0;
    let silverCount = 0;
    let currentStreak = 0;
    let maxStreak = 0;

    history.forEach((day) => {
      const total = getDayTotal(day);
      if (total < avgCO2 * 0.5) {
        goldCount++;
      }
      if (total < avgCO2) {
        silverCount++;
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    });

    return {
      gold: goldCount,
      silver: silverCount,
      streak: maxStreak
    };
  };

  const achievements = calculateAchievements();

  const handleSort = (key) => {
    playClick();
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const filteredHistory = history.filter((entry) => {
    if (filterCategory === "all") return true;
    if (filterCategory === "green") return getDayTotal(entry) < avgCO2;
    if (filterCategory === "heavy") return getDayTotal(entry) >= avgCO2;
    return (entry[filterCategory] || 0) > (getDayTotal(entry) * 0.3);
  });

  const sortedHistory = [...filteredHistory].sort((a, b) => {
    let valA = sortKey === "date" ? a.date : getDayTotal(a);
    let valB = sortKey === "date" ? b.date : getDayTotal(b);

    if (valA < valB) return sortOrder === "asc" ? -1 : 1;
    if (valA > valB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedHistory = sortedHistory.slice(startIndex, startIndex + itemsPerPage);

  const exportToCSV = async () => {
    playClick();
    
    // Compute statistics
    const totalDays = history.length;
    const totalOffsets = history.reduce((sum, h) => sum + (h.appliedOffset || 0), 0);
    const averageNet = totalDays > 0 ? (history.reduce((sum, h) => sum + getDayTotal(h), 0) / totalDays) : 0;
    
    const timestampStr = new Date().toLocaleString();
    const dateStamp = new Date().toISOString().split("T")[0];
    
    // Header block
    const headerLines = [
      `=========================================================`,
      `  KARBURN PERSONAL EMISSIONS REPORT`,
      `=========================================================`,
      `  Generated on         : ${timestampStr}`,
      `  User Name            : ${userName}`,
      `  Country              : ${country}`,
      `  Daily Green Target   : ${avgCO2} kg CO2`,
      `  Total Days Logged    : ${totalDays}`,
      `  Total Saved Offsets  : ${totalOffsets.toFixed(2)} kg CO2`,
      `  Average Net Footprint: ${averageNet.toFixed(2)} kg CO2/day`,
      `=========================================================`,
      ``
    ];
    
    // Column headers
    const headers = [
      "Date",
      "Logging Time",
      "Gross Emissions (kg CO2)",
      "Offsets Applied (kg CO2)",
      "Net Emissions (kg CO2)",
      "Travel (kg CO2)",
      "Diet (kg CO2)",
      "Electricity (kg CO2)",
      "Water (kg CO2)",
      "Paper & Books (kg CO2)",
      "Apparel (kg CO2)",
      "Media (kg CO2)",
      "Deliveries (kg CO2)"
    ];
    
    const rows = history.map(row => {
      const gross = row.grossEmissions !== undefined ? row.grossEmissions : (
        (row.transport || 0) + (row.food || 0) + (row.energy || 0) + (row.water || 0) +
        (row.books || 0) + (row.clothing || 0) + (row.streaming || 0) + (row.shopping || 0)
      );
      const net = getDayTotal(row);
      const offset = row.appliedOffset !== undefined ? row.appliedOffset : 0;
      const timeStr = row.timestamp ? new Date(row.timestamp).toLocaleString() : "N/A";
      
      return [
        row.date,
        `"${timeStr}"`,
        gross.toFixed(2),
        offset.toFixed(2),
        net.toFixed(2),
        (row.transport || 0).toFixed(2),
        (row.food || 0).toFixed(2),
        (row.energy || 0).toFixed(2),
        (row.water || 0).toFixed(2),
        (row.books || 0).toFixed(2),
        (row.clothing || 0).toFixed(2),
        (row.streaming || 0).toFixed(2),
        (row.shopping || 0).toFixed(2)
      ];
    });
    
    const csvContent = [
      ...headerLines,
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");
    
    // Save via Electron API if available, fallback to browser download
    const filename = `karburn_history_report_${dateStamp}.csv`;
    if (window.electronAPI && window.electronAPI.saveCSV) {
      await window.electronAPI.saveCSV(filename, csvContent);
    } else {
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const printReport = () => {
    playClick();
    window.print();
  };

  const changePage = (p) => {
    playClick();
    setCurrentPage(p);
  };

  const last7Days = history.slice(-7);
  const generateChartPath = () => {
    if (last7Days.length < 2) return { linePath: "", areaPath: "", points: [] };

    const width = 600;
    const height = 180;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartW = width - paddingLeft - paddingRight;
    const chartH = height - paddingTop - paddingBottom;

    const maxVal = Math.max(...last7Days.map(d => getDayTotal(d)), avgCO2 * 1.5, 5);
    const xStep = chartW / (last7Days.length - 1);

    const points = last7Days.map((day, index) => {
      const total = getDayTotal(day);
      const x = paddingLeft + index * xStep;
      const y = paddingTop + chartH - (total / maxVal) * chartH;
      return { x, y, val: total.toFixed(1), date: day.date.slice(5) };
    });

    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${paddingTop + chartH} L ${points[0].x} ${paddingTop + chartH} Z`;

    return { linePath, areaPath, points, maxVal, chartH, paddingTop, paddingLeft, chartW };
  };

  const chartData = generateChartPath();

  return (
    <div className="history-container">
      {showTutorial && (
        <div className="tutorial-overlay" style={{ zIndex: 1100 }}>
          <div className="tutorial-card" style={{ maxWidth: "450px" }}>
            <div className="tutorial-step-header">
              <h3 style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0 }}>
                <GlassesIcon size={22} style={{ color: "var(--primary-green)" }} />
                <span>History Tour</span>
              </h3>
              <span className="tutorial-step-indicator">Step {tutorialStep} of 3</span>
            </div>
            
            <div className="tutorial-step-body" style={{ margin: "20px 0" }}>
              {tutorialStep === 1 && (
                <>
                  <h4 style={{ margin: "0 0 10px 0", color: "#ffffff" }}>1. Carbon Charts</h4>
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "#A5B4FC", lineHeight: "1.5" }}>
                    Look at your 7-day carbon chart to see if your footprint is going up or down. You can unlock awards like Green Star and Eco Streak for staying green!
                  </p>
                </>
              )}
              {tutorialStep === 2 && (
                <>
                  <h4 style={{ margin: "0 0 10px 0", color: "#ffffff" }}>2. Sorts & Filters</h4>
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "#A5B4FC", lineHeight: "1.5" }}>
                    Use the filters to find days where you had high travel or diet footprints, and click on headers to sort your logs instantly.
                  </p>
                </>
              )}
              {tutorialStep === 3 && (
                <>
                  <h4 style={{ margin: "0 0 10px 0", color: "#ffffff" }}>3. Export & Print</h4>
                  <p style={{ margin: 0, fontSize: "0.95rem", color: "#A5B4FC", lineHeight: "1.5" }}>
                    You can easily download your entire logging history as a clean spreadsheet file or print a neat report to show off your green journey!
                  </p>
                </>
              )}
            </div>

            <div className="tutorial-footer" style={{ justifyContent: "space-between", borderTop: "none", padding: 0 }}>
              <div className="tutorial-dot-container" style={{ display: "flex", gap: "6px" }}>
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`tutorial-dot ${tutorialStep === s ? "active" : ""}`} />
                ))}
              </div>
              <div className="tutorial-buttons">
                <button className="btn-primary" style={{ padding: "8px 20px" }} onClick={nextTutorial}>
                  {tutorialStep === 3 ? "Understood!" : "Next →"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="history-header" style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "12px", justifyContent: "center" }}>
          <GlassesIcon size={36} />
          <h1 style={{ margin: 0 }}>Your Carbon Journey & Achievements</h1>
        </div>
        <p style={{ marginTop: "0.5rem" }}>Review your personal records, earn milestone awards, and analyze past activities.</p>
      </header>

      <section className="leaderboard-section card carbon-black">
        <h2>Personal Records & Milestones</h2>
        <p className="section-desc">Track progress against your historical log averages and budget thresholds.</p>
        
        <div className="leaderboard-list">
          <div className="leaderboard-item user-row">
            <div className="leaderboard-rank" style={{ color: "var(--accent-gold)", display: "flex", alignItems: "center" }}>
              <GlassesIcon size={24} />
            </div>
            <div className="leaderboard-details">
              <div className="competitor-name">Personal All-Time Best Day</div>
              <div className="competitor-info">Your lowest daily carbon emissions logged in history</div>
            </div>
            <div className="competitor-score">
              {bestRecord > 0 ? bestRecord.toFixed(2) : "0.00"} <span className="score-unit">kg/day</span>
            </div>
          </div>

          <div className="leaderboard-item">
            <div className="leaderboard-rank" style={{ color: "var(--primary-green)", display: "flex", alignItems: "center" }}>
              <SpiralIcon size={24} className="icon-spiral" />
            </div>
            <div className="leaderboard-details">
              <div className="competitor-name">Current Historical Average</div>
              <div className="competitor-info">Your rolling average across all log entries</div>
            </div>
            <div className="competitor-score">
              {userWeeklyAvg > 0 ? userWeeklyAvg.toFixed(2) : "0.00"} <span className="score-unit">kg/day</span>
            </div>
          </div>

          <div className="leaderboard-item">
            <div className="leaderboard-rank" style={{ color: "var(--primary-blue)", display: "flex", alignItems: "center" }}>
              <DrillIcon size={24} className="icon-drill" />
            </div>
            <div className="leaderboard-details">
              <div className="competitor-name">Your Daily Green Target</div>
              <div className="competitor-info">Based on your country average baseline ({country})</div>
            </div>
            <div className="competitor-score">
              {avgCO2.toFixed(2)} <span className="score-unit">kg/day</span>
            </div>
          </div>
        </div>

        <div className="league-standing-banner">
          {history.length === 0 ? (
            <p>Log your first activity to start your personalized carbon journey milestones!</p>
          ) : bestRecord < avgCO2 ? (
            <p className="status-success">Great job! Your best record day operates below your country average baseline. Keep aiming for new personal records!</p>
          ) : (
            <p className="status-highlight">Action Tip: Try to reduce your travel distances or adjust appliance usage tomorrow to beat your personal average!</p>
          )}
        </div>
      </section>

      <section className="achievements-section card carbon-black">
        <h2>Earned Achievement Badges</h2>
        <div className="badge-grid">
          <div className={`badge-card ${achievements.gold > 0 ? "unlocked" : "locked"}`}>
            <div className="badge-icon">
              <SpiralIcon size={44} className="icon-spiral" />
            </div>
            <h4>Green Star</h4>
            <div className="badge-stat">{achievements.gold} Unlocked</div>
            <p>Log a day with under 50% of your country average footprint.</p>
          </div>

          <div className={`badge-card ${achievements.silver > 0 ? "unlocked" : "locked"}`}>
            <div className="badge-icon">
              <GlassesIcon size={44} />
            </div>
            <h4>Carbon Saver</h4>
            <div className="badge-stat">{achievements.silver} Unlocked</div>
            <p>Keep your daily carbon footprint below the national Green Target.</p>
          </div>

          <div className={`badge-card ${achievements.streak >= 3 ? "unlocked" : "locked"}`}>
            <div className="badge-icon">
              <DrillIcon size={44} className="icon-drill" />
            </div>
            <h4>Eco Streak</h4>
            <div className="badge-stat">{achievements.streak} Day Max</div>
            <p>Maintain a consecutive 3-day streak below the national Green Target.</p>
          </div>
        </div>
      </section>

      <section className="charts-section card carbon-black">
        <h2>Your 7-Day Carbon Emissions Trend</h2>
        
        {last7Days.length < 2 ? (
          <div className="no-chart-placeholder">
            <p>Insufficient history data to generate trend charts. Please log activities for at least 2 days.</p>
          </div>
        ) : (
          <div className="chart-wrapper">
            <svg viewBox="0 0 600 180" className="svg-chart">
              <defs>
                <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary-cta)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--primary-cta)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              <line x1={chartData.paddingLeft} y1={20} x2={600 - 20} y2={20} className="chart-gridline" />
              <line x1={chartData.paddingLeft} y1={80} x2={600 - 20} y2={80} className="chart-gridline" />
              <line x1={chartData.paddingLeft} y1={140} x2={600 - 20} y2={140} className="chart-gridline" />

              <line 
                x1={chartData.paddingLeft} 
                y1={20 + chartData.chartH - (avgCO2 / chartData.maxVal) * chartData.chartH} 
                x2={600 - 20} 
                y2={20 + chartData.chartH - (avgCO2 / chartData.maxVal) * chartData.chartH} 
                className="chart-baseline-line" 
              />
              <text 
                x={600 - 145} 
                y={20 + chartData.chartH - (avgCO2 / chartData.maxVal) * chartData.chartH - 4} 
                className="chart-baseline-text"
              >
                Green Target ({avgCO2} kg)
              </text>

              <path d={chartData.areaPath} fill="url(#chartGlow)" />

              <path d={chartData.linePath} fill="none" stroke="var(--primary-cta)" strokeWidth="3" />

              {chartData.points.map((p, index) => (
                <g key={index} className="chart-node-group">
                  <circle cx={p.x} cy={p.y} r="5" className="chart-node" />
                  <circle cx={p.x} cy={p.y} r="10" className="chart-node-hover" />
                  <text x={p.x} y={p.y - 10} textAnchor="middle" className="chart-node-label">{p.val} kg</text>
                  <text x={p.x} y={170} textAnchor="middle" className="chart-axis-label">{p.date}</text>
                </g>
              ))}
            </svg>
          </div>
        )}
      </section>

      <section className="table-section card carbon-black">
        <div className="table-controls" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <h2 style={{ margin: 0 }}>Detailed History Logs</h2>
            <div style={{ display: "flex", gap: "8px" }}>
              <button className="btn-primary" onClick={exportToCSV} style={{ padding: "6px 12px", fontSize: "12px", borderRadius: "8px" }}>
                Export CSV
              </button>
              <button className="btn-secondary" onClick={printReport} style={{ padding: "6px 12px", fontSize: "12px", borderRadius: "8px" }}>
                Print Table
              </button>
            </div>
          </div>
          <div className="filter-block">
            <select 
              value={filterCategory} 
              onChange={(e) => { playClick(); setFilterCategory(e.target.value); setCurrentPage(1); }}
            >
              <option value="all">All Logs</option>
              <option value="green">Within Green Target</option>
              <option value="heavy">Above Green Target</option>
              <option value="transport">High Travel Days</option>
              <option value="food">High Diet Days</option>
              <option value="energy">High Electricity Days</option>
            </select>
          </div>
        </div>

        {history.length === 0 ? (
          <p className="no-data-msg">No logs loaded. Go log some activities to populate your journey history!</p>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="google-table">
                <thead>
                  <tr>
                    <th 
                      onClick={() => handleSort("date")} 
                      className="sortable-th"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleSort("date"); }}
                      aria-label="Sort by Date"
                    >
                       Date {sortKey === "date" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                    </th>
                    <th 
                      onClick={() => handleSort("total")} 
                      className="sortable-th"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleSort("total"); }}
                      aria-label="Sort by Footprint"
                    >
                       Footprint {sortKey === "total" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                    </th>
                    <th>Travel</th>
                    <th>Diet</th>
                    <th>Electricity</th>
                    <th>Other Factors</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedHistory.map((row, idx) => {
                    const total = getDayTotal(row);
                    const statusClass = total < avgCO2 ? "status-tag-success" : "status-tag-danger";
                    const statusText = total < avgCO2 ? "Good" : "Over Budget";
                    return (
                      <tr key={idx}>
                        <td className="table-date">{row.date}</td>
                        <td>
                          <span className={`status-tag ${statusClass}`}>
                            {statusText}: {total.toFixed(2)} kg
                          </span>
                        </td>
                        <td>{row.transport?.toFixed(1) || 0} kg</td>
                        <td>{row.food?.toFixed(1) || 0} kg</td>
                        <td>{row.energy?.toFixed(1) || 0} kg</td>
                        <td>
                          <span className="other-summary-pills" style={{ fontSize: "0.85rem", color: "var(--card-text-muted)" }}>
                            Water: {row.water?.toFixed(1) || 0}kg | 
                            Apparel: {row.clothing?.toFixed(1) || 0}kg | 
                            Deliveries: {row.shopping?.toFixed(1) || 0}kg
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="pagination-bar">
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => changePage(currentPage - 1)}
                  className="page-nav-btn"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button 
                    key={p} 
                    className={`page-btn ${currentPage === p ? "active" : ""}`}
                    onClick={() => changePage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button 
                  disabled={currentPage === totalPages} 
                  onClick={() => changePage(currentPage + 1)}
                  className="page-nav-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

export default History;