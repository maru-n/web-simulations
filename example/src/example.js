import DynamicalSystem from './dynamical_system.js'
import DynamicalSystemCanvasVisualizer from './visualizer.js'

export class Fireworks extends DynamicalSystem {
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
                var amp = Math.random() * Math.PI * 1.5;
                this.vel[i][0] += amp * Math.cos(th);
                this.vel[i][1] += amp * Math.sin(th);
            }
            this.fired = true;
        }
        var reset = true;
        for (var i = 0; i < this.pos.length; i++) {
            var x = this.pos[i];
            var v = this.vel[i]
            // gravity and update position
            v[1] -= 0.1;
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


export class FireworksVisualizer extends DynamicalSystemCanvasVisualizer {
    constructor(system, canvas_selector, width=800, height=600) {
        super(system, canvas_selector, width, height);
        // setup visualizer according to system object.
        this.pos = system.pos;
        // start animation. this call draw() periodically.
        super.run_animation();
    }

    // called when system updated
    system_update_listener(system) {
        this.pos = system.pos;
    }

    draw(canvas) {
        super.clear_canvas();
        super.draw_fps();
        var ctx = canvas.getContext('2d');

        for (var i = 0; i < this.pos.length; i++) {
            var xy = this.pos[i];
            var canvas_x = this.width / 2 + xy[0];
            var canvas_y = this.height - xy[1];
            ctx.beginPath();
            ctx.fillStyle = '#7F7FFF';
            ctx.arc(canvas_x, canvas_y, 3, 0, 2*Math.PI, false);
            ctx.fill();
        }
    }
}
