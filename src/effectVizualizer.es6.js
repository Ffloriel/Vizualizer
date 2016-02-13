/**
* Interface of an effect for the vizualizer
* @interface
*/
class EffectVizualizer{
    
    /**
    * Constructor
    * @throws {TypeError} Methods not implemented
    */
    constructor() {
        if (this.renderEffect === undefined) {
            throw TypeError("renderEffect(dataArray) must be implemented");
        }
        if (this.hide === undefined) {
            throw TypeError("hide() must be implemented");
        }
        if (this.show === undefined) {
            throw TypeError("show() must be implemented");
        }
    }
    
    /**
     * Render the effect
     * @abstract
     * @param {Uint8Array} dataArray Audio data provided by the vizualizer
     */
    renderEffect(dataArray) {}
    
    /**
     * Hide the effect
     * @abstract
     */
    hide(){}
    
    /**
     * Show the effect
     * @abstract
     */
    show(){}
    
}