const REQUIRED_FIELDS = {
  name: {
    title: 'name',
    type: 'string',
  },
  delay: {
    title: 'delay',
    type: 'number',
    more: 5000,
    less: 0,
  },
  interval: {
    title: 'interval',
    type: 'boolean',
  },
  job: {
    title: 'job',
    type: 'function',
  },
};

const validateByValue = ({ title, value }) => {
  const { type, more, less } = REQUIRED_FIELDS[title];

  if (typeof value !== type) {
    throw Error(`Incorrect type of the ${title}`);
  }
  if (title === 'delay') {
    if (value > more) {
      throw Error(`${title} should be less or equal than ${more}`);
    }
    if (value < less) {
      throw Error(`${title} should be more or equal than ${less}`);
    }
  }
};

const validate = (fields, isSingle = true) => {
  if (isSingle) {
    const { title, value } = fields;

    if (!value) {
      throw Error(`Missing ${title}`);
    }

    validateByValue(fields);
  } else {
    Object.values(REQUIRED_FIELDS).forEach(({ title, type, more, less }) => {
      if (!fields.hasOwnProperty(title)) {
        throw Error(`Missing ${title}`);
      }

      validateByValue({ title, value: fields[title] });
    });
  }
};

const setTimer = (interval, delayFunction, delay) => {
  return interval ? setInterval(delayFunction, delay) : setTimeout(delayFunction, delay);
};

const clearTimer = (interval, timerId) => {
  interval ? clearInterval(timerId) : clearTimeout(timerId);
};

const delayFunctionHandler = (name, job, params) => {
  let res;
  let error;
  try {
    res = job(...params);
  } catch (err) {
    const { name, message, stack } = err;

    error = {
      name,
      message,
      stack,
    }
  }

  const logObj = {
    name,
    in: params,
    out: res,
    created: new Date().toISOString(),
  }

  if (error) {
    logObj.error = error
  }

  return logObj;
};

const ADDITIONAL_TIME = 10000;

class TimersManager {
  constructor() {
    this.timers = [];
    this.logs = [];
  }

  _log(log) {
    this.logs.push(log);
  }

  add(timer, ...params) {
    const isStart = this.timers.some((timer) => timer.isStart);

    if (isStart) {
      throw Error('Timer is started');
    }

    const currentTimer = this.timers.find((timerItem) => timerItem.data.name === timer.name);

    if (currentTimer) {
      throw Error('Timer is already exist');
    }

    validate(timer, false)

    this.timers.push({ data: timer, params, isStart: false, timerId: null });

    return this;
  }

  remove(name) {
    validate({ title: 'name', value: name });

    this.timers = this.timers.filter((timer) => {
      const { data, timerId } = timer;
      const { interval, name: timerName } = data;

      if (name === timerName) {
        clearTimer(interval, timerId);
      }

      return name !== timerName;
    });
  }

  start() {
    let maxDelay = 0;

    this.timers = this.timers.map((timer) => {
      const { data, params } = timer;
      const { name, delay, job, interval } = data;

      const delayFunction = () => {
        const logObj = delayFunctionHandler(name, job, params);

        this._log(logObj);
      };

      const timerId = setTimer(interval, delayFunction, delay);

      if (maxDelay < delay) {
        maxDelay = delay;
      }

      return { ...timer, isStart: true, timerId };
    });

    setTimeout(() => {
      this.stop();
    }, maxDelay + ADDITIONAL_TIME);
  }

  stop() {
    this.timers = this.timers.map((timer) => {
      const { data, timerId } = timer;

      clearTimer(data.interval, timerId);

      return { ...timer, isStart: false, timerId: null };
    });
  }

  pause(name) {
    validate({ title: 'name', value: name })

    this.timers = this.timers.map((timer) => {
      const { data, timerId } = timer;
      const { interval, name: timerName } = data;

      if (name !== timerName) {
        return timer;
      }

      clearTimer(interval, timerId);

      return { ...timer, isStart: false, timerId: null };
    });
  }

  resume(name) {
    this.timers = this.timers.map((timer) => {
      const { data, params } = timer;
      const { interval, job, delay, name: timerName } = data;

      if (name !== timerName) {
        return timer;
      }

      const delayFunction = () => {
        const logObj = delayFunctionHandler(name, job, params);

        this._log(logObj);
      };

      const timerId = setTimer(interval, delayFunction, delay);

      return { ...timer, isStart: true, timerId };
    });
  }

  print() {
    return console.log(this.logs);
  }
}

const manager = new TimersManager();

const t1 = {
  name: 't1',
  delay: 3000,
  interval: false,
  job: (a, b) => console.log(a + b)
};
const t2 = {
  name: 't2',
  delay: 2000,
  interval: false,
  job: () => {
    throw new Error('We have a problem!')
  }
};
const t3 = {
  name: 't3',
  delay: 5000,
  interval: false,
  job: n => console.log(n)
};

manager.add(t1, 1, 2).add(t2).add(t3, 1);
manager.start();
