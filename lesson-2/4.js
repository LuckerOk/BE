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

const ADDITIONAL_TIME = 10000;

class TimersManager {
  #timers = [];
  #logs = [];
  #maxDelay = 0;

  #setTimer(interval, delayFunction, delay) {
    return interval ? setInterval(delayFunction, delay) : setTimeout(delayFunction, delay);
  }

  #clearTimer(interval, timerId) {
    interval ? clearInterval(timerId) : clearTimeout(timerId);
  }

  #log(log) {
    this.#logs.push(log);
  }

  #validateByValue = ({ title, value }) => {
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

  #validate = (fields, isSingle = true) => {
    if (isSingle) {
      const { title, value } = fields;

      if (!value) {
        throw Error(`Missing ${title}`);
      }

      this.#validateByValue(fields);
    } else {
      Object.values(REQUIRED_FIELDS).forEach(({ title }) => {
        if (!fields.hasOwnProperty(title)) {
          throw Error(`Missing ${title}`);
        }

        this.#validateByValue({ title, value: fields[title] });
      });
    }
  };

  #delayFunctionHandler = (name, job, params) => {
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

  add(timer, ...params) {
    const isStart = this.#timers.some((timer) => timer.timerId);

    if (isStart) {
      throw Error('Timer is started');
    }

    const currentTimer = this.#timers.find((timerItem) => timerItem.data.name === timer.name);

    if (currentTimer) {
      throw Error('Timer is already exist');
    }

    this.#validate(timer, false)

    this.#timers.push({ data: timer, params, timerId: null });

    if (this.#maxDelay < timer.delay) {
      this.#maxDelay = timer.delay;
    }

    return this;
  }

  remove(name) {
    this.#validate({ title: 'name', value: name });

    this.#timers = this.#timers.filter((timer) => {
      const { data, timerId } = timer;
      const { interval, name: timerName } = data;

      if (name === timerName) {
        this.#clearTimer(interval, timerId);
      }

      return name !== timerName;
    });
  }

  start() {
    this.#timers = this.#timers.map((timer) => {
      const { data, params } = timer;
      const { name, delay, job, interval } = data;

      const delayFunction = () => {
        const logObj = this.#delayFunctionHandler(name, job, params);

        this.#log(logObj);
      };

      const timerId = this.#setTimer(interval, delayFunction, delay);

      return { ...timer, timerId };
    });

    setTimeout(() => {
      this.stop();
    }, this.#maxDelay + ADDITIONAL_TIME);
  }

  stop() {
    this.#timers = this.#timers.map((timer) => {
      const { data, timerId } = timer;

      this.#clearTimer(data.interval, timerId);

      return { ...timer, timerId: null };
    });
  }

  pause(name) {
    this.#validate({ title: 'name', value: name })

    this.#timers = this.#timers.map((timer) => {
      const { data, timerId } = timer;
      const { interval, name: timerName } = data;

      if (name !== timerName) {
        return timer;
      }

      this.#clearTimer(interval, timerId);

      return { ...timer, timerId: null };
    });
  }

  resume(name) {
    this.#timers = this.#timers.map((timer) => {
      const { data, params } = timer;
      const { interval, job, delay, name: timerName } = data;

      if (name !== timerName) {
        return timer;
      }

      const delayFunction = () => {
        const logObj = this.#delayFunctionHandler(name, job, params);

        this.#log(logObj);
      };

      const timerId = this.#setTimer(interval, delayFunction, delay);

      return { ...timer, timerId };
    });
  }

  print() {
    return console.log(this.#logs);
  }
}

const manager = new TimersManager();

const t1 = {
  name: 't1',
  delay: 3000,
  interval: true,
  job: (a, b) => console.log(a + b)
};
const t2 = {
  name: 't2',
  delay: 2000,
  interval: true,
  job: () => {
    throw new Error('We have a problem!')
  }
};
const t3 = {
  name: 't3',
  delay: 5000,
  interval: true,
  job: n => console.log(n)
};

manager.add(t1, 1, 2).add(t2).add(t3, 1);
manager.start();
