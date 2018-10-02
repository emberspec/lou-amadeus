$( document ).ready(function() {

    function validator() {

        var form = $("#frmAvailability");
        var toReturn = true;

        //loop on each fields to check for errors
        $(".txtField", form).each(function () {

            var txtId = $(this).attr('id'),
                errorName = "." + txtId + "ErrorMessage";

            if ($(this).val() == "") {
                $(errorName).show();
                toReturn = false;
            }else {
                $(errorName).hide();
            }
            
        });

        return toReturn;
        console.log(toReturn);
    }

    function showSearchResults(flight, colorType) {
        $('#ibeResults').append(
            '<div class="col-lg-4 col-md-4 col-sm-12 col-xs-12"  style="cursor: pointer">' +
                '<div class="card alert alert-' + colorType + '">' +
                    '<div class="col-md-6 text-center">' +
                        '<h3>' + flight.flightInformation.location[0].locationId + '</h3>' +
                        '<h4>' + moment(flight.flightInformation.productDateTime.dateOfDeparture, 'DDMMYY').format('YYYY-MM-DD') + '</h4>' +
                        '<h4>' + flight.flightInformation.productDateTime.timeOfDeparture.slice(0, 2) + ":" + flight.flightInformation.productDateTime.timeOfDeparture.slice(2) + '</h4>' +
                    '</div>' +
                    '<div class="col-md-6 text-center">' +
                        '<h3>' + flight.flightInformation.location[1].locationId + '</h3>' +
                        '<h4>' + moment(flight.flightInformation.productDateTime.dateOfArrival, 'DDMMYY').format('YYYY-MM-DD') + '</h4>' +
                        '<h4>' + flight.flightInformation.productDateTime.timeOfArrival.slice(0, 2) + ":" + flight.flightInformation.productDateTime.timeOfArrival.slice(2) + '</h4>' +
                    '</div>' + 
                '</div>' +
            '</div>'
        )
    }

    $('#frmAvailability').submit(function( event ) {

        event.preventDefault();

        if(validator()) {
            $('.loading').show();
            var txtReturnDate    = $('#txtReturnDate').val();
            var txtReturnTime    = $('#txtReturnTime').val();


            $.ajax({
                url:"./IBEavailability",
                type:"POST",
                data:{
                    nrOfRequestedResults: $('#txtResults').val() || 50,
                    nrOfRequestedPassengers: $('#txtPassengers').val() || 1,
                    departureLocation : $('#txtOrigin').val().toUpperCase(),
                    arrivalLocation : $('#txtDestination').val().toUpperCase(),
                    departureDate : $('#txtDepartureDate').val(),
                    departureTime :$('#txtDepartureTime').val(),
                },
                contentType:"application/x-www-form-urlencoded; charset=UTF-8",
                dataType:"json",
                success: function(response, status){
                    $(".toShowUponSearch").show();
                    response.flightIndex.groupOfFlights.forEach(function(eachResult){
                        
                        if (eachResult.flightDetails instanceof Array) {
                            eachResult.flightDetails.forEach(function(eachConnectingFlight){
                                showSearchResults(eachConnectingFlight, "warning");
                            });
                        } else {
                            showSearchResults(eachResult.flightDetails, "info");
                        }

                    });

                    $('.loading').hide();


                },
            })

        }
    });

});