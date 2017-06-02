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
        var that = this;
        var runner = () => {
            if (!this.running) {
                return
            }
            that.update();
            setTimeout(runner, 1);
        }
        runner();
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
