const utils = {
    eval_prob: (p) => {
        return (Math.random() < p)
    },

    get_rand_neumann_neighborhood: (cells, x, y) => {
        let x_size = cells.length;
        let y_size = cells[x].length;
        let neighborhood = [
            [ x                 , (y-1+y_size)%y_size],
            [(x-1+x_size)%x_size, y],
            [(x+1)%x_size       , y],
            [ x                 , (y+1)%y_size]
        ];
        let [nx,ny] = neighborhood[Math.floor(Math.random()*neighborhood.length)];
        let np = cells[nx][ny]
        return [np, nx, ny]
    },

    get_rand_moore_neighborhood: (cells, x, y) => {
        let x_size = cells.length;
        let y_size = cells[x].length;
        let neighborhood = [
            [(x-1+x_size)%x_size, (y-1+y_size)%y_size],
            [ x                 , (y-1+y_size)%y_size],
            [(x+1)%x_size       , (y-1+y_size)%y_size],
            [(x-1+x_size)%x_size, y],
            [(x+1)%x_size       , y],
            [(x-1+x_size)%x_size, (y+1)%y_size],
            [ x                 , (y+1)%y_size],
            [(x+1)%x_size       , (y+1)%y_size]
        ];
        let [nx,ny] = neighborhood[Math.floor(Math.random()*neighborhood.length)];
        let np = cells[nx][ny]
        return [np, nx, ny]
    },

    get_rand_2_moore_neighborhood: (cells, x, y) => {
        let x_size = cells.length;
        let y_size = cells[x].length;
        let [np1, nx1, ny1] = utils.get_rand_moore_neighborhood(cells, x, y);
        let neighborhood2;
        if (x == nx1) {
            neighborhood2 = [
                [(nx1-1+x_size)%x_size, ny1],
                [(nx1+1)%x_size       , ny1]
            ]
        } else if (y == ny1) {
            neighborhood2 = [
                [nx1, (ny1-1+y_size)%y_size],
                [nx1, (ny1+1)%y_size]
            ]
        } else {
            neighborhood2 = [
                [nx1, y],
                [x, ny1]
            ]
        }
        let [nx2,ny2] = neighborhood2[Math.floor(Math.random()*neighborhood2.length)];
        let np2 = cells[nx2][ny2];
        return [np1, nx1, ny1, np2, nx2, ny2]
    }
}

export default utils
