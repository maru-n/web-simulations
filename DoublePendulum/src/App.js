import React from 'react';
import SimVisJs from './libs/SimVisJs.js'
import {SimVisApp, Visualizer, PlayButton, ParameterSlider} from './libs/components.js'

const sin = Math.sin;
const cos = Math.cos;


SimVisJs.register('my_sim', {
    init() {
        this.t = 0;
        this.th1 = Math.PI*0.4;
        this.th2 = Math.PI*0.9;
        this.vth1 = 0;
        this.vth2 = 0;

        this.dt = 0.001;
        this.l1 = 0.5;
        this.l2 = 0.5;
        this.m1 = 0.1;
        this.m2 = 0.1;
        this.g = 9.8;
    },

    update() {
        for (let i = 0; i < 16; i++) {
            this.t += this.dt;

            let k1_1 = this.dt * this.th1_dot(this.th1, this.th2, this.vth1, this.vth2)
            let k1_2 = this.dt * this.th2_dot(this.th1, this.th2, this.vth1, this.vth2)
            let k1_3 = this.dt * this.vth1_dot(this.th1, this.th2, this.vth1, this.vth2)
            let k1_4 = this.dt * this.vth2_dot(this.th1, this.th2, this.vth1, this.vth2)

            let k2_1 = this.dt * this.th1_dot(this.th1+k1_1/2.0, this.th2+k1_2/2.0, this.vth1+k1_3/2.0, this.vth2+k1_4/2.0)
            let k2_2 = this.dt * this.th2_dot(this.th1+k1_1/2.0, this.th2+k1_2/2.0, this.vth1+k1_3/2.0, this.vth2+k1_4/2.0)
            let k2_3 = this.dt * this.vth1_dot(this.th1+k1_1/2.0, this.th2+k1_2/2.0, this.vth1+k1_3/2.0, this.vth2+k1_4/2.0)
            let k2_4 = this.dt * this.vth2_dot(this.th1+k1_1/2.0, this.th2+k1_2/2.0, this.vth1+k1_3/2.0, this.vth2+k1_4/2.0)

            let k3_1 = this.dt * this.th1_dot(this.th1+k2_1/2.0, this.th2+k2_2/2.0, this.vth1+k2_3/2.0, this.vth2+k2_4/2.0)
            let k3_2 = this.dt * this.th2_dot(this.th1+k2_1/2.0, this.th2+k2_2/2.0, this.vth1+k2_3/2.0, this.vth2+k2_4/2.0)
            let k3_3 = this.dt * this.vth1_dot(this.th1+k2_1/2.0, this.th2+k2_2/2.0, this.vth1+k2_3/2.0, this.vth2+k2_4/2.0)
            let k3_4 = this.dt * this.vth2_dot(this.th1+k2_1/2.0, this.th2+k2_2/2.0, this.vth1+k2_3/2.0, this.vth2+k2_4/2.0)

            let k4_1 = this.dt * this.th1_dot(this.th1+k3_1, this.th2+k3_2, this.vth1+k3_3, this.vth2+k3_4)
            let k4_2 = this.dt * this.th2_dot(this.th1+k3_1, this.th2+k3_2, this.vth1+k3_3, this.vth2+k3_4)
            let k4_3 = this.dt * this.vth1_dot(this.th1+k3_1, this.th2+k3_2, this.vth1+k3_3, this.vth2+k3_4)
            let k4_4 = this.dt * this.vth2_dot(this.th1+k3_1, this.th2+k3_2, this.vth1+k3_3, this.vth2+k3_4)

            this.th1 +=   (k1_1 + 2.0*k2_1 + 2.0*k3_1 + k4_1) / 6.0;
            this.th2 +=   (k1_2 + 2.0*k2_2 + 2.0*k3_2 + k4_2) / 6.0;
            this.vth1 +=  (k1_3 + 2.0*k2_3 + 2.0*k3_3 + k4_3) / 6.0;
            this.vth2 +=  (k1_4 + 2.0*k2_4 + 2.0*k3_4 + k4_4) / 6.0;
        }
        this.th1 = ((this.th1 % (Math.PI*2.0)) + Math.PI*2.0) % (Math.PI*2.0);
        this.th2 = ((this.th2 % (Math.PI*2.0)) + Math.PI*2.0) % (Math.PI*2.0);
    },

    th1_dot(th1, th2, vth1, vth2) {
        return vth1
    },

    th2_dot(th1, th2, vth1, vth2) {
        return vth2
    },

    vth1_dot(th1, th2, vth1, vth2) {
        let [m1, m2, l1, l2, g] = [this.m1, this.m2, this.l1, this.l2, this.g];
        let a1 = (m1+m2) * l1;
        let b1 = m2 * l2 * cos(th1-th2);
        let c1 = m2 * l2 * vth2 * vth2 * sin(th1-th2) + (m1+m2) * g * sin(th1);
        let a2 = l1 * l2 * cos(th1-th2);
        let b2 = l2 * l2;
        let c2 = -l1 * l2 * vth1 * vth1 * sin(th1-th2) + g * l2 * sin(th2);
        return (b1*c2 - b2*c1) / (a1*b2 - a2*b1)
    },


    vth2_dot(th1, th2, vth1, vth2) {
        let [m1, m2, l1, l2, g] = [this.m1, this.m2, this.l1, this.l2, this.g];
        let a1 = (m1+m2) * l1;
        let b1 = m2 * l2 * cos(th1-th2);
        let c1 = m2 * l2 * vth2 * vth2 * sin(th1-th2) + (m1+m2) * g * sin(th1);
        let a2 = l1 * l2 * cos(th1-th2);
        let b2 = l2 * l2;
        let c2 = -l1 * l2 * vth1 * vth1 * sin(th1-th2) + g * l2 * sin(th2);
        return (a1*c2 - a2*c1) / (a2*b1 - a1*b2)
    },

    get_xy() {
        let x1 =  this.l1*sin(this.th1);
        let y1 = -this.l1*cos(this.th1);
        let x2 = x1 + this.l2*sin(this.th2);
        let y2 = y1 - this.l2*cos(this.th2);
        return [x1, y1, x2, y2]
    },

    get_vxy() {
        let vx1 = this.l1*cos(this.th1) * this.vth1;
        let vy1 = this.l1*sin(this.th1) * this.vth1;
        let vx2 = vx1 + this.l2*cos(this.th2) * this.vth2;
        let vy2 = vy1 + this.l2*sin(this.th2) * this.vth2;
        return [vx1, vy1, vx2, vy2]
    },

    get_energy() {
        let [th1, th2, vth1, vth2] = [this.th1, this.th2, this.vth1, this.vth2];
        let [m1, m2, l1, l2, g] = [this.m1, this.m2, this.l1, this.l2, this.g];
        let ke1 = m1 * l1*l1 * vth1**2 / 2.0;
        let ke2 = m2 * (l1**2 * vth1**2 + l2**2 * vth2**2 + 2*l1*l2*vth1*vth2*cos(th1-th2)) / 2.0;
        let pe1 = -g * m1 * l1*cos(th1);
        let pe2 = -g * m2 * (l1*cos(th1) + l2*cos(th2));
        let e = ke1 + ke2 + pe1 + pe2;
        return e
    }
})

