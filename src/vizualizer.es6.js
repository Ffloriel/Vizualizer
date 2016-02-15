/**
* Small library to simplify the creation of audio visualisation
* @class Vizualizer
*/
class Vizualizer{
    
    /**
     * Default constructor with null members
     */
    constructor() {
        /**
        * Audio Context
        * @type {AudioContext}
        */
        this.audioContext = null;
        /**
        * Audio Element
        * @type {Element}
        */
        this.audioElement = null;
        /**
        * Audio Source
        * @type {AudioSourceNode}
        */
        this.audioSource = null;
        /**
        * Audio Analyser
        * @type {AnalyserNode}
        */
        this.audioAnalyser = null;
        /**
        * Array of data of the audio
        * @type {Uint8Array}
        */
        this.dataArray = null;
        /**
        * Array of effects
        * @type {Array}
        */
        this.effects = null;
        /**
        * The ID value returned by the call to window.requestAnimationFrame()
        * @type {number}
        */
        this.requestId = null;
    }
    
    /* Constructors */
    
    /**
     * Create a new Vizualizer with the specified url of a media
     * @throws {Error} Web Audio not supported by the browser
     * @param {String}     mediaUrl   Url of the media
     * @param {number}     [bufferLength=1024] The length of the buffer
     * @return {Vizualizer} Return a new Vizualizer
     */
    static withMedia(mediaUrl, bufferLength = 1024) {
        let vizualizer = new Vizualizer();
        if (typeof AudioContext !== undefined) {
            vizualizer.audioContext = new AudioContext();
        } else if (typeof webkitAudioContext !== undefined) {
            vizualizer.audioContext = new webkitAudioContext();
        } else {
            throw new Error("AudioContext is not supported");
        }
        
        vizualizer.audioElement = new Audio();
        vizualizer.audioElement.crossOrigin = "anonymous";
        vizualizer.audioElement.src = mediaUrl;
        vizualizer.effects = [];
        vizualizer.initializeVisibilityEvent();
    }
    
    /**
     * Create a new Vizualizer with the specified audio element
     * @throws {Error} Web Audio not supported by the browser
     * @param   {Element}    element    Audio element <audio>
     * @param   {number}     [bufferLength=1024] The length of the buffer
     * @returns {Vizualizer} Return a new Vizualizer
     */
    static withElement(element, bufferLength = 1024) {
        let vizualizer = new Vizualizer();
        
        if (typeof AudioContext !== undefined) {
            vizualizer.audioContext = new AudioContext();
        } else if (typeof webkitAudioContext !== undefined) {
            vizualizer.audioContext = new webkitAudioContext();
        } else {
            throw new Error("AudioContext is not supported");
        }
        vizualizer.audioElement = element;
        vizualizer.audioElement.crossOrigin = "anonymous";
        vizualizer.audioSource = vizualizer.audioContext.createMediaElementSource(vizualizer.audioElement);
        vizualizer.audioAnalyser = vizualizer.audioContext.createAnalyser();
        vizualizer.audioSource.connect(vizualizer.audioAnalyser);
        vizualizer.audioSource.connect(vizualizer.audioContext.destination);
        vizualizer.dataArray = new Uint8Array(bufferLength);
        vizualizer.effects = [];
        vizualizer.initializeVisibilityEvent();
        
        return vizualizer;
    }
    
    /**
     * Create a new Vizualizer with the specified audio context and source
     * @param   {AudioContext}    context         Audio context
     * @param {AudioSourceNode} source Source
     * @param   {number}          [bufferLength=1024]      The length of the buffer
     * @returns {Vizualizer}      Return a new Vizualizer
     */
    static withContextSource(context, source, bufferLength = 1024) {
        let vizualizer = new Vizualizer();
        
        vizualizer.audioContext = context;
        vizualizer.audioSource = source;
        vizualizer.audioAnalyser = vizualizer.audioContext.createAnalyser();
        vizualizer.audioSource.connect(vizualizer.audioAnalyser);
        vizualizer.audioSource.connect(vizualizer.audioContext.destination);
        vizualizer.dataArray = new Uint8Array(bufferLength);
        vizualizer.effects = [];
        vizualizer.initializeVisibilityEvent();
        
        return vizualizer;
    }
    
