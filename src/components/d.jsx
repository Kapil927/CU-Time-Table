import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import Cookies from "js-cookie";

import { timeTable } from "../assets/data";
import { days } from "../assets/data";
import { ParticlesBackground } from "./ParticlesBackground";


// Simple cookie functions (replacement for js-cookie)
const setCookie = (name, value, days = 365) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
};

const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};


// Reliable IST calculation without external APIs
const getIndiaTime = () => {
  const now = new Date();
  
  // Method 1: Try using Intl.DateTimeFormat (most reliable)
  try {
    const istTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
    // Verify this gives us a valid date
    if (!isNaN(istTime.getTime())) {
      return istTime;
    }
  } catch (error) {
    console.log('Intl timezone failed, falling back to UTC calculation');
  }
  
  // Method 2: Manual UTC + IST offset calculation
  const utcTime = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  return new Date(utcTime.getTime() + istOffset);
};

// Date formatting functions
const formatDate = (date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'];
  
  const dayName = days[date.getDay()];
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  const getOrdinalSuffix = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  
  return `${dayName}, ${monthName} ${getOrdinalSuffix(day)} ${year}`;
};

const formatTime = (date) => {
  return date.toLocaleString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

const formatDateShort = (date) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  const monthName = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  const getOrdinalSuffix = (n) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  
  return `${monthName} ${getOrdinalSuffix(day)} ${year}`;
};

const formatDayName = (date) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
};

const getCurrentDay = (currentTime) => {
  const dayIndex = currentTime.getDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[dayIndex];
};

const parseTime = (timeStr) => {
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const getRemainingTime = (targetTimeStr, currentDate) => {
  const [time, modifier] = targetTimeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  const target = new Date(currentDate);
  target.setHours(hours, minutes, 0);
  const diff = target - currentDate;
  if (diff <= 0) return "00:00:00";
  const hrs = String(Math.floor(diff / 3600000)).padStart(2, "0");
  const mins = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
  const secs = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
  return `${hrs}:${mins}:${secs}`;
};

const typeColors = {
  Lecture: "text-green-400",
  Tutorial: "text-yellow-400",
  Practical: "text-blue-400",
};

export default function TimetableApp() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState("");
  const [timeMethod, setTimeMethod] = useState('');

  // Initialize theme from cookie or default to 'light'
  const [themeMode, setThemeMode] = useState(() => {
    const savedTheme = getCookie('themeMode');
    return ['light', 'dark', 'glass'].includes(savedTheme) ? savedTheme : 'light';
  });

  // Save to cookie whenever theme changes
  useEffect(() => {
    setCookie('themeMode', themeMode, 365);
  }, [themeMode]);

  // Initialize with India time
  useEffect(() => {
    const indiaTime = getIndiaTime();
    setCurrentTime(indiaTime);
    setSelectedDay(getCurrentDay(indiaTime));
    
    // Determine which method was used for display
    try {
      const testTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
      if (!isNaN(new Date(testTime).getTime())) {
        setTimeMethod('Browser Timezone API');
      } else {
        setTimeMethod('UTC + 5:30 Calculation');
      }
    } catch {
      setTimeMethod('UTC + 5:30 Calculation');
    }
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const indiaTime = getIndiaTime();
      setCurrentTime(indiaTime);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setThemeMode(prev => {
      switch(prev) {
        case 'light': return 'dark';
        case 'dark': return 'glass';
        default: return 'light';
      }
    });
  };

  const lectures = timeTable[selectedDay]?.lectures || [];
  const sortedLectures = [...lectures].sort((a, b) => parseTime(a.from) - parseTime(b.from));
  const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const isToday = selectedDay === getCurrentDay(currentTime);

  const currentLecture = isToday
    ? sortedLectures.find(
        (lec) => parseTime(lec.from) <= nowMinutes && nowMinutes <= parseTime(lec.till))
    : null;

  const upcomingLecture = isToday
    ? sortedLectures.find((lec) => parseTime(lec.from) > nowMinutes)
    : null;

  const isLectureOver = (lecture) => {
    return isToday && nowMinutes > parseTime(lecture.till);
  };

  return (
    <div className={`flex flex-col min-h-screen font-sans transition-colors duration-300 ${
      themeMode === "dark" 
        ? "bg-zinc-900 text-white relative overflow-hidden" 
        : themeMode === "glass" 
          ? "bg-gradient-to-br from-blue-50/20 to-purple-50/20 backdrop-blur-sm bg-cover bg-[url(https://wallpapers-clan.com/wp-content/uploads/2024/03/starfall-night-sky-mountains-aesthetic-gif-cover-desktop-wallpaper.gif)]" 
          : "bg-white text-zinc-900 sm:bg-cover bg-[url(https://i.makeagif.com/media/1-13-2023/_3qu79.gif)]"
    }`}>
      
      {/* particle background */}
      {themeMode === "dark" && (
        <div key="particles" className="fixed">    
          <ParticlesBackground />
        </div>
      )}

      {/* Fixed Header */}
      <header className={`sticky top-0 z-20 flex flex-row justify-between items-center gap-4 p-4 shadow-lg border-b transition-all ${
        themeMode === "dark" 
          ? "bg-zinc-800 border-zinc-700" 
          : themeMode === "glass" 
            ? "bg-white/30 backdrop-blur-md border-white/20 shadow-lg"
            : "bg-white border-gray-300"
      }`}>
        <img
          className="h-12 rounded-full"
          src="https://d2lk14jtvqry1q.cloudfront.net/media/large_Chandigarh_University_Chandigarh_777cdcda4f_6764d211ac.png"
          alt="uni"
        />

        <div className="flex flex-col items-end gap-1">
          <div className="text-sm font-mono tracking-tight">
            <div className="hidden sm:block">{formatDateShort(currentTime)}</div>
            <div className="sm:hidden text-xs">{formatDayName(currentTime)}</div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="text-sm">{formatTime(currentTime)}</div>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-full hover:bg-zinc-600/30 border border-transparent hover:border-zinc-500 transition"
            >
              {themeMode === "dark" ? (
                <Sun className="w-3.5 h-3.5 text-yellow-300" />
              ) : themeMode === "glass" ? (
                <span className="w-3.5 h-3.5 text-blue-500">☁️</span>
              ) : (
                <Moon className="w-3.5 h-3.5 text-zinc-700" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area with Scroll */}
      <main className="flex-1 overflow-auto">
        <div className="flex flex-col gap-4 p-4 relative z-10">
          {/* Sticky Day Selector */}
          <div className="sticky top-0 z-10 py-2 bg-opacity-90 backdrop-blur-sm"
            style={{
              backgroundColor: themeMode === "dark" ? 'rgba(39, 39, 42, 0.9)' : 
                             themeMode === "glass" ? 'rgba(255, 255, 255, 0.3)' : 
                             'rgba(255, 255, 255, 0.9)'
            }}>
            <div className="flex flex-wrap justify-center gap-2">
              {days.map((day) => (
                <button
                  key={day}
                  className={`h-10 w-10 px-2 py-1 rounded-full text-xs font-semibold shadow-sm hover:shadow transition-all ${
                    selectedDay === day
                      ? "bg-blue-500 text-white"
                      : themeMode === "dark"
                      ? "bg-zinc-700 border-zinc-600 text-gray-200 hover:bg-blue-700"
                      : themeMode === "glass"
                      ? "bg-white/40 border-white/30 text-gray-800 hover:bg-blue-100/50"
                      : "bg-gray-200 border-gray-400 text-gray-800 hover:bg-blue-100"
                  } border`}
                  onClick={() => setSelectedDay(day)}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Desktop Table */}
          <div className={`hidden md:block rounded-2xl shadow-md overflow-hidden border ${
            themeMode === "dark" 
              ? "bg-zinc-800 border-zinc-700" 
              : themeMode === "glass"
                ? "bg-white/30 backdrop-blur-md border-white/20"
                : "bg-gray-50 border-gray-200"
          }`}>
        <div className={`hidden md:block rounded-2xl shadow-md overflow-hidden border ${
          themeMode === "dark" 
            ? "bg-zinc-800 border-zinc-700" 
            : themeMode === "glass"
              ? "bg-white/30 backdrop-blur-md border-white/20"
              : "bg-gray-50 border-gray-200"
        }`}>
          <table className="w-full table-auto text-sm text-center">
            <thead>
              <tr className={`${
                themeMode === "dark" 
                  ? "bg-zinc-700 text-blue-300" 
                  : themeMode === "glass"
                    ? "bg-white/40 text-blue-600 backdrop-blur-md"
                    : "bg-blue-100 text-blue-800"
              } uppercase tracking-wide text-sm`}>
                <th className="px-5 py-3">Time / Type</th>
                <th className="px-5 py-3">Subject / Code</th>
                <th className="px-5 py-3">Block / Room</th>
                <th className="px-5 py-3">Instructor / EID</th>
              </tr>
            </thead>
            <tbody>
              {sortedLectures.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-5 py-8 text-center text-gray-500">
                    No lectures scheduled for {selectedDay}
                  </td>
                </tr>
              ) : (
                sortedLectures.map((lec, i) => {
                  const isCurrent = isToday && currentLecture?.eid === lec.eid;
                  const isUpcoming = isToday && upcomingLecture?.eid === lec.eid;
                  const timeInfo = isCurrent
                    ? getRemainingTime(lec.till, currentTime)
                    : isUpcoming
                    ? getRemainingTime(lec.from, currentTime)
                    : null;

                  return (
                    <tr
                      key={i}
                      className={`border-b text-centerc card-shine-effect ${
                        themeMode === "dark" ? "border-zinc-700" : "border-gray-200"
                      } ${
                        isCurrent
                          ? themeMode === "dark"
                            ? "bg-yellow-800/30"
                            : themeMode === "glass"
                            ? "bg-yellow-200/40"
                            : "bg-yellow-100"
                          : isUpcoming
                          ? themeMode === "dark"
                            ? "bg-zinc-700"
                            : themeMode === "glass"
                            ? "bg-white/30"
                            : "bg-gray-200"
                          : themeMode === "dark"
                          ? "hover:bg-zinc-700/50"
                          : themeMode === "glass"
                          ? "hover:bg-white/40"
                          : "hover:bg-gray-100"
                      } transition-all`}
                    >
                      <td className="px-5 py-4 whitespace-nowrap font-medium">
                        <div className="flex flex-col items-center justify-center gap-1">
                          <div className="flex items-center gap-2 justify-center">
                            <span>
                              {lec.from} - {lec.till}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <span className={`text-xs ${typeColors[lec.type] || "text-gray-400"}`}>
                              {lec.type}
                              {isLectureOver(lec) && (
                                <span className="ml-2 text-red-500 text-xs"> OVER</span>
                              )}                              
                            </span>
                            {isCurrent && (
                              <span className="relative flex h-2 w-2 translate-y-[2px]">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                              </span>
                            )}
                          </div>
                          {isCurrent && (
                            <div className="text-xs text-green-400 font-medium">
                              Ends in: {timeInfo}
                            </div>
                          )}
                          {isUpcoming && (
                            <div className="text-xs text-blue-400 font-medium">
                              Starts in: {timeInfo}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold">{lec.subject}</div>
                        <div className={`text-xs ${
                          themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}>
                          {lec.subjectCode}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-medium">{lec.blockNo}</span> / <span>{lec.roomNo}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div>{lec.instructor}</div>
                        <div className={`text-xs ${
                          themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}>
                          {lec.eid}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
          </div>

          {/* Mobile View */}
          <div className={`md:hidden flex flex-col divide-y gap-3 ${
            themeMode === "dark" ? "divide-zinc-700" : "divide-gray-200"
          }`}>
        <div className={`md:hidden flex flex-col divide-y px-5 gap-3 ${
          themeMode === "dark" ? "divide-zinc-700" : "divide-gray-200"
        }`}>
          {sortedLectures.length === 0 ? (
            <div className={`rounded-xl p-6 text-center ${
              themeMode === "dark" 
                ? "bg-zinc-800 text-gray-300" 
                : themeMode === "glass"
                ? "bg-white/20 backdrop-blur-md"
                : "bg-gray-100"
            }`}>
              <p className="text-gray-500">No lectures scheduled for {selectedDay}</p>
            </div>
          ) : (
            sortedLectures.map((lec, i) => {
              const isCurrent = isToday && currentLecture?.eid === lec.eid;
              const isUpcoming = isToday && upcomingLecture?.eid === lec.eid;
              const timeInfo = isCurrent
                ? getRemainingTime(lec.till, currentTime)
                : isUpcoming
                ? getRemainingTime(lec.from, currentTime)
                : null;

              return (
                <div
                  key={i}
                  className={`rounded-xl p-4 transition-all card-shine-effect ${
                    isCurrent
                      ? themeMode === "dark"
                        ? "bg-yellow-800/30"
                        : themeMode === "glass"
                        ? "bg-yellow-200/40 backdrop-blur-md"
                        : "bg-yellow-200/70"
                      : isUpcoming
                      ? themeMode === "dark"
                        ? "bg-zinc-700"
                        : themeMode === "glass"
                        ? "bg-white/30 backdrop-blur-md"
                        : "bg-gray-200"
                      : themeMode === "dark"
                      ? "bg-zinc-800 text-white"
                      : themeMode === "glass"
                      ? "bg-white/20 text-zinc-900 backdrop-blur-md"
                      : "bg-transparent backdrop-blur-none text-zinc-900"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className={`font-semibold ${
                      themeMode === "dark" ? "text-blue-400" : "text-blue-600"
                    }`}>
                      ⌛ {lec.from} - {lec.till}
                    </div>
                    <div className="flex flex-col items-end translate-x-[-6px]">
                      <span className={`text-xs ${
                        typeColors[lec.type] || (themeMode === "dark" ? "text-gray-400" : "text-gray-600")
                      }`}>
                        {lec.type}
                      </span>
                      {isCurrent && (
                        <span className="text-xs text-red-600 animate-pulse">LIVE</span>
                      )}
                      {isLectureOver(lec) && (
                        <span className="ml-2 text-red-500 text-xs ">OVER</span>
                      )}                  
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <div className={`text-lg font-bold ${
                      themeMode === "dark" ? "text-white" : "text-zinc-800"
                    }`}>
                      📚 {lec.subject}
                    </div>
                    <div className={`text-xs mb-2 
                      ${themeMode === "dark" && "text-gray-400"}
                      ${themeMode === "light" && "text-gray-500"}
                      ${themeMode === "glass" && "text-black"}
                      `}>
                      {lec.subjectCode}
                    </div>
                  </div>
                  <div className="text-sm">
                    <strong>📍 Block/Room:</strong> {lec.blockNo} / {lec.roomNo}
                  </div>
                  <div className="text-sm">
                   <strong>👤 Instructor:</strong> {lec.instructor} 
                   <span className={`text-xs
                      ${themeMode === "dark" && "text-gray-400"}
                      ${themeMode === "light" && "text-gray-500"}
                      ${themeMode === "glass" && "text-black"}
                    } mb-2`}>
                     ({lec.eid})
                  </span> 
                  </div>
                  {isCurrent && (
                    <div className={`mt-2 text-sm font-medium ${
                      themeMode === "dark" ? "text-green-400" : "text-green-700"
                    }`}>
                      ⏱ Ends in: {timeInfo}
                    </div>
                  )}
                  {isUpcoming && (
                    <div className={`mt-2 text-sm font-medium ${
                      themeMode === "dark" ? "text-blue-400" : "text-blue-700"
                    }`}>
                      ⏱ Starts in: {timeInfo}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
          </div>
        </div>
      </main>
    </div>
  );
}