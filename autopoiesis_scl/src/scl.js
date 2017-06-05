import DynamicalSystem from './dynamical_system.js'
import utils from './utils.js'


export default class SCL extends DynamicalSystem {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.x_size = 40;
        this.y_size = 30;
        this.cells = new Array(this.x_size);
        for(let x = 0; x < this.x_size; x++) {
            this.cells[x] = new Array(this.y_size);
            for (var y = 0; y < this.y_size; y++) {
                if ( utils.eval_prob(0.8) ) {
                //if ( utils.eval_prob(0.8) &&  i > 10 && i<20 && j>20 && j<30) {
                    this.cells[x][y] = {'type':'S', 'bonds':[], 'mobile':true};
                } else {
                    this.cells[x][y] = {'type':'H', 'bonds':[], 'mobile':true};
                }
            }
        }
        this.cells[this.x_size/2][this.y_size/2] = {'type':'C', 'bonds':[], 'mobile':true};
    }

    update() {
        for(let x = 0; x < this.x_size; x++) {
            for (var y = 0; y < this.y_size; y++) {
                let [nx, ny] = utils.get_rand_neumann_neighborhood(x, y, this.x_size, this.y_size);
                let p = this.cells[x][y]
                let np = this.cells[nx][ny];
                if (p.mobile && np.mobile && p.type!=np.type && p.bonds.length==0 && np.bonds.length==0) {
                    let mobility_factor = 0.1;
                    if (utils.eval_prob(mobility_factor)) {
                        this.cells[x][y] = np;
                        this.cells[nx][ny] = p;
                        this.cells[x][y].mobile = false;
                        this.cells[nx][ny].mobile = false;
                    }
                }
            }
        }

        for(let x = 0; x < this.x_size; x++) {
            for (var y = 0; y < this.y_size; y++) {
                this.cells[x][y].mobile = true;
            }
        }

        super.update_state();
    }
}
