import DynamicalSystem from '../websim/dynamical_system.js'
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
                    };
                } else {
                    this.cells[x][y] = {
                        'type': 'H',
                        'bonds': [],
                        'mobile': true,
                    };
                }
            }
        }
        this.cells[this.x_size/2][this.y_size/2] = {
            'type':'C',
            'bonds':[],
            'mobile':true
        };
        let membrane_size = 6;
        let membrane_x_min = this.x_size/2 - membrane_size/2;
        let membrane_x_max = this.x_size/2 + membrane_size/2;
        let membrane_y_min = this.y_size/2 - membrane_size/2;
        let membrane_y_max = this.y_size/2 + membrane_size/2;
        for(let x = membrane_x_min; x < membrane_x_max; x++) {
            this.cells[x][membrane_y_min].type = 'L'
            this.cells[x][membrane_y_min].bonds.push([x+1,membrane_y_min]);
            this.cells[x+1][membrane_y_min].type = 'L'
            this.cells[x+1][membrane_y_min].bonds.push([x,membrane_y_min]);
            this.cells[x][membrane_y_max].type = 'L'
            this.cells[x][membrane_y_max].bonds.push([x+1,membrane_y_max]);
            this.cells[x+1][membrane_y_max].type = 'L'
            this.cells[x+1][membrane_y_max].bonds.push([x,membrane_y_max]);
        }
        for(let y = membrane_y_min; y < membrane_y_max; y++) {
            this.cells[membrane_x_min][y].type = 'L'
            this.cells[membrane_x_min][y].bonds.push([membrane_x_min,y+1]);
            this.cells[membrane_x_min][y+1].type = 'L'
            this.cells[membrane_x_min][y+1].bonds.push([membrane_x_min,y]);
            this.cells[membrane_x_max][y].type = 'L'
            this.cells[membrane_x_max][y].bonds.push([membrane_x_max,y+1]);
            this.cells[membrane_x_max][y+1].type = 'L'
            this.cells[membrane_x_max][y+1].bonds.push([membrane_x_max,y]);
        }

        this.mobility_factors = {
            'H':  0.1,
            'S':  0.1,
            'C':  0.001,
            'L':  0.1,
            'LS': 0.1,
        }
        this.production_prob = 0.1;
        //this.disintegration_prob = 0.9;
        //this.bonding_prob = 0.5;
        //this.bond_decay_prob = 0.1;
        this.absorption_prob = 0.1;
        this.emission_prob = 0.5;
    }

    update() {
        SCL.reset_mobile(this.cells);
        for(let x = 0; x < this.x_size; x++) {
            for (let y = 0; y < this.y_size; y++) {
                SCL.motion(this.cells, x, y, this.mobility_factors);
            }
        }

        for(let x = 0; x < this.x_size; x++) {
            for (let y = 0; y < this.y_size; y++) {
                SCL.production(this.cells, x, y, this.production_prob);
                //SCL.disintegration(this.cells, x, y);
                //SCL.bonding(this.cells, x, y);
                //SCL.bond_decay(this.cells, x, y);
                SCL.absorption(this.cells, x, y, this.absorption_prob);
                SCL.emission(this.cells, x, y, this.emission_prob);
            }
        }

        super.update_state();
    }

    static reset_mobile(cells) {
        for(let x = 0; x < cells.length; x++) {
            for (let y = 0; y < cells[x].length; y++) {
                cells[x][y].mobile = (cells[x][y].bonds.length==0);
            }
        }
    }

    static motion(cells, x, y, mobility_factors) {
        let p = cells[x][y];
        let [np, nx, ny] = utils.get_rand_neumann_neighborhood(cells, x, y);
        if (!p.mobile || !np.mobile || p.type==np.type) {
            return
        }
            let prob = Math.sqrt(mobility_factors[p.type] * mobility_factors[np.type]);
            if (utils.eval_prob(prob)) {
                cells[x][y] = np;
                cells[nx][ny] = p;
                cells[x][y].mobile = false;
                cells[nx][ny].mobile = false;
            }
        }

    static production(cells, x, y, prob) {
        let p = cells[x][y];
        if (p.type != 'C') {
            return
        }
        let [np1, nx1, ny1, np2, nx2, ny2] = utils.get_rand_2_moore_neighborhood(cells, x, y);
        if (np1.type != 'S' || np2.type != 'S') {
            return
        }
        if (utils.eval_prob(prob)) {
            np1.type = 'H';
            np2.type = 'L'
        }
    }

    static disintegration(cells, x, y) {}
    static bonding(cells, x, y) {}
    static bond_decay(cells, x, y) {}

    static absorption(cells, x, y, prob) {
        let p = cells[x][y];
        let [np, nx, ny] = utils.get_rand_moore_neighborhood(cells, x, y);
        if (p.type != 'L' || np.type != 'S') {
            return
        }
        if (utils.eval_prob(prob)) {
            p.type = 'LS';
            np.type = 'H';
        }
    }

    static emission(cells, x, y, prob) {
        let p = cells[x][y];
        let [np, nx, ny] = utils.get_rand_moore_neighborhood(cells, x, y);
        if (p.type != 'LS' || np.type != 'H') {
            return
        }
        if (utils.eval_prob(prob)) {
            p.type = 'L';
            np.type = 'S'
        }
    }
}
