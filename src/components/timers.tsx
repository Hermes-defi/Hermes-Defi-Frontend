import { useState, useEffect } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";

dayjs.extend(duration);

// TODO:: THIS SHOULDN'T BE HERE. MOVE TO /hooks folder.
export function useTimer(initialTime, format = "D[d] H[h] - mm[m] - ss[s]") {
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    if (dayjs().isAfter(initialTime)) return;

    const initialDiff = dayjs.duration(initialTime.diff(dayjs())).format(format);
    setCurrentTime(initialDiff);

    const interval = setInterval(() => {
      const diff = dayjs.duration(initialTime.diff(dayjs())).format(format);
      setCurrentTime(diff);
    }, 1000);

    return () => clearInterval(interval);
  }, [initialTime]);

  return currentTime;
}
