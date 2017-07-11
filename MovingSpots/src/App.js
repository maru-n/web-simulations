import React from 'react';
import SimVisJs from './libs/SimVisJs.js'
import {SimVisApp, Visualizer, PlayButton, InitButton, ParameterSelecter} from './libs/components.js'

const WIDTH = 200
const HEIGHT = 200

SimVisJs.register('my_sim', {
    visualize: 'All',

    init() {
        this.dx = 0.01
        this.dt = 0.5
        this.Da = 2e-5
        this.Db = 1e-5
        this.Dc = 1e-6
        // this.r = 0.0347
        // this.k_1 = 0.2
        // this.k_2 = 0.8
        // this.k_3 = 0.005
        // this.a_res = 1.00
        
        // this.r = 0.035
        // this.k_1 = 0.1
        // this.k_2 = 0.8
        // this.k_3 = 0.002
        // this.a_res = 1.00

        this.r = 0.0347
        this.k_1 = 0.1
        this.k_2 = 0.8
        this.k_3 = 0.003
        this.a_res = 1.02

        this.a_res_end = 1.0
        this.a_res_step = (this.a_res - this.a_res_end) * this.dt / 2000

        this.a = [...Array(WIDTH)].map(() => Array(HEIGHT));
        this.b = [...Array(WIDTH)].map(() => Array(HEIGHT));
        this.c = [...Array(WIDTH)].map(() => Array(HEIGHT));
        this.a_tmp = [...Array(WIDTH)].map(() => Array(HEIGHT));
        this.b_tmp = [...Array(WIDTH)].map(() => Array(HEIGHT));
        this.c_tmp = [...Array(WIDTH)].map(() => Array(HEIGHT));
        for(let i = 0; i < WIDTH; i++) {
            for (let j = 0; j < HEIGHT; j++) {
                this.a[i][j] = 1
                this.b[i][j] = 0
                this.c[i][j] = 0
                let x = i * this.dx
                let y = j * this.dx
                if (x > 1 && x <= 1.1 && y > 1 && y <= 1.1) {
                    this.a[i][j] = 0.45 + Math.random()*0.1
                    this.b[i][j] = 0.45 + Math.random()*0.1
                }
                if (x > 0.93 && x <= 1 && y > 1.015 && y <= 1.085) {
                //if (x > 0.9 && x <= 1 && y > 1 && y <= 1.1) {
                    this.c[i][j] = 1.4 + Math.random()*0.2
                }
            }
        }
    },
    
    update() {
        for (var i = 0; i < 10; i++) {
            for(let xi = 0; xi < WIDTH; xi++) {
                for (let yi = 0; yi < HEIGHT; yi++) {
                    let a = this.a[xi][yi]
                    let b = this.b[xi][yi]
                    let c = this.c[xi][yi]

                    let x1 = (xi - 1 + WIDTH) % WIDTH
                    let x2 = (xi + 1) % HEIGHT
                    let y1 = (yi - 1 + HEIGHT) % HEIGHT
                    let y2 = (yi + 1) % HEIGHT
                    let lap_a = (this.a[x1][yi] + this.a[x2][yi] + this.a[xi][y1] + this.a[xi][y2]  - 4*a) / (this.dx*this.dx)
                    let lap_b = (this.b[x1][yi] + this.b[x2][yi] + this.b[xi][y1] + this.b[xi][y2]  - 4*b) / (this.dx*this.dx)
                    let lap_c = (this.c[x1][yi] + this.c[x2][yi] + this.c[xi][y1] + this.c[xi][y2]  - 4*c) / (this.dx*this.dx)

                    let dadt = this.Da * lap_a - a*b*b + this.r*(this.a_res - a)
                    let dbdt = this.Db * lap_b + a*b*b - this.k_1*b - this.k_2*b*c*c
                    let dcdt = this.Dc * lap_c + this.k_2*b*c*c - this.k_3*c
            
                    a += this.dt * dadt
                    b += this.dt * dbdt
                    c += this.dt * dcdt
                    /*
                    a = a >= 0 ? a : 0
                    b = b >= 0 ? b : 0
                    c = c >= 0 ? c : 0
                    */

                    this.a_tmp[xi][yi] = a
                    this.b_tmp[xi][yi] = b
                    this.c_tmp[xi][yi] = c
                }
            }
            this.a_res = this.a_res > this.a_res_end ? this.a_res - this.a_res_step : this.a_res_end
            this.time += this.dt
            
            let tmp
            tmp = this.a
            this.a = this.a_tmp
            this.a_tmp = tmp
            tmp = this.b
            this.b = this.b_tmp
            this.b_tmp = tmp
            tmp = this.c
            this.c = this.c_tmp
            this.c_tmp = tmp
        }
    },
})

let draw_func = function(canvas, sim) {
    const ctx = canvas.getContext('2d');
    let imgData = ctx.createImageData(WIDTH, HEIGHT);
    for(let xi = 0; xi < WIDTH; xi++) {
        for (let yi = 0; yi < HEIGHT; yi++) {
            const idx = xi + yi*WIDTH
            if(sim.visualize === 'All') {
                imgData.data[idx*4+0] = (sim.b[xi][yi])*255
                imgData.data[idx*4+1] = (1-sim.a[xi][yi])*255
                imgData.data[idx*4+2] = (sim.c[xi][yi])*255
            }else if(sim.visualize === 'A') {
                imgData.data[idx*4+0] = (sim.a[xi][yi])*255
                imgData.data[idx*4+1] = (sim.a[xi][yi])*255
                imgData.data[idx*4+2] = (sim.a[xi][yi])*255
            }else if(sim.visualize === 'B') {
                imgData.data[idx*4+0] = (sim.b[xi][yi])*255
                imgData.data[idx*4+1] = (sim.b[xi][yi])*255
                imgData.data[idx*4+2] = (sim.b[xi][yi])*255
            }else if(sim.visualize === 'C') {
                imgData.data[idx*4+0] = (sim.c[xi][yi])*255
                imgData.data[idx*4+1] = (sim.c[xi][yi])*255
                imgData.data[idx*4+2] = (sim.c[xi][yi])*255
            }
            imgData.data[idx*4+3] = 255
        }
    }
    ctx.putImageData(imgData, 0, 0)
}

export default (
    <SimVisApp style={{width:600, margin:'auto'}}>
        <Visualizer width={WIDTH} height={HEIGHT}
            sim_name={'my_sim'}
            draw_func={draw_func} />
        <div>
            <PlayButton sim_name={'my_sim'} />
            <InitButton sim_name={'my_sim'} />
        </div>
        <div>
            <ParameterSelecter
                label={'Visualize'}
                sim_name={'my_sim'}
                parameter={'visualize'}
                choices={['All','A','B','C']} />
        </div>
    </SimVisApp>
);
