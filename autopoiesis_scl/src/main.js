'use strict';

import SCL from './scl.js'
import SCLVisualizer from './scl_visualizer.js'
import $ from 'jquery'

window.onload = () => {
    var scl = new SCL();
    var visualizer = new SCLVisualizer(scl, 'simCanvas');

    $('#playPauseBtn').on('click', function() {
        if (scl.running) {
            scl.stop();
            $('#playIcon').show();
            $('#pauseIcon').hide();
        } else {
            scl.run();
            $('#playIcon').hide();
            $('#pauseIcon').show();
        }
    });
}
