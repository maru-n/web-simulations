import DynamicalSystemCanvasVisualizer from './websim/visualizer.js'


export default class DoublePendulumVisualizer extends DynamicalSystemCanvasVisualizer {
    constructor(system, canvas_selector, width=800, height=600) {
        super(system, canvas_selector, width, height);

        this.radius = 10;
        this.color1 = '#ABABFF';
        this.color2 = '#7F7FFF';
        this.line_color = "#666666";
        this.origin = [this.canvas.width/2, this.canvas.height/2];

        this.x1;
        this.y1;
        this.x2;
        this.y2;

        this.trajectory_num = 3000
        this.trajectory_on = true;
        this.trajectory_xy = [];
        this.display_scale = 280.0;

        [this.x1, this.y1, this.x2, this.y2] = this.convert_xy_cordinate(...this.system.get_xy());

        super.run_animation();
    }

    system_update_listener(double_pendulum) {
        [this.x1, this.y1, this.x2, this.y2] = this.convert_xy_cordinate(...double_pendulum.get_xy());
        if (double_pendulum.running) {
            this.trajectory_xy.push([this.x2, this.y2]);
            if (this.trajectory_xy.length > this.trajectory_num) {
                this.trajectory_xy.shift()
            }
        } else {
            this.trajectory_xy = [];
        }
    }

    draw(canvas) {
        super.clear_canvas();
        super.draw_fps();
        var ctx = canvas.getContext('2d');

        // time
        ctx.font = "italic 1em sans-serif";
        ctx.fillStyle = '#666666';
        ctx.fillText(`t = ${this.system.get_time().toFixed(3)}`, 10, canvas.height-10);

        // connectors
        ctx.beginPath();
        ctx.strokeStyle = this.line_color;
        ctx.moveTo(this.origin[0], this.origin[1]);
        ctx.lineTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke()

        // trajectory
        if (this.trajectory_on) {
            ctx.save();
            ctx.strokeStyle = this.color2;
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            for (var xy of this.trajectory_xy) {
                ctx.lineTo(xy[0], xy[1]);
            }
            ctx.stroke();
            ctx.restore();
        }

        // circles
        ctx.beginPath();
        ctx.fillStyle = this.color1;
        ctx.arc(this.x1, this.y1, this.radius, 0, 2*Math.PI, false);
        ctx.fill();
        ctx.beginPath();
        ctx.fillStyle = this.color2;
        ctx.arc(this.x2, this.y2, this.radius, 0, 2*Math.PI, false);
        ctx.fill();
    }

    convert_xy_cordinate(x1, y1, x2, y2) {
        x1 = this.origin[0] + x1 * this.display_scale;
        y1 = this.origin[1] - y1 * this.display_scale;
        x2 = this.origin[0] + x2 * this.display_scale;
        y2 = this.origin[1] - y2 * this.display_scale;
        return [x1, y1, x2, y2]
    }

    set_trajectory(state) {
        this.trajectory_on = state;
    }
}
