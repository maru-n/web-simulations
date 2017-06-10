export default class Cell {
    static MAX_BOND_NUM = 2;

    constructor(type, x, y) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.bonds = [];
        this.mobile = true;
    }

    set_type(type) {
        this.type = type;
        if (['H', 'S', 'C'].indexOf(this.type) != -1) {
            this.bonds = [];
        }
    }
    
    reset_mobile() {
        if (this.bonds.length == 0) {
            this.mobile = true;
        } else {
            this.mobile = false;
        }
    }
    
    add_bond(cell, recurcive=true) {
        if (this.bonds.length >= Cell.MAX_BOND_NUM) {
            throw new TypeError("Bonding is more than max size.");
        }
        if (cell.type != 'L') {
            throw new TypeError("Target cell is not LINK.");
        }
        this.bonds.push(cell);
        this.mobile = false;
        if (recurcive) {
            cell.add_bond(this, false);
        }
    }
    
    get_bonds_pos() {
        return this.bonds.map((c)=>{return [c.x, c.y]});
    }
}
