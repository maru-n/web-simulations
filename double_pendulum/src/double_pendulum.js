import DynamicalSystem from './dynamical_system.js'

const sin = Math.sin;
const cos = Math.cos;


export default class DoublePendulum extends DynamicalSystem {
    constructor(th1, th2, vth1, vth2) {
        super();
        this.set_state(th1, th2, vth1, vth2);
        this.dt = 0.001;
        this.l1 = 0.5;
        this.l2 = 0.5;
        this.m1 = 0.1;
        this.m2 = 0.1;
        this.g = 9.8;
    }

    set_state(th1, th2, vth1, vth2, t=0) {
        this.t = t;
        this.th1 = th1;
        this.th2 = th2;
        this.vth1 = vth1;
        this.vth2 = vth2;
        super.update_state();
    }

    update() {
        for (var i = 0; i < 8; i++) {
        this.t += this.dt;

        var k1_1 = this.dt * this.th1_dot(this.th1, this.th2, this.vth1, this.vth2)
        var k1_2 = this.dt * this.th2_dot(this.th1, this.th2, this.vth1, this.vth2)
        var k1_3 = this.dt * this.vth1_dot(this.th1, this.th2, this.vth1, this.vth2)
        var k1_4 = this.dt * this.vth2_dot(this.th1, this.th2, this.vth1, this.vth2)

        var k2_1 = this.dt * this.th1_dot(this.th1+k1_1/2.0, this.th2+k1_2/2.0, this.vth1+k1_3/2.0, this.vth2+k1_4/2.0)
        var k2_2 = this.dt * this.th2_dot(this.th1+k1_1/2.0, this.th2+k1_2/2.0, this.vth1+k1_3/2.0, this.vth2+k1_4/2.0)
        var k2_3 = this.dt * this.vth1_dot(this.th1+k1_1/2.0, this.th2+k1_2/2.0, this.vth1+k1_3/2.0, this.vth2+k1_4/2.0)
        var k2_4 = this.dt * this.vth2_dot(this.th1+k1_1/2.0, this.th2+k1_2/2.0, this.vth1+k1_3/2.0, this.vth2+k1_4/2.0)

        var k3_1 = this.dt * this.th1_dot(this.th1+k2_1/2.0, this.th2+k2_2/2.0, this.vth1+k2_3/2.0, this.vth2+k2_4/2.0)
        var k3_2 = this.dt * this.th2_dot(this.th1+k2_1/2.0, this.th2+k2_2/2.0, this.vth1+k2_3/2.0, this.vth2+k2_4/2.0)
        var k3_3 = this.dt * this.vth1_dot(this.th1+k2_1/2.0, this.th2+k2_2/2.0, this.vth1+k2_3/2.0, this.vth2+k2_4/2.0)
        var k3_4 = this.dt * this.vth2_dot(this.th1+k2_1/2.0, this.th2+k2_2/2.0, this.vth1+k2_3/2.0, this.vth2+k2_4/2.0)

        var k4_1 = this.dt * this.th1_dot(this.th1+k3_1, this.th2+k3_2, this.vth1+k3_3, this.vth2+k3_4)
        var k4_2 = this.dt * this.th2_dot(this.th1+k3_1, this.th2+k3_2, this.vth1+k3_3, this.vth2+k3_4)
        var k4_3 = this.dt * this.vth1_dot(this.th1+k3_1, this.th2+k3_2, this.vth1+k3_3, this.vth2+k3_4)
        var k4_4 = this.dt * this.vth2_dot(this.th1+k3_1, this.th2+k3_2, this.vth1+k3_3, this.vth2+k3_4)

        this.th1 +=   (k1_1 + 2.0*k2_1 + 2.0*k3_1 + k4_1) / 6.0;
        this.th2 +=   (k1_2 + 2.0*k2_2 + 2.0*k3_2 + k4_2) / 6.0;
        this.vth1 +=  (k1_3 + 2.0*k2_3 + 2.0*k3_3 + k4_3) / 6.0;
        this.vth2 +=  (k1_4 + 2.0*k2_4 + 2.0*k3_4 + k4_4) / 6.0;

        super.update_state();
        }
    }

    th1_dot(th1, th2, vth1, vth2) {
        return vth1
    }

    th2_dot(th1, th2, vth1, vth2) {
        return vth2
    }

    vth1_dot(th1, th2, vth1, vth2) {
        var [m1, m2, l1, l2, g] = [this.m1, this.m2, this.l1, this.l2, this.g];
        var a1 = (m1+m2) * l1;
        var b1 = m2 * l2 * cos(th1-th2);
        var c1 = m2 * l2 * vth2 * vth2 * sin(th1-th2) + (m1+m2) * g * sin(th1);
        var a2 = l1 * l2 * cos(th1-th2);
        var b2 = l2 * l2;
        var c2 = -l1 * l2 * vth1 * vth1 * sin(th1-th2) + g * l2 * sin(th2);
        return (b1*c2 - b2*c1) / (a1*b2 - a2*b1)
    }


    vth2_dot(th1, th2, vth1, vth2) {
        var [m1, m2, l1, l2, g] = [this.m1, this.m2, this.l1, this.l2, this.g];
        var a1 = (m1+m2) * l1;
        var b1 = m2 * l2 * cos(th1-th2);
        var c1 = m2 * l2 * vth2 * vth2 * sin(th1-th2) + (m1+m2) * g * sin(th1);
        var a2 = l1 * l2 * cos(th1-th2);
        var b2 = l2 * l2;
        var c2 = -l1 * l2 * vth1 * vth1 * sin(th1-th2) + g * l2 * sin(th2);
        return (a1*c2 - a2*c1) / (a2*b1 - a1*b2)
    }

    get_xy() {
        var x1 =  this.l1*sin(this.th1);
        var y1 = -this.l1*cos(this.th1);
        var x2 = x1 + this.l2*sin(this.th2);
        var y2 = y1 - this.l2*cos(this.th2);
        return [x1, y1, x2, y2]
    }

    get_time() {
        return this.t;
    }

    get_energy() {
        var [th1, th2, vth1, vth2] = [this.th1, this.th2, this.vth1, this.vth2];
        var [m1, m2, l1, l2, g] = [this.m1, this.m2, this.l1, this.l2, this.g];
        var ke1 = m1 * l1*l1 * vth1**2 / 2.0;
        var ke2 = m2 * (l1**2 * vth1**2 + l2**2 * vth2**2 + 2*l1*l2*vth1*vth2*cos(th1-th2)) / 2.0;
        var pe1 = -g * m1 * l1*cos(th1);
        var pe2 = -g * m2 * (l1*cos(th1) + l2*cos(th2));
        var e = ke1 + ke2 + pe1 + pe2;
        return e
    }
}
