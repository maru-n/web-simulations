import DynamicalSystem from '../websim/dynamical_system.js'
import Cell from './scl_cell.js'
import utils from './utils.js'


export default class SCL extends DynamicalSystem {
    constructor() {
        super();
        this.x_size = 40;
        this.y_size = 30;
        this.init_cells();
    }

    init_cells() {
        this.step = 0;
        this.cells = new Array(this.x_size);
        for(let x = 0; x < this.x_size; x++) {
            this.cells[x] = new Array(this.y_size);
            for (let y = 0; y < this.y_size; y++) {
                if ( utils.eval_prob(0.8) ) {
                //if ( utils.eval_prob(0.8) &&  i > 10 && i<20 && j>20 && j<30) {
                    this.cells[x][y] = new Cell('S', x, y);
                } else {
                    this.cells[x][y] = new Cell('H', x, y);
                }
            }
        }
        this.cells[Math.floor(this.x_size/2)][Math.floor(this.y_size/2)].set_type('C');
        /*
        let membrane_size = 6;
        let membrane_x_min = Math.floor(this.x_size/2 - membrane_size/2);
        let membrane_x_max = Math.floor(this.x_size/2 + membrane_size/2);
        let membrane_y_min = Math.floor(this.y_size/2 - membrane_size/2);
        let membrane_y_max = Math.floor(this.y_size/2 + membrane_size/2);
        this.cells[membrane_x_min][membrane_y_min].set_type('L');
        this.cells[membrane_x_min][membrane_y_max].set_type('L');
        for(let x = membrane_x_min+1; x < membrane_x_max+1; x++) {
            this.cells[x][membrane_y_min].set_type('L');
            this.cells[x][membrane_y_min].add_bond(this.cells[x-1][membrane_y_min]);
            this.cells[x][membrane_y_max].set_type('L');
            this.cells[x][membrane_y_max].add_bond(this.cells[x-1][membrane_y_max]);
        }
        for(let y = membrane_y_min+1; y < membrane_y_max+1; y++) {
            this.cells[membrane_x_min][y].set_type('L');
            this.cells[membrane_x_min][y].add_bond(this.cells[membrane_x_min][y-1]);
            this.cells[membrane_x_max][y].set_type('L');
            this.cells[membrane_x_max][y].add_bond(this.cells[membrane_x_max][y-1]);
        }
        */

        this.mobility_factors = {
            'H':  0.2,
            'S':  0.2,
            'C':  0.001,
            'L':  0.2,
            'LS': 0.2,
        }

        this.production_prob = 0.9;
        //this.disintegration_prob = 0.9;
        this.chainInhibitBondFlag = true;
        this.catInhibitBondFlag = true;
        //this.bonding_prob = 1.0;
        this.chain_initiate_prob = 0.1;
        this.chain_extend_prob = 0.5;
        this.chain_splice_prob = 0.9;
        
        //this.bond_decay_prob = 0.1;
        this.absorption_prob = 0.5;
        this.emission_prob = 0.5;
    }

    update() {
        this.step += 1;

        for(let x = 0; x < this.x_size; x++) {
            for (let y = 0; y < this.y_size; y++) {
                this.cells[x][y].reset_mobile();
            }
        }

        for(let x = 0; x < this.x_size; x++) {
            for (let y = 0; y < this.y_size; y++) {
                this.motion(x, y);
            }
        }

        for(let x = 0; x < this.x_size; x++) {
            for (let y = 0; y < this.y_size; y++) {
                this.production(x, y);
                //SCL.disintegration(this.cells, x, y, this.
                this.bonding(x, y);
                //SCL.bond_decay(this.cells, x, y);
                this.absorption(x, y);
                this.emission(x, y);
            }
        }

        super.update_state();
    }

    motion(x, y) {
        let p = this.cells[x][y];
        let nxy = utils.get_rand_neumann_neighborhood(x, y, this.x_size, this.y_size);
        let np = this.cells[nxy.x][nxy.y];
        if (!p.mobile || !np.mobile || p.type==np.type) {
            return
        }
        let prob = Math.sqrt(this.mobility_factors[p.type] * this.mobility_factors[np.type]);
        if (utils.eval_prob(prob)) {
            this.swap_cell(x, y, nxy.x, nxy.y);
            p.mobile = false;
            np.mobile = false;
        }
    }
    
    swap_cell(x0, y0, x1, y1) {
        let tmp = this.cells[x0][y0];
        this.cells[x0][y0] = this.cells[x1][y1];
        this.cells[x1][y1] = tmp;
        this.cells[x0][y0].x = x0;
        this.cells[x0][y0].y = y0;
        this.cells[x1][y1].x = x1;
        this.cells[x1][y1].y = y1;
    }

