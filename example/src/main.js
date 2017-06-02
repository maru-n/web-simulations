'use strict';

import {Fireworks, FireworksVisualizer} from './example.js'
import $ from 'jquery'

window.onload = () => {
    var system = new Fireworks();
    var visualizer = new FireworksVisualizer(system, 'simCanvas');

    $('#playPauseBtn').on('click', function() {
        if (system.running) {
            system.stop();
            $('#playIcon').show();
            $('#pauseIcon').hide();
        } else {
            system.run();
            $('#playIcon').hide();
            $('#pauseIcon').show();
        }
    });
}
