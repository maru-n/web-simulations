window.requestAnimationFrame = (function() {
    return (
        window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback, time) {
            var time = time ? time: 1000 / 60;
            window.setTimeout(callback, time);
        }
    );
})();


export default class DynamicalSystemCanvasVisualizer {
    constructor(system, canvas_selector, width=800, height=600) {
        this.canvas = document.getElementById(canvas_selector);
        this.canvas.width  = width;
        this.canvas.height = height;

        system.addUpdateListener(this.set_system_state.bind(this));
        //system.addUpdateListener(this.set_system_state);
        this.system = system;

        this.frame = 0;
        this.fps = 0;
        this.fps_last_draw_time = null;
        this.fps_calc_frames = 10;

        this.running_animation = false;
    }

    run_animation() {
        this.running_animation = true;
        this.runner();
    }

    runner() {
        if (!this.running_animation) {
            return;
        }
        this.frame += 1
        if (this.frame % this.fps_calc_frames == 0) {
            var now = Date.now();
            this.fps = parseInt(1000*this.fps_calc_frames/(now - this.fps_last_draw_time));
            this.fps_last_draw_time = now;
        }
        this.draw(this.canvas);
        requestAnimationFrame(this.runner.bind(this));
    }

    stop_animation() {
        this.running_animation = false;
    }

    clear_canvas(color='#ffffff', alpha=1) {
        var ctx = this.canvas.getContext('2d');;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.restore();
    }

    draw_fps(font="1em sans-serif", color='#666666') {
        var ctx = this.canvas.getContext('2d');;
        ctx.save();
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText(this.fps+' fps', 10, 30);
        ctx.restore();
    }

    draw(canvas) {throw new TypeError("Must override method: draw(canvas)");}
    set_system_state(system) {throw new TypeError("Must override method: set_system_state(system)");}
}
