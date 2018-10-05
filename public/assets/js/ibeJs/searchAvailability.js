$( document ).ready(function() {

    function showNotif(from, align, color, message, icon) {
        $.notify({
            icon: icon,
            message: message

        }, {
            type: color,
            timer: 4000,
            placement: {
                from: from,
                align: align
            }
        });
    }

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

    function populatingNotes(fare, refNumber){
        if(fare.pricingMessage.freeTextQualification.textSubjectQualifier != "LTD" && fare.pricingMessage.freeTextQualification.informationType != "41"){
            if(fare.pricingMessage.description instanceof Array){
                fare.pricingMessage.description.forEach(function(eachDescription){
                    $('#pricingMsgs' + refNumber).append(
                        '<li><i>' + eachDescription + '</i></li>' 
                    );
                });
            }else{
                $('#pricingMsgs' + refNumber).append( 
                    '<li><i>' + fare.pricingMessage.description + '</i></li>'     
                );
            }
        }
    }

    function populatingShowMore(eachConnectingFlight, refNumber) {

        if(eachConnectingFlight.flightInformation.addProductDetail.electronicTicketing == "Y"){
            var isETicketing = '<i class="material-icons">check_circle</i>';
        }else{
            var isETicketing = '<i class="material-icons">cancel</i>';
        }
        
        $('#tblFlights' + refNumber).append(
            '<tr>' +
                '<td>' + eachConnectingFlight.flightInformation.flightOrtrainNumber + '</td>' +
                '<td>' + eachConnectingFlight.flightInformation.location[0].locationId + '</td>' +
                '<td>' + moment(eachConnectingFlight.flightInformation.productDateTime.dateOfArrival, 'DDMMYY').format('YYYY-MM-DD') + ' ' + eachConnectingFlight.flightInformation.productDateTime.timeOfArrival.slice(0, 2) + ":" + eachConnectingFlight.flightInformation.productDateTime.timeOfArrival.slice(2) + '</td>' +
                '<td> Terminal ' + eachConnectingFlight.flightInformation.location[0].terminal + '</td>' +
                '<td>' + eachConnectingFlight.flightInformation.location[1].locationId  + '</td>' +
                '<td>' + moment(eachConnectingFlight.flightInformation.productDateTime.dateOfArrival, 'DDMMYY').format('YYYY-MM-DD') + ' ' + eachConnectingFlight.flightInformation.productDateTime.timeOfArrival.slice(0, 2) + ":" + eachConnectingFlight.flightInformation.productDateTime.timeOfArrival.slice(2) + '</td>' +
                '<td> Terminal ' + eachConnectingFlight.flightInformation.location[1].terminal + '</td>' + 
                '<td>' + eachConnectingFlight.flightInformation.productDetail.equipmentType + '</td>' +
                '<td>' + isETicketing + '</td>' +
            '</tr>'
        )
    }

    function showSearchResults(flight, refNumber, response, isConnecting, lastConnectingFlight, color, stop) {
        //response.recommendation()
        if (response.recommendation[refNumber].paxFareProduct.paxFareDetail.codeShareDetails instanceof Array) {
            var codShareDetails = response.recommendation[refNumber].paxFareProduct.paxFareDetail.codeShareDetails[0]; 
        }else{
            var codShareDetails = response.recommendation[refNumber].paxFareProduct.paxFareDetail.codeShareDetails; 
        }

        if(isConnecting){
            var originFlight = flight[0];
            var destinationFlight = flight[lastConnectingFlight];
        }else{
            var originFlight = flight;
            var destinationFlight = flight;
        }
        
        $('#ibeResults').append(
            '<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12" style=" padding: 1px;">' +
                '<div class="card alert" style="border-top: 5px solid ' + color + '; margin:5px; padding-left: 0px; padding-right: 0px; padding-bottom: 0px;">' +
                    '<div class="col-md-3 text-center">' +
                        '<h4> Flight : ' + originFlight.flightInformation.flightOrtrainNumber + '</h4>' +
                        '<p> Airline : ' + codShareDetails.company + '</p>' +
                        '<p> Class : ' + response.recommendation[refNumber].paxFareProduct.fareDetails.majCabin.bookingClassDetails.designator + '</p>' +
                    '</div>' +
                    '<div class="col-md-6 text-center">' +
                        '<div class="col-md-4">' +
                            '<h4>' + originFlight.flightInformation.location[0].locationId + '</h4>' +
                            '<p> Terminal : ' + originFlight.flightInformation.location[0].terminal + '</p>' +
                            '<p>' + moment(originFlight.flightInformation.productDateTime.dateOfDeparture, 'DDMMYY').format('YYYY-MM-DD') + ' ' + originFlight.flightInformation.productDateTime.timeOfDeparture.slice(0, 2) + ":" + originFlight.flightInformation.productDateTime.timeOfDeparture.slice(2) + '</p>' +
                        '</div>' +
                        '<div class="col-md-4">' +
                            '<i class="material-icons" style="font-size:60px">flight_takeoff</i>' +
                            '<p>' + stop + '</p>' +
                        '</div>' +
                        '<div class="col-md-4">' +
                            '<h4>' + destinationFlight.flightInformation.location[1].locationId + '</h4>' +
                            '<p> Terminal : ' + destinationFlight.flightInformation.location[1].terminal + '</p>' +
                            '<p>' + moment(destinationFlight.flightInformation.productDateTime.dateOfArrival, 'DDMMYY').format('YYYY-MM-DD') + ' ' + destinationFlight.flightInformation.productDateTime.timeOfArrival.slice(0, 2) + ":" + destinationFlight.flightInformation.productDateTime.timeOfArrival.slice(2) + '</p>' +
                        '</div>' +

                    '</div>' + 
                    '<div class="col-md-3 text-center">' +
                        '<h4> ₱' + parseInt(response.recommendation[refNumber].paxFareProduct.paxFareDetail.totalFareAmount).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") + '</h4>' +
                        '<button type="button" class="btn btn-info ">BOOK</button>' +
                    '</div>' + 
                    '<div id="moreDetails' + refNumber + '" class="col-md-12" style=" display:none;">' +
                        '<table class="table table-hover">' +
                            '<thead>' +
                                '<tr><th>Flight #</th>' +
                                '<th>Origin</th>' +
                                '<th>Departure Date</th>' +
                                '<th>Departure Terminal</th>' +
                                '<th>Destination</th>' +
                                '<th>Arrival Date</th>' +
                                '<th>Arrival Terminal</th>' +
                                '<th>Equipment Type</th>' +
                                '<th>E-Ticketing</th>' +
                            '</tr></thead>' +
                            '<tbody id="tblFlights' + refNumber + '">' +
                            '</tbody>' +
                        '</table>' +
                        '<div class="col-lg-12">'+
                            '<p id="msgHeader' + refNumber + '">Pricing Message</p>' +
                            '<ul id="pricingMsgs' + refNumber + '">' +
                            '</ul>' + 
                        '</div>' +
                    '</div>' +
                    '<div id="btnShowMore' + refNumber + '" class="col-md-12 showMoreBtns showNhide text-center" style="border-top: 1px solid #e0e0e0; margin-top:10px; cursor:pointer">' +
                        '<small style="margin-top: 4px; margin-bottom: 4px; color: ' + color + '"><span id="more' + refNumber + '">Show More</span></small>' +
                        '<span style="display:none;">' + color + '</span>' +
                    '</div>' + 
                    '<div id="btnLessMore' + refNumber + '" class="col-md-12 showLessBtns showNhide text-center" style="border-top: 1px solid #e0e0e0; margin-top:10px; cursor:pointer; display:none">' +
                        '<small style="margin-top: 4px; margin-bottom: 4px; color: ' + color + '"><span id="less' + refNumber + '">Show Less</span></small>' +
                        '<span style="display:none;">' + color + '</span>' +
                    '</div>' +

                    
                '</div>' +
            '</div>'
        );
    
        if(flight instanceof Array){
            flight.forEach(function(eachConnectingFlight){
                populatingShowMore(eachConnectingFlight, refNumber);
            }); 
        }else{
            populatingShowMore(flight, refNumber);
        }

        if(response.recommendation[refNumber].paxFareProduct.fare instanceof Array){
            response.recommendation[refNumber].paxFareProduct.fare.forEach(function(eachFare){
                populatingNotes(eachFare, refNumber);
            });
        }else{
            if(response.recommendation[refNumber].paxFareProduct.fare.pricingMessage.freeTextQualification.textSubjectQualifier != "LTD" && response.recommendation[refNumber].paxFareProduct.fare.pricingMessage.freeTextQualification.informationType != "41"){
                populatingNotes(response.recommendation[refNumber].paxFareProduct.fare, refNumber);
            }else{
                $('#msgHeader' + refNumber).hide();
            }
        }
        
    }

    $('#frmAvailability').submit(function( event ) {

        event.preventDefault();

        if(validator()) {
            $('.loading').show();
            $('#ibeResults').empty();
            var txtReturnDate    = $('#txtReturnDate').val();
            var txtReturnTime    = $('#txtReturnTime').val();


            $.ajax({
                url:"./IBEavailability",
                type:"POST",
                data:{
                    nrOfRequestedResults: $('#txtResults').val() || 10,
                    nrOfRequestedPassengers: $('#txtPassengers').val() || 1,
                    departureLocation : $('#txtOrigin').val().toUpperCase(),
                    arrivalLocation : $('#txtDestination').val().toUpperCase(),
                    departureDate : $('#txtDepartureDate').val(),
                    departureTime :$('#txtDepartureTime').val(),
                },
                contentType:"application/x-www-form-urlencoded; charset=UTF-8",
                dataType:"json",
                success: function(response, status){
                    if(typeof response.flightIndex == 'undefined'){
                        $(".toShowUponSearch").hide();
                        $('.loading').hide();
                        showNotif('top','right', 'danger', 'No results for this search. Please review search parameters.', 'clear');
                    }else{

                        $(".toShowUponSearch").show();
                        response.flightIndex.groupOfFlights.forEach(function(eachResult){
                                                        var refNumberOrig = eachResult.propFlightGrDetail.flightProposal[0].ref;
                            var refNumber = eachResult.propFlightGrDetail.flightProposal[0].ref - 1;

                            if (eachResult.flightDetails instanceof Array) {
                                var lastConnectingFlight = eachResult.flightDetails.length - 1;
                                var isConnecting = true;
                                
                                if(eachResult.flightDetails.length == 2){
                                    var stops =  lastConnectingFlight + 'Stop';
                                }else{
                                    var stops =  lastConnectingFlight + 'Stops'
                                }
                                
                                showSearchResults(eachResult.flightDetails, refNumber, response, isConnecting, lastConnectingFlight, '#ffa21a', stops);
                                
                            } else {
                                var isConnecting = false;
                                showSearchResults(eachResult.flightDetails, refNumber, response, isConnecting, lastConnectingFlight, '#00d3ee', 'Direct');
                            }

                        });

                        

                        $(".showNhide").mouseenter(function() {
                            var origColor = $(this).children('span').html();
                            $(this).children('small').css('color', 'white');
                            $(this).css('background-color', origColor);
                        }).mouseleave(function() {
                            var origColor = $(this).children('span').html();
                            $(this).children('small').css('color', origColor);
                            $(this).css('background-color', 'white');
                        });
                        
                        $(".showMoreBtns").click(function() {
                            var btnId = $(this).attr("id").substring(11);
                            $('#btnShowMore' + btnId).hide();
                            $('#btnLessMore' + btnId).show();
                            $('#moreDetails' + btnId).show();
                        });

                        $(".showLessBtns").click(function() {
                            var btnId = $(this).attr("id").substring(11);
                            $('#btnShowMore' + btnId).show();
                            $('#btnLessMore' + btnId).hide();
                            $('#moreDetails' + btnId).hide();
                        });

                        

                        $('.loading').hide();

                    }
                },
            })

        }
    });

});