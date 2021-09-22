var buttonCheckSchedAttrib = "style='background-color: #E31B49; font-size: 12px; color: white; font-weight: bold; margin-bottom: 5px; margin-right: 5px;' class='btn'";
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function multiSearchOr(text, searchWords) {
    var regex = searchWords
        .map(word => "(?=.*\\b" + word + "\\b)")
        .join('');
    var searchExp = new RegExp(regex);
    return (searchExp.test(text)) ? "Found!" : "Not found!";
}
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/

        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/


            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

/*An array containing all the CityList names in the world:*/
var CityListCode;
$(document).ready(function () {
    //$('#ModalDetailedDeposit').modal({
    //    backdrop: 'static',
    //    keyboard: false,
    //    show: true
    //});
    //var datenow = moment(Date.now()).format("MMMM DD, YYYY HH:mm");
    //console.log(moment("MArch 23, 2020 9:00").format("HH:mm") < datenow);
    //var a = 'how are you';
    //console.log(a.includes('yo'));
    $('#txtScheduledDate').keydown(function (e) {
        e.preventDefault();
    });
    $('#txtBirthDate').keydown(function (e) {
        e.preventDefault();
    });
    var pin = getParameterByName('pin');
    var code = getParameterByName('code');
    if (pin != null && code != null) {

        $("#MainDiv").fadeIn(1000);
        $('#Confirmation').fadeIn(1000, function () {
            $('#ConfirmationLoader').fadeIn(1000);
            $.ajax({
                url: "/Home/ConfirmReservation",
                type: "POST",
                data: {
                    OTP: pin,
                    reserveCode: code
                },
                success: function (finalReturn) {
                    let res = finalReturn.data;
                    let result;
                    result = $.parseJSON(res);


                    if (result.resultCode == 200) {
                        $.ajax({
                            url: "/Home/RefCodeToQRCode",
                            type: "POST",
                            data: {
                                qrText: code
                            },
                            success: function (returnData) {
                                $('#ConfirmationLoader').fadeOut(1000, function () {
                                    $('#ConfirmationSuccess').fadeIn(1000);
                                    document.getElementById('ReferenceCode').innerHTML = result.data;
                                    document.getElementById('QRCode').src = "data:image/png;base64," + returnData.data;
                                });


                            },
                            error: function () {
                                swal({
                                    title: "Invalid Operation",
                                    type: "error",
                                    html: "<span style='font-size: 15px; font-weight: bold; color: #E31B49'>Can't generate QR Code.<br /> Try using reference code as your primary reference.</span>",
                                    showCancelButton: false,
                                    confirmButtonColor: '#E31B49',
                                    cancelButtonColor: '#E31B49',
                                    confirmButtonText: 'OK',
                                    cancelButtonText: 'NO',
                                    confirmButtonClass: 'btn btn-danger',
                                    cancelButtonClass: 'btn btn-danger',
                                    //closeOnConfirm: false,
                                    allowOutsideClick: false
                                }).then((result) => {
                                    if (result.value) {
                                        $('#ConfirmationLoader').fadeOut(1000, function () {
                                            $('#ConfirmationSuccess').fadeIn(1000);
                                            document.getElementById('ReferenceCode').innerHTML = result.data;
                                            document.getElementById('QRCode').src = "data:image/png;base64," + returnData.data;
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        swal({
                            title: "Invalid Operation",
                            type: "error",
                            html: "<span style='font-size: 15px; font-weight: bold; color: #E31B49'>" + result.resultMessage + "<br />Redirecting to Home page.</span>",
                            showCancelButton: false,
                            confirmButtonColor: '#E31B49',
                            cancelButtonColor: '#E31B49',
                            confirmButtonText: 'OK',
                            cancelButtonText: 'NO',
                            confirmButtonClass: 'btn btn-danger',
                            cancelButtonClass: 'btn btn-danger',
                            //closeOnConfirm: false,
                            allowOutsideClick: false
                        }).then((result) => {
                            if (result.value) {
                                window.location.href = "../Home/Index";
                            }
                        });

                    }
                },
                error: function (xhr, status, error) {

                    swal({
                        title: "Invalid Operation",
                        type: "error",
                        html: "<span style='font-size: 15px; font-weight: bold; color: #E31B49'>(Status Code: " + xhr.status + ")<br />Please refresh the page and try again.</span>",
                        showCancelButton: false,
                        confirmButtonColor: '#E31B49',
                        cancelButtonColor: '#E31B49',
                        confirmButtonText: 'OK',
                        cancelButtonText: 'NO',
                        confirmButtonClass: 'btn btn-danger',
                        cancelButtonClass: 'btn btn-danger',
                        //closeOnConfirm: false,
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.value) {
                            return false;

                            //$('#ConfirmationLoader').fadeOut(1000, function () {
                            //    $('#ConfirmationSuccess').fadeIn(1000);
                            //});
                        }
                    });

                }
            });
        });

    }
    else {
        $('.select2').select2();
        $("#MainDiv").fadeIn(1000);
        $("#tabs").fadeOut(50);
        $("#PageLoading").fadeIn(1000);
        
        $.ajax({
            url: "/Home/GetInstitutionList",
            type: "POST",
            success: function (finalReturn) {
                let res = finalReturn.data;
                let result;
                result = $.parseJSON(res);
                if (result.resultCode == 200) {
                    $("#PageLoading").fadeOut(200, function () {
                        $("#tabs").fadeIn(1000);
                        $("#ScheduleInformation").fadeIn(1000);
                        $("#CustomerInformation").fadeOut(1000);
                        $("#SummaryInformation").fadeOut(1000);
                        $("#AvailableSchedDiv").fadeOut(1000);                        
                        document.getElementById("AvailableSchedDiv").innerHTML = "<button + " + buttonCheckSchedAttrib + "disabled>" + "NO AVAILABLE SLOTS AT THE MOMENT" + "</button>";
                    });
                    $('#chkAgreement').prop('checked', false);
                    agreed = 0;
                    $('#btnReserveSlot').prop('disabled', 'disabled');
                    $('#BranchSelect').prop('disabled', 'disabled');
                    $('#txtScheduledDate').prop('disabled', 'disabled');
                    $('#txtScheduledDate').val('');
                    $('#txtBirthDate').val('');
                    $('#btnCheckSchedule').prop('disabled', 'disabled');

                    $('#InstitutionSelect').empty();
                    $('#InstitutionSelect').append($('<option></option>').val(0).html("Select..."));
                    if (result.resultCode == 200) {
                        $('#InstitutionSelect').select2('val', 0);
                        $.each(result.data, function (index, itemData) {
                            $('#InstitutionSelect').append($('<option></option>').val(itemData.guid).html(itemData.name));
                        });
                    }


                }
                else {
                    swal({
                        title: "Invalid Operation",
                        type: "error",
                        html: "<span style='font-size: 15px; font-weight: bold; color: #E31B49'>" + result.resultMessage + "</span>",
                        showCancelButton: false,
                        confirmButtonColor: '#E31B49',
                        cancelButtonColor: '#E31B49',
                        confirmButtonText: 'OK',
                        cancelButtonText: 'NO',
                        confirmButtonClass: 'btn btn-danger',
                        cancelButtonClass: 'btn btn-danger',
                        //closeOnConfirm: false,
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.value) {
                            return false;
                        }
                    });
                }
            },
            error: function (xhr, status, error) {
                swal({
                    title: "Invalid Operation",
                    type: "error",
                    html: "<span style='font-size: 15px; font-weight: bold; color: #E31B49'>(Status Code: " + xhr.status + ")<br />Please refresh the page and try again.</span>",
                    showCancelButton: false,
                    confirmButtonColor: '#E31B49',
                    cancelButtonColor: '#E31B49',
                    confirmButtonText: 'OK',
                    cancelButtonText: 'NO',
                    confirmButtonClass: 'btn btn-danger',
                    cancelButtonClass: 'btn btn-danger',
                    //closeOnConfirm: false,
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.value) {
                        $("#PageLoading").fadeOut(200, function () {                 
                            $("#ScheduleInformation").fadeIn(1000);
                            $("#CustomerInformation").fadeOut(1000);
                            $("#SummaryInformation").fadeOut(1000);
                            $("#AvailableSchedDiv").fadeOut(1000);                            
                            document.getElementById("AvailableSchedDiv").innerHTML = "<button + " + buttonCheckSchedAttrib + "disabled>" + "NO AVAILABLE SLOTS AT THE MOMENT" + "</button>";
                        });
                        //$('#ConfirmationLoader').fadeOut(1000, function () {
                        //    $('#ConfirmationSuccess').fadeIn(1000);
                        //});
                    }
                });
            }


        });
    }

});
$('#InstitutionSelect').on('change', function () {
    $('#BranchSelect').empty();
    $('#BranchSelect').append($('<option></option>').val(0).html("Select..."));
    $('#BranchSelect').select2('val', 0);
    if ($('#InstitutionSelect').select2('val') == 0 || $('#InstitutionSelect').select2('val') == null) {
        $('#BranchSelect').prop('disabled', 'disabled');
        $('#BranchSelect').select2('val', 0);
    }

    else {
        $.ajax({
            url: "/Home/GetBranchList",
            type: "POST",
            data: {
                institutionID: $('#InstitutionSelect').select2('val')
            },
            success: function (finalReturn) {
                let res = finalReturn.data;
                let result;
                result = $.parseJSON(res);
                if (result.resultCode == 200) {
                    $('#BranchSelect').prop('disabled', false);
                    $('#BranchSelect').empty();
                    $('#BranchSelect').append($('<option></option>').val(0).html("Select..."));
                    if (result.resultCode == 200) {
                        $('#BranchSelect').select2('val', 0);
                        $.each(result.data, function (index, itemData) {
                            $('#BranchSelect').append($('<option></option>').val(itemData.guid).html(itemData.name));
                        });
                    }
                }
                else {
                    swal({
                        title: "Invalid Operation",
                        type: "error",
                        html: "<span style='font-size: 15px; font-weight: bold; color: #E31B49'>" + result.resultMessage + "</span>",
                        showCancelButton: false,
                        confirmButtonColor: '#E31B49',
                        cancelButtonColor: '#E31B49',
                        confirmButtonText: 'OK',
                        cancelButtonText: 'NO',
                        confirmButtonClass: 'btn btn-danger',
                        cancelButtonClass: 'btn btn-danger',
                        //closeOnConfirm: false,
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.value) {
                            return false;
                        }
                    });
                }
            }
        });
    }
});
$('#BranchSelect').on('change', function () {
    //$("#AvailableSchedDiv").fadeIn(1000);
    //document.getElementById("AvailableSchedDiv").innerHTML = "<button + " + buttonCheckSchedAttrib + " disabled>" + "NO AVAILABLE SLOTS AT THE MOMENT" + "</button>";
    $('#ScheduleDiv').fadeOut(500);
    if ($('#BranchSelect').select2('val') == 0 || $('#BranchSelect').select2('val') == null) {
        $('#txtScheduledDate').val('');
        $('#txtScheduledDate').prop('disabled', 'disabled');
        $('#btnCheckSchedule').prop('disabled', 'disabled');
        document.getElementById('txtAvailableSlots').innerHTML = 0;
        return false;

    }
    else {
        $('#txtScheduledDate').val('');
        $('#txtScheduledDate').prop('disabled', false);
        //$('#btnCheckSchedule').prop('disabled', false);

        document.getElementById('txtAvailableSlots').innerHTML = 0;
    }
});
$('#txtScheduledDate').daterangepicker({
    timePicker: false,
    timePickerIncrement: 30,
    locale: {
        format: 'MMMM DD, YYYY'
    },
    singleDatePicker: true,
    minYear: 1901,
    maxYear: parseInt(moment().format('YYYY'), 10),
    minDate: moment(Date.now()).format('MMMM DD, YYYY')
},
    function (start) {
        $('#btnCheckSchedule').prop('disabled', false);
        $('#ScheduleDiv').fadeOut(500);
        //$('#AvailableSchedDiv').fadeIn(1000);
        //document.getElementById("AvailableSchedDiv").innerHTML = "<button + " + buttonCheckSchedAttrib + " disabled>" + "NO AVAILABLE SLOTS AT THE MOMENT" + "</button>";
        //document.getElementById('txtAvailableSlots').innerHTML = 0;
    }
);
var scheduleID = null;
var scheduleDateAndTime = null;
$('#btnCheckSchedule').on('click', function () {

    $('#ScheduleDiv').fadeOut(500, function () {
        $('#AvailableSlotsDiv').fadeOut(200);
        $('#ScheduleDivLoader').fadeIn(500);


        scheduleID = null;
        document.getElementById('txtAvailableSlots').innerHTML = 0;
        $.ajax({
            url: "/Home/GetAvailableTimeSlotPerBranch",
            type: "POST",
            data: {
                branchCode: $('#BranchSelect').select2('val'),
                date: $('#txtScheduledDate').data('daterangepicker').startDate.format('YYYY-MM-DD')
            },
            success: function (finalReturn) {
                let res = finalReturn.data;
                let result;
                result = $.parseJSON(res);
                $('#ScheduleDivLoader').fadeOut(500, function () {
                    if (result.resultCode == 200) {


                        var StartTime;
                        var EndTime;
                        var StartDate;
                        var datenow;
                        var datetimenow;
                        if (result.data.length != 0) {
                            console.log(result.data);
                            $('#AvailableSchedDiv').fadeOut(100, function () {
                                $('#ScheduleDiv').fadeIn(200);
                                document.getElementById("AvailableSchedDiv").innerHTML = "";
                                $('#AvailableSchedDiv').fadeIn(200);
                                //$('#AvailableSlotsDiv').fadeIn(200);
                                $.each(result.data, function (i, value) {
                                    StartDate = moment(value.startTime).format("MMM DD, YYYY");
                                    StartTime = moment(value.startTime).format("HH:mm");
                                    EndTime = moment(value.endTime).format("HH:mm");
                                    datenow = moment(Date.now()).format("MMM DD, YYYY");
                                    datetimenow = moment(Date.now()).format("HH:mm");
                                    //console.log(StartDate < datenow);
                                    if (value.isSenior == true) {
                                        if (StartDate == datenow && (StartTime < datetimenow && EndTime < datetimenow)) {
                                            document.getElementById("AvailableSchedDiv").innerHTML += "<button id =" + '"' + value.guid + '"' + " onClick='ScheduleDetailsv2(" + '"' + value.guid + '"' + "," + '"' + value.date + '"' + "," + '"' + value.startTime + '"' + "," + '"' + value.endTime + '"' + ")' + " + buttonCheckSchedAttrib + "disabled><i class='fa fa-blind' style='color: white; font-weight: bold;'></i>" + " " + StartTime + " - " + EndTime + "</button>";
                                        }
                                        else {
                                            document.getElementById("AvailableSchedDiv").innerHTML += "<button id =" + '"' + value.guid + '"' + " onClick='ScheduleDetailsv2(" + '"' + value.guid + '"' + "," + '"' + value.date + '"' + "," + '"' + value.startTime + '"' + "," + '"' + value.endTime + '"' + ")' + " + buttonCheckSchedAttrib + "><i class='fa fa-blind' style='color: white; font-weight: bold;'></i>" + " " + StartTime + " - " + EndTime + "</button>";
                                        }
                                    }
                                    else {
                                        if (StartDate == datenow && (StartTime < datetimenow && EndTime < datetimenow)) {
                                            document.getElementById("AvailableSchedDiv").innerHTML += "<button id =" + '"' + value.guid + '"' + " onClick='ScheduleDetailsv2(" + '"' + value.guid + '"' + "," + '"' + value.date + '"' + "," + '"' + value.startTime + '"' + "," + '"' + value.endTime + '"' + ")' + " + buttonCheckSchedAttrib + "disabled>" + StartTime + " - " + EndTime + "</button>";
                                        }
                                        else {
                                            document.getElementById("AvailableSchedDiv").innerHTML += "<button id =" + '"' + value.guid + '"' + " onClick='ScheduleDetailsv2(" + '"' + value.guid + '"' + "," + '"' + value.date + '"' + "," + '"' + value.startTime + '"' + "," + '"' + value.endTime + '"' + ")' + " + buttonCheckSchedAttrib + ">" + StartTime + " - " + EndTime + "</button>";
                                        }
                                    }


                                });


                            });

                        }
                        else {
                            $('#AvailableSchedDiv').fadeOut(100, function () {
                                $('#ScheduleDiv').fadeIn(200);
                                document.getElementById("AvailableSchedDiv").innerHTML = "";
                                $('#AvailableSchedDiv').fadeIn(200);
                                //$('#AvailableSlotsDiv').fadeIn(200);
                                document.getElementById("AvailableSchedDiv").innerHTML = "<button + " + buttonCheckSchedAttrib + " disabled>" + "NO AVAILABLE SLOTS AT THE MOMENT" + "</button>";
                                //for (i = 0; i < 3; i++) {
                                //    document.getElementById("AvailableSchedDiv").innerHTML += "<button onClick='ScheduleDetails(" + '"b_' + i + '"' + ")' id=b_" + i + " + " + buttonCheckSchedAttrib + ">" + "NO AVAILABLE SLOTS AT THE MOMENT" + "</button>";
                                //}
                            });
                        }
                    }

                    else {
                        swal({
                            title: "Invalid Operation",
                            type: "error",
                            html: "<span style='font-size: 15px; font-weight: bold; color: #E31B49'>" + result.resultMessage + "</span>",
                            showCancelButton: false,
                            confirmButtonColor: '#E31B49',
                            cancelButtonColor: '#E31B49',
                            confirmButtonText: 'OK',
                            cancelButtonText: 'NO',
                            confirmButtonClass: 'btn btn-danger',
                            cancelButtonClass: 'btn btn-danger',
                            //closeOnConfirm: false,
                            allowOutsideClick: false
                        }).then((result) => {
                            if (result.value) {
                                return false;
                            }
                        });
                    }
                });

            },
            error: function (xhr, status, error) {

                swal({
                    title: "Invalid Operation",
                    type: "error",
                    html: "<span style='font-size: 15px; font-weight: bold; color: #E31B49'>(Status Code: " + xhr.status + ")<br />Please refresh the page and try again.</span>",
                    showCancelButton: false,
                    confirmButtonColor: '#E31B49',
                    cancelButtonColor: '#E31B49',
                    confirmButtonText: 'OK',
                    cancelButtonText: 'NO',
                    confirmButtonClass: 'btn btn-danger',
                    cancelButtonClass: 'btn btn-danger',
                    //closeOnConfirm: false,
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.value) {
                        return false;
                        //$('#ConfirmationLoader').fadeOut(1000, function () {
                        //    $('#ConfirmationSuccess').fadeIn(1000);
                        //});   
                    }
                });

            }
        });
    });
});

function ScheduleDetailsv2(id, schedDate, schedStartTime, schedEndTime) {
    var selectedElement = $(".select_v2");
    scheduleID = id;
    scheduleDateAndTime = moment(schedDate).format("MMMM DD, YYYY") + ' ' + moment(schedStartTime).format("HH:mm") + ' - ' + moment(schedEndTime).format("HH:mm")
    document.getElementById(id).style.backgroundColor = "darkseagreen";
    document.getElementById(id).classList.add("select_v2");

    selectedElement.each(function () {
        document.getElementById(this.id).style.backgroundColor = "#E31B49";
        document.getElementById(this.id).classList.remove("select_v2");
    });


    $.ajax({
        url: "/Home/GetRemainingSlotCount",
        type: "POST",
        data: {
            scheduleCode: id
        },
        success: function (finalReturn) {
            let res = finalReturn.data;
            let result;
            result = $.parseJSON(res);
            if (result.resultCode == 200) {
                if ($('#' + id).css('background-color') == "rgb(227, 27, 73)") {
                    $('#AvailableSlotsDiv').fadeOut(200);
                    document.getElementById('txtAvailableSlots').innerHTML = 0;
                }
                else {
                    $('#AvailableSlotsDiv').fadeIn(200);
                    document.getElementById('txtAvailableSlots').innerHTML = result.data;
                }

            }
            else {
                swal({
                    title: "Invalid Operation",
                    type: "error",
                    html: "<span style='font-size: 15px; font-weight: bold; color: #E31B49'>" + result.resultMessage + "</span>",
                    showCancelButton: false,
                    confirmButtonColor: '#E31B49',
                    cancelButtonColor: '#E31B49',
                    confirmButtonText: 'OK',
                    cancelButtonText: 'NO',
                    confirmButtonClass: 'btn btn-danger',
                    cancelButtonClass: 'btn btn-danger',
                    //closeOnConfirm: false,
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.value) {
                        return false;
                    }
                });
            }
        }
    });
}

function ScheduleDetails(id) {
    var selectedElement = $(".select_v2");
    scheduleID = id;    
    document.getElementById(id).style.backgroundColor = "darkseagreen";
    document.getElementById(id).classList.add("select_v2");

    selectedElement.each(function () {
        document.getElementById(this.id).style.backgroundColor = "#E31B49";
        document.getElementById(this.id).classList.remove("select_v2");
    });


    $.ajax({
        url: "/Home/GetRemainingSlotCount",
        type: "POST",
        data: {
            scheduleCode: id
        },
        success: function (finalReturn) {
            let res = finalReturn.data;
            let result;
            result = $.parseJSON(res);
            if (result.resultCode == 200) {
                if ($('#' + id).css('background-color') == "rgb(227, 27, 73)") {
                    $('#AvailableSlotsDiv').fadeOut(200);
                    document.getElementById('txtAvailableSlots').innerHTML = 0;
                }
                else {
                    $('#AvailableSlotsDiv').fadeIn(200);
                    document.getElementById('txtAvailableSlots').innerHTML = result.data;
                }

            }
            else {
                swal({
                    title: "Invalid Operation",
                    type: "error",
                    html: "<span style='font-size: 15px; font-weight: bold; color: #E31B49'>" + result.resultMessage + "</span>",
                    showCancelButton: false,
                    confirmButtonColor: '#E31B49',
                    cancelButtonColor: '#E31B49',
                    confirmButtonText: 'OK',
                    cancelButtonText: 'NO',
                    confirmButtonClass: 'btn btn-danger',
                    cancelButtonClass: 'btn btn-danger',
                    //closeOnConfirm: false,
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.value) {
                        return false;
                    }
                });
            }
        }
    });
}
var agreed = 0;
var isNumberKey = function (evt) {
    var charCode = (evt.which) ? evt.which : event.keyCode;

    var excludedKey = (charCode >= 65 && charCode <= 90);

    if (!excludedKey) {
        return;
    } else {
        return evt.preventDefault();
    }
};
var Decimal = {
    convert: function (number, decimal_places) {
        if (typeof number === 'number' && typeof decimal_places === 'number') {
            var denominator = Math.pow(10, decimal_places),
                rounded_number = Math.round(number * denominator) / denominator;

            return rounded_number;
        } else {
            return number;
        }
    }
};
$('#txtMobileNumber').on('keydown', function (event) {
    isNumberKey(event);
});
$('#txtCCANo').on('keydown', function (event) {
    isNumberKey(event);
});
$('#txtCIF').on('keydown', function (event) {
    isNumberKey(event);
});
var dateObject;
//$('#txtBirthDate').daterangepicker({
//    timePicker: false,
//    timePickerIncrement: 30,
//    locale: {
//        format: 'MMMM DD, YYYY'
//    },
//    singleDatePicker: true,
//    showDropdowns: false,
//    //minYear: 1901,
//    //maxYear: parseInt(moment().format('YYYY'), 10),
//    onSelect: function () {
//        dateObject = $(this).val();
//    },

//}, function (start) {
//    var txtFinished = moment(Date.now()).format('YYYY-MM-DD');
//    var end = moment(new Date(txtFinished));
//    var duration = moment.duration(end.diff(start));
//    if ((Decimal.convert(duration.asYears(), 0) < 18)) {
//        swal({
//            title: "Invalid Operation",
//            type: "error",
//            html: "<span style='font-size: 15px; font-weight: bold; color: #E31B49'>Only 18 years old and above are allowed.</span>",
//            showCancelButton: false,
//            confirmButtonColor: '#E31B49',
//            cancelButtonColor: '#E31B49',
//            confirmButtonText: 'OK',
//            cancelButtonText: 'NO',
//            confirmButtonClass: 'btn btn-danger',
//            cancelButtonClass: 'btn btn-danger',
//            //closeOnConfirm: false,
//            allowOutsideClick: false
//        }).then((result) => {
//            if (result.value) {
//                $('#txtBirthDate').val('');
//                return false;
//            }
//        });
//    }
//});
$('#txtBirthDate').datepicker({
    'viewMode': 'years'
});
var inp = document.querySelector('input');
inp.addEventListener('input', function () {
    var value = this.value;
    var opt = [].find.call(this.list.options, function (option) {
        return option.value === value;
    });
    if (opt) {
        this.value = opt.textContent;
    }
});
$('#txtCityAddress').on('keyup', function () {
    var BirthPlaceArray = [];
    var BirthPlaceLength = document.getElementById('txtCityAddress').value.length;
    if (BirthPlaceLength == 3) {
        $.ajax({
            url: "/Home/SearchCity",
            type: "POST",
            data: {
                City: $('#txtCityAddress').val()
            },
            success: function (finalReturn) {
                let res = finalReturn.data;
                let result;
                result = $.parseJSON(res);
                if (result.resultCode == 200) {
                    $('#CityList').empty();
                    $.each(result.data, function (index, itemData) {
                        //BirthPlaceArray.push(itemData.provinceDescription + ", " + itemData.description);
                        //var CityListJoined = itemData.provinceDescription + ", " + ;
                        $('#CityList').append($('<option data-customvalue=' + itemData.provinceCode + '></option>').val(itemData.provinceDescription + ", " + itemData.description).html(itemData.description));
                    });
                    //console.log(result.data);
                    //autocomplete(document.getElementById("txtCityAddress"), BirthPlaceArray);

                }
                else {
                    swal({
                        title: "Invalid Operation",
                        type: "error",
                        html: "<span style='font-size: 15px; font-weight: bold; color: #E31B49'>" + result.resultMessage + "</span>",
                        showCancelButton: false,
                        confirmButtonColor: '#E31B49',
                        cancelButtonColor: '#E31B49',
                        confirmButtonText: 'OK',
                        cancelButtonText: 'NO',
                        confirmButtonClass: 'btn btn-danger',
                        cancelButtonClass: 'btn btn-danger',
                        //closeOnConfirm: false,
                        allowOutsideClick: false
                    }).then((result) => {
                        if (result.value) {
                            return false;
                        }
                    });
                }
            }
        });
    }
});

$('#txtCityAddress').on('input', function () {
    var value = $('#txtCityAddress').val();
    var BirthPlaceLength = document.getElementById('txtCityAddress').value.length;
    if (BirthPlaceLength >= 2) {
        CityListCode = $('#CityList [value="' + value + '"]').data('customvalue');
    }
});

$('#TermsAndCondition').on('click', function () {
    swal({
        title: "<span style='font-size: 20px;'>Terms & Condition</span>",
        showCancelButton: false,
        allowEscapeKey: false,
        confirmButtonColor: '#E31B49',
        confirmButtonText: 'OK',
        confirmButtonClass: 'btn',
        //closeOnConfirm: false
        allowOutsideClick: false
    }).then((result) => {
        if (result.value) {

        }
    });
});
$('#PrivacyPolicy').on('click', function () {
    swal({
        title: "<span style='font-size: 20px;'>Privacy policy</span>",
        showCancelButton: false,
        allowEscapeKey: false,
        confirmButtonColor: '#E31B49',
        confirmButtonText: 'OK',
        confirmButtonClass: 'btn',
        //closeOnConfirm: false
        allowOutsideClick: false
    }).then((result) => {
        if (result.value) {

        }
    });
});
$('#chkAgreement').on('click', function () {

    if ($('#chkAgreement').is(':checked')) {
        //swal({
        //    title: "Confirmation",
        //    html: "Are you sure you want to reserve a slot?",
        //    type: "info",
        //    showCancelButton: true,
        //    allowEscapeKey: false,
        //    confirmButtonColor: '#2E8B57',
        //    cancelButtonColor: '#E31B49',
        //    confirmButtonText: 'AGREE',
        //    cancelButtonText: 'DISAGREE',
        //    confirmButtonClass: 'btn',
        //    cancelButtonClass: 'btn',
        //    //closeOnConfirm: false
        //    allowOutsideClick: false
        //}).then((result) => {
        //    if (result.value) {

        //    }
        //});
        agreed = $(this).is(':checked') ? 1 : 0;
        $('#btnReserveSlot').prop('disabled', false);
    }
    else {
        $('#chkAgreement').prop('checked', false);
        agreed = 0;
        $('#btnReserveSlot').prop('disabled', 'disabled');
    }
});

function tabDispo(tabIndex) {
    if (tabIndex == 0) {
        $('#tabSchedule').prop('class', "active");
        document.getElementById('tabSelected').innerText = 'Schedule';
    } else $('#tabSchedule').prop('class', "");

    if (tabIndex == 1) {
        $('#tabPersonalInformation').prop('class', "active");
        document.getElementById('tabSelected').innerText = 'Personal Information';
    } else $('#tabPersonalInformation').prop('class', "");

    if (tabIndex == 2) {
        $('#tabSummary').prop('class', "active");
        document.getElementById('tabSelected').innerText = 'Summary';
    } else $('#tabSummary').prop('class', "");

    return true;
}

$('#btnSchedule_Next').on('click', function () {
    if ($('#InstitutionSelect').select2('val') == 0 || $('#InstitutionSelect').select2('val') == null) {
        $('#InstitutionSelect').data('select2').$container.addClass('highlightInvalid');
        setTimeout(function () {
            $('#InstitutionSelect').data('select2').$container.removeClass('highlightInvalid');

        }, 1000);
        return false;
    }
    if ($('#BranchSelect').select2('val') == 0 || $('#BranchSelect').select2('val') == null) {
        $('#BranchSelect').data('select2').$container.addClass('highlightInvalid');
        setTimeout(function () {
            $('#BranchSelect').data('select2').$container.removeClass('highlightInvalid');

        }, 1000);
        return false;
    }

    if (scheduleID == null) {
        $('#AvailableSchedDiv').addClass('highlightInvalid');
        setTimeout(function () {
            $('#AvailableSchedDiv').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;
        $('#AvailableSchedDiv').prop('checked', false);
        return false;
    }

    tabDispo(1);

    $('#ScheduleInformation').fadeOut(500, function () {
        $('#CustomerInformation').fadeIn(200);
        $('#SummaryInformation').fadeOut(1000);
        $('#ScheduleDivLoader').fadeOut(1000);

        return true;
    });
});

$('#btnCustomer_Back').on('click', function () {
    tabDispo(0);

    $('#CustomerInformation').fadeOut(500, function () {
        $('#ScheduleInformation').fadeIn(200);
        $('#SummaryInformation').fadeOut(1000);
        $('#ScheduleDivLoader').fadeOut(1000);

        return true;
    });
});

$('#btnSummary_Back').on('click', function () {
    tabDispo(1);

    $('#SummaryInformation').fadeOut(500, function () {
        $('#CustomerInformation').fadeIn(200);
        $('#ScheduleInformation').fadeOut(1000);
        $('#ScheduleDivLoader').fadeOut(1000);

        return true;
    });
});

$('#btnCustomer_Next').on('click', function () {
    if ($('#txtCCANo').val() == null || $('#txtCCANo').val() == '' || $('#txtCCANo').val() == undefined) {
        $('#txtCCANo').addClass('highlightInvalid');
        setTimeout(function () {
            $('#txtCCANo').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;       
        return false;
    }

    if (document.getElementById('txtCCANo').value.length < 14) {
        $('#CCANoDiv').fadeIn(500);
        $('#txtCCANo').addClass('highlightInvalid');
        setTimeout(function () {
            $('#CCANoDiv').fadeOut(1000);
            $('#txtCCANo').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;
        return false;
    }

    if ($('#txtCIF').val() != '' && document.getElementById('txtCIF').value.length < 13) {
        $('#CIFDiv').fadeIn(500);
        $('#txtCIF').addClass('highlightInvalid');
        setTimeout(function () {
            $('#CIFDiv').fadeOut(1000);
            $('#txtCIF').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;
        return false;
    }

    if ($('#txtFirstName').val() == null || $('#txtFirstName').val() == '' || $('#txtFirstName').val() == undefined) {
        $('#txtFirstName').addClass('highlightInvalid');
        setTimeout(function () {
            $('#txtFirstName').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;       
        return false;
    }

    if ($('#txtLastName').val() == null || $('#txtLastName').val() == '' || $('#txtLastName').val() == undefined) {
        $('#txtLastName').addClass('highlightInvalid');
        setTimeout(function () {
            $('#txtLastName').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;
        $('#chkAgreement').prop('checked', false);
        return false;
    }

    if ($('#txtEmail').val() == null || $('#txtEmail').val() == '' || $('#txtEmail').val() == undefined) {
        $('#txtEmail').addClass('highlightInvalid');
        setTimeout(function () {
            $('#txtEmail').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;
        $('#chkAgreement').prop('checked', false);
        return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($('#txtEmail').val())) {
        $('#EmailDiv').fadeIn(500);
        $('#txtEmail').addClass('highlightInvalid');
        setTimeout(function () {
            $('#EmailDiv').fadeOut(1000);
            $('#txtEmail').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;
        $('#chkAgreement').prop('checked', false);
        return false;
    }

    if ($('#txtBirthDate').val() == null || $('#txtBirthDate').val() == '' || $('#txtBirthDate').val() == undefined) {
        $('#txtBirthDate').addClass('highlightInvalid');
        setTimeout(function () {
            $('#txtBirthDate').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;
        $('#txtBirthDate').prop('checked', false);
        return false;
    }
    if ($('#txtMobileNumber').val() == null || $('#txtMobileNumber').val() == '' || $('#txtMobileNumber').val() == undefined || document.getElementById('txtMobileNumber').value.length < 11) {
        $('#txtMobileNumber').addClass('highlightInvalid');
        setTimeout(function () {
            $('#txtMobileNumber').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;
        $('#txtMobileNumber').prop('checked', false);
        return false;
    }

    if ($('#txtMobileNumber').val().substr(0,2) != '09') {
        $('#MobileNoDiv').fadeIn(500);
        $('#txtMobileNumber').addClass('highlightInvalid');
        setTimeout(function () {
            $('#MobileNoDiv').fadeOut(1000);
            $('#txtMobileNumber').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;       
        return false;
    }

    if (moment($('#txtBirthDate').val()).format("YYYY-MM-DD") == "Invalid Date") {
        $('#txtBirthDate').addClass('highlightInvalid');
        setTimeout(function () {
            $('#txtBirthDate').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;
        $('#txtBirthDate').prop('checked', false);
        return false;
    }

    var txtStart = moment($('#txtBirthDate').val()).format('YYYY-MM-DD');
    var txtFinished = moment(Date.now()).format('YYYY-MM-DD');

    var end = moment(new Date(txtFinished));
    var duration = moment.duration(end.diff(txtStart));
    if ((Decimal.convert(duration.asYears(), 0) < 18)) {
        swal({
            title: "Invalid Operation",
            type: "error",
            html: "<span style='font-size: 15px; font-weight: bold; color: #E31B49'>Only 18 years old and above are allowed.</span>",
            showCancelButton: false,
            confirmButtonColor: '#E31B49',
            cancelButtonColor: '#E31B49',
            confirmButtonText: 'OK',
            cancelButtonText: 'NO',
            confirmButtonClass: 'btn btn-danger',
            cancelButtonClass: 'btn btn-danger',
            //closeOnConfirm: false,
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                $('#txtBirthDate').val('');
            }
        });
        return false;
    }

    document.getElementById('summBranch').innerText = $('#BranchSelect option:selected').text();
    document.getElementById('summSchedule').innerText = scheduleDateAndTime;
    document.getElementById('summCCANo').innerText = $('#txtCCANo').val();
    document.getElementById('summCIF').innerText = $('#txtCIF').val();
    document.getElementById('summFullName').innerText = $('#txtFirstName').val() + ' ' + $('#txtMiddleName').val() + ' ' + $('#txtLastName').val() + $('#txtSuffix').val();
    document.getElementById('summDOB').innerText = $('#txtBirthDate').val();
    document.getElementById('summEmail').innerText = $('#txtEmail').val();
    document.getElementById('summMobile').innerText = $('#txtMobileNumber').val();
    document.getElementById('summTransactionType').innerText = 'ATM';

    tabDispo(2);

    $('#CustomerInformation').fadeOut(500, function () {
        $('#SummaryInformation').fadeIn(200);
        $('#ScheduleInformation').fadeOut(1000);
        $('#ScheduleDivLoader').fadeOut(1000);

        return true;
    });
});

$('#btnReserveSlot').on('click', function () {
    if ($('#InstitutionSelect').select2('val') == 0 || $('#InstitutionSelect').select2('val') == null) {
        $('#InstitutionSelect').data('select2').$container.addClass('highlightInvalid');
        setTimeout(function () {
            $('#InstitutionSelect').data('select2').$container.removeClass('highlightInvalid');

        }, 1000);
        return false;
    }
    if ($('#BranchSelect').select2('val') == 0 || $('#BranchSelect').select2('val') == null) {
        $('#BranchSelect').data('select2').$container.addClass('highlightInvalid');
        setTimeout(function () {
            $('#BranchSelect').data('select2').$container.removeClass('highlightInvalid');

        }, 1000);
        return false;
    }

    if ($('#txtCCANo').val() == null || $('#txtCCANo').val() == '' || $('#txtCCANo').val() == undefined || document.getElementById('txtCCANo').value.length < 14) {
        $('#txtCCANo').addClass('highlightInvalid');
        setTimeout(function () {
            $('#txtCCANo').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;        
        return false;
    }

    if ($('#txtCIF').val() != '' && document.getElementById('txtCIF').value.length < 13) {
        $('#CIFDiv').fadeIn(500);
        $('#txtCIF').addClass('highlightInvalid');
        setTimeout(function () {
            $('#CIFDiv').fadeOut(1000);
            $('#txtCIF').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;
        return false;
    }

    if ($('#txtFirstName').val() == null || $('#txtFirstName').val() == '' || $('#txtFirstName').val() == undefined) {
        $('#txtFirstName').addClass('highlightInvalid');
        setTimeout(function () {
            $('#txtFirstName').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;
        $('#chkAgreement').prop('checked', false);
        return false;
    }

    if ($('#txtLastName').val() == null || $('#txtLastName').val() == '' || $('#txtLastName').val() == undefined) {
        $('#txtLastName').addClass('highlightInvalid');
        setTimeout(function () {
            $('#txtLastName').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;
        $('#chkAgreement').prop('checked', false);
        return false;
    }

    if ($('#txtEmail').val() == null || $('#txtEmail').val() == '' || $('#txtEmail').val() == undefined) {
        $('#txtEmail').addClass('highlightInvalid');
        setTimeout(function () {
            $('#txtEmail').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;
        $('#chkAgreement').prop('checked', false);
        return false;
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test($('#txtEmail').val())) {
        $('#EmailDiv').fadeIn(500);
        $('#txtEmail').addClass('highlightInvalid');
        setTimeout(function () {
            $('#EmailDiv').fadeOut(1000);
            $('#txtEmail').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;
        $('#chkAgreement').prop('checked', false);
        return false;
    }
    if (document.getElementById('txtCCANo').value.length < 14) {
        $('#CCANoDiv').fadeIn(500);
        $('#txtCCANo').addClass('highlightInvalid');
        setTimeout(function () {
            $('#CCANoDiv').fadeOut(1000);
            $('#txtCCANo').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;      
        return false;
    }
    if ($('#txtBirthDate').val() == null || $('#txtBirthDate').val() == '' || $('#txtBirthDate').val() == undefined) {
        $('#txtBirthDate').addClass('highlightInvalid');
        setTimeout(function () {
            $('#txtBirthDate').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;
        $('#txtBirthDate').prop('checked', false);
        return false;
    }
    if ($('#txtMobileNumber').val() == null || $('#txtMobileNumber').val() == '' || $('#txtMobileNumber').val() == undefined || document.getElementById('txtMobileNumber').value.length < 11) {
        $('#txtMobileNumber').addClass('highlightInvalid');
        setTimeout(function () {
            $('#txtMobileNumber').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;
        $('#txtMobileNumber').prop('checked', false);
        return false;
    }

    if (moment($('#txtBirthDate').val()).format("YYYY-MM-DD") == "Invalid Date") {
        $('#txtBirthDate').addClass('highlightInvalid');
        setTimeout(function () {
            $('#txtBirthDate').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;
        $('#txtBirthDate').prop('checked', false);
        return false;
    }  

    var txtStart = moment($('#txtBirthDate').val()).format('YYYY-MM-DD');
    var txtFinished = moment(Date.now()).format('YYYY-MM-DD');

    var end = moment(new Date(txtFinished));
    var duration = moment.duration(end.diff(txtStart));
    if ((Decimal.convert(duration.asYears(), 0) < 18)) {
        swal({
            title: "Invalid Operation",
            type: "error",
            html: "<span style='font-size: 15px; font-weight: bold; color: #E31B49'>Only 18 years old and above are allowed.</span>",
            showCancelButton: false,
            confirmButtonColor: '#E31B49',
            cancelButtonColor: '#E31B49',
            confirmButtonText: 'OK',
            cancelButtonText: 'NO',
            confirmButtonClass: 'btn btn-danger',
            cancelButtonClass: 'btn btn-danger',
            //closeOnConfirm: false,
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                $('#txtBirthDate').val('');
            }
        });
        return false;
    }
    if (CityListCode == undefined) {
        swal({
            title: "Invalid Operation",
            type: "error",
            html: "<span style='font-size: 15px; font-weight: bold; color: #E31B49'>Can't find city code of selected city.</span>",
            showCancelButton: false,
            confirmButtonColor: '#E31B49',
            cancelButtonColor: '#E31B49',
            confirmButtonText: 'OK',
            cancelButtonText: 'NO',
            confirmButtonClass: 'btn btn-danger',
            cancelButtonClass: 'btn btn-danger',
            //closeOnConfirm: false,
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                $('#txtCityAddress').val('');
            }
        });
        return false;
    }
    //alert(CityListCode + ", " + Decimal.convert(duration.asYears(), 0));
    //return false;
    if (scheduleID == null) {
        $('#AvailableSchedDiv').addClass('highlightInvalid');
        setTimeout(function () {
            $('#AvailableSchedDiv').removeClass('highlightInvalid');
        }, 1000);
        agreed = 0;
        $('#AvailableSchedDiv').prop('checked', false);
        return false;
    }
    else {

        swal({
            title: "Confirmation",
            html: "Are you sure you want to reserve a slot?",
            type: "info",
            showCancelButton: true,
            allowEscapeKey: false,
            confirmButtonColor: '#2E8B57',
            cancelButtonColor: '#E31B49',
            confirmButtonText: 'YES',
            cancelButtonText: 'NO',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger',
            //closeOnConfirm: false
            allowOutsideClick: false
        }).then((result) => {
            if (result.value) {
                swal.queue([{
                    title: 'Processing',
                    html: 'Please wait...',
                    showCancelButton: false,
                    showConfirmButton: false,
                    allowEscapeKey: false,
                    allowOutsideClick: false,
                    onOpen: function () {
                        swal.showLoading();
                        setTimeout(function () {

                            ReserveSlot(scheduleID, $('#txtFullname').val(), CityListCode, moment($('#txtBirthDate').val()).format("YYYY-MM-DD"), $('#txtMobileNumber').val(), $('#txtEmail').val());
                        }, 800);
                    }
                }]);
            }
        });
    }

});

function ReserveSlot(scheduleCode, ccaNo, cif, firstName, middleName, lastName, suffix, fullName, cityaddress, birthdate, mobileNumber, email) {
    //alert(cityaddress);
    //return false;
    $.ajax({
        url: "/Home/ReserveSlot",
        type: "POST",
        data: {
            scheduleCode: scheduleCode,
            ccaNo: ccaNo,
            cif: cif,
            firstName: firstName,
            middleName: middleName,
            lastName: lastName,
            suffix: suffix,            
            birthdate: birthdate,
            mobileNumber: mobileNumber,
            email: email
        },
        success: function (finalReturn) {
            let res = finalReturn.data;
            let result;
            result = $.parseJSON(res);
            if (result.resultCode == 200) {
                swal({
                    html: "Please visit your email to confirm your reservation.",
                    type: "success",
                    allowEscapeKey: false,
                    showCancelButton: false,
                    confirmButtonColor: '#2E8B57',
                    //cancelButtonColor: '#E31B49',
                    confirmButtonText: 'OK',
                    //cancelButtonText: 'NO',
                    confirmButtonClass: 'btn btn-success',
                    //cancelButtonClass: 'btn btn-danger',
                    //closeOnConfirm: false
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.value) {
                        window.location.reload();
                    }

                });
            }
            else {
                swal({
                    title: "Invalid Operation",
                    type: "error",
                    html: "<span style='font-size: 15px; font-weight: bold; color: #E31B49'>" + result.resultMessage + "</span>",
                    showCancelButton: false,
                    confirmButtonColor: '#E31B49',
                    cancelButtonColor: '#E31B49',
                    confirmButtonText: 'OK',
                    cancelButtonText: 'NO',
                    confirmButtonClass: 'btn btn-danger',
                    cancelButtonClass: 'btn btn-danger',
                    //closeOnConfirm: false,
                    allowOutsideClick: false
                }).then((result) => {
                    if (result.value) {
                        return false;
                    }
                });
            }


        }
    });
}
    //function moveToNext(fromText, toText) {
    //    var that = this;
    //    var length = fromText.value.length;
    //    var maxLength = fromText.getAttribute("maxLength");


    //    if (length == maxLength && toText != '') {
    //        document.getElementById(toText).focus();

    //    }

    //}
    //$('#btnSubmitOTP').on('click', function () {
    //    var OTPLength = 0;
    //    OTPLength = document.getElementsByName('txtOTP').values;
    //    console.log(OTPLength);
    //    if (parseInt(OTPLength) == 6) {

    //    }
    //    else {
    //        swal({
    //            title: "Please complete the following details.",
    //            showCancelButton: false,
    //            confirmButtonColor: '#E31B49',
    //            cancelButtonColor: '#E31B49',
    //            confirmButtonText: 'OK',
    //            cancelButtonText: 'NO',
    //            confirmButtonClass: 'btn btn-danger',
    //            cancelButtonClass: 'btn btn-danger',
    //            //closeOnConfirm: false,
    //            allowOutsideClick: false
    //        }).then((result) => {
    //            if (result.value) {
    //                return false;
    //            }
    //        });
    //    }
    //});

$('#tabSchedule').on('click', function () {
    $("#btnCustomer_Back").trigger("click");
});

$('#tabPersonalInformation').on('click', function () {
    $("#btnSchedule_Next").trigger("click");
});

$('#tabSummary').on('click', function () {
    $("#btnCustomer_Next").trigger("click");
});