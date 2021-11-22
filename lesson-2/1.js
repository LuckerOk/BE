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

class TimersManager {
    #timers = [];

    #setTimer(interval, delayFunction, delay) {
        return interval ? setInterval(delayFunction, delay) : setTimeout(delayFunction, delay);
    }

    #clearTimer(interval, timerId) {
        interval ? clearInterval(timerId) : clearTimeout(timerId);
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
    }

    #validate = (fields, isSingle = true) => {
        if (isSingle) {
            const { title, value } = fields;

            if (!value) {
                throw Error(`Missing ${title}`);
            }

            this.#validateByValue(fields)
        } else {
            Object.values(REQUIRED_FIELDS).forEach(({ title }) => {
                if (!fields.hasOwnProperty(title)) {
                    throw Error(`Missing ${title}`);
                }

                this.#validateByValue({ title, value: fields[title] })
            });
        }
    }

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
            const { delay, job, interval } = data;

            const delayFunction = () => job(...params);

            const timerId = this.#setTimer(interval, delayFunction, delay);

            return { ...timer, timerId };
        });
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

            const delayFunction = () => job(...params);

            const timerId = this.#setTimer(interval, delayFunction, delay);

            return { ...timer, timerId };
        });
    }
}

const manager = new TimersManager();

const t1 = {
    name: 't1',
    delay: 1000,
    interval: false,
    job: () => { console.log('t1') }
};
const t2 = {
    name: 't2',
    delay: 1000,
    interval: false,
    job: (a, b) => { console.log(a + b) }
};

manager.add(t1).add(t2, 1, 2)
manager.start();
manager.pause('t1');
