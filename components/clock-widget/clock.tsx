'use client';

import { useState, useEffect } from 'react';

import classes from './clock.module.css';

function Clock() {
  const [hour, setHour] = useState<string>('');
  const [min, setMin] = useState<string>('');
  const [sec, setSec] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      let hours: string | number = now.getHours();
      let minutes: string | number = now.getMinutes();
      let seconds: string | number = now.getSeconds();

      hours = hours < 10 ? '0' + hours : hours.toString();
      minutes = minutes < 10 ? '0' + minutes : minutes.toString();
      seconds = seconds < 10 ? '0' + seconds : seconds.toString();

      setHour(hours);
      setMin(minutes);
      setSec(seconds);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={classes.clock}>
      <div>
        <span id="hour">{hour}</span>
        <span className={classes.text}>Óra</span>
      </div>
      <div>
        <span id="minutes">{min}</span>
        <span className={classes.text}>Perc</span>
      </div>
      <div>
        <span id="seconds">{sec}</span>
        <span className={classes.text}>Másodperc</span>
      </div>
    </div>
  );
}

export default Clock;
