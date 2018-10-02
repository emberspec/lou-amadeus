$( document ).ready(function() {

    $('#txtDepartureDate').datepicker({
        format: 'yyyy-mm-dd',
        startDate: '0d'
    });

    $('#txtReturnDate').datepicker({
        format: 'yyyy-mm-dd',

    });

    $("#txtDepartureDate").change(function() {
        $("#txtReturnDate").datepicker("clearDates");
        $("#txtReturnDate").datepicker("setStartDate", new Date($(txtDepartureDate).val()));

        $('#txtReturnDate').prop('disabled', false);
        $('#txtReturnTime').prop('disabled', false);
    })

    $('#txtDepartureTime').timepicker({ 'timeFormat': 'H:i:s' });
    $('#txtReturnTime').timepicker({ 'timeFormat': 'H:i:s' });

    $('.timeFields').click(function(){
        var timeInputWidth = $('#txtDepartureTime').width();
        $('.ui-timepicker-wrapper').width(timeInputWidth);
    });


    $(document).click(function(){
      $("#dd").removeClass('active');
    });

    $("#dd").click(function(e){
      e.stopPropagation();
    });
    

    function DropDown(el) {
        this.dd = el;
        this.placeholder = this.dd.children('span');
        this.opts = this.dd.find('ul.dropdown > li');
        this.val = '';
        this.index = -1;
        this.initEvents();
    }
    DropDown.prototype = {
        initEvents : function() {
            var obj = this;

            obj.dd.on('click', function(event){
                $(this).toggleClass('active');
                return false;
            });

            obj.opts.on('click',function(){
                var opt = $(this);
                obj.val = opt.text();
                obj.index = opt.index();
                obj.placeholder.text(obj.val);
            });
        },
        getValue : function() {
            return this.val;
        },
        getIndex : function() {
            return this.index;
        }
    }

    $(function() {

        var dd = new DropDown( $('#dd') );

        $(document).click(function() {
            // all dropdowns
            $('.wrapper-dropdown-1').removeClass('active');
        });

    });

    $(window).on('shown.bs.modal', function() { 
        $('.sidebar .sidebar-wrapper, .main-panel'). perfectScrollbar('destroy');
        $('.modal').perfectScrollbar();
        $('.modal').addClass('perfect-scrollbar-on');
    });

    $(window).on('hidden.bs.modal', function () {
        $('.sidebar .sidebar-wrapper, .main-panel'). perfectScrollbar();
        $('.modal').perfectScrollbar('destroy');
        $('.modal').removeClass('perfect-scrollbar-on');
    })

    new Awesomplete(document.getElementById("txtOrigin"), listOfAirports);

    new Awesomplete(document.getElementById("txtDestination"), listOfAirports);

});