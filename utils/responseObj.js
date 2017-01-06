var Response =  function() {
    this.success = true;
    this.message = "ok";
    this.code = '0';
    this.data = {};
    this.errMsg =  function(success, message) {
        this.success = success;
        this.message = message;
        this.code = '-203';
    };
};
module.exports = function(options) {
    return new Response(options);
};