jQuery.fn.extend({
    toggleText: function (a, b){
        var that = this;
        if (that.text() != a && that.text() != b){
            that.text(a);
        }
        else
        if (that.text() == a){
            that.text(b);
        }
        else
        if (that.text() == b){
            that.text(a);
        }
        return this;
    }
});