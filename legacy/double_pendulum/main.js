'use strict';

import DoublePendulumVisualizer from './double_pendulum_visualizer.js'
import DoublePendulum from './double_pendulum.js'
import $ from 'jquery'

window.onload = () => {
    function set_range(dp) {
        var th1 = dp.th1 >  Math.PI ? (dp.th1 + Math.PI) % (Math.PI*2) - Math.PI:
                  dp.th1 < -Math.PI ? (dp.th1 - Math.PI) % (Math.PI*2) + Math.PI:
                  dp.th1;
        var th2 = dp.th2 >  Math.PI ? (dp.th2 + Math.PI) % (Math.PI*2) - Math.PI:
                  dp.th2 < -Math.PI ? (dp.th2 - Math.PI) % (Math.PI*2) + Math.PI:
                  dp.th2;
        if (!$('#th1>input[type=range]').is(':focus')) {
            $('#th1>input[type=range]').val((th1 / Math.PI));
        }
        if (!$('#th2>input[type=range]').is(':focus')) {
            $('#th2>input[type=range]').val((th2 / Math.PI));
        }
        if (!$('#th1>input[type=number]').is(':focus')) {
            $('#th1>input[type=number]').val((th1 / Math.PI));
        }
        if (!$('#th2>input[type=number]').is(':focus')) {
            $('#th2>input[type=number]').val((th2 / Math.PI));
        }
    }

    var dp = new DoublePendulum(Math.PI*0.4, Math.PI*0.9, 0, 0);
    var visualizer = new DoublePendulumVisualizer(dp, 'simCanvas');
    set_range(dp);
    dp.addUpdateListener(set_range);

    $('#playPauseBtn').on('click', function() {
        if (dp.running) {
            dp.stop();
            $('#playIcon').show();
            $('#pauseIcon').hide();
            $('#th1>input[type=range]').prop('disabled', false);
            $('#th2>input[type=range]').prop('disabled', false);
            $('#th1>input[type=number]').prop('disabled', false);
            $('#th2>input[type=number]').prop('disabled', false);
            set_range(dp);
        } else {
            dp.run();
            $('#playIcon').hide();
            $('#pauseIcon').show();
            $('#th1>input[type=range]').prop('disabled', true);
            $('#th2>input[type=range]').prop('disabled', true);
            $('#th1>input[type=number]').prop('disabled', true);
            $('#th2>input[type=number]').prop('disabled', true);
        }
    });

    $('#trajectorySwitch').on('change', function() {
        visualizer.set_trajectory($(this).prop('checked'));
    });

    $('#th1>input[type=range]').on('input change', function(){
        var th = $(this).val() * Math.PI;
        dp.set_state(th, dp.th2, 0, 0);
    });

    $('#th2>input[type=range]').on('input change', function(){
        var th = $(this).val() * Math.PI;
        dp.set_state(dp.th1, th, 0, 0);
    });

    $('#th1>input[type=number]').on('input', function () {
        var th = $(this).val() * Math.PI;
        dp.set_state(th, dp.th2, 0, 0);
    });

    $('#th2>input[type=number]').on('input', function () {
        var th = $(this).val() * Math.PI;
        dp.set_state(dp.th1, th, 0, 0);
    });
}
