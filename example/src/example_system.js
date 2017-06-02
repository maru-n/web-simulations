import DynamicalSystem from './dynamical_system.js'


export default class Fireworks extends DynamicalSystem {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.fired = false;
        this.pos = [];
        this.vel = [];
        for (var i = 0; i < 1000; i++) {
            this.pos.push([0,0]);
            this.vel.push([0,10]);
        }
    }

    update() {
        // if reached top, fire!
        if (this.vel[0][1] < 0 && !this.fired) {
            for (var i = 0; i < this.vel.length; i++) {
                var th = Math.random() * Math.PI * 2;
                var amp = Math.random() * Math.PI * 2;
                this.vel[i][0] += amp * Math.cos(th);
                this.vel[i][1] += amp * Math.sin(th);
            }
            this.fired = true;
        }
        var reset = true;
        for (var i = 0; i < this.pos.length; i++) {
            var x = this.pos[i];
            var v = this.vel[i]

            // gravity
            v[1] -= 0.1;

            // motion
            x[0] += v[0];
            x[1] += v[1];
            if (x[1] > 0) {
                reset = false;
            }
        }

        if (reset) {
            this.init();
        }
        super.update_state();
    }
}
