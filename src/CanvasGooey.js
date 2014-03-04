var CanvasGooey = function(canvas, targetFPS) {
    this.canvasID = canvas;
    this.canvasElement = document.getElementById(this.canvasID);

    this.canvasElement.onmousemove = this.onMouseMove.bind(this);

    this.context = this.canvasElement.getContext("2d");
    this.pubSub = new GUIPubSub();

    this.root = new GUIElement(undefined, undefined, new GUIPubSub(), "root");
    this.targetFPS = targetFPS || 15;
    this.lastUpdateTime = -1;

    this.active = false;
};

CanvasGooey.prototype.onMouseMove = function(e) {
    var loc = this.windowToCanvas(e.clientX, e.clientY);

};

CanvasGooey.prototype.windowToCanvas = function(x, y) {
    var boundingBox = this.canvasElement.getBoundingClientRect();
    return {
        x : (x - boundingBox.left) * (this.canvasElement.width / boundingBox.width),
        y : (y - boundingBox.top) * (this.canvasElement.height / boundingBox.height)
    };
};

CanvasGooey.prototype.start = function(process, callback, scope) {
    var gui = this;

    this.active = true;
    this.pubSub.emit("Started");

    setTimeout(function loop() {
        gui.update();
        gui.render();

        process.apply(scope || this);

        if(gui.active) {
            setTimeout(loop.bind(scope || this), this.targetFPS);
        } else {
            callback.apply(scope || this);
        }
    }.bind(scope || this), this.targetFPS);
};

CanvasGooey.prototype.stop = function() {
    this.active = false;
    this.pubSub.emit("Stopped");
};

CanvasGooey.prototype.render = function() {
    this.root.render(this.context);
    this.pubSub.emit("Render", {context:this.context});
};

CanvasGooey.prototype.update = function() {
    var elapsed = Date.now() - this.lastUpdateTime;
    if(elapsed < this.targetFPS) {
        this.pubSub.emit("Idle", {elapsed : elapsed});
    }

    this.root.update(elapsed);
    this.pubSub.emit("Update", {elapsed : elapsed});

    this.lastUpdateTime = Date.now();
};

CanvasGooey.prototype.createElement = function(parent, name) {
    var result = new GUIElement(this.root, parent, new GUIPubSub(), name);
    var realParent = parent || this.root;

    realParent.addChild(result);
    return result;
};