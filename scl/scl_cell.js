export default class Cell {
    static MAX_BOND_NUM = 2;

    constructor(type, x, y) {
        this.x = x;
        this.y = y;
        this._type = type;
        this._bonds = [];
        this.mobile = true;
        this.disintegrating = false;
    }

    set_type(type) {
        this._type = type;
        if (!this.is_type(['L','LS'])) {
            this.clear_bonds();
            this.disintegrating = false;
        }
    }
    
    get_type() {
        return this._type
    }
    
    same_type(cell) {
        return (this._type == cell._type)
    }
    
    reset_mobile() {
        if (this._bonds.length == 0) {
            this.mobile = true;
        } else {
            this.mobile = false;
        }
    }
    
    add_bond(cell, recurcive=true) {
        if (this.is_max_bonding()) {
            throw new TypeError("Bonding is more than max size.");
        }
        if (!this.is_type(['L','LS'])) {
            throw new TypeError("Target cell is not LINK.");
        }
        this._bonds.push(cell);
        this.mobile = false;
        if (recurcive) {
            cell.add_bond(this, false);
        }
    }
    
    clear_bonds() {
        for (let bp of this._bonds) {
            bp.remove_bond(this, false);
        }
        this._bonds = [];
    }
    
    remove_bond(cell, recurcive=true) {
        this._bonds.splice(this._bonds.indexOf(cell), 1);
        if (recurcive) {
            cell.remove_bond(this, false);
        }
    }
    
    is_type(type) {
        if (Array.isArray(type)) {
            return (type.indexOf(this._type) != -1);
        } else {
            return (this._type == type)
        }
    }
    
    is_max_bonding() {
        return (this._bonds.length >= Cell.MAX_BOND_NUM);
    }
    
    is_bonding_to(x, y) {
        for (let bp of this.get_bonds_pos()) {
            if (bp.x == x && bp.y == y) {
                return true
            }
        }
        return false
    }
    
    get_bonds() {
        return this._bonds
    }
    
    get_bonds_pos() {
        return this._bonds.map((c)=>{return {x:c.x, y:c.y}});
    }
    
    bonds_num() {
        return this._bonds.length
    }
}
