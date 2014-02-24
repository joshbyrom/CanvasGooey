var GUIPubSub = function() {
    this.listeners = {};
}

GUIPubSub.prototype.on = function(string, callback, count) {
    if(this.listeners.hasOwnProperty(string)) {
        this.listeners[string].push({fun:callback, count:count});
    }

    this.listeners[string] = [];
    this.listeners[string].push({fun:callback, count:count});
};

GUIPubSub.prototype.emit = function(string, extra) {
    var emitter = this;

    if(this.listeners.hasOwnProperty(string)) {
        this.listeners[string].forEach(function(element, index, array) {
           if(element.count === undefined || element.count > 0) {
               element.fun(extra || {});

               if(element.count != undefined) {
                   element.count = element.count - 1;
               }
           }
        });
    }
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