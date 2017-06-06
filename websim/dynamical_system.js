export default class DynamicalSystem {
    constructor() {
        this.running = false;
        this.update_listeners = [];
    }

    addUpdateListener(listener) {
        this.update_listeners.push(listener);
    }

    run() {
        this.running = true;
        this.runner();
    }

    step() {
        this.update();
    }

    runner() {
        if (!this.running) {
            return
        }
        this.update();
        setTimeout(this.runner.bind(this), 1);
    }

    stop() {
        this.running = false;
    }

    update_state() {
        for (var listener of this.update_listeners) {
            listener(this);
        }
    }

    update() {throw new TypeError("Must override method: update()");}
}
