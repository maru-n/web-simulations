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
            for (let y = 0; y < this.y_size; y++) {
                if ( utils.eval_prob(0.8) ) {
                //if ( utils.eval_prob(0.8) &&  i > 10 && i<20 && j>20 && j<30) {
                    this.cells[x][y] = {
                        'type': 'S',
                        'bonds': [],
                        'mobile': true,
                        'mobility_factor': 0.1
                    };
                } else {
                    this.cells[x][y] = {
                        'type': 'H',
                        'bonds': [],
                        'mobile': true,
                        'mobility_factor': 0.1
                    };
                }
            }
        }
        this.cells[this.x_size/2][this.y_size/2] = {'type':'C', 'bonds':[], 'mobile':true};

        this.mobility_factors = {
            'H':  0.1,
            'S':  0.1,
            'C':  0.001,
            'L':  0.1,
            'LS': 0.1,
        }
        this.production_prob = 0.1;
    }

    update() {
        for(let x = 0; x < this.x_size; x++) {
            for (let y = 0; y < this.y_size; y++) {
                SCL.motion(this.cells, x, y, this.mobility_factors);
            }
        }
        SCL.reset_mobile(this.cells);

        for(let x = 0; x < this.x_size; x++) {
            for (let y = 0; y < this.y_size; y++) {
                SCL.production(this.cells, x, y, this.production_prob);
                //SCL.disintegration(this.cells, x, y);
                //SCL.bonding(this.cells, x, y);
                //SCL.bond_decay(this.cells, x, y);
                //SCL.absorption(this.cells, x, y);
                //SCL.emission(this.cells, x, y);
            }
        }

        super.update_state();
    }

    static motion(cells, x, y, mobility_factors) {
        let p = cells[x][y];
        let [np, nx, ny] = utils.get_rand_neumann_neighborhood(cells, x, y);
        if (p.mobile && np.mobile && p.type!=np.type && p.bonds.length==0 && np.bonds.length==0) {
            let prob = Math.sqrt(mobility_factors[p.type] * mobility_factors[np.type]);
            if (utils.eval_prob(prob)) {
                cells[x][y] = np;
                cells[nx][ny] = p;
                cells[x][y].mobile = false;
                cells[nx][ny].mobile = false;
            }
        }
    }

    static reset_mobile(cells) {
        for(let x = 0; x < cells.length; x++) {
            for (let y = 0; y < cells[x].length; y++) {
                cells[x][y].mobile = true;
            }
        }
    }

    static production(cells, x, y, production_prob) {
        let p = cells[x][y];
        if (p.type != 'C') {
            return
        }
        let [np1, nx1, ny1, np2, nx2, ny2] = utils.get_rand_2_moore_neighborhood(cells, x, y);
        if (np1.type != 'S' || np2.type != 'S') {
            return
        }
        if (utils.eval_prob(production_prob)) {
            np1.type = 'H';
            np2.type = 'L'
        }
    }

    static disintegration(cells, x, y) {}
    static bonding(cells, x, y) {}
    static bond_decay(cells, x, y) {}
    static absorption(cells, x, y) {}
    static emission(cells, x, y) {}
}
