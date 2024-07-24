$(document).ready(function () {
    $('body').on('keypress', '.decimalvalidation', function (event) {
        var $this = $(this);
        $this.val($this.val().replace(/[^-][^0-9\.]/g, ''));
        if ((event.which != 45 || $this.val().indexOf('-') != -1) && (event.which != 46 || $this.val().indexOf('.') != -1) && (event.which < 48 || event.which > 57))
            event.preventDefault();
    });

    $('body').on('paste', '.decimalvalidation', function (e) {
        var $this = $(this);
        setTimeout(function () {
            $this.val($this.val().replace(/[^-][^0-9\.]/g, ''));
        }, 5);
    });
});