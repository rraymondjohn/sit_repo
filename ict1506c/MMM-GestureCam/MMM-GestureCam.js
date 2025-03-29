Module.register("MMM-GestureCam", {
    defaults: {
        width: 320,
        height: 240,
        streamUrl: "http://localhost:5000/video_feed"
    },

    start: function() {
        console.log("MMM-GestureCam started");
    },

    getDom: function() {
        var wrapper = document.createElement("div");
        var img = document.createElement("img");
        img.src = this.config.streamUrl;
        img.width = this.config.width;
        img.height = this.config.height;
        wrapper.appendChild(img);
        return wrapper;
    },

    getStyles: function() {
        return [];
    }
});