    production(x, y) {
        let p = this.cells[x][y];
        if (p.type != 'C') {
            return
        }
        let [np1_xy, np2_xy] = utils.get_rand_2_moore_neighborhood(x, y, this.x_size, this.y_size);
        let np1 = this.cells[np1_xy.x][np1_xy.y];
        let np2 = this.cells[np2_xy.x][np2_xy.y];
        if (np1.type != 'S' || np2.type != 'S') {
            return
        }
        if (utils.eval_prob(this.production_prob)) {
            np1.set_type('H');
            np2.set_type('L');
        }
    }

    static disintegration(cells, x, y, prob) {}

    bonding(x, y) {
        let nxy = utils.get_rand_moore_neighborhood(x, y, this.x_size, this.y_size);
        let nx = nxy.x, ny = nxy.y;
        let p = this.cells[x][y];
        let np = this.cells[nxy.x][nxy.y];
        if ( ['L', 'LS'].indexOf(p.type) == -1 || ['L', 'LS'].indexOf(np.type) == -1 ) {
            return
        }
        if (p.is_max_bonding() || np.is_max_bonding() || p.is_bonding_to(nx, ny)) {
            return
        }
        if (this.chainInhibitBondFlag) {
            let neighborhood = utils.get_moore_neighborhood(x, y, this.x_size, this.y_size);
            for (let xy1 of neighborhood) {
                for(let xy2 of neighborhood) {
                    if (this.cells[xy1.x][xy1.y].is_bonding_to(xy2.x, xy2.y)) {
                        return
                    }
                }
            }
            neighborhood = utils.get_moore_neighborhood(nx, ny, this.x_size, this.y_size);
            for (let xy1 of neighborhood) {
                for(let xy2 of neighborhood) {
                    if (this.cells[xy1.x][xy1.y].is_bonding_to(xy2.x, xy2.y)) {
                        return
                    }
                }
            }
        }
        if (this.catInhibitBondFlag) {
            for (let xy of utils.get_moore_neighborhood(x, y, this.x_size, this.y_size)) {
                if (this.cells[xy.x][xy.y].type == 'C') {
                    return
                }
            }
            for (let xy of utils.get_moore_neighborhood(nx, ny, this.x_size, this.y_size)) {
                if (this.cells[xy.x][xy.y].type == 'C') {
                    return
                }
            }
        }
        for (let bp of p.get_bonds_pos()) {
            let dx = Math.abs(bp.x - np.x);
            let dy = Math.abs(bp.y - np.y);
            dx = dx > this.x_size/2 ? this.x_size - dx : dx;
            dy = dy > this.y_size/2 ? this.y_size - dy : dy;
            if ((dx==0 && dy==1) || (dx==1 && dy==0)) {
                return
            }
        }
        for (let bp of np.get_bonds_pos()) {
            let dx = Math.abs(bp.x - p.x);
            let dy = Math.abs(bp.y - p.y);
            dx = dx > this.x_size/2 ? this.x_size - dx : dx;
            dy = dy > this.y_size/2 ? this.y_size - dy : dy;
            if ((dx==0 && dy==1) || (dx==1 && dy==0)) {
                return
            }
        }
        let prob;
        if (p.bonds.length == 0 && np.bonds.length == 0) {
            prob = this.chain_initiate_prob;
        } else if (p.bonds.length == 1 && np.bonds.length == 1) {
            prob = this.chain_splice_prob;
        } else {
            prob = this.chain_extend_prob;
        }
        if (utils.eval_prob(prob)) {
            p.add_bond(np);
        }
    }

    static bond_decay(cells, x, y) {}

    absorption(x, y) {
        let nxy = utils.get_rand_moore_neighborhood(x, y, this.x_size, this.y_size);
        let p = this.cells[x][y];
        let np = this.cells[nxy.x][nxy.y];
        if (p.type != 'L' || np.type != 'S') {
            return
        }
        if (utils.eval_prob(this.absorption_prob)) {
            p.set_type('LS');
            np.set_type('H');
        }
    }

    emission(x, y) {
        let nxy = utils.get_rand_moore_neighborhood(x, y, this.x_size, this.y_size);
        let p = this.cells[x][y];
        let np = this.cells[nxy.x][nxy.y];
        if (p.type != 'LS' || np.type != 'H') {
            return
        }
        if (utils.eval_prob(this.emission_prob)) {
            p.set_type('L');
            np.set_type('S');
        }
    }
}