const TRAJECTORY_NUM = 3000;
let trajectory = [];

let draw_func = function(canvas, sim) {
    const CIRCLE_RADIUS = 10;
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fill()

    let origin = [canvas.width/2, canvas.height/2];
    let [x1, y1, x2, y2] = sim.get_xy();
    let scale = Math.min(canvas.width, canvas.height) * 0.45;
    x1 = origin[0] + x1 * scale;
    y1 = origin[1] - y1 * scale;
    x2 = origin[0] + x2 * scale;
    y2 = origin[1] - y2 * scale;

    // save trajectory
    trajectory.push([x2, y2]);
    if (trajectory.length > TRAJECTORY_NUM) {
        trajectory.shift()
    }

    // time
    ctx.font = "italic 1em sans-serif";
    ctx.fillStyle = '#666666';
    ctx.fillText(`t = ${sim.t.toFixed(3)}`, 10, canvas.height-10);

    // connectors
    ctx.beginPath();
    ctx.strokeStyle = "#666666";
    ctx.moveTo(origin[0], origin[1]);
    ctx.lineTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke()

    // trajectory
    //if (sim.trajectory_on) {
    if (true) {
        ctx.save();
        ctx.strokeStyle = '#7F7FFF';
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        for (let xy of trajectory) {
            ctx.lineTo(xy[0], xy[1]);
        }
        ctx.stroke();
        ctx.restore();
    }

    // circles
    ctx.beginPath();
    ctx.fillStyle = '#FF7F7F';
    ctx.arc(x1, y1, CIRCLE_RADIUS, 0, 2*Math.PI, false);
    ctx.fill();
    ctx.beginPath();
    ctx.fillStyle = '#7F7FFF';
    ctx.arc(x2, y2, CIRCLE_RADIUS, 0, 2*Math.PI, false);
    ctx.fill();
}