    /**
     * Create a new Vizualizer with the specified array buffer
     * @throws {Error} Web Audio not supported by the browser
     * @param   {ArrayBuffer}    arrayBuffer    Array buffer
     * @param   {number}     [bufferLength=1024] The length of the buffer
     * @returns {Vizualizer} Return a new Vizualizer
     */
    static withArrayBuffer(arrayBuffer, bufferLength = 1024) {
        let vizualizer = new Vizualizer();
        if (typeof AudioContext !== undefined) {
            vizualizer.audioContext = new AudioContext();
        } else if (typeof webkitAudioContext !== undefined) {
            vizualizer.audioContext = new webkitAudioContext();
        } else {
            throw new Error("AudioContext is not supported");
        }
        
        vizualizer.audioAnalyser = vizualizer.audioContext.createAnalyser();
        vizualizer.audioContext.decodeAudioData(buffer => {
            vizualizer.audioSource = vizualizer.audioContext.createBufferSource();
            vizualizer.audioSource.connect(vizualizer.audioAnalyser);
            vizualizer.audioSource.connect(vizualizer.audioContext.destination);
            vizualizer.audioSource.buffer = buffer;
        });
        vizualizer.dataArray = new Uint8Array(bufferLength);
        vizualizer.effects = [];
        vizualizer.initializeVisibilityEvent();
        
        return vizualizer;
    }
    
    /**
     * Start the visualisation
     */
    start() {
        this.requestId = requestAnimationFrame(this.startRender.bind(this));
    }
    
    /**
     * Stop the visualisation
     */
    stop() {
        cancelAnimationFrame(this.requestId);
    }
    
    /**
     * Render every effect in the array effects
     */
    startRender() {
        var i = 0;
        this.audioAnalyser.getByteFrequencyData(this.dataArray);
        for (i; i < this.effects.length; i += 1) {
            this.effects[i].renderEffect(this.dataArray);
        }
        requestAnimationFrame(this.startRender.bind(this));
    }
    
    /**
     * Change the effect of the vizualizer
     * @param {EffectVizualizer} effectVizualizer Effect
     * @param {number} [i=0]   Index of the effect to change 
     */
    changeEffect(effectVizualizer, i = 0) {
        if (this.effects[i] !== undefined) {
            this.effects[i].hide();
            this.effects[i] = effectVizualizer;
            this.effects[i].show();
        }
    }
    
    /**
     * Add an effect at the end of the array
     * @param {EffectVizualizer} effect Effect to add
     */
    addEffect(effect) {
        this.effects.push(effect);
        this.effects[this.effects.length - 1].show();
    }
    
    /**
     * Remove the last effect added
     */
    popEffect() {
        this.effects[this.effects.length - 1].hide();
        this.effects.pop();
    }
    
    /**
     * Remove the effect specified by the index
     * @param {number} index Index of the element that should be remove from the effects array
     */
    removeEffect(index) {
        this.effects[index].hide();
        this.effects.splice(index, 1);
    }
    
    /**
     * Change the audio context
     * @param {AudioContext} context AudioContext
     */
    loadAudioContext(context) {
        this.audioContext = context;
        this.audioAnalyser = this.audioContext.createAnalyser();
        this.dataArray = new Uint8Array(this.dataArray.length);
        this.audioAnalyser.getByteFrequencyData(this.dataArray);
    }
    
    /**
     * Change the audio element
     * @param {Element} element Element
     */
    loadElement(element) {
        this.audioElement = element;
        this.audioSource = this.audioContext.createMediaElementSource(this.audioElement);
        this.audioSource.connect(this.audioAnalyser);
        this.audioSource.connect(this.audioContext.destination);
    }
    
    /**
     * Load the vizualizer with the specified array buffer
     * @param {ArrayBuffer} arraybuffer Array buffer to load
     */
    loadArrayBuffer(arraybuffer) {
        this.audioContext.decodeAudioData(buffer => {
            this.audioSource = this.audioContext.createBufferSource();
            this.audioSource.connect(this.audioAnalyser);
            this.audioSource.connect(this.audioContext.destination);
            this.audioSource.buffer = buffer;
        });
    }
    
    /**
     * Load the vizualizer with the specified data url
     * @param {string} dataUrl Url of the data
     */
    loadDataUrl(dataUrl) {
        if (this.audioElement === null || this.audioElement === undefined) {
            this.audioElement = new Audio();
            this.audioElement.crossOrigin = "anonymous";
        }
        this.audioElement.src = dataUrl;
    }
    
    /**
     * Initialize the visibilty change event to stop the visualisation when the page is not visible.
     */
    initializeVisibilityEvent() {
        let hidden, visibilityChange;
        if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support 
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (typeof document.mozHidden !== "undefined") {
            hidden = "mozHidden";
            visibilityChange = "mozvisibilitychange";
        } else if (typeof document.msHidden !== "undefined") {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        } else if (typeof document.webkitHidden !== "undefined") {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }

        if (typeof document[hidden] != "undefined") {
            document.addEventListener(visibilityChange,
                e => {
                    if (document[hidden]) {
                        this.stop();
                    } else {
                        this.start();
                    }
                }, false);
        }

    }
        
}