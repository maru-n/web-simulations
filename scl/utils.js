const utils = {
    eval_prob: (p) => {
        return (Math.random() < p)
    },
    
    get_neumann_neighborhood: (x, y, x_size, y_size) => {
        let neighborhood = [
            {x: x                 , y:(y-1+y_size)%y_size},
            {x:(x-1+x_size)%x_size, y: y},
            {x:(x+1)%x_size       , y: y},
            {x: x                 , y:(y+1)%y_size}
        ];
        return neighborhood
    },

    get_rand_neumann_neighborhood: (x, y, x_size, y_size) => {
        let neighborhood = utils.get_neumann_neighborhood(x, y, x_size, y_size);
        return neighborhood[Math.floor(Math.random()*neighborhood.length)];
    },
    
    get_moore_neighborhood: (x, y, x_size, y_size) => {
        let neighborhood = [
            {x:(x-1+x_size)%x_size, y:(y-1+y_size)%y_size},
            {x: x                 , y:(y-1+y_size)%y_size},
            {x:(x+1)%x_size       , y:(y-1+y_size)%y_size},
            {x:(x-1+x_size)%x_size, y: y},
            {x:(x+1)%x_size       , y: y},
            {x:(x-1+x_size)%x_size, y:(y+1)%y_size},
            {x: x                 , y:(y+1)%y_size},
            {x:(x+1)%x_size       , y:(y+1)%y_size}
        ];
        return neighborhood;
    },

    get_rand_moore_neighborhood: (x, y, x_size, y_size) => {
        let neighborhood = utils.get_moore_neighborhood(x, y, x_size, y_size);
        return neighborhood[Math.floor(Math.random()*neighborhood.length)];
    },

    get_rand_2_moore_neighborhood: (x, y, x_size, y_size) => {
        let nxy1 = utils.get_rand_moore_neighborhood(x, y, x_size, y_size);
        let neighborhood2;
        if (x == nxy1.x) {
            neighborhood2 = [
                {x:(nxy1.x-1+x_size)%x_size, y:nxy1.y},
                {x:(nxy1.x+1)%x_size       , y:nxy1.y}
            ]
        } else if (y == nxy1.y) {
            neighborhood2 = [
                {x:nxy1.x, y:(nxy1.y-1+y_size)%y_size},
                {x:nxy1.x, y:(nxy1.y+1)%y_size}
            ]
        } else {
            neighborhood2 = [
                {x:nxy1.x, y:y},
                {x:x, y:nxy1.y}
            ]
        }
        let nxy2 = neighborhood2[Math.floor(Math.random()*neighborhood2.length)];
        return [nxy1, nxy2]
    }
}

export default utils
