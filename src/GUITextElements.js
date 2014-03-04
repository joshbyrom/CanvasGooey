var createGUITextELement = function(element, text, font, fill, stroke) {
    var TextComponent = function(text, font, fill, stroke) {
        this.text = text;
        this.font = font;
        this.fill = fill;
        this.stroke = stroke;

        this.scrollX = 0;
        this.scrollY = 0;

        this.offsetX = 0;
        this.offsetY = 0;
        this.maxWidth = -1;
        this.maxHeight = -1;
    };

    TextComponent.prototype.update = function() {

    };

    TextComponent.prototype.render = function(extra) {
        var context = extra.context;


    };

    var result = new TextComponent(text, font, fill, stroke);

    element.pubSub.on("Update", result.update);
    element.pubSub.on("Render", result.render);

    return result;
};