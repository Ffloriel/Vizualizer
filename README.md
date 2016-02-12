# Vizualizer.js

Vizualizer.js is a small javascript library to simplify the creation of audio visualisation in the web browser. It uses the Web Audio API.

## Documentation

Documentation available [here](#).

## Demo

You can found a demo of the vizualizer [here](#).

## Usage

```html
<audio src="audio.mp3" id="audio" controls></audio>
<script src="vizualizer.min.js"></script>
```
### Create a vizualizer
```javascript
//With Element
var el = document.getElementById("audio");
var vizualizerElement = Vizualizer.withElement(el, 1024);

//With an url to the media (an audio element is created)
var url = "audio.mp3";
var vizualizerMedia = Vizualizer.withMedia(url, 1024);
```
TODO: ArrayBuffer & context

### Add, remove and change an effect

### Start and Stop the visualisation
```javascript
var vizualizer = vizualizer = Vizualizer.withElement(el, 1024);
vizualizer.start();
vizualizer.stop();
```

### Create an effect

To create an effect, you have to create a class extending *EffectVizualizer* and implement the 3 following functions:
* hide()
* show()
* renderEffect(dataArray) called each frame

Example in ES6 with d3.js :
```javascript
class CirclesEffect extends EffectVizualizer {
    constructor(nbCircle, radius, acceleration) {
        super();
        this.nbCircle = nbCircle;
        this.radius = radius;
        this.acceleration = acceleration;
        this.color = "#fff";
        this.opacity = 0.7;
        this.fill = "none";
    }
    
    create(svg, width, height, dataArray) {
        let i = 0;
        this.width = width;
        this.height = height;
        this.circles = [];
        
        for (i; i < this.nbCircle; i += 1) {
            this.circles[i] = svg.append("circle")
                .data(dataArray)
                .attr("cx", width / 2)
                .attr("cy", height / 2)
                .attr("stroke-width", 2)
                .attr("stroke", this.color)
                .attr("fill", this.fill)
                .attr("opacity", this.opacity);
        }
    }
    
    renderEffect(dataArray) {
        let r;
        let i = 0;
        for (i; i < this.nbCircle; i += 1) {
            r = this.radius + d3.mean(dataArray) * (this.acceleration + i * 0.1) * this.height / 255;
            this.circles[i].data(dataArray)
                .attr("r", r);
        }
    }
    
    hide() {
        let i = 0;
        for (i; i < this.nbCircle; i += 1) {
            this.circles[i].attr("opacity", 0);
        }
    }
    
    show() {
        let i = 0;
        for (i; i < this.nbCircle; i += 1) {
            this.circles[i].attr("opacity", this.opacity);
        }
    }

}
```