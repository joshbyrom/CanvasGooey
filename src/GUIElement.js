var GUIElement = function(parent, pubSub, name) {
    this.name = name;

    this.active = true;
    this.visible = true;

    // all variables prefixed with *last* are monitoring variables
    // and should not be changed manually
    this.lastActive = this.active;
    this.lastVisible = this.visible;

    this.selected = false;
    this.mouseOver = false;

    this.lastSelected = this.selected;
    this.lastMouseOver = this.mouseOver;

    this.x = 0;
    this.y = 0;

    this.lastX = this.x;
    this.lastY = this.y;

    this.width = 0;
    this.height = 0;

    this.lastWidth = this.width;
    this.lastHeight = this.height;

    this.pubSub = pubSub;

    this.parent = parent;
    this.children = [];
};

GUIElement.prototype.render = function() {
    if(!active) return;

    if(!visible) {
        // TODO render grayscale?
        return;
    }

    this.pubSub.emit("Render");
};

GUIElement.prototype.update = function() {
    if(!active) return;

    this.monitorState();
    this.pubSub.emit("Update");
};

GUIElement.prototype.addChild = function(child) {
    var index = this.children.indexOf(child);

    if(index < 0) {
        if(child.parent != this) {
            child.parent = this;
            child.pubSub.emit("ParentAdded", {parent : this});
        }

        this.children.push(child);
        this.pubSub.emit("ChildAdded", {child : child});
        return true;
    }

    return false;
};

GUIElement.prototype.removeChild = function(child) {
    var index = this.children.indexOf(child);
    if(index >= 0) {
        if(child.parent == this) {
            child.parent = undefined;
            child.pubSub.emit("ParentRemoved", {parent : this});
        }

        this.children.splice(index, 1);
        this.pubSub.emit("ChildRemoved", {child:child});
        return true;
    }

    return false;
};

GUIElement.prototype.hasChild = function(child) {
    return this.children.indexOf(child) >= 0;
};

GUIElement.prototype.getChildByName = function(name) {
    for(var i = 0; i < this.children.length; ++i) {
        if(this.children[i].name === name) {
            return this.children[i];
        }
    }

    return undefined;
};

GUIElement.property.monitorState = function() {

};

var createGUIElement = function() {

};