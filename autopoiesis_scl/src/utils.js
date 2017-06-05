const utils = {
    eval_prob: (p) => {
        return (Math.random() < p)
    },

    get_rand_neumann_neighborhood: (x, y, x_size, y_size) => {
        let xy = parseInt(Math.random() * 2);
        let i = parseInt(Math.random() * 2) * 2 - 1
        let nx = (x +  xy * i + x_size) % x_size;
        let ny = (y + !xy * i + y_size) % y_size;
        return [nx, ny]
    },

    get_rand_moor_neighborhood: (x, y, x_size, y_size) => {
        let nx = (x + parseInt(Math.random() * 2) * 2 - 1 + x_size) % x_size;
        let ny = (y + parseInt(Math.random() * 2) * 2 - 1 + y_size) % y_size;
        return [nx, ny]
    }
}

export default utils
