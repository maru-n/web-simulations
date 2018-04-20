import './components.css'
import React, {Component} from 'react';
import PropTypes from 'prop-types'
import SimVisJs from './SimVisJs.js'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import FlatButton from 'material-ui/FlatButton';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import SkipNext from 'material-ui/svg-icons/av/skip-next';
import Pause from 'material-ui/svg-icons/av/pause';
import Replay from 'material-ui/svg-icons/av/replay';
import Slider from 'material-ui/Slider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();


/*
 * SimVisApp
 * top level component of SimVisJs Application
 */
export class SimVisApp extends Component {
    render() {
        return (
            <MuiThemeProvider><div className={'SimVisApp'} style={this.props.style}>{this.props.children}</div></MuiThemeProvider>
        )
    }
}

/*
 * Visualizer
 * canvas component to visualize simulation
 */
export class Visualizer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            canvas_width: '100%',
            canvas_height: '100%',
        }
        this.handleClick = this.handleClick.bind(this)
        this.handleDbClick = this.handleDbClick.bind(this)
        this.handleMouseMove = this.handleMouseMove.bind(this)
    }
    componentDidMount() {
        const {canvas} = this.refs;
        let l = this.props.draw_func.bind(null, canvas)
        l(SimVisJs.get_sim(this.props.sim_name))
        SimVisJs.addUpdateListener(this.props.sim_name, l)
        this.setCanvasSize()
        canvas.addEventListener('fullscreenchange', this.handleFullscreenChange.bind(this));
        canvas.addEventListener('mozfullscreenchange', this.handleFullscreenChange.bind(this));
        canvas.addEventListener('webkitfullscreenchange', this.handleFullscreenChange.bind(this));
    }
    componentWillUnmount() {
        const {canvas} = this.refs;
        canvas.removeEventListener('fullscreenchange', this.handleFullscreenChange);
        canvas.removeEventListener('mozfullscreenchange', this.handleFullscreenChange);
        canvas.removeEventListener('webkitfullscreenchange', this.handleFullscreenChange);
    }
    setCanvasSize() {
        const is_fullscreen = (
            (document.webkitFullscreenElement && document.webkitFullscreenElement !== null) ||
            (document.mozFullScreenElement && document.mozFullScreenElement !== null) ||
            (document.msFullscreenElement && document.msFullscreenElement !== null) ||
            (document.fullScreenElement && document.fullScreenElement !== null) )
        
        if (is_fullscreen) {
            const canvas_asp = this.props.width / this.props.height
            const screen_asp = window.screen.width / window.screen.height
            if (canvas_asp > screen_asp) {
                this.setState({
                    canvas_height: 'auto',
                })
            } else {
                this.setState({
                    canvas_width: 'auto',
                })
            }
        } else {
            this.setState({
                canvas_width: '100%',
                canvas_height: '100%',
            })
        }
    }
    handleFullscreenChange(e) {
        this.setCanvasSize()
    }
    handleDbClick() {
        const elm = this.refs.canvas
        if (elm.requestFullscreen) {
            elm.requestFullscreen();
        } else if (elm.mozRequestFullScreen) {
            elm.mozRequestFullScreen();
        } else if (elm.webkitRequestFullScreen) {
            elm.webkitRequestFullScreen();
        }
    }
    handleClick(event) {
        if (this.props.onClick) {
            const canvas = this.refs.canvas
            const rect = canvas.getBoundingClientRect()
            this.props.onClick(canvas, SimVisJs.get_sim(this.props.sim_name),
                event.clientX - rect.left, event.clientY - rect.top)
            SimVisJs.refresh(this.props.sim_name)
        }
    }
    handleMouseMove(event) {
        if (this.props.onMouseMove) {
            const canvas = this.refs.canvas
            const rect = canvas.getBoundingClientRect()
            this.props.onMouseMove(canvas, SimVisJs.get_sim(this.props.sim_name),
                event.clientX - rect.left, event.clientY - rect.top)
            SimVisJs.refresh(this.props.sim_name)
        }
    }
    render() {
        let wrapper_style = {}
        if (this.props.display_scale === 'auto') {
            wrapper_style.width = '100%'
            wrapper_style.height = 'auto'
        } else if (this.props.display_scale === 'fix') {
            wrapper_style.width = this.props.width
            wrapper_style.height = this.props.height
        }
        return (
            <div className={'Visualizer'} style={wrapper_style}>
                    <canvas ref="canvas"
                        width={this.props.width}
                        height={this.props.height}
                        onDoubleClick={this.props.switch_fullscreen ? this.handleDbClick : null}
                        onClick = {this.handleClick}
                        onMouseMove = {this.handleMouseMove}
                        style = {{
                            width:this.state.canvas_width,
                            height:this.state.canvas_height,
                        }}/>
            </div>
        )
    }
}

