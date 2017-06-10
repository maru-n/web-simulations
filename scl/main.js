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
            $('#stepBtn').prop('disabled', false);
        } else {
            scl.run();
            $('#playIcon').hide();
            $('#pauseIcon').show();
            $('#stepBtn').prop('disabled', true);
        }
    });

    $('#stepBtn').on('click', function() {
        scl.update();
    });

    $('#production_prob>input[type=range]').on('input change', function(){
        var p = $(this).val();
        scl.production_prob = p;
        console.log('production_prob:'+p);
    });
    $('#production_prob>input[type=number]').on('input', function () {
        var p = $(this).val();
        scl.production_prob = p;
    });

    $('#chain_initiate_prob>input[type=range]').on('input change', function(){
        var p = $(this).val();
        scl.chain_initiate_prob = p;
        console.log('chain_initiate_prob:'+p);
    });
    $('#chain_initiate_prob>input[type=number]').on('input', function () {
        var p = $(this).val();
        scl.chain_initiate_prob = p;
    });

    $('#chain_extend_prob>input[type=range]').on('input change', function(){
        var p = $(this).val();
        scl.chain_extend_prob = p;
        console.log('chain_extend_prob:'+p);
    });
    $('#chain_extend_prob>input[type=number]').on('input', function () {
        var p = $(this).val();
        scl.chain_extend_prob = p;
    });

    $('#chain_splice_prob>input[type=range]').on('input change', function(){
        var p = $(this).val();
        scl.chain_splice_prob = p;
        console.log('chain_splice_prob:'+p);
    });
    $('#chain_splice_prob>input[type=number]').on('input', function () {
        var p = $(this).val();
        scl.chain_splice_prob = p;
    });

    $('#absorption_prob>input[type=range]').on('input change', function(){
        var p = $(this).val();
        scl.absorption_prob = p;
        console.log('absorption_prob:'+p);
    });
    $('#absorption_prob>input[type=number]').on('input', function () {
        var p = $(this).val();
        scl.absorption_prob = p;
    });

    $('#emission_prob>input[type=range]').on('input change', function(){
        var p = $(this).val();
        scl.emission_prob = p;
        console.log('emission_prob:'+p);
    });
    $('#emission_prob>input[type=number]').on('input', function () {
        var p = $(this).val();
        scl.emission_prob = p;
    });
}
