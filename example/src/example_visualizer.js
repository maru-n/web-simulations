import DynamicalSystemCanvasVisualizer from './visualizer.js'


export default class FireworksVisualizer extends DynamicalSystemCanvasVisualizer {
    constructor(system, canvas_selector, width=800, height=600) {
        super(system, canvas_selector, width, height);

        // setup visualizer according to system object.
        this.pos = system.pos;
        this.colors = [];
        for (var i = 0; i < this.pos.length; i++) {
            var r = 255*Math.random()|0,
                g = 255*Math.random()|0,
                b = 255*Math.random()|0;
            this.colors[i] = 'rgba(' + r + ',' + g + ',' + b + ',0.5)';
        }

        // start animation. this call draw() periodically.
        super.run_animation();
    }

    system_update_listener(system) {
        // called if system updated
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
            ctx.fillStyle = this.colors[i];
            ctx.arc(canvas_x, canvas_y, 3, 0, 2*Math.PI, false);
            ctx.fill();
        }
    }
}
