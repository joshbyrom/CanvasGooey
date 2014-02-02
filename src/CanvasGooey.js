var GUIPubSub = function() {
	this.listeners = new Object();
}

GUIPubSub.prototype.on = function(string, callback, count) {
	if(this.listeners.hasOwnProperty(string)) {
		this.listeners[string].push({fun:callback, count:count});
	}

	this.listeners[string] = [];
	this.listeners[string].push({fun:callback, count:count});
};

GUIPubSub.prototype.remove = function(string, callback) {
	if(this.listeners.hasOwnProperty(string)) {
		var elemToRemove = undefined;

		this.listeners[string].map(function(elem) {
			if(elem.fun === callback) {
				elemToRemove = this.listeners[string];
			}
		}.bind(this));

		if(elemToRemove) {
			this.listeners[string].splice(this.listeners[string].indexOf(elemToRemove), 1);
		}
	}
};

var GUIElement = function(canvas) {
	this.x = 0;
	this.y = 0;

	this.width = 0;
	this.height = 0;

	this.canvas = canvas;
};

GUIElement.prototype.render = function() {

};

GUIElement.prototype.update = function() {
	
};

var CanvasGooey = function(canvasId) {
	this.canvasElement = document.getElementById(canvasName);
	this.elements = [];
};

CanvasGooey.prototype.createElement = function() {
	
};