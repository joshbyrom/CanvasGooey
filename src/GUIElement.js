var GUIElement = function(scene, parent, pubSub, name) {
    this.scene = scene;
    this.name = name;

    this.active = true;
    this.visible = true;

    // all variables prefixed with *last* are monitoring variables
    // and should not be changed manually
    this.lastActive = this.active;
    this.lastVisible = this.visible;

    this.selected = false;
    this.mouseOver = false;
    this.mouseOverTime = 0;
    this.mouseOverElapsedTime = 0;

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

GUIElement.prototype.render = function(context) {
    if(!this.active) return;

    context.save();

    if(!this.visible) {
        this.pubSub.emit("RenderDisabled");
    } else {
      this.pubSub.emit("Render", {context:context});
    }

    for(var i = 0; i < this.children.length; ++i) {
        this.children[i].render(context);
    }

    context.restore();
};

GUIElement.prototype.update = function(elapsed) {
    this.monitorState();

    if(!this.active) {}
    else {
        this.pubSub.emit("Update", {elapsed:elapsed});
        for(var i = 0; i < this.children.length; ++i) {
            this.children[i].update(elapsed);
        }
    }
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

GUIElement.prototype.addChildBefore = function(child, before) {
    var beforeIndex = this.children.indexOf(before);
    var index = this.children.indexOf(child);

    if(index < 0 && beforeIndex >= 0) {
        this.children.splice(beforeIndex, 0, child);
        this.pubSub.emit("ChildAdded", {child:child});
        return true;
    }

    return false;
};

GUIElement.prototype.addChildAfter = function(child, after) {
    var afterIndex = this.children.indexOf(after);
    var index = this.children.indexOf(child);

    if(index < 0 && afterIndex >= 0) {
        if(afterIndex + 1 > this.children.length) {
            this.children.push(child);
        } else {
            this.children.splice(afterIndex+1, 0, child);
        }

        this.pubSub.emit("ChildAdded", {child:child});
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

GUIElement.prototype.monitorMovement = function () {
    if (this.x != this.lastX || this.y != this.lastY) {
        this.pubSub.emit("Moving", {lastX: this.lastX, lastY: this.lastY, x: this.x, y: this.y});

        this.lastX = this.x;
        this.lastY = this.y;
    }
};

GUIElement.prototype.monitorSize = function () {
    if (this.width != this.lastWidth || this.height != this.lastHeight) {
        this.pubSub.emit("SizeChanged",
            {   // emit arguments
                lastWidth: this.lastWidth,
                lastHeight: this.lastHeight,
                width: this.width,
                height: this.height
            }
        );
    }
};

GUIElement.prototype.monitorSelected = function () {
    if (this.lastSelected === false && this.selected === true) {
        this.pubSub.emit("Selected");
        this.lastSelected = this.selected;
    } else if (this.lastSelected === true && this.selected === false) {
        this.pubSub.emit("Deselected");
        this.lastSelected = this.selected;
    }
};

GUIElement.prototype.monitorMouseOver = function () {
    if (this.mouseOver === true && this.lastMouseOver === true) {
        this.mouseOverElapsedTime = Date.now() - this.mouseOverTime;
        this.pubSub.emit("MouseStay", {time: this.mouseOverTime, elapsed: this.mouseOverElapsedTime});
    } else if (this.mouseOver === true && this.lastMouseOver === false) {
        this.mouseOverTime = Date.now();
        this.pubSub.emit("MouseEnter", {time: this.mouseOverTime});
        this.lastMouseOver = this.mouseOver;
    } else if (this.mouseOver === false && this.lastMouseOver === true) {
        this.pubSub.emit("MouseExit");

        this.lastMouseOver = this.mouseOver;
        this.mouseOverTime = 0;
        this.mouseOverElapsedTime = 0;
    }
};

GUIElement.prototype.monitorVisibility = function () {
    if (this.visible != this.lastVisible) {
        if (this.visible) {
            this.pubSub.emit("Revealed");
        } else {
            this.pubSub.emit("Hidden");
        }

        this.lastVisible = this.visible;
    }
};

GUIElement.prototype.monitorActivity = function () {
    if (this.active != this.lastActive) {
        if (this.active) {
            this.pubSub.emit("Enabled");
        } else {
            this.pubSub.emit("Disabled");
        }

        this.lastActive = this.active;
    }
};

GUIElement.prototype.monitorState = function() {
    this.monitorMovement();
    this.monitorSize();
    this.monitorSelected();
    this.monitorMouseOver();
    this.monitorActivity();
    this.monitorVisibility();
};