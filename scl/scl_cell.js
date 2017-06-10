export default class Cell {
    static MAX_BOND_NUM = 2;

    constructor(type, x, y) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.bonds = [];
        this.mobile = true;
        this.disintegrating = false;
    }

    set_type(type) {
        this.type = type;
        if (['H','S','C'].indexOf(this.type)!=-1) {
            this.bonds = [];
            this.disintegrating = false;
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
        if (this.is_max_bonding()) {
            throw new TypeError("Bonding is more than max size.");
        }
        if (['L', 'LS'].indexOf(cell.type) == -1) {
            throw new TypeError("Target cell is not LINK.");
        }
        this.bonds.push(cell);
        this.mobile = false;
        if (recurcive) {
            cell.add_bond(this, false);
        }
    }
    
    is_max_bonding() {
        return (this.bonds.length >= Cell.MAX_BOND_NUM);
    }
    
    is_bonding_to(x, y) {
        for (let bp of this.get_bonds_pos()) {
            if (bp.x == x && bp.y == y) {
                return true
            }
        }
        return false
    }
    
    get_bonds_pos() {
        return this.bonds.map((c)=>{return {x:c.x, y:c.y}});
    }
}
