import DynamicalSystemCanvasVisualizer from '../websim/visualizer.js'


export default class SCLVisualizer extends DynamicalSystemCanvasVisualizer {

    static SUBSTRATE_COLOR = '#a8ffff';
    static CATALYST_COLOR = '#ff7f7f';
    static LINK_COLOR = '#7f7fff';
    static SUBSTRATE_SIZE = 0.5;
    static CATALYST_SIZE = 0.9;
    static LINK_SIZE = 0.6
    static LINK_LINE_WIDTH = 2;

    constructor(scl, canvas_selector, width=800, height=600) {
        super(scl, canvas_selector, width, height);
        this.cells = scl.cells;
        if (scl.x_size / scl.y_size > this.width / this.height) {
            this.cell_size = this.width / scl.x_size;
            this.origin = [0, (this.height - this.cell_size * scl.y_size) / 2];
        } else {
            this.cell_size = this.height / scl.y_size;
            this.origin = [(this.width - this.cell_size * scl.x_size) / 2, 0];
        }

        super.run_animation();
    }

    system_update_listener(scl) {}

    draw(canvas, scl) {
        super.clear_canvas();

        let ctx = canvas.getContext('2d');

        for(let x = 0; x < scl.x_size; x++) {
            for (var y = 0; y < scl.y_size; y++) {
                this.draw_cell(ctx, scl.cells[x][y].type, x, y);
            }
        }
        super.draw_fps();
    }

    draw_cell(ctx, type, x, y, size) {
        ctx.save();
        if (type == 'S' || type == 'LS') {
            ctx.beginPath();
            ctx.fillStyle = SCLVisualizer.SUBSTRATE_COLOR;
            ctx.arc(this.origin[0] + x*this.cell_size + this.cell_size/2,
                    this.origin[1] + y*this.cell_size + this.cell_size/2,
                    SCLVisualizer.SUBSTRATE_SIZE*this.cell_size/2,
                    0, 2*Math.PI, false);
            ctx.fill();
        } else if (type == 'C') {
            ctx.beginPath();
            ctx.fillStyle = SCLVisualizer.CATALYST_COLOR;
            ctx.arc(this.origin[0] + x*this.cell_size + this.cell_size/2,
                    this.origin[1] + y*this.cell_size + this.cell_size/2,
                    SCLVisualizer.CATALYST_SIZE*this.cell_size/2,
                    0, 2*Math.PI, false);
            ctx.fill();
        }
        if (type == 'L' || type == 'LS') {
            ctx.beginPath();
            ctx.strokeStyle = SCLVisualizer.LINK_COLOR;
            ctx.lineWidth = SCLVisualizer.LINK_LINE_WIDTH;
            ctx.rect(this.origin[0] + x*this.cell_size + this.cell_size*(1-SCLVisualizer.LINK_SIZE)/2,
                     this.origin[1] + y*this.cell_size + this.cell_size*(1-SCLVisualizer.LINK_SIZE)/2,
                     this.cell_size * SCLVisualizer.LINK_SIZE,
                     this.cell_size * SCLVisualizer.LINK_SIZE);
            ctx.stroke();
        }
        ctx.restore();
    }

    draw_bond(ctx, x1, y1, x2, y2) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = SCLVisualizer.LINK_COLOR;
        ctx.lineWidth = SCLVisualizer.LINK_LINE_WIDTH;

        let start_x = (0.5 + x1 + (x2 - x1) * SCLVisualizer.LINK_SIZE / 2) * this.cell_size ;
        let start_y = (0.5 + y1 + (y2 - y1) * SCLVisualizer.LINK_SIZE / 2) * this.cell_size ;
        let end_x = (0.5 + x2 - (x2 - x1) * SCLVisualizer.LINK_SIZE / 2) * this.cell_size ;
        let end_y = (0.5 + y2 - (y2 - y1) * SCLVisualizer.LINK_SIZE / 2) * this.cell_size ;
        ctx.moveTo(start_x, start_y);
        ctx.lineTo(end_x, end_y);
        ctx.stroke()
        ctx.restore();
    }
}