Visualizer.propTypes = {
    width: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string]).isRequired,
    height: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string]).isRequired,
    display_scale: PropTypes.string,
    sim_name: PropTypes.string.isRequired,
    draw_func: PropTypes.func.isRequired,
};
Visualizer.defaultProps = {
    display_scale: 'auto',
}


/*
 * PlayButton / InitButton
 * buttons to start/stop/init/step of simulation
 */
let button_style = {
    margin: "5px 5px 0px 0px"
}
export class PlayButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_pause: SimVisJs.is_running(this.props.sim_name)
        }
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        if (this.state.is_pause) {
            SimVisJs.stop(this.props.sim_name)
        } else {
            SimVisJs.start(this.props.sim_name)
        }
        this.setState({
            is_pause: !this.state.is_pause
        })
    }
    render() {
        return (<FlatButton backgroundColor="#dddddd"
                icon={this.state.is_pause ? <Pause /> : <PlayArrow />}
                onClick={this.handleClick}
                style={button_style} />)
    }
}
PlayButton.propTypes = {
    sim_name: PropTypes.string.isRequired,
};


export class InitButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        SimVisJs.init(this.props.sim_name)
    }
    render() {
        return (<FlatButton backgroundColor="#dddddd"
                icon={<Replay />}
                onClick={this.handleClick}
                style={button_style} />)
    }
}
InitButton.propTypes = {
    sim_name: PropTypes.string.isRequired,
};

export class StepButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick() {
        SimVisJs.update(this.props.sim_name)
    }
    render() {
        return (<FlatButton backgroundColor="#dddddd"
                icon={<SkipNext />}
                onClick={this.handleClick}
                style={button_style} />)
    }
}
StepButton.propTypes = {
    sim_name: PropTypes.string.isRequired,
};


/*
 * ParameterSlider
 * slider to controll parameter of simulation
 */
export class ParameterSlider extends React.Component {
    style = {
        margin: "10px 10px 0px 0px"
    }

    constructor(props) {
        super(props)
        let callback = ((sim) => {
            const value = sim[this.props.parameter]
            this.setState({value: value});
        })
        SimVisJs.addUpdateListener(this.props.sim_name, callback)
        this.state = {
            value: SimVisJs.get_sim(this.props.sim_name)[props.parameter]
        }
    }
    
    handleSlider = (event, value) => {
        SimVisJs.set_parameter(this.props.sim_name, this.props.parameter, value)
    };
    
    render() {
        this.style.width = '100%'
        return (
            <div style={this.style}>
                <div>{this.props.label} : {this.state.value}</div>
                <Slider
                    min={this.props.min}
                    max={this.props.max}
                    step={this.props.step}
                    value={this.state.value}
                    onChange={this.handleSlider}
                    style={{width: '100%', position:'relative'}}
                    sliderStyle={{margin:0}}
                    />
                <div style={{clear:'both'}} />
            </div>
        );
    }
}

ParameterSlider.defaultProps = {
    min: 0,
    max: 1,
    step: 0.01
}

ParameterSlider.propTypes = {
    sim_name: PropTypes.string.isRequired,
    parameter: PropTypes.string.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
}


/*
 * ParameterSelecter
 * component to select parameter from a set
 */
export class ParameterSelecter extends Component {
    style = {
        margin: "0px 10px 0px 0px"
    }

    constructor(props) {
        super(props)
        let callback = ((sim) => {
            const value = sim[this.props.parameter]
            this.setState({value: value});
        })
        SimVisJs.addUpdateListener(this.props.sim_name, callback)
        this.state = {
            value: SimVisJs.get_parameter(this.props.sim_name, props.parameter)
        }
    }
    
    handleChange = (event, index, value) => {
        SimVisJs.set_parameter(this.props.sim_name, this.props.parameter, value)
    }
    
    render() {
        let choices = this.props.choices
        let items
        if (Array.isArray(choices)) {
            items = choices.map(function(c) {
                return <MenuItem key={c} value={c} primaryText={c} />
            });
        } else {
            items = Object.keys(choices).map(function(k) {
                return <MenuItem key={k} value={choices[k]} primaryText={k} />
            });
        }
        
        return (
            <SelectField
                floatingLabelText={this.props.label}
                value={this.state.value}
                onChange={this.handleChange}
                style={this.style}
                >
                {items}
            </SelectField>
        );
    }
}

ParameterSelecter.propTypes = {
    sim_name: PropTypes.string.isRequired,
    parameter: PropTypes.string.isRequired,
    choices: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object]).isRequired,
}
