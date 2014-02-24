var GUIElement = function(parent, pubSub) {
    this.x = 0;
    this.y = 0;

    this.width = 0;
    this.height = 0;
    this.pubSub = pubSub;

    this.parent = parent;
    this.children = [];
};

GUIElement.prototype.render = function() {

    this.pubSub.emit("Render");
};

GUIElement.prototype.update = function() {

    this.pubSub.emit("Update");
};

GUIElement.prototype.addChild = function(child) {

};

GUIElement.prototype.removeChild = function(child) {
    var index = this.children.indexOf(child);
    if(index >= 0) {
        if(child.parent == this) {
            child.parent = undefined;
        }

        this.children.splice(index, 1);
        this.pubSub.emit("ChildRemoved", {child:child});
    }

    return false;
};

GUIElement.prototype.hasChild = function(child) {
    return this.children.indexOf(child) >= 0;
};

var createGUIElement = function() {

};