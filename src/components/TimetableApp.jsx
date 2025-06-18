import  React,{ useEffect, useState, memo, useMemo, useCallback } from "react";
import { format } from "date-fns";
import { Sun, Moon } from "lucide-react";
import Cookies from "js-cookie";
import { loadFull } from "tsparticles";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim"; // Using slim package for better performance

import { timeTable } from "../assets/data";
import { days } from "../assets/data";
import { ParticlesBackground } from "./ParticlesBackground";


const getCurrentDay = () => {
  const today = new Date();
  return days[today.getDay() - 1] || "Monday";
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
  const [selectedDay, setSelectedDay] = useState(getCurrentDay());
  const [currentTime, setCurrentTime] = useState(new Date());


 const [themeMode, setThemeMode] = useState(() => {
  // Initialize from cookie or default to 'light'
  const savedTheme = Cookies.get('themeMode');
  return ['light', 'dark', 'glass'].includes(savedTheme) ? savedTheme : 'light';
});

// Save to cookie whenever theme changes
useEffect(() => {
  Cookies.set('themeMode', themeMode, { expires: 365, sameSite: 'Lax' });
}, [themeMode]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
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
  const isToday = selectedDay === getCurrentDay();

  const currentLecture = isToday
    ? sortedLectures.find(
        (lec) => parseTime(lec.from) <= nowMinutes && nowMinutes <= parseTime(lec.till))
    : null;

  const upcomingLecture = isToday
    ? sortedLectures.find((lec) => parseTime(lec.from) > nowMinutes)
    : null;

// pending : create components out of this follow good practice, to save time i did't do. 
  return (
    <div className={`flex flex-col gap-3 min-h-screen p-4 font-sans transition-colors duration-300 ${
      themeMode === "dark" 
        ? "bg-zinc-900 text-white relative overflow-hidden" 
        : themeMode === "glass" 
          ? "bg-gradient-to-br from-blue-50/20 to-purple-50/20 backdrop-blur-sm bg-cover bg-[url(https://wallpapers-clan.com/wp-content/uploads/2024/03/starfall-night-sky-mountains-aesthetic-gif-cover-desktop-wallpaper.gif)]" 
          : "bg-white text-zinc-900 sm:bg-cover bg-[url(https://i.makeagif.com/media/1-13-2023/_3qu79.gif)]"
    }`}>
      
       {/* particle background :- */}
      {themeMode === "dark" && (
        <div key="particles" className="fixed ">    
          <ParticlesBackground />
        </div>
      )}

      {/* Header */}
      <header className={`flex flex-row justify-between items-center gap-4 md:gap-0 mb-6 p-6 rounded-3xl shadow-lg border transition-all ${
        themeMode === "dark" 
          ? "bg-zinc-800 border-zinc-700" 
          : themeMode === "glass" 
            ? "bg-white/30 backdrop-blur-md border-white/20 shadow-lg"
            : "bg-white border-gray-300"
      }`}>
        <img
          className="block rounded-l-full"
          src="https://d2lk14jtvqry1q.cloudfront.net/media/large_Chandigarh_University_Chandigarh_777cdcda4f_6764d211ac.png"
          alt="uni"
          width="200px"
        />

        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="text-sm md:text-base font-mono tracking-tight">
            <div className="hidden md:block">{format(currentTime, "eeee , MMMM do yyyy")}</div>
            <div className="md:hidden">
              <div>{format(currentTime, "MMMM do yyyy")}</div>
              <div>{format(currentTime, "eeee")}</div>
            </div>
            <div className="flex gap-1.5">
              <div>{format(currentTime, "hh:mm:ss a")}</div>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-zinc-600/30 border border-transparent hover:border-zinc-500 transition"
              >
                {themeMode === "dark" ? (
                  <Sun className="w-4 h-4 text-yellow-300" />
                ) : themeMode === "glass" ? (
                  <span className="w-4 h-4 text-blue-500">☁️</span>
                ) : (
                  <Moon className="w-4 h-4 text-zinc-700" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Day Selector */}
      <div className="flex flex-wrap justify-center gap-2 sm:gap-24 mb-6">
        {days.map((day) => (
          <button
            key={day}
            className={`h-[50px] w-[50px] px-5 py-2 rounded-full rounded-tr-md text-sm font-semibold shadow-sm hover:shadow transition-all ${
              selectedDay === day
                ? "bg-blue-400 text-white"
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

      {/* Desktop Table */}
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
            {sortedLectures.map((lec, i) => {
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
                  className={`border-b text-center ${
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
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile View */}
      <div className={`md:hidden flex flex-col divide-y px-5 gap-2 ${
        themeMode === "dark" ? "divide-zinc-700" : "divide-gray-200"
      }`}>
        {sortedLectures.map((lec, i) => {
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
              className={`rounded-xl p-4 transition-all ${
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
                  : "bg-white text-zinc-900"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className={`font-semibold ${
                  themeMode === "dark" ? "text-blue-400" : "text-blue-600"
                }`}>
                  {lec.from} - {lec.till}
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
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <div className={`text-lg font-bold ${
                  themeMode === "dark" ? "text-white" : "text-zinc-800"
                }`}>
                  {lec.subject}
                </div>
                <div className={`text-xs ${
                  themeMode === "dark" ? "text-gray-400" : "text-gray-500"
                } mb-2`}>
                  {lec.subjectCode}
                </div>
              </div>
              <div className="text-sm">
                <strong>📍Block/Room:</strong> {lec.blockNo} / {lec.roomNo}
              </div>
              <div className="text-sm">
                <strong>👤Instructor:</strong> {lec.instructor} ({lec.eid})
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
        })}
      </div>
    </div>
  );
}