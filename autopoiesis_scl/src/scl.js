import DynamicalSystem from './websim/dynamical_system.js'
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
                SCL.motion(this.cells, x, y);
            }
        }
        SCL.reset_mobile(this.cells);

        for(let x = 0; x < this.x_size; x++) {
            for (var y = 0; y < this.y_size; y++) {
                SCL.production(this.cells, x, y)
                SCL.disintegration(this.cells, x, y)
                SCL.bonding(this.cells, x, y)
                SCL.bond_decay(this.cells, x, y)
                SCL.absorption(this.cells, x, y)
                SCL.emission(this.cells, x, y)
            }
        }


        super.update_state();
    }

    static motion(cells, x, y) {
        let x_size = cells.length;
        let y_size = cells[x].length;
        let [nx, ny] = utils.get_rand_neumann_neighborhood(x, y, x_size, y_size);
        let p = cells[x][y]
        let np = cells[nx][ny];
        if (p.mobile && np.mobile && p.type!=np.type && p.bonds.length==0 && np.bonds.length==0) {
            let mobility_factor = 0.1;
            if (utils.eval_prob(mobility_factor)) {
                cells[x][y] = np;
                cells[nx][ny] = p;
                cells[x][y].mobile = false;
                cells[nx][ny].mobile = false;
            }
        }
    }

    static reset_mobile(cells) {
        for(let x = 0; x < cells.length; x++) {
            for (var y = 0; y < cells[x].length; y++) {
                cells[x][y].mobile = true;
            }
        }
    }

    static production(cells, x, y) {}
    static disintegration(cells, x, y) {}
    static bonding(cells, x, y) {}
    static bond_decay(cells, x, y) {}
    static absorption(cells, x, y) {}
    static emission(cells, x, y) {}
}
