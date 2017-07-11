import React from 'react';
import SimVisJs from './libs/SimVisJs.js'
import {SimVisApp, Visualizer, PlayButton, InitButton, ParameterSlider} from './libs/components.js'

const WIDTH = 200
const HEIGHT = 200

SimVisJs.register('my_sim', {
    dx: 0.01,
    dt: 0.5,
    Du: 2e-5,
    Dv: 1e-5,
    f: 0.035,
    k: 0.065,

    init() {

        this.u = [...Array(WIDTH)].map(() => Array(HEIGHT));
        this.v = [...Array(WIDTH)].map(() => Array(HEIGHT));
        this.u_tmp = [...Array(WIDTH)].map(() => Array(HEIGHT));
        this.v_tmp = [...Array(WIDTH)].map(() => Array(HEIGHT));
        for(let i = 0; i < WIDTH; i++) {
            for (let j = 0; j < HEIGHT; j++) {
                this.u[i][j] = 1
                this.v[i][j] = 0
                let x = i * this.dx
                let y = j * this.dx
                if (x > 0.9 && x <= 1.1 && y > 0.9 && y <= 1.1) {
                    this.u[i][j] = 0.45 + Math.random()*0.1
                    this.v[i][j] = 0.45 + Math.random()*0.1
                }
            }
        }
    },
    
    update() {
        for (var i = 0; i < 16; i++) {
            for(let xi = 0; xi < WIDTH; xi++) {
                for (let yi = 0; yi < HEIGHT; yi++) {
                    let u = this.u[xi][yi]
                    let v = this.v[xi][yi]

                    let x1 = (xi - 1 + WIDTH) % WIDTH
                    let x2 = (xi + 1) % HEIGHT
                    let y1 = (yi - 1 + HEIGHT) % HEIGHT
                    let y2 = (yi + 1) % HEIGHT
                    let lap_u = (this.u[x1][yi] + this.u[x2][yi] + this.u[xi][y1] + this.u[xi][y2]  - 4*u) / (this.dx*this.dx)
                    let lap_v = (this.v[x1][yi] + this.v[x2][yi] + this.v[xi][y1] + this.v[xi][y2]  - 4*v) / (this.dx*this.dx)

                    let f = this.f
                    let k = this.k
                    /*
                    let f = 0.01 + 0.04 * xi / WIDTH
                    let k = 0.03 + 0.04 * yi / HEIGHT
                    */
                    
                    let dudt = this.Du * lap_u - u*v*v + f*(1-u)
                    let dvdt = this.Dv * lap_v + u*v*v - (f+k)*v
            
                    u += this.dt * dudt
                    v += this.dt * dvdt

                    this.u_tmp[xi][yi] = u
                    this.v_tmp[xi][yi] = v
                }
            }
            let tmp
            tmp = this.u
            this.u = this.u_tmp
            this.u_tmp = tmp
            tmp = this.v
            this.v = this.v_tmp
            this.v_tmp = tmp
        }
    },
})

let draw_func = function(canvas, sim) {
    const ctx = canvas.getContext('2d');
    let imgData = ctx.createImageData(WIDTH, HEIGHT);
    for(let xi = 0; xi < WIDTH; xi++) {
        for (let yi = 0; yi < HEIGHT; yi++) {
            const idx = xi + yi*WIDTH
            imgData.data[idx*4+0] = (sim.v[xi][yi])*255
            imgData.data[idx*4+1] = (sim.v[xi][yi])*255
            imgData.data[idx*4+2] = (sim.v[xi][yi])*255
            imgData.data[idx*4+3] = 255
        }
    }
    ctx.putImageData(imgData, 0, 0)
}

export default (
    <SimVisApp style={{width:600, margin:'auto'}}>
        <Visualizer width={WIDTH} height={HEIGHT}
            display_width={600} display_height={600}
            sim_name={'my_sim'}
            draw_func={draw_func} />
        <div>
            <PlayButton sim_name={'my_sim'} />
            <InitButton sim_name={'my_sim'} />
        </div>
        <div>
            <ParameterSlider
                label={'f'}
                sim_name={'my_sim'}
                parameter={'f'}
                min={0.01} max={0.04} step={0.0001}/>
            <ParameterSlider
                label={'k'}
                sim_name={'my_sim'}
                parameter={'k'}
                min={0.05} max={0.07} step={0.0001}/>
        </div>
    </SimVisApp>
);