let phase_trajectory_x1 = [];
let phase_trajectory_x2 = [];
let phase_trajectory_y1 = [];
let phase_trajectory_y2 = [];

let draw_func2 = function(canvas, sim) {
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.rect(0, 0, canvas.width, canvas.height)
    ctx.fill()

    let origin = [canvas.width/2, canvas.height/2];
    let [x1, y1, x2, y2] = sim.get_xy();
    let [vx1, vy1, vx2, vy2] = sim.get_vxy();
    let scale_x = Math.min(canvas.width, canvas.height) * 0.45;
    let scale_y = scale_x * 0.1;
    phase_trajectory_x1.push([origin[0]+x1*scale_x, origin[1] + vx1*scale_y]);
    phase_trajectory_x2.push([origin[0]+x2*scale_x, origin[1] + vx2*scale_y]);
    phase_trajectory_y1.push([origin[0]+y1*scale_x, origin[1] + vy1*scale_y]);
    phase_trajectory_y2.push([origin[0]+y2*scale_x, origin[1] + vy2*scale_y]);

    // axis
    ctx.strokeStyle = "#666666";
    ctx.beginPath();
    ctx.moveTo(origin[0], 0);
    ctx.lineTo(origin[0], canvas.height);
    ctx.stroke()
    ctx.beginPath();
    ctx.moveTo(0, origin[1]);
    ctx.lineTo(canvas.width, origin[1]);
    ctx.stroke()

    ctx.font = "italic 1.5em sans-serif";
    ctx.fillStyle = '#666666';
    ctx.fillText('x', canvas.width - 30, origin[1] + 30);
    ctx.fillText('vx', origin[0] - 40, 30);

    // line
    ctx.strokeStyle = '#FF7F7F';
    ctx.beginPath();
    ctx.moveTo(phase_trajectory_x1[0][0], phase_trajectory_x1[0][1]);
    for (let xy of phase_trajectory_x1.slice(1)) {
        ctx.lineTo(xy[0], xy[1]);
    }
    ctx.stroke();
    ctx.strokeStyle = '#7F7FFF';
    ctx.beginPath();
    ctx.moveTo(phase_trajectory_x2[0][0], phase_trajectory_x2[0][1]);
    for (let xy of phase_trajectory_x2.slice(1)) {
        ctx.lineTo(xy[0], xy[1]);
    }
    ctx.stroke();
}


export default (
    <SimVisApp style={{width:400, margin:'auto'}}>
        <Visualizer width={600} height={600} sim_name={'my_sim'} draw_func={draw_func} />
        <div>
            <PlayButton sim_name={'my_sim'} />
        </div>
        <div>
            <ParameterSlider
                label={'th1'}
                sim_name={'my_sim'}
                parameter={'th1'}
                min={0.0} max={Math.PI*2.0} step={0.0001}/>
            <ParameterSlider
                label={'th2'}
                sim_name={'my_sim'}
                parameter={'th2'}
                min={0.0} max={Math.PI*2.0} step={0.0001}/>
            <ParameterSlider
                label={'m1'}
                sim_name={'my_sim'}
                parameter={'m1'}
                min={0.001} max={1.0} step={0.001}/>
            <ParameterSlider
                label={'m2'}
                sim_name={'my_sim'}
                parameter={'m2'}
                min={0.001} max={1.0} step={0.001}/>
        </div>
        <Visualizer width={600} height={600} sim_name={'my_sim'} draw_func={draw_func2} />
    </SimVisApp>
);
