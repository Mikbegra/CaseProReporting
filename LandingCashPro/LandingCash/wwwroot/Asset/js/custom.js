

var globalactivityId;
var globalActivityType;
var handleBlurEvent = true;

//$('.Jobcard').on('blur', 'input, textarea, button, select', function () {
//    Savedate();
//});
$('.Installation, .loading, .Tipping').change(function () {

    var fileName = $(this).val();
    var ext = fileName.split('.').pop().toLowerCase();
    var errorMessageElement = $(this).closest('.form-group').find('.fileError');

    if ($.inArray(ext, ['jpg', 'jpeg', 'gif', 'img', 'png']) == -1) {
        errorMessageElement.html('Invalid file type. Only JPEG, JPG, GIF, or IMG files are allowed.');
        $(this).val('');
    } else {
        errorMessageElement.html('');
    }
});
var previousTabSelectionId = "tab1";
var currentTabId = "tab1";
var pendingNavigation = null;
var myArray = {
    tab1: ".Jobcard",
    tab2: "#content2",
    tab3: "#content3",
    tab4: "#divActivityDetails",
    tab5: "#content5",
    tab6: "#content6",
    tab7: "#content7"

};
$("input[type='radio'][name='tabs']").change(function () {

    var currentTabSelectionId = $(this).val();
    currentTabId = $("input[type='radio'][name='tabs']:checked")[0].id;
    currentTabSelectionId = $("input[type='radio'][name='tabs']:checked")[0].id;
    if (previousTabSelectionId != currentTabSelectionId) {
        var selector = myArray[previousTabSelectionId];
        var changes = DoChangesExistsJobCard(selector,false)

        if (changes) {
            $('#ModelUnSavedChangesConfirmation').modal('show');
            $("input[name='tabs'][id='" + previousTabSelectionId + "']").prop("checked", true);//.trigger("click");
            return false;
        }
        else {
            previousTabSelectionId = currentTabSelectionId;
        }
    }

})

$('.nav-link').click(function (e) {
    debugger;
    var targetHref = $(this).attr('href');
    var selector = myArray[previousTabSelectionId];
    var changes = DoChangesExistsJobCard(selector, false);

    if (changes) {
        e.preventDefault();
        pendingNavigation = targetHref;
        $('#ModelUnSavedChangesConfirmation').modal('show');
        return false;
    } else {
        window.location.href = targetHref;
    }
});

//function SavePendingChanges() {
//   
//    Savedate();
//}

function TabChange() {
    $("input[type='radio'][name='tabs']:checked");
}
function DoChangesExistsJobCard(selector,IsValid) {
    var doChangesExists = false;

    if (selector == ".Jobcard") {
        $(selector).find("input,select,textarea").each(function () {
            var currentElementsId = $(this).attr("id");
            if (currentElementsId != undefined) {
                var currentVal = $(this).val();
                var oldVal = $(this).attr('oldvalue');
                if (IsValid) {
                    $(this).val($(this).attr('oldvalue'));
                    $('#activityType').val(null).trigger('change');
                    //$("#activityType").val('');
                    $("#ActivityTypeString").val('');
                }
                if (currentVal != oldVal && this.type != "hidden" && this.type != "file" && this.type != "button") {
                    doChangesExists = true;
                }
            }
        });
    }
    if (doChangesExists == false && selector == ".Jobcard") {

        //check customer detail pending changes
        doChangesExists = CustomerDetailsChangeExists(IsValid);

    }
    else if (doChangesExists == false && selector == "#content2") {

        //check product detail pending changes
        doChangesExists = ProductDetailsChangeExists();

    }
    else if (doChangesExists == false && selector == "#content3") {

        //check resources detail pending changes
        doChangesExists = ResoursesDetailsChangeExists(IsValid);

    }
    else if (doChangesExists == false && selector == "#divActivityDetails") {
        
        var activityType = $('#activityType').val();
        //if (activityType == "Site Installation" || activityType == "Site Uplift") {
        if (activityType.includes("Site Installation") || activityType.includes("Site Uplift")) {
            selector = ".siteInstallation";
        }
        else if (activityType.includes('Yard Loading')) {
            selector = ".yardLoading";
        }
        else if (activityType.includes('Yard Tipping')) {
            selector = ".yardTipping";
        }
        else {
            selector = ".siteInstallation";
        }

        $(selector).find("input,select,textarea").each(function () {
            var currentElementsId = $(this).attr("id");
            var currentVal = $(this).val();
            var oldVal = $(this).attr('oldvalue');
            if (IsValid) {
                $(this).val(oldVal)
            }
            if (currentVal != oldVal && this.type != "hidden" && this.type != "file" && this.type != "button") {
                doChangesExists = true;
            }

        });
        
        if (doChangesExists == false) {
            doChangesExists = TeamTimeDetailsChangeExists();
        }

    }
    return doChangesExists;
}

function CustomerDetailsChangeExists(IsValid) {

    var doChangesExists = false;
    $('#custidfordom').find('.original-row').each(function (i, obj) {

        if (!$(obj).hasClass("existingRow")) {
            var $currentRow = $(obj);
            var CustomerName = $currentRow.find('input[name="item.CustomerName"]').val();
            var ContactNo = $currentRow.find('input[name="item.ContactNo"]').val();
            if (IsValid) {
                //$currentRow.remove();
            }
            if ((CustomerName != "" && ContactNo == "") || (CustomerName == "" && ContactNo != "")) {
                doChangesExists = true;
            }
        }
    });
    return doChangesExists;
}
function ValidateCustomerDetailsData() {

    var isValidFinal = true;
    $('#custidfordom').find('.original-row').each(function (i, obj) {

        if (!$(obj).hasClass("existingRow")) {
            var $currentRow = $(obj);
            var isValid = validateInputFieldsCustomerDetailis($currentRow);

            if (!isValid) {
                isValidFinal = false;
            }

        }
    });
    return isValidFinal;
}
function ValidateandSaveData() {

    var isVaild = Savedate();
    //
    //if (isValid) {
    //    SaveJobCustomerDetails();
    //}

    //var actId = $('#activityid').val();
    //window.location.href = '/Activity/CreateActivity/' + actId;
}

var previousTabId = "";
var currentTabId = "";

function IgnoreChnages() {
    var previousTabId = $("input[type='radio'][name='tabs']:checked")[0].id;

    if (previousTabId != currentTabId) {
        var selector = myArray[previousTabId];
    }
    var changes = DoChangesExistsJobCard(selector, true);
    $('#ModelUnSavedChangesConfirmation').modal('hide');
    var newTabId = currentTabId;
    previousTabSelectionId = newTabId;
    $("input[name='tabs'][id='" + newTabId + "']").prop("checked", true);
    if (pendingNavigation) {
        window.location.href = pendingNavigation;
    }
}


$(document).ready(function () {

    const currentUrl = window.location.href;

    // Initialize the editFlag variable
    let editFlag = false;

    // Check if the URL has query parameters
    if (currentUrl.includes('?')) {
        // Extract the part after '?'
        const queryString = currentUrl.split('?')[1];

        // Split the query string into key-value pairs
        const queryParams = queryString.split('&');

        // Find the 'editFlag' parameter and extract its value
        for (let param of queryParams) {
            const [key, value] = param.split('=');
            if (key === 'editFlag') {
                editFlag = value;
                break;
            }
        }
    }


    var doDisable = true;
    var doDisablePD = true;
    var doDisableRD = true;
    var doDisableTeamTime = true;
    $(".jb").each(function () {
        if ($(this).val() != "") {
            doDisable = doDisable && true;

        }
        else {
            doDisable = doDisable && false;
        }
    });

    if (doDisable == true) {
        $('.jb').attr('disabled', 'disabled');
        $("#Customer").removeAttr("disabled");
        $("#SAGEOrder").removeAttr("disabled");
        $("#HCJob").removeAttr("disabled");
    }


    $(".teamTimeCtl").each(function () {
        if ($(this).val() != "") {
            doDisableTeamTime = doDisableTeamTime && true;

        }
        else {
            doDisableTeamTime = doDisableTeamTime && false;
        }
    });

    if (doDisableTeamTime == true) {
        $('.teamTimeCtl').attr('disabled', 'disabled');
    }



    //product
    if (!editFlag) {
        $(".PD").each(function () {
            if ($(this).val() != "") {
                doDisablePD = doDisablePD && true;

            }
            else {
                doDisablePD = doDisablePD && false;
            }
        });

        if (doDisablePD == true) {
            $('.PD').attr('disabled', 'disabled');
        }
    }

    //resourese 
    if (!editFlag) {
        $(".RD").each(function () {
            if ($(this).val() != "") {
                doDisableRD = doDisableRD && true;

            }
            else {
                doDisableRD = doDisableRD && false;
            }
        });

        if (doDisableRD == true) {
            //$('.RD').attr('disabled', 'disabled');
        }
    }
    const checkboxes = document.querySelectorAll('.is-read-only');

    // Add change event listener to each checkbox
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            // Get the current row
            const row = this.closest('tr');

            // Get all input, select, and textarea elements in the current row
            const fields = row.querySelectorAll('input, select, textarea');

            // Toggle the disabled attribute based on the checkbox state
            fields.forEach(field => {
                if (field !== this && field.type !== 'button') {  // Exclude the checkbox itself
                    field.disabled = this.checked;
                }
            });
        });
    });
    function toggleTextarea() {
        if ($('#IsNotNeeded').is(':checked')) {
            $('#Whyitsnotneeded').removeClass('disabled').prop('disabled', false);
        } else {
            $('#Whyitsnotneeded').addClass('disabled').prop('disabled', true);
            $('#Whyitsnotneeded').val('');
        }
    }

    // Initial call to set the correct state on page load
    toggleTextarea();

    // Event listener for checkbox change
    $('#IsNotNeeded').change(function () {
        toggleTextarea();
    });
    $('#tab7').on('change', function () {
        if ($(this).is(':checked')) {
            var activityId = $('#activityid').val();

            if (activityId != 0) {
                if (activityId != 0) {
                    $.ajax({
                        url: '/activity/GetAuditData',
                        method: 'POST',
                        data: { activityId: activityId },
                        success: function (response) {
                            if (response.success) {
                                var tbody = $('#myTable2 tbody');
                                tbody.empty();

                                response.data.forEach(function (item) {
                                    var actionDate = new Date(item.actionDate);
                                    var formattedDate = [
                                        ('0' + actionDate.getDate()).slice(-2),
                                        ('0' + (actionDate.getMonth() + 1)).slice(-2),
                                        actionDate.getFullYear()
                                    ].join('-');
                                    var row = '<tr>' +
                                        '<td>' + item.auditText + '</td>' +
                                        '<td>ASLAdmin</td>' +
                                        '<td>' + formattedDate + '</td>' +
                                        '</tr>';
                                    tbody.append(row);
                                });

                            }
                        },
                        error: function (xhr, status, error) {
                        }
                    });
                }
            }
        }
    });
   
});

var isDropdownOrTextboxFocusedProductDetails = false;
$(document).ready(function () {
    if ($("#tab6").next(".our_tab_box").css('display') == 'block') {
        console.log("Tab0 has a display block");
        $("#tab6").click();
    }
    else {
        console.log("Tab0 has a display none");
    }
    if ($("#roleName").val() == "ReadOnly") {
        $('.form-control').attr('disabled', 'disabled');
        console.log("User is on Readonly role");
    } else {
        console.log("User is on Admin role");
    }

    $('#myTable1').on('focus', 'input[type="text"], select', function () {
        //isDropdownOrTextboxFocusedProductDetails = true;
    });

    $('#myTable1').on('click', function () {
        isDropdownOrTextboxFocusedProductDetails = false;
        $('.text-danger').empty();
    });
    $('#activityType').select2({
        placeholder: "Select activity types",
        allowClear: true
    }).on('change', function () {
        var selectedValues = $(this).val();
        $('#ActivityTypeString').val(selectedValues.join(','));
        console.log($('#ActivityTypeString').val());
    });;
    function clearValidationErrors($row) {
        $row.find('.text-danger').empty();
    }


});



function SaveProductDetails() {


    var saveAllowed = ValidateProductDetailsData();
    if (saveAllowed) {

        $('#myTable1').find('.productDetailRow').each(function (i, obj) {

            //if (!$(obj).hasClass("existingRow")) {

            var $currentRow = $(obj);//.closest('.original-row');

            var aid = $('#activityid').val();

            if (!aid) {
                $('#fildata').fadeIn().delay(1000).fadeOut();
                return;
            }

            clearValidationErrorsProductDetails($currentRow);

            //var isValid = validateInputFieldsProductDetails($currentRow);

            //if (isValid && !isDropdownOrTextboxFocused) {
            if (!isDropdownOrTextboxFocusedProductDetails) {

                var requestData = {
                    aid: aid,
                    shift: $currentRow.find('select[name="Shift"]').val(),
                    date: $currentRow.find('input[name="Date"]').val(),
                    summaryOfWorks: $currentRow.find('input[name="SummaryOfWorks"]').val(),
                    pid: $currentRow.find('#pid').val()
                };

                $.ajax({
                    url: '/activity/ProductData',
                    method: 'POST',
                    data: requestData,
                    success: function (response) {
                        if (response.success) {
                            var doDisable = true;
                            $currentRow.addClass('existingRow');
                            $(".PD").each(function () {
                                var currVal = $(this).val();

                                if (currVal != "") {
                                    doDisable = doDisable && true;
                                    $(this).attr("oldvalue", currVal)

                                }
                                else {
                                    doDisable = doDisable && false;
                                }
                            });

                            if (doDisable == true) {
                                $('.PD').attr('disabled', 'disabled');
                            }

                            if (response.pid > 0) {

                                $('#Productupdatemessage').fadeIn().delay(1000).fadeOut();
                            } else {
                                $('#Productsuccessmessage').fadeIn().delay(1000).fadeOut();
                            }
                        }
                    },
                    error: function (xhr, status, error) {
                        $('#Producterrormessage').fadeIn().delay(1000).fadeOut();
                    }
                });
            }


            //}
        });
    }

}

function ValidateProductDetailsData() {

    var isValidFinal = true;
    $('#myTable1').find('.productDetailRow').each(function (i, obj) {

        //if (!$(obj).hasClass("existingRow")) {
        var $currentRow = $(obj);
        clearValidationErrorsProductDetails($currentRow);
        var isValid = validateInputFieldsProductDetails($currentRow);

        if (!isValid) {
            isValidFinal = false;
        }

        //}
    });
    return isValidFinal;
}
function clearValidationErrorsProductDetails($row) {
    $row.find('.text-danger').empty();
}

function ProductDetailsChangeExists() {

    var doChangesExists = false;
    $('#myTable1').find('.productDetailRow').each(function (i, obj) {
        var $currentRow = $(obj);
        var SummaryOfWorks = $currentRow.find('input[name="SummaryOfWorks"]').val();
        var Dateval = $currentRow.find('input[name="Date"]').val();
        var Shift = $currentRow.find('select[name="Shift"]').val();
        if (!$currentRow.hasClass("existingRow")) {
            if ((SummaryOfWorks != "" || Dateval != "" || Shift != ""))// || (Name == "" && Comments == "" && Shift == "")) {
            {
                doChangesExists = true;
            }
        }
        else {
            var SummaryOfWorksOldVal = $currentRow.find('input[name="SummaryOfWorks"]').attr('oldvalue');
            var DatevalOldVal = $currentRow.find('input[name="Date"]').attr('oldvalue');
            var ShiftOldVal = $currentRow.find('select[name="Shift"]').attr('oldvalue');
            if ((SummaryOfWorks != SummaryOfWorksOldVal || Dateval != DatevalOldVal || Shift != ShiftOldVal)) {
                doChangesExists = true;
            }
        }
    });
    return doChangesExists;
}

function validateInputFieldsProductDetails($row) {



    var isValid = true;

    var SummaryOfWorks = $row.find('input[name="SummaryOfWorks"]').val();
    var Dateval = $row.find('input[name="Date"]').val();
    var Shift = $row.find('select[name="Shift"]').val();
    if ((SummaryOfWorks != "" && Dateval != "" && Shift != ""))// || (SummaryOfWorks == "" && Dateval == "" && Shift == ""))
    {
    }
    else {
        isValid = false;
    }


    if (!isValid) {
        $row.find('input[name="SummaryOfWorks"], input[name="Date"] ,select').each(function () {
            var $input = $(this);
            var fieldName = $input.attr('name');
            var fieldValue = $input.val();

            if (!fieldValue.trim()) {
                isValid = false;
                $row.find('#' + fieldName + "Error").text(fieldName + ' is required');
            }
        });
    }
    return isValid;
}

var isDropdownOrTextboxFocusedResoursesDetails = false;
$(document).ready(function () {


    $('#myTable').on('focus', 'input[type="text"], select', function () {
        //isDropdownOrTextboxFocusedResoursesDetails = true;
    });

    $('#myTableOld').on('blur', 'input[type="text"], select', function () {

        var $currentRow = $(this).closest('tr');
        var aid = $('#activityid').val();

        if (!aid) {
            $('#fildata').fadeIn().delay(1000).fadeOut();
            return;
        }

        clearValidationErrorsResoursesDetails($currentRow);

        var isValid = validateInputFieldsResoursesDetails($currentRow);

        if (isValid && !isDropdownOrTextboxFocusedResoursesDetails) {
            var requestData = {
                resourcetype: $currentRow.find('select[name="ResourceType"]').val(),
                shift: $currentRow.find('select[name="Shift"]').val(),
                daynight: $currentRow.find('select[name="DayNight"]').val(),
                name: $currentRow.find('input[name="Name"]').val(),
                comment: $currentRow.find('input[name="Comments"]').val(),
                rid: $currentRow.find('#rid').val(),
                isReadOnly: 0,//$currentRow.find('#IsReadOnly').is(':checked'),
                aid: aid
            };

            // Perform AJAX request to save the data
            $.ajax({
                url: '/activity/ResourseData',
                method: 'POST',
                data: requestData,
                success: function (response) {
                    if (response.success) {
                        var doDisable = true;
                        $(".RD").each(function () {
                            if ($(this).val() != "") {
                                doDisable = doDisable && true;

                            }
                            else {
                                doDisable = doDisable && false;
                            }
                        });

                        if (doDisable == true) {
                            //$('.RD').attr('disabled', 'disabled');
                        }

                        if (response.rid > 0) {

                            $('#resourseupdatemessage').fadeIn().delay(1000).fadeOut();
                        } else {
                            $('#resoursesuccessmessage').fadeIn().delay(1000).fadeOut();
                        }
                    }
                },
                error: function (xhr, status, error) {
                    $('#resourseerrormessage').fadeIn().delay(1000).fadeOut();
                }
            });
        }

    });


    $('#myTable').on('click', function () {
        isDropdownOrTextboxFocusedResoursesDetails = false;
        $('.text-danger').empty();
    });




})


function SaveResoursesDetails() {


    var saveAllowed = ValidateResoursesDetailsData();
    if (saveAllowed) {

        $('#myTable').find('.resourcesDetailRow').each(function (i, obj) {

            //if (!$(obj).hasClass("existingRow")) {

            var $currentRow = $(obj);//.closest('.original-row');

            var aid = $('#activityid').val();

            if (!aid) {
                $('#fildata').fadeIn().delay(1000).fadeOut();
                return;
            }

            clearValidationErrorsResoursesDetails($currentRow);

            //var isValid = validateInputFieldsResoursesDetails($currentRow);

            //if (isValid && !isDropdownOrTextboxFocused) {
            if (!isDropdownOrTextboxFocusedResoursesDetails) {

                var requestData = {
                    resourcetype: $currentRow.find('select[name="ResourceType"]').val(),
                    shift: $currentRow.find('select[name="Shift"]').val(),
                    daynight: $currentRow.find('select[name="DayNight"]').val(),
                    name: $currentRow.find('input[name="Name"]').val(),
                    comment: $currentRow.find('input[name="Comments"]').val(),
                    rid: $currentRow.find('#rid').val(),
                    aid: aid,
                    isReadOnly: 0//$currentRow.find('#IsReadOnly').is(':checked')
                };
                $.ajax({
                    url: '/activity/ResourseData',
                    method: 'POST',
                    data: requestData,
                    success: function (response) {

                        if (response.success) {
                            var doDisable = true;
                            $currentRow.addClass('existingRow');
                            $(".RD").each(function () {
                                var currVal = $(this).val();

                                if (currVal != "") {
                                    doDisable = doDisable && true;
                                    $(this).attr("oldvalue", currVal)

                                }
                                else {
                                    doDisable = doDisable && false;
                                }
                            });

                            if (doDisable == true) {
                               // $('.RD').attr('disabled', 'disabled');
                            }

                            if (response.rid > 0) {
                                $('#resourseupdatemessage').fadeIn().delay(1000).fadeOut();
                            } else {
                                $('#resoursesuccessmessage').fadeIn().delay(1000).fadeOut();
                            }
                        }
                    },
                    error: function (xhr, status, error) {
                        $('#resourseerrormessage').fadeIn().delay(1000).fadeOut();
                    }
                });
            }


            //}
        });
    }

}

function ValidateResoursesDetailsData() {

    var isValidFinal = true;
    $('#myTable').find('.resourcesDetailRow').each(function (i, obj) {

        //if (!$(obj).hasClass("existingRow")) {
        var $currentRow = $(obj);
        clearValidationErrorsResoursesDetails($currentRow);
        var isValid = validateInputFieldsResoursesDetails($currentRow);

        if (!isValid) {
            isValidFinal = false;
        }

        //}
    });
    return isValidFinal;
}
function clearValidationErrorsResoursesDetails($row) {
    $row.find('.text-danger').empty();
}

function ResoursesDetailsChangeExists(IsValid) {

    var doChangesExists = false;
    $('#myTable').find('.resourcesDetailRow').each(function (i, obj) {
        var $row = $(obj);

        var resourcetype = $row.find('select[name="ResourceType"]').val();
        var shift = $row.find('select[name="Shift"]').val();
        var daynight = $row.find('select[name="DayNight"]').val();
        var name = $row.find('input[name="Name"]').val();
        var comment = $row.find('input[name="Comments"]').val();

        if (!$row.hasClass("existingRow")) {
            if ((resourcetype != "" || shift != "" || daynight != "" || name != "" || comment != ""))// || (Name == "" && Comments == "" && Shift == "")) {
            {
                doChangesExists = true;
            }
        }
        else {
            var resourcetypeOldVal = $row.find('select[name="ResourceType"]').attr('oldvalue');
            var shiftOldVal = $row.find('select[name="Shift"]').attr('oldvalue');
            var daynightOldVal = $row.find('select[name="DayNight"]').attr('oldvalue');
            var nameOldVal = $row.find('input[name="Name"]').attr('oldvalue');
            var commentOldVal = $row.find('input[name="Comments"]').attr('oldvalue');
            if (IsValid) {
                $row.find('select[name="ResourceType"]').val(resourcetypeOldVal);
                $row.find('select[name="Shift"]').val(shiftOldVal);
                $row.find('select[name="DayNight"]').val(daynightOldVal);
                $row.find('input[name="Name"]').val(nameOldVal);
                $row.find('input[name="Comments"]').val(commentOldVal);
            }
            if ((resourcetype != resourcetypeOldVal || shift != shiftOldVal || daynight != daynightOldVal || name != nameOldVal || comment != commentOldVal)) {
                doChangesExists = true;
            }
        }
    });
    return doChangesExists;
}
function clearValidationErrorsResoursesDetails($row) {
    $row.find('.text-danger').empty();
}

function validateInputFieldsResoursesDetails($row) {



    var isValid = true;

    var resourcetype = $row.find('select[name="ResourceType"]').val();
    var shift = $row.find('select[name="Shift"]').val();
    var daynight = $row.find('select[name="DayNight"]').val();
    var name = $row.find('input[name="Name"]').val();
    var comment = $row.find('input[name="Comments"]').val();


    if ((resourcetype != "" && shift != "" && daynight != "" && name != "" && comment != ""))// || (resourcetype == "" && shift == "" && daynight == "" && name == "" && comment == ""))
    {
    }
    else {
        isValid = false;
    }


    if (!isValid) {
        $row.find('select ,input[name="Name"], input[name="Comments"]').each(function () {
            var $input = $(this);
            var fieldName = $input.attr('name');
            var fieldValue = $input.val();

            if (!fieldValue.trim()) {
                isValid = false;
                $row.find('#' + fieldName).text(fieldName + ' is required');
            }
        });
    }
    return isValid;
}


// Function to add a new row to the table

function addRowformanage(button) {

    var table = document.getElementById("manageTable");
    var currentRow = button.closest('table').rows;
    var latestRow = currentRow[currentRow.length - 1];
    var inputs = latestRow.querySelectorAll('.form-control');
    var errorSpans = latestRow.querySelectorAll('.text-danger');
    var canAddRow = true;
    var instruid = $('#InstructorId').val();

    inputs.forEach(function (input, index) {
        var errorSpan = input.parentNode.querySelector('.text-danger');

        if (input.value.trim() === '') {
            // Input is empty, show error message
            if (!errorSpan) {
                // Create error span if it doesn't exist
                errorSpan = document.createElement('span');
                errorSpan.classList.add('text-danger');
                input.parentNode.appendChild(errorSpan);
            }
            // Set error message text
            errorSpan.innerText = "Please fill out this field.";
            canAddRow = false; // Set flag to prevent further action

        } else {
            // Input is not empty, remove error message if exists
            if (errorSpan) {
                input.parentNode.removeChild(errorSpan);
            }
        }
    });


    if (canAddRow) {
        var newRow = table.insertRow(-1); // Insert row at the top (reversed)
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        var cell4 = newRow.insertCell(3);

        cell1.innerHTML = '<input type="date" class="form-control" id="Completeion1Date1">';
        cell2.innerHTML = '<input type="text" class="form-control" id="Signature1">';
        cell3.innerHTML = '<input type="text" class="form-control" id="Name1">';
        cell4.innerHTML = '<input type="date" class="form-control" id="Date1">' + '<input type="text" hidden="" id="InstructorId" value="' + instruid + '">';

        inputs.forEach(function (input, index) {
            var errorSpan = input.parentNode.querySelector('.text-danger');
            if (errorSpan) {
                input.parentNode.removeChild(errorSpan);
            }
        });
    }
}


function addRowResourceDetails(button) {
    var aid = $('#activityid').val();
    var table = document.getElementById("myTable");
    var currentRow = button.parentNode.parentNode; // Get the current row
    var inputs = currentRow.querySelectorAll('.form-control');
    var errorSpans = currentRow.querySelectorAll('.text-danger');
    var canAddRow = true;

    inputs.forEach(function (input, index) {
        if (input.value.trim() === '') {
            canAddRow = false;
            if (errorSpans[index]) {
                errorSpans[index].innerText = "Please fill out this field.";
            } else {
                var errorSpan = document.createElement('span');
                errorSpan.classList.add('text-danger');
                errorSpan.innerText = "Please fill out this field.";
                input.parentNode.appendChild(errorSpan);
            }
        } else {
            if (errorSpans[index]) {
                errorSpans[index].innerText = "";
            }
        }
    });

    // Check if any dropdown is not filled out
    var dropdowns = currentRow.querySelectorAll('select');
    dropdowns.forEach(function (dropdown) {
        if (dropdown.value.trim() === '') {
            canAddRow = false;
            var errorSpan = document.createElement('span');
            errorSpan.classList.add('text-danger');
            errorSpan.innerText = "Please select an option.";
            dropdown.parentNode.appendChild(errorSpan);
        }
    });

    if (canAddRow) {

        var newRow = table.insertRow(-1); // Insert row at the top (reversed)
        newRow.classList.add('resourcesDetailRow');
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        var cell4 = newRow.insertCell(3);
        var cell5 = newRow.insertCell(4);
        var cell6 = newRow.insertCell(5);
        //var cell7 = newRow.insertCell(6);

        //cell1.innerHTML = '<input class="form-check-input is-read-only" id="IsReadOnly" name="IsReadOnly" type="checkbox" value="true">' +
        //    '<input name="IsReadOnly" type="hidden" value="false">';

        cell1.innerHTML = '<select class="form-control RD" id="type" name="ResourceType">' +
            '<option value="">Select an Resource Type</option>' +
            '<option>Supervisor</option>' +
            '<option>Operative</option>' +
            '<option>Labour Man</option>' +
            '<option>HGV</option>' +
            '<option>HGV+Crane</option>' +
            '<option>Trailer</option>' +
            '<option>Loader</option>' +
            '<option>Work Van</option>' +
            '<option>Subcontractors</option>' +
            '</select>' +
            '<span id="ResourceType" class="text-danger"></span>';
        cell2.innerHTML = '<select class="form-control RD" id="ReShift" name="Shift">' +
            '<option value="">Select an Shift type</option>' +
            '<option>Shift 1</option>' +
            '<option>Shift 2</option>' +
            '<option>Shift 3</option>' +
            '<option>Shift 4</option>' +
            '<option>Shift 5</option>' +
            '<option>Shift 6</option>' +
            '<option>Shift 7</option>' +
            '<option>Shift 8</option>' +
            '</select>' +
            '<span id="Shift" class="text-danger"></span>';
        cell3.innerHTML = '<select class="form-control RD" id="daynight" name="DayNight">' +
            '<option value="">Select an Shift</option>' +
            '<option>Day</option>' +
            '<option>Night</option>' +
            '</select>' +
            '<span id="DayNight" class="text-danger"></span>';
        cell4.innerHTML = '<input value="" type="text" class="form-control RD" id="name" name="Name">' + '<span id="Name" class="text-danger"></span>';
        cell5.innerHTML = '<input type="text" class="form-control RD" width="500" id="comment" name="Comments">' + '<span id="Comments" class="text-danger"></span>';
        cell6.innerHTML = '<input value="0" type="text" id="rid" style="display: none;">' + '<input value="' + aid + '" type="text" id="activityid" style="display: none;" /> ';
    }

}
function addRowProductDetails(button) {

    var aid = $('#activityid').val();
    var table = document.getElementById("myTable1");
    var currentRow = button.parentNode.parentNode; // Get the current row
    var inputs = currentRow.querySelectorAll('.form-control');
    var errorSpans = currentRow.querySelectorAll('.text-danger');
    var canAddRow = true;

    inputs.forEach(function (input, index) {
        if (input.value.trim() === '') {
            canAddRow = false;
            if (errorSpans[index]) {
                errorSpans[index].innerText = "Please fill out this field.";
            } else {
                var errorSpan = document.createElement('span');
                errorSpan.classList.add('text-danger');
                errorSpan.innerText = "Please fill out this field.";
                input.parentNode.appendChild(errorSpan);
            }
        } else {
            if (errorSpans[index]) {
                errorSpans[index].innerText = "";
            }
        }
    });

    // Check if any dropdown is not filled out
    var dropdowns = currentRow.querySelectorAll('select');
    dropdowns.forEach(function (dropdown) {
        if (dropdown.value.trim() === '') {
            canAddRow = false;
            var errorSpan = document.createElement('span');
            errorSpan.classList.add('text-danger');
            errorSpan.innerText = "Please select an option.";
            dropdown.parentNode.appendChild(errorSpan);
        }
    });

    if (canAddRow) {

        var newRow = table.insertRow(-1); // Insert row at the top (reversed)
        newRow.classList.add('productDetailRow');
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        var cell4 = newRow.insertCell(3);



        cell1.innerHTML = '<select class="form-control PD" name="Shift" id="Shift">' +
            '<option value="">Select an Shift type</option>' +
            '<option>Shift 1</option>' +
            '<option>Shift 2</option>' +
            '<option>Shift 3</option>' +
            '<option>Shift 4</option>' +
            '<option>Shift 5</option>' +
            '<option>Shift 6</option>' +
            '<option>Shift 7</option>' +
            '<option>Shift 8</option>' +
            '</select>' +
            '<span id="ShiftError" class="text-danger"></span>';
        cell2.innerHTML = '<input value="" type="date" class="form-control PD" name="Date" id="Date" style="width: 150px;"> ' +
            '<span id="DateError" class="text-danger"></span>';
        cell3.innerHTML = '<input value="" type="text" class="form-control PD" name="SummaryOfWorks" id="SummaryOfWorks">' + '<span id="SummaryOfWorksError" class="text-danger"></span>';

        cell4.innerHTML = '<input value="0" type="text" id="pid" style="display: none;" />' + '<input value="' + aid + '" type="text" id="activityid" style="display: none;" /> ';

    }

}



//ADD sign of and update has submit
function addsignoff(button) {

    var actid = $('#id').val(); // Assuming you have an element with id="id" to get the actid

    var signOffData = [];

    // Get all table rows except the header row
    var rows = $('#manageTable tbody tr');

    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var CompetionDate = $(row).find('input[type="date"]').eq(0).val();
        var Signature = $(row).find('input[type="text"]').eq(0).val();
        var PrintName = $(row).find('input[type="text"]').eq(1).val();
        var SignOffDate = $(row).find('input[type="date"]').eq(1).val();
        var InstructorId = $(row).find('#InstructorId').val();

        // Check if any field is blank or null
        if (CompetionDate && Signature && PrintName && SignOffDate && InstructorId) {
            var rowData = {
                CompetionDate: CompetionDate,
                Signature: Signature,
                PrintName: PrintName,
                SignOffDate: SignOffDate,
                InstructorId: InstructorId,
                ActivityId: actid
            };
            signOffData.push(rowData);
        }
    }


    if (signOffData.length > 0) {
        $.ajax({
            type: 'POST',
            url: '/Activity/SaveSignOff',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(signOffData),
            datatype: 'json',
            success: function (response) {
                console.log(response);
                if (response.success) {


                    $('#signoffsuccessmessage').fadeIn(function () {
                        // Once message is fully displayed, redirect after a delay
                        setTimeout(function () {
                            window.location.reload();
                        }, 1000); // Adjust delay time as needed (in milliseconds)
                    });

                }
            },
            error: function (xhr, status, error) {
                $('#signofferrormessage').fadeIn().delay(1000).fadeOut();
            }
        });
    }
    else {
        alert("Please Fill atleast One row!");
    }


}


document.addEventListener('DOMContentLoaded', function () {
    // Find the error message element
    var errorMessageElement = document.getElementById('errorMessage');

    // If the element exists
    if (errorMessageElement) {
        // Set a timeout to hide the element after 3 seconds
        setTimeout(function () {
            errorMessageElement.style.display = 'none';
        }, 3000); // 3000 milliseconds = 3 seconds
    }
});

function SaveJobCustomerDetails() {

    var custDetails = [];
    $('#custidfordom').find('.original-row').each(function (i, obj) {

        if (!$(obj).hasClass("existingRow")) {

            var $currentRow = $(obj);//.closest('.original-row');
            var aid = $('#activityid').val();

            if (!aid) {
                $currentRow.find('#CustomerNameError').text('Please fill basic details');
                $currentRow.find('#ContactNoError').text('Please fill basic details');

                return;
            }



            clearValidationErrors($currentRow);

            var isValid = validateInputFieldsCustomerDetailis($currentRow);


            if (isValid && !isDropdownOrTextboxFocusedJobTab) {

                var custData = {
                    ActivityId: aid,
                    CustomerName: $currentRow.find('input[name="item.CustomerName"]').val(),
                    ContactNo: $currentRow.find('input[name="item.ContactNo"]').val(),
                    custid: $currentRow.find('#custid').val()
                };
                custDetails.push(custData);
                $.ajax({
                    async: false,
                    url: '/activity/Customersavedata',
                    method: 'POST',
                    data: custData,
                    success: function (response) {
                        if (response.success) {


                            var doDisable = true;
                            $(".CD").each(function () {
                                if ($(this).val() != "") {
                                    doDisable = doDisable && true;

                                }
                                else {
                                    doDisable = doDisable && false;
                                }
                            });

                            if (doDisable == true) {
                                $('.CD').attr('disabled', 'disabled');
                            }

                            if (response.cid > 0) {

                                $('#customerupdatemessage').fadeIn().delay(1000).fadeOut();
                            }
                            else {
                                $('#customersuccessmessage').fadeIn().delay(1000).fadeOut();
                            }
                        }
                    },
                    error: function (xhr, status, error) {
                        $('#customererrormessage').fadeIn().delay(1000).fadeOut();
                    }
                });
            }
        }

    });

}
var isDropdownOrTextboxFocusedJobTab = false;
$(document).ready(function () {


    $('#custidfordom').on('focus', 'input[type="text"], select', function () {
        //isDropdownOrTextboxFocusedJobTab = true;
    });
    //



    $('#custidfordom').on('click', function () {
        isDropdownOrTextboxFocusedJobTab = false;
        $('.text-danger').empty();
    });






});
function clearValidationErrors($row) {
    $row.find('.text-danger').empty();
}
function validateInputFieldsCustomerDetailis($row) {
    var isValid = true;

    var CustomerName = $row.find('input[name="item.CustomerName"]').val();
    var ContactNo = $row.find('input[name="item.ContactNo"]').val();
    if ((CustomerName != "" && ContactNo != ""))// || (CustomerName == "" && ContactNo != "")) {
    {
    }
    else {
        isValid = false;
    }

    if (!isValid) {
        $row.find('input[name="item.CustomerName"], input[name="item.ContactNo"] ,select').each(function () {
            var $input = $(this);
            var fieldName = $input.attr('name');
            var fieldValue = $input.val();
            var fieldNameWithoutPrefix = fieldName.replace('item.', '');

            if (!fieldValue.trim()) {
                isValid = false;
                $row.find('#' + fieldNameWithoutPrefix + 'Error').text(fieldNameWithoutPrefix + ' is required');
            }
        });
    }

    return isValid;
}

function addCustRow(button) {

    var aid = $('#activityid').val();
    var currentRow = button.closest('.original-row');
    var inputs = currentRow.querySelectorAll('.form-control');
    var errorSpans = currentRow.querySelectorAll('.text-danger');
    var canAddRow = true;

    inputs.forEach(function (input, index) {
        if (input.value.trim() === '' && (input.getAttribute('name') === 'ContactNo' || input.getAttribute('name') === 'CustomerName')) {
            canAddRow = false;
            if (errorSpans[index]) {
                errorSpans[index].innerText = "Please fill out this field.";
            } else {
                var errorSpan = document.createElement('span');
                errorSpan.classList.add('text-danger');
                errorSpan.innerText = "Please fill out this field.";
                input.parentNode.appendChild(errorSpan);
            }
        } else {
            if (errorSpans[index]) {
                errorSpans[index].innerText = "";
            }
        }
    });


    if (canAddRow) {
        var newRow = document.createElement('div');
        newRow.classList.add('panel-body', 'original-row');
        newRow.innerHTML = `
        <div class="row">
        <div class="col-sm-4 col-md-4">
        <div class="form-group clearfix">
        <input type="text" class="form-control custid hidden" name="custid" id="custid">
        <input type="text" class="form-control customer-name CD" name="item.CustomerName" id="CustomerName">
        <span class="text-danger validation-error" id="CustomerNameError"></span>
        </div>
        </div>
        <div class="col-sm-4 col-md-4">
        <div class="form-group clearfix">
        <input type="text" value="" name="item.ContactNo" pattern ="\d{10}" class="form-control contact-no CD" id="SAGEOrder">
        <span class="text-danger validation-error" id="ContactNoError"></span>
        </div>
        </div>
        </div>
        `;

        currentRow.parentNode.appendChild(newRow);
    }
}

function Savedate() {

    var isValid = true;
    var flagValue = null;
    var currentUrl = window.location.href;
    var urlParts = currentUrl.split('?');
    var queryParamsPart = urlParts[1];
    // Check if queryParamsPart exists and is not empty
    if (queryParamsPart) {
        // Split the query parameters into an array
        var queryParams = queryParamsPart.split('&');

        // Initialize a variable to store the value of the "flag" parameter


        // Loop through each parameter to find the "flag" parameter
        for (var i = 0; i < queryParams.length; i++) {
            var param = queryParams[i].split('=');
            // Check if the parameter name is "flag"
            if (param[0] === "flag") {
                // Store the value of the "flag" parameter
                flagValue = param[1];
                break; // Exit the loop once "flag" parameter is found
            }
        }

        // Output the value of the "flag" parameter to the console
        console.log(flagValue);
    }


    if (!$('#Customer').val()) {
        $('#customerOrderNumberError').text('Customer Order Number is required.');
        isValid = false;
    } else {
        $('#customerOrderNumberError').text('');
    }

    // Validation for SAGE Order Number
    if (!$('#SAGEOrder').val()) {
        $('#sageOrderNumberError').text('SAGE Order Number is required.');
        isValid = false;
    } else {
        $('#sageOrderNumberError').text('');
    }

    // Validation for HC Job Number
    if (!$('#HCJob').val()) {
        $('#hcorderNumberError').text('HC Job Number is required.');
        isValid = false;
    } else {
        $('#hcorderNumberError').text('');
    }

    // Validation for activityType
    if (!$('#activityType').val()) {
        $('#activityTypeError').text('Activity Type is required.');
        isValid = false;
    } else {
        $('#activityTypeError').text('');
    }

    if (!$('#Date').val()) {
        $('#DateError').text('Date is required.');
        isValid = false;
    } else {
        $('#DateError').text('');
    }

    if (!$('#RaisedBy').val()) {
        $('#RaiseError').text('RaiseBy is required.');
        isValid = false;
    } else {
        $('#RaiseError').text('');
    }

    if (!$('#SiteAddress').val()) {
        $('#SiteAddressError').text('SiteAddress is required.');
        isValid = false;
    } else {
        $('#SiteAddressError').text('');
    }

    var outOfHours = $('#OutofHours').val();
    if (!outOfHours) {
        $('#OutofHoursError').text('Emergency Contact is required.');
        isValid = false;
    } else if (!/^\d{10}$/.test(outOfHours)) {
        $('#OutofHoursError').text('Emergency Contact must be a 10-digit number.');
        isValid = false;
    } else {
        $('#OutofHoursError').text('');
    }

    if (!$('#Nearest').val()) {
        $('#NearestError').text('Nearest is required.');
        isValid = false;
    } else {
        $('#NearestError').text('');
    }
    if (!$('#nameCouncil').val()) {
        $('#NameCouncilError').text('Name of Council is required.');
        isValid = false;
    } else {
        $('#NameCouncilError').text('');
    }
    if (isValid) {
        isValid = ValidateCustomerDetailsData();
    }
    if (isValid) {
        var formdata = {
            ActivityId: $('#id').val() || 0,
            CustomerOrderNumber: $('#Customer').val(),
            SageOrderNumber: $('#SAGEOrder').val(),
            HcorderNumber: $('#HCJob').val(),
            ActivityType: $('#ActivityTypeString').val(),
            //ActivityType: $('#activityType').val(),
            DateRaised: $('#Date').val(),
            RaisedBy: $('#RaisedBy').val(),
            SiteAddress: $('#SiteAddress').val(),
            OutofhoursEmrgContact: $('#OutofHours').val(),
            NearestAE: $('#Nearest').val(),
            NameofCouncil: $('#nameCouncil').val(),
            flag: flagValue,
            ActivityStatus: $('#activityStatus').val(),
        };

        $.ajax({
            async: false,
            url: '/activity/Savejobcard',
            method: 'post',
            data: formdata,
            success: function (response) {
                debugger;
                if (response.success) {
                    console.log($('.jobid').val())
                    if ($('.jobid').val() != 0) {


                        $('#jobcardupdatemessage').fadeIn(function () {
                            // Once message is fully displayed, redirect after a delay
                            setTimeout(function () {
                                document.getElementById("id").value = response.activityId;
                                globalactivityId = response.activityId;
                                globalActivityType = response.activityType;
                                $('#activityid').val(globalactivityId);
                                SaveJobCustomerDetails();
                                window.location.href = '/Activity/CreateActivity/' + response.activityId;
                            }, 1000); // Adjust delay time as needed (in milliseconds)
                        });


                        //$('#jobcardupdatemessage').fadeIn().delay(2000).fadeOut();
                    }
                    else {

                        $('#jobcardsuccessmessage').fadeIn(function () {
                            // Once message is fully displayed, redirect after a delay
                            setTimeout(function () {
                                document.getElementById("id").value = response.activityId;
                                globalactivityId = response.activityId;
                                globalActivityType = response.activityType;

                                $('#activityid').val(globalactivityId);
                                SaveJobCustomerDetails();

                                window.location.href = '/Activity/CreateActivity/' + response.activityId;
                            }, 1000); // Adjust delay time as needed (in milliseconds)
                        });
                        // $('#jobcardsuccessmessage').fadeIn().delay(2000).fadeOut();
                    }
                    //document.getElementById("id").value = response.activityId;
                    //globalactivityId = response.activityId;
                    //globalActivityType = response.activityType;
                    //window.location.href = '/Activity/CreateActivity/' + response.activityId;


                }
            },
            error: function (xhr, status, error) {
                $('#jobcarderrormessage').fadeIn().delay(1000).fadeOut();
            }
        });

    }

    return isValid;
}

function saveTrailerdata() {
    var isValid = true;
    var id = globalactivityId;
    var fileInputValue;
    if (id == "" || id == null || id == undefined || id == 0) {
        id = $('#activityid').val();
    }

    var tippingData = {
        Date: $('#yardbarrierdateloaded').val(),
        TrailerSupplier: $('#yardtsupplier').val(),
        TrailerNumber: $('#yardTrailerNumber').val(),
        Quantity: $('#yardunit').val(),
        VehicleReg: $('#yardVehicleReg').val(),
        LoadDepot: $('#yardTrailerdeport').val(),
        LoadedTippedBy: $('#yardloadedby').val(),
        Activityid: id
    };

    $.each(tippingData, function (key, value) {
        // Check if the value is empty or null
        if (!value) {
            // Set error message based on the field
            switch (key) {
                case 'Date':
                    $('#yardbarrierdateloadedError').text('Tipping date is required.');
                    break;
                case 'TrailerSupplier':
                    $('#yardtsupplierError').text('Trailer supplier is required.');
                    break;
                case 'TrailerNumber':
                    $('#yardTrailerNumberError').text('Trailer number is required.');
                    break;
                case 'Quantity':
                    $('#yardunitError').text('Unit is required.');
                    break;
                case 'VehicleReg':
                    $('#yardVehicleRegError').text('Vehicle Reg is required.');
                    break;
                case 'LoadDepot':
                    $('#yardTrailerdeportError').text('Trailer depot is required.');
                    break;
                case 'LoadedTippedBy':
                    $('#yardloadedbyError').text('Tipped by is required.');
                    break;

                // Add cases for other fields
                default:
                    break;
            }
            isValid = false; // Set isValid to false
        } else {
            // Clear error message if the field is not empty
            switch (key) {
                case 'Date':
                    $('#yardbarrierdateloadedError').text('');
                    break;
                case 'TrailerSupplier':
                    $('#yardtsupplierError').text('');
                    break;
                case 'TrailerNumber':
                    $('#yardTrailerNumberError').text('');
                    break;
                case 'Quantity':
                    $('#yardunitError').text('');
                    break;
                case 'VehicleReg':
                    $('#yardVehicleRegError').text('');
                    break;
                case 'LoadDepot':
                    $('#yardTrailerdeportError').text('');
                    break;
                case 'LoadedTippedBy':
                    $('#yardloadedbyError').text('');
                    break;

                // Add cases for other fields
                default:
                    break;
            }
        }
    });
    if (isValid) {
        $.ajax({
            url: '/activity/SaveTrailerTipping',
            type: 'POST',
            data: tippingData,
            success: function (response) {
                if (response != null) {
                    $('#Tippingsuccessmessage').fadeIn().delay(1000).fadeOut();

                    var rowCount = $('#yardTTrailerDetails tbody tr').length;
                    // Increment the last used id for the next row
                    var nextId = rowCount + 1;
                    var newRow = '<tr>' +
                        '<td>' + nextId + '</td>' +
                        '<td>' + response.trailerSupplier + '</td>' +
                        '<td>' + response.trailerNumber + '</td>' +
                        '<td>' + response.quantity + '</td>' +
                        '<td>' + response.loadDepot + '</td>' +
                        '<td>' + response.loadedTippedBy + '</td>' +
                        '</tr>';
                    $('#yardTTrailerDetails tbody').append(newRow);

                    $('#yardbarrierdateloaded').val('');
                    $('#yardtsupplier').val('');
                    $('#yardTrailerNumber').val('');
                    $('#yardunit').val('');
                    $('#yardVehicleReg').val('');
                    $('#yardTrailerdeport').val('');
                    $('#yardloadedby').val('');
                    $('#isInbound').prop('checked', false);
                    $('#isOutbound').prop('checked', false);
                } else {
                    $('#tippingerrormessage').fadeIn().delay(1000).fadeOut();
                }
            },
            error: function () {
                $('#tippingerrormessage').fadeIn().delay(1000).fadeOut();
            }
        });
    }

}
function UpdateInBoundTrailerData() {
    var isValid = true;
    var id = globalactivityId;
    var fileInputValue;
    if (id == "" || id == null || id == undefined || id == 0) {
        id = $('#activityid').val();
    }

    var isOutBound = $('input[id="IsOutBound"]:checked').val();
    if (isOutBound == undefined || isOutBound == '') {
        isOutBound = 'off';
    } else {
        isOutBound = $('input[id="IsOutBound"]:checked').val();
    }

    var loadingData = {
        Date: $('#date').val(),
        TrailerSupplier: $('#trailerSupplier').val(),
        TrailerNumber: $('#trailerNumber').val(),
        /*LoadPositioned: 'A',*///$('#LoadPositioned').val(),
        Quantity: $('#quantity').val(),
        VehicleReg: $('#vehicleReg').val(),
        DepartFrom: $('#departFrom').val(),
        LoadDepot: $('#loadDepot').val(),
        LoadedTippedBy: $('#loadedTippedBy').val(),
        IsOutBound: isOutBound,
        Activityid: id,
        id: $('#Trailerid').val()
    };
    

    if (isValid) {
        $.ajax({
            url: '/activity/SaveTrailerTipping',
            type: 'POST',
            data: loadingData,
            success: function (response) {
                if (response != null) {

                    // Clear input fields
                    $('#trailersupplier').val('');
                    $('#trailerSupNum').val('');
                    $('#date').val('');
                    $('#quantity').val('');
                    $('#vehicleReg').val('');
                    $('#departFrom').val('');
                    $('#loadDepot').val('');
                    $('#loadedTippedBy').val('');
                    $('#isInbound').prop('checked', false);
                    $('#isOutbound').prop('checked', false);
                    location.reload();
                } else {
                    $('#loadingerrormessage').fadeIn().delay(1000).fadeOut();
                }
            },
            error: function () {
                $('#loadingerrormessage').fadeIn().delay(1000).fadeOut();
            }
        });
    }
} 

function SaveInBoundTrailerData() {
    var isValid = true;
    var id = globalactivityId;
    var fileInputValue;
    if (id == "" || id == null || id == undefined || id == 0) {
        id = $('#activityid').val();
    }

    var isOutBound = $('input[id="isOutbound"]:checked').val();
    if (isOutBound == undefined || isOutBound == '') {
        isOutBound = 'off';
    } else {
        isOutBound = $('input[id="isOutbound"]:checked').val();
    }

    var loadingData = {
        Date: $('#barrierdate').val(),
        TrailerSupplier: $('#Trailersupplier').val(),
        TrailerNumber: $('#TrailerSupNum').val(),
        /*LoadPositioned: 'A',*///$('#LoadPositioned').val(),
        Quantity: $('#UnitLoad').val(),
        VehicleReg: $('#Vehicle').val(),
        DepartFrom: $('#TrailerDepart').val(),
        LoadDepot: $('#TrailerDepartTo').val(),
        LoadedTippedBy: $('#Loaded').val(),
        IsOutBound: isOutBound,
        Activityid: id,
        id: 0
    };
    $.each(loadingData, function (key, value) {
        // Check if the value is empty or null
        if (key !== 'id') {
            if (!value) {
                // Set error message based on the field
                switch (key) {
                    case 'Date':
                        $('#BarrierDate').text('Barrier date is required.');
                        break;
                    case 'TrailerSupplier':
                        $('#TSupllier').text('Trailer supplier is required.');
                        break;
                    case 'TrailerNumber':
                        $('#TrailerNumber').text('Trailer number is required.');
                        break;
                    case 'LoadPositioned':
                        $('#LoadPos').text('Trailer number is required.');
                        break;
                    case 'Quantity':
                        $('#UnitLoaded').text('Unit is required.');
                        break;
                    case 'VehicleReg':
                        $('#Vehicalreg').text('Vehicle Reg is required.');
                        break;
                    case 'DepartFrom':
                        $('#TrailerDepartFrom').text('Trailer Depart Form is required');
                        break;
                    case 'LoadDepot':
                        $('#Trailerdepart').text('Trailer depot is required.');
                        break;
                    case 'LoadedTippedBy':
                        $('#LoadTrailer').text('Loaded by is required.');
                        break;

                    // Add cases for other fields
                    default:
                        break;
                }
                isValid = false; // Set isValid to false
            } else {
                // Clear error message if the field is not empty
                switch (key) {
                    case 'Date':
                        $('#BarrierDate').text('');
                        break;
                    case 'TrailerSupplier':
                        $('#TSupllier').text('');
                        break;
                    case 'TrailerNumber':
                        $('#TrailerNumber').text('');
                        break;
                    case 'LoadPositioned':
                        $('#LoadPos').text('');
                        break;
                    case 'Quantity':
                        $('#UnitLoaded').text('');
                        break;
                    case 'VehicleReg':
                        $('#Vehicalreg').text('');
                        break;
                    case 'DepartFrom':
                        $('#TrailerDepartFrom').text('');
                        break;
                    case 'LoadDepot':
                        $('#Trailerdepart').text('');
                        break;
                    case 'LoadedTippedBy':
                        $('#LoadTrailer').text('');
                        break;

                    // Add cases for other fields
                    default:
                        break;
                }
            }
        }
    });

    if (isValid) {
        $.ajax({
            url: '/activity/SaveTrailerTipping',
            type: 'POST',
            data: loadingData,
            success: function (response) {
                if (response != null) {


                    if (response.isOutBound == 'on') {
                        $('#loadingoutboundsuccessmessage').fadeIn().delay(1000).fadeOut();
                        $('#outboundHideClass').removeClass('hide');
                        var rowCount = $('#TrailerDetails1 tbody tr').length;
                        var nextId = rowCount + 1;

                        // Extracting the date part from response.date and formatting it
                        var datePart = response.date.split('T')[0];

                        // Appending a new row with the date part only
                        var newRow = '<tr>' +
                            '<td>' + nextId + '</td>' +
                            '<td>' + response.trailerSupplier + '</td>' +
                            '<td>' + response.trailerNumber + '</td>' +
                            '<td>' + response.quantity + '</td>' +
                            '<td>' + response.loadDepot + '</td>' +
                            '<td>' + response.departFrom + '</td>' +
                            '<td>' + datePart + '</td>' + // Displaying only the date part
                            '<td>' + response.loadedTippedBy + '</td>' +
                            '</tr>';

                        // Appending the new row to the table body
                        $('#TrailerDetails1 tbody').append(newRow);
                    }


                    else {
                        $('#loadingsuccessmessage').fadeIn().delay(1000).fadeOut();
                        $('#inboundHideClass').removeClass('hide');
                        var rowcount2 = $('#TrailerDetails2 tbody tr').length;
                        var nextId1 = rowcount2 + 1;
                        var datePart = response.date.split('T')[0];
                        var newRow1 = '<tr>' +
                            '<td>' + nextId1 + '</td>' +
                            '<td>' + response.trailerSupplier + '</td>' +
                            '<td>' + response.trailerNumber + '</td>' +
                            '<td>' + response.quantity + '</td>' +
                            '<td>' + response.loadDepot + '</td>' +
                            '<td>' + datePart + '</td>' +
                            '</tr>';
                        $('#TrailerDetails2 tbody').append(newRow1);
                    }



                    // Clear input fields
                    $('#Trailersupplier').val('');
                    $('#TrailerSupNum').val('');
                    $('#UnitLoad').val('');
                    $('#TrailerDepart').val('');
                    $('#TrailerDepartTo').val('');
                    $('#Loaded').val('');
                    $('#Vehicle').val('');
                    $('#barrierdate').val('');
                    $('#isInbound').prop('checked', false);
                    $('#isOutbound').prop('checked', false);
                } else {
                    $('#loadingerrormessage').fadeIn().delay(1000).fadeOut();
                }
            },
            error: function () {
                $('#loadingerrormessage').fadeIn().delay(1000).fadeOut();
            }
        });
    }
}

//function displayThumbnails(event,id) {
//    var files = event.target.files;
//    var thumbnailsContainer = document.getElementById(id);
//    thumbnailsContainer.innerHTML = ''; // Clear previous thumbnails

//    for (var i = 0; i < files.length; i++) {
//        var file = files[i];
//        if (file.type.startsWith('image/')) {
//            var reader = new FileReader();
//            reader.onload = function (e) {
//                var thumbnail = document.createElement('img');
//                thumbnail.src = e.target.result;
//                thumbnail.style.width = '100px'; // Adjust thumbnail size as needed
//                thumbnail.style.marginRight = '10px'; // Adjust spacing between thumbnails
//                thumbnail.classList.add('thumbnail'); // Add a class for easier selection
//                thumbnailsContainer.appendChild(thumbnail);

//                thumbnail.addEventListener('click', function () {
//                    // Create a Blob from the base64 data
//                    var blob = dataURItoBlob(this.src);
//                    var blobUrl = URL.createObjectURL(blob);
//                    // Open the Blob URL in a new tab
//                    window.open(blobUrl, '_blank');
//                });
//            };
//            reader.readAsDataURL(file);
//        }
//    }
//}

function displayThumbnails(event, id) {
    var files = event.target.files;
    var thumbnailsContainer = document.getElementById(id);
    // thumbnailsContainer.innerHTML = ''; // Clear previous thumbnails

    for (var i = 0; i < files.length; i++) {
        var file = files[i];
        if (file.type.startsWith('image/')) {
            var reader = new FileReader();
            reader.onload = (function (file) {
                return function (e) {
                    var thumbnailContainer = document.createElement('div');
                    thumbnailContainer.classList.add('thumbnail-container');

                    var thumbnail = document.createElement('img');
                    thumbnail.src = e.target.result;
                    thumbnail.style.width = '100px'; // Adjust thumbnail size as needed
                    thumbnail.style.marginRight = '10px'; // Adjust spacing between thumbnails

                    var closeButton = document.createElement('span');
                    closeButton.classList.add('close-button');
                    closeButton.textContent = '×'; // Close symbol

                    thumbnailContainer.appendChild(thumbnail);
                    thumbnailContainer.appendChild(closeButton);
                    thumbnailsContainer.appendChild(thumbnailContainer);

                    // Set data attribute to store file name
                    thumbnailContainer.setAttribute('data-file-name', escape(file.name));

                    // Event listener for close button
                    closeButton.addEventListener('click', function () {
                        thumbnailContainer.remove(); // Remove thumbnail container
                    });

                    // Event listener for thumbnail click to open in new tab
                    thumbnail.addEventListener('click', function () {
                        // Create a Blob from the base64 data
                        var blob = dataURItoBlob(thumbnail.src);
                        var blobUrl = URL.createObjectURL(blob);
                        // Open the Blob URL in a new tab
                        window.open(blobUrl, '_blank');
                    });
                };
            })(file);
            reader.readAsDataURL(file);
        }
    }
}

// Function to convert data URI to Blob
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

//function loadEditForm(selectedItem) {
//    console.log(selectedItem);
//    try {
//        var editFormContainer = document.getElementById('editFormContainer');
//        editFormContainer.style.display = 'block';

//        var inputs = editFormContainer.querySelectorAll('input, select');
//        inputs.forEach(function (input) {
//            // Assuming selectedItem is passed as JSON object
//            var prop = input.id.charAt(0).toLowerCase() + input.id.slice(1); // Convert the ID to the property name
//            if (selectedItem.hasOwnProperty(prop)) {
//                input.value = selectedItem[prop].toString();
//            }
//        });

//        window.scrollTo(0, editFormContainer.offsetTop);
//    } catch (error) {
//        console.error('Error loading edit form:', error);
//    }
//}

function loadEditForm(selectedItem) {
    console.log(selectedItem);
    try {
        var editFormContainer = document.getElementById('editFormContainer');
        if (!editFormContainer) {
            console.error('Edit form container not found.');
            return;
        }

        // Display the edit form container
        editFormContainer.style.display = 'block';
        var trailerIdInput = editFormContainer.querySelector('#Trailerid');
        if (trailerIdInput) {
            trailerIdInput.value = selectedItem.id.toString(); // Assuming id is numeric
        } else {
            console.error('TrailerId input field not found.');
        }

        // Loop through each input/select element within editFormContainer
        var inputs = editFormContainer.querySelectorAll('input, select');
        inputs.forEach(function (input) {
            var prop = input.id.charAt(0).toLowerCase() + input.id.slice(1); // Convert ID to property name
            if (selectedItem.hasOwnProperty(prop)) {
                // Handle different input types
                switch (input.type) {
                    case 'checkbox':
                        // Special handling for checkboxes based on their ID
                        if (input.id === 'IsInBound') {
                            input.checked = !selectedItem.isOutBound; // Invert for IsInBound checkbox
                        } else if (input.id === 'IsOutBound') {
                            input.checked = selectedItem.isOutBound; // Directly set for IsOutBound checkbox
                        }
                        break;
                    case 'select-one':
                        // Find the option matching the selectedItem[prop] value
                        for (var i = 0; i < input.options.length; i++) {
                            if (input.options[i].value === selectedItem[prop].toString()) {
                                input.selectedIndex = i;
                                break;
                            }
                        }
                        break;
                    default:
                        input.value = selectedItem[prop].toString(); // Set input value
                        break;
                }
            }
            else {
                if (input.id === 'IsInBound') {
                    input.checked = !selectedItem.isOutBound; // Invert for IsInBound checkbox
                } else if (input.id === 'IsOutBound') {
                    input.checked = selectedItem.isOutBound; // Directly set for IsOutBound checkbox
                }
            }
        });

        // Scroll to the top of the edit form container
        window.scrollTo(0, editFormContainer.offsetTop);
    } catch (error) {
        console.error('Error loading edit form:', error);
    }
}

var isSuccess = false;
async function SaveActivityDetails() {
    var activityType = $('#activityType').val();
    var saveOperations = [];

    if (activityType.includes('Yard Loading')) {
        saveOperations.push(SaveYardLoading());
    }
    if (activityType.includes('Yard Tipping')) {
        saveOperations.push(SaveYardTipping());
    }
    if (activityType.includes("Site Installation") || activityType.includes("Site Uplift")) {
        saveOperations.push(SaveSiteInstallation());
    }

    try {
        // Wait for all save operations to complete
        const results = await Promise.all(saveOperations);

        // Check if all operations were successful
        isSuccess = results.every(result => result === true);

        if (isSuccess) {
            SaveActivityTeamTimeDetails();
            pageReloaded = true;
            setTimeout(function () {
                location.reload(); // Reload the page after a 2-second delay
            }, 2000);
        }
    } catch (error) {
        console.error("An error occurred:", error);
    }
}


$('.siteInstallationOld').on('blur', 'input, select,textarea,button', function (e) {

    const target = e.target || e.srcElement;
    // Check if the target element or any of its ancestors is the file input
    if (target.id === 'fileInput' || $(target).closest('#fileInput').length > 0) {
        if (target.files.length <= 0) {
            return; // Do nothing if the file input or its child elements triggered the event
        }
    }

    SaveSiteInstallation();

});
async function SaveSiteInstallation() {
    return new Promise((resolve, reject) => {
        var actid = globalactivityId || $('#activityid').val();
        var filesInput = document.getElementById('fileInput');
        if (filesInput && filesInput.files && filesInput.files.length > 0) {
            fileInputValue = filesInput.files;
        }
        var filesInputRam = document.getElementById('fileInputRAM');
        if (filesInputRam && filesInputRam.files && filesInputRam.files.length > 0) {
            fileInputRamValue = filesInputRam.files;
        }
        var isValid = true;

        var Siteformdata = {
            MeetingSite: $('#sitemeetingDate').val(),
            LabourSupplier: $('#sitelabourSupplier').val(),
            SupplierContact: $('#sitesupplierContact').val(),
            NoOfPersoneSupplied: $('#Numberofpersons').val(),
            BarrierType: $('#btype').val(),
            BarrierQty: $('#bquantity').val(),
            BarrierStartAndFinishLocation: $('#blocations').val(),
            BarrierPerformance: $('#bPerformance').val(),
            LengthOfRuns: $('#blength').val(),
            AnchoringDetails: $('#anchordetails').val(),
            Isapermittobreakgroundrequired: $('#bpermitreq').val(),
            ChainLiftingequipmenttobeused: $('#bpermitreqchain').val(),
            IncidentReporting: $('#Incidentreporting').val(),
            OtherResourcesEquipmentUsed: $('#txtresources').val(),
            AllRelevantActivityRams: $('#txtrelevantactivity').val(),
            AnySpecialInstructions: $('#txtspecialinstruction').val(),
            ActivityId: actid,
            Id: $('.sid1').val(),
            ProjectNumberIdCode: $('#siteprojectId').val(),
            Meetingdateandtime: $('#sitemDateTime').val(),
            SpecificBarrierStartAndFinishLocations: $('#sfinishlocation').val(),
            CrashCushionsRequiredDetails: $('#cushionsrequireddetails').val(),
            Type: "Site Installation",
            IsNotNeeded: $('#IsNotNeeded').is(':checked'),
            Whyitsnotneeded: $('#Whyitsnotneeded').val()
        };

        if (!Siteformdata.IsNotNeeded) {
            delete Siteformdata.Whyitsnotneeded;
            delete Siteformdata.IsNotNeeded;
        }

        var formData = new FormData();

        if (filesInput && filesInput.files.length > 0) {
            for (var i = 0; i < filesInput.files.length; i++) {
                formData.append('SiteImages', filesInput.files[i]);
            }
        }

        if (filesInputRam && filesInputRam.files.length > 0) {
            for (var i = 0; i < filesInputRam.files.length; i++) {
                formData.append('RAMSImages', filesInputRam.files[i]);
            }
        }

        $.each(Siteformdata, function (key, value) {
            formData.append('Sitedata.' + key, value);
        });

        $.each(Siteformdata, function (key, value) {
            if (!value) {
                // Set error message based on the field
                switch (key) {
                    case 'MeetingSite':
                        $('#sitemeetingError').text('Meeting Site is required.');
                        break;
                    case 'LabourSupplier':
                        $('#sitelabourSupplierError').text('Labour Supplier is required.');
                        break;
                    case 'SupplierContact':
                        $('#sitesupplierError').text('Supplier Contact is required.');
                        break;
                    case 'NoOfPersoneSupplied':
                        $('#numofpersonserror').text('Number of Persons Supplied is required.');
                        break;
                    case 'BarrierType':
                        $('#btypeerror').text('Barrier Type is required.');
                        break;
                    case 'BarrierQty':
                        $('#qtyBarriersError').text('Barrier Qty is required.');
                        break;
                    case 'BarrierStartAndFinishLocation':
                        $('#blocationError').text('Barrier start and finish location is required.');
                        break;
                    case 'BarrierPerformance':
                        $('#bperformanceError').text('Barrier Performance is required.');
                        break;
                    case 'LengthOfRuns':
                        $('#blengthError').text('Length of runs is required.');
                        break;
                    case 'AnchoringDetails':
                        $('#anchodetailsError').text('Anchoring details is required.');
                        break;
                    case 'Isapermittobreakgroundrequired':
                        $('#permitreqError').text('Is a permit to break ground required is required.');
                        break;
                    case 'ChainLiftingequipmenttobeused':
                        $('#permitreqchainError').text('Chain / lifting equipment to be used is required.');
                        break;
                    case 'IncidentReporting':
                        $('#IncidentreportingError').text('Incident reporting is required.');
                        break;
                    case 'OtherResourcesEquipmentUsed':
                        $('#txtresourcesError').text('Other resources / equipment used is required.');
                        break;
                    case 'AllRelevantActivityRams':
                        $('#txtrelevantactivityError').text('All relevant activity RAMS, lift plans and SSOW is required.');
                        break;
                    case 'AnySpecialInstructions':
                        $('#txtspecialinstructionError').text('Any special instructions / site restrictions / specific PPE is required');
                        break;
                    case 'ProjectNumberIdCode':
                        $('#siteprojid').text('Project Number / ID code is required.');
                        break;
                    case 'Meetingdateandtime':
                        $('#sitemeetigdate').text('Meeting Date and Time is required.');
                        break;
                    case 'SpecificBarrierStartAndFinishLocations':
                        $('#siteloc').text('Specific barrier start and finish locations is required.');
                        break;
                    case 'CrashCushionsRequiredDetails':
                        $('#sitecrashcushion').text('Crash cushions required - details is required.');
                        break;
                    default:
                        break;
                }
                isValid = false;
            } else {
                switch (key) {
                    case 'MeetingSite':
                        $('#sitemeetingError').text('');
                        break;
                    case 'LabourSupplier':
                        $('#sitelabourSupplierError').text('');
                        break;
                    case 'SupplierContact':
                        $('#sitesupplierError').text('');
                        break;
                    case 'NoOfPersoneSupplied':
                        $('#numofpersonserror').text('');
                        break;
                    case 'BarrierType':
                        $('#btypeerror').text('');
                        break;
                    case 'BarrierQty':
                        $('#qtyBarriersError').text('');
                        break;
                    case 'BarrierStartAndFinishLocation':
                        $('#blocationError').text('');
                        break;
                    case 'BarrierPerformance':
                        $('#bperformanceError').text('');
                        break;
                    case 'LengthOfRuns':
                        $('#blengthError').text('');
                        break;
                    case 'AnchoringDetails':
                        $('#anchodetailsError').text('');
                        break;
                    case 'Isapermittobreakgroundrequired':
                        $('#permitreqError').text('');
                        break;
                    case 'ChainLiftingequipmenttobeused':
                        $('#permitreqchainError').text('');
                        break;
                    case 'IncidentReporting':
                        $('#IncidentreportingError').text('');
                        break;
                    case 'OtherResourcesEquipmentUsed':
                        $('#txtresourcesError').text('');
                        break;
                    case 'AllRelevantActivityRams':
                        $('#txtrelevantactivityError').text('');
                        break;
                    case 'AnySpecialInstructions':
                        $('#txtspecialinstructionError').text('');
                        break;
                    case 'ProjectNumberIdCode':
                        $('#siteprojid').text('');
                        break;
                    case 'Meetingdateandtime':
                        $('#sitemeetigdate').text('');
                        break;
                    case 'SpecificBarrierStartAndFinishLocations':
                        $('#siteloc').text('');
                        break;
                    case 'CrashCushionsRequiredDetails':
                        $('#sitecrashcushion').text('');
                        break;
                    default:
                        break;
                }
            }
        });

        if (filesInput.files.length === 0) {
            var IsimageCount = document.querySelectorAll('#UploadPathSite');
            var oldFileCount = $('#fileInput').attr('oldFileCount');
            oldFileCount = oldFileCount == undefined ? 0 : oldFileCount;

            if (IsimageCount.length > 0 || oldFileCount > 0 ) {
                $('#fileInputError').text('');
            } else {
                $('#fileInputError').text('Site/Layout drawings/site images is required.');
                isValid = false;
            }
        } else {
            $('#fileInputError').text('');
        }

        if (filesInputRam.files.length === 0) {
            var IsimageCount = document.querySelectorAll('#UploadPathRAMSite');
            var oldFileCount = $('#fileInputRAM').attr('oldFileCount');

            oldFileCount = oldFileCount == undefined ? 0 : oldFileCount;
            if (IsimageCount.length > 0 || oldFileCount > 0) {
                $('#fileInputRAMError').text('');
            } else {
                $('#fileInputRAMError').text('Site/Layout drawings/site images is required.');
                isValid = false;
                
            }
        } else {
            $('#fileInputRAMError').text('');
        }

        if (isValid) {
            isValid = ValidateTeamTimeDetailsData();
        }

        if (isValid) {
            $.ajax({
                url: '/activity/SaveDataactivitydetails',
                method: 'post',
                processData: false,
                contentType: false,
                data: formData,
                success: function (response) {
                    if (response.success) {
                        if ($('.sid1').val() != 0) {
                            $('#sitesuccessupdatemessage').fadeIn().delay(1000).fadeOut();
                        } else {
                            $('#sitesuccessmessage').fadeIn().delay(1000).fadeOut();
                        }
                        resolve(true);
                    }
                },
                error: function (xhr, status, error) {
                    $('#siteerrormessage').fadeIn().delay(1000).fadeOut();
                    reject(false);
                }
            });
        } else {
            resolve(false);
        }
    });
}





$('.yardLoadingOld').on('blur', 'input, select,textarea,button', function (e) {

    const target = e.target || e.srcElement;

    // Check if the target element or any of its ancestors is the file input
    if (target.id === 'fileInputloding' && $(target).closest('#fileInputloding').length > 0) {
        if (target.files.length <= 0) {
            return; // Do nothing if the file input or its child elements triggered the event
        }
    }

    SaveYardLoading();

});
async function SaveYardLoading() {
    var actid = globalactivityId;
    var fileInputValue, fileInputRamValue, fileInputDamageValue;

    if (!actid) {
        actid = $('#activityid').val();

        var filesInput = document.getElementById('fileInputloding');
        if (filesInput && filesInput.files && filesInput.files.length > 0) {
            fileInputValue = filesInput.files;
        }

        var filesInputRam = document.getElementById('fileInputRAMloading');
        if (filesInputRam && filesInputRam.files && filesInputRam.files.length > 0) {
            fileInputRamValue = filesInputRam.files;
        }

        var filesInputDamage = document.getElementById('fileInputDamageloading');
        if (filesInputDamage && filesInputDamage.files && filesInputDamage.files.length > 0) {
            fileInputDamageValue = filesInputDamage.files;
        }
    }

    var isValid = true;

    var Yardformdata = {
        Startandfinishtime: $('#bstartfinishTime').val(),
        LiftingEquipmentUsed: $('#blifting').val(),
        ChainLiftingequipmenttobeused: $('#chainlifteq').val(),
        IncidentReporting: $('#LIncireporting').val(),
        AnyNearMissOccurrences: $('#txtanymissoccure').val(),
        BarrierConditionChecks: $('#conditions').val(),
        AllRelevantActivityRams: $('#Rams').val(),
        ActivityId: actid,
        Id: $('.ylid').val(),
        ProjectNumberIdCode: $('#projectId').val(),
        Meetingdateandtime: $('#mDateTime').val(),
        HCSiteActivitytoTakePlace: $('#activityPlace').val(),
        DateBarrierLoadedIsRequiredIfKnown: $('#barrierDate').val(),
        LocationOfFallArresterIBeam: $('#location').val(),
        Type: "Yard Loading",
        IsNotNeeded: $('#IsNotNeeded').is(':checked'),
        Whyitsnotneeded: $('#Whyitsnotneeded').val(),
    };

    if (!Yardformdata.IsNotNeeded) {
        delete Yardformdata.Whyitsnotneeded;
        delete Yardformdata.IsNotNeeded;
    }

    var formData = new FormData();
    if (fileInputValue) {
        for (var i = 0; i < fileInputValue.length; i++) {
            formData.append('SiteImages', fileInputValue[i]);
        }
    }
    if (fileInputRamValue) {
        for (var i = 0; i < fileInputRamValue.length; i++) {
            formData.append('RAMSImages', fileInputRamValue[i]);
        }
    }
    if (fileInputDamageValue) {
        for (var i = 0; i < fileInputDamageValue.length; i++) {
            formData.append('DamageImages', fileInputDamageValue[i]);
        }
    }

    $.each(Yardformdata, function (key, value) {
        formData.append('Sitedata.' + key, value);
    });

    $.each(Yardformdata, function (key, value) {
        if (!value) {
            switch (key) {
                case 'Startandfinishtime':
                    $('#starttime').text('Start & finish Time is required.');
                    break;
                case 'LiftingEquipmentUsed':
                    $('#liftingeqp').text('Lifting equipment used is required.');
                    break;
                case 'ChainLiftingequipmenttobeused':
                    $('#chainliftingL').text('Chain / lifting equipment to be used is required.');
                    break;
                case 'IncidentReporting':
                    $('#increporting').text('Incident reporting is required.');
                    break;
                case 'AnyNearMissOccurrences':
                    $('#txtanymissoccureError').text('Any Near Miss / N/C / I/O occurrences is required.');
                    break;
                case 'BarrierConditionChecks':
                    $('#barriercon').text('Barrier condition checks / suitability / damage is required.');
                    break;
                case 'AllRelevantActivityRams':
                    $('#allrelavant').text('All relevant activity RAMS, lift plans and SSOW is required.');
                    break;
                case 'ProjectNumberIdCode':
                    $('#projid').text('Project Number / ID code is required.');
                    break;
                case 'Meetingdateandtime':
                    $('#meetigdate').text('Meeting Date and Time is required.');
                    break;
                case 'HCSiteActivitytoTakePlace':
                    $('#actliplace').text('HC Site activity to take place is required.');
                    break;
                case 'DateBarrierLoadedIsRequiredIfKnown':
                    $('#bdate').text('Date barrier loader is required if known is required.');
                    break;
                case 'LocationOfFallArresterIBeam':
                    $('#locationE').text('Location of fall arrester I beam is required.');
                    break;
                default:
                    break;
            }
            isValid = false;
        } else {
            switch (key) {
                case 'Startandfinishtime':
                    $('#starttime').text('');
                    break;
                case 'LiftingEquipmentUsed':
                    $('#liftingeqp').text('');
                    break;
                case 'ChainLiftingequipmenttobeused':
                    $('#chainliftingL').text('');
                    break;
                case 'IncidentReporting':
                    $('#increporting').text('');
                    break;
                case 'AnyNearMissOccurrences':
                    $('#txtanymissoccureError').text('');
                    break;
                case 'BarrierConditionChecks':
                    $('#barriercon').text('');
                    break;
                case 'AllRelevantActivityRams':
                    $('#allrelavant').text('');
                    break;
                case 'ProjectNumberIdCode':
                    $('#projid').text('');
                    break;
                case 'Meetingdateandtime':
                    $('#meetigdate').text('');
                    break;
                case 'HCSiteActivitytoTakePlace':
                    $('#actliplace').text('');
                    break;
                case 'DateBarrierLoadedIsRequiredIfKnown':
                    $('#bdate').text('');
                    break;
                case 'LocationOfFallArresterIBeam':
                    $('#locationE').text('');
                    break;
                default:
                    break;
            }
        }
    });

    if (filesInputDamage.files.length == 0) {
        var IsimageCount = document.querySelectorAll('#UploadPathDamage');
        var oldFileCount = $('#fileInputDamageloading').attr('oldFileCount');
        oldFileCount = oldFileCount == undefined ? 0 : oldFileCount;

        if (IsimageCount.length > 0 || oldFileCount > 0) {
            $('#fileInputErrorDamage').text('');
        } else {
            $('#fileInputErrorDamage').text('Barrier condition checks / suitability / damage images are required.');
            isValid = false;
        }
    } else {
        $('#fileInputErrorDamage').text('');
    }

    if (filesInputRam.files.length == 0) {
        var IsimageCount = document.querySelectorAll('#UploadPathRAM');
        var oldFileCount = $('#fileInputRAMloding').attr('oldFileCount');
        oldFileCount = oldFileCount == undefined ? 0 : oldFileCount;

        if (IsimageCount.length > 0 || oldFileCount > 0) {
            $('#fileInputErrorRAM').text('');
        } else {
            $('#fileInputErrorRAM').text('All relevant activity RAMS, lift plans and SSOW  images are required.');
            isValid = false;
        }
    } else {
        $('#fileInputErrorRAM').text('');
    }
    
    if (filesInput.files.length == 0) {
        var IsimageCount = document.querySelectorAll('#UploadPath');
        var oldFileCount = $('#fileInputloding').attr('oldFileCount');
        oldFileCount = oldFileCount == undefined ? 0 : oldFileCount;

        if (IsimageCount.length > 0 || oldFileCount > 0) {
            $('#fileInputlError').text('');
        } else {
            $('#fileInputlError').text('Site/Layout drawings/site images are required.');
            isValid = false;
        }
    } else {
        $('#fileInputlError').text('');
    }

    if (isValid) {
        isValid = ValidateTeamTimeDetailsData();
    }

    if (isValid) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: '/Activity/SaveDataactivitydetails',
                method: 'post',
                processData: false,
                contentType: false,
                data: formData,
                success: function (response) {
                    if (response.success) {
                        if ($('.ylid').val() != 0) {
                            $('#sitesuccessupdatemessage').fadeIn().delay(1000).fadeOut();
                        } else {
                            $('#sitesuccessmessage').fadeIn().delay(1000).fadeOut();
                        }
                        resolve(true);
                    } else {
                        $('#siteerrormessage').fadeIn().delay(1000).fadeOut();
                        resolve(false);
                    }
                },
                error: function (xhr, status, error) {
                    $('#siteerrormessage').fadeIn().delay(1000).fadeOut();
                    resolve(false);
                }
            });
        });
    } else {
        return Promise.resolve(false);
    }
}



var fileInputValueYard;

$('.yardTippingOld').on('blur', 'input, select,textarea,button', function (e) {


    const target = e.target || e.srcElement;

    // Check if the target element or any of its ancestors is the file input
    if (target.id === 'fileInputyard' && $(target).closest('#fileInputyard').length > 0) {
        if (target.files.length <= 0) {
            return; // Do nothing if the file input or its child elements triggered the event
        }
    }

    SaveYardTipping();
});
async function SaveYardTipping() {
    return new Promise((resolve, reject) => {
        var actid = globalactivityId || $('#activityid').val();
        var filesInput = document.getElementById('fileInputyard');
        var filesInputRam = document.getElementById('fileInputRAMyard');
        var filesInputDamage = document.getElementById('fileInputDamageyard');

        var Siteformdata = {
            Startandfinishtime: $('#yardbstartfinishTime').val(),
            LiftingEquipmentUsed: $('#yardblifting').val(),
            ChainLiftingequipmenttobeused: $('#yardchainlifteq').val(),
            IncidentReporting: $('#yardIncidentreporting').val(),
            AnyNearMissOccurrences: $('#txtyardAnymiss').val(),
            BarrierConditionChecks: $('#txtbarriercondition').val(),
            AllRelevantActivityRams: $('#txtAllrelevant').val(),
            ActivityId: actid || 0,
            Id: $('.ytid').val(),
            ProjectNumberIdCode: $('#txtprojectId').val(),
            Meetingdateandtime: $('#txtmDateTime').val(),
            HCSiteTippingActivityToTakePlace: $('#txtactivityPlace').val(),
            Type: "Yard Tipping",
            IsNotNeeded: $('#IsNotNeeded').is(':checked'),
            Whyitsnotneeded: $('#Whyitsnotneeded').val()
        };

        if (!Siteformdata.IsNotNeeded) {
            delete Siteformdata.Whyitsnotneeded;
            delete Siteformdata.IsNotNeeded;
        }

        var isValid = true;

        // Append files to formData
        var formData = new FormData();
        if (filesInput && filesInput.files.length > 0) {
            for (var i = 0; i < filesInput.files.length; i++) {
                formData.append('SiteImages', filesInput.files[i]);
            }
        }
        if (filesInputRam && filesInputRam.files.length > 0) {
            for (var i = 0; i < filesInputRam.files.length; i++) {
                formData.append('RAMSImages', filesInputRam.files[i]);
            }
        }
        if (filesInputDamage && filesInputDamage.files.length > 0) {
            for (var i = 0; i < filesInputDamage.files.length; i++) {
                formData.append('DamageImages', filesInputDamage.files[i]);
            }
        }

        $.each(Siteformdata, function (key, value) {
            formData.append('Sitedata.' + key, value);
        });

        $.each(Siteformdata, function (key, value) {
            if (!value) {
                // Set error message based on the field
                switch (key) {
                    case 'Startandfinishtime':
                        $('#bstartfinishTimeError').text('Start & finish Time is required.');
                        break;
                    case 'LiftingEquipmentUsed':
                        $('#bliftingError').text('Lifting equipment used is required.');
                        break;
                    case 'ProjectNumberIdCode':
                        $('#txtprojid').text('Project Number / ID code is required.');
                        break;
                    case 'Meetingdateandtime':
                        $('#txtmeetigdate').text('Meeting Date and Time is required.');
                        break;
                    case 'HCSiteTippingActivityToTakePlace':
                        $('#txtactiplc').text('HC Site tipping activity to take place is required.');
                        break;
                    default:
                        break;
                }
                isValid = false;
            } else {
                switch (key) {
                    case 'Startandfinishtime':
                        $('#bstartfinishTimeError').text('');
                        break;
                    case 'LiftingEquipmentUsed':
                        $('#bliftingError').text('');
                        break;
                    case 'ProjectNumberIdCode':
                        $('#txtprojid').text('');
                        break;
                    case 'Meetingdateandtime':
                        $('#txtmeetigdate').text('');
                        break;
                    case 'HCSiteTippingActivityToTakePlace':
                        $('#txtactiplc').text('');
                        break;
                    default:
                        break;
                }
            }
        });

        if (filesInputDamage.files.length == 0) {
            var IsimageCount = document.querySelectorAll('#UploadPathDamageyard');
            var oldFileCount = $('#fileInputDamageyard').attr('oldFileCount');
            oldFileCount = oldFileCount == undefined ? 0 : oldFileCount;

            if (IsimageCount.length > 0 || oldFileCount > 0) {
                $('#fileInputErrorDamageyard').text('');
            } else {
                $('#fileInputErrorDamageyard').text('Barrier condition checks / suitability / damage images are required.');
                isValid = false;
            }
        } else {
            $('#fileInputErrorDamageyard').text('');
        }

        if (filesInputRam.files.length == 0) {
            var IsimageCount = document.querySelectorAll('#UploadPathRAMyard');
            var oldFileCount = $('#fileInputRAMyard').attr('oldFileCount');
            oldFileCount = oldFileCount == undefined ? 0 : oldFileCount;

            if (IsimageCount.length > 0 || oldFileCount > 0) {
                $('#fileInputErrorRAMyard').text('');
            } else {
                $('#fileInputErrorRAMyard').text('All relevant activity RAMS, lift plans and SSOW  images are required.');
                isValid = false;
            }
        } else {
            $('#fileInputErrorRAMyard').text('');
        }
        if (filesInput.files.length === 0) {
            var IsimageCount = document.querySelectorAll('#UploadPathyard');
            var oldFileCount = $('#fileInputyard').attr('oldFileCount') || 0;

            if (IsimageCount.length === 0 && oldFileCount === 0) {
                $('#fileInputyardError').text('Site/Layout drawings/site images is required.');
                isValid = false;
            } else {
                $('#fileInputyardError').text('');
            }
        } else {
            $('#fileInputyardError').text('');
        }

        if (isValid) {
            isValid = ValidateTeamTimeDetailsData();
        }

        if (isValid) {
            $.ajax({
                url: '/activity/SaveDataactivitydetails',
                method: 'post',
                processData: false,
                contentType: false,
                data: formData,
                success: function (response) {
                    if (response.success) {
                        if ($('.ytid').val() != 0) {
                            $('#sitesuccessupdatemessage').fadeIn().delay(1000).fadeOut();
                        } else {
                            $('#sitesuccessmessage').fadeIn().delay(1000).fadeOut();
                        }
                        resolve(true);
                    } else {
                        $('#siteerrormessage').fadeIn().delay(1000).fadeOut();
                        resolve(false);
                    }
                },
                error: function (xhr, status, error) {
                    $('#siteerrormessage').fadeIn().delay(1000).fadeOut();
                    reject(false);
                }
            });
        } else {
            resolve(false);
        }
    });
}


//function SaveYardTipping() {

//    var actid = globalactivityId;
//    //var fileInputValue;
//    if (actid == "" || actid == null || actid == undefined || actid == 0) {
//        actid = $('#activityid').val();

//        var filesInput = document.getElementById('fileInputyard');
//        if (filesInput && filesInput.files && filesInput.files.length > 0) {
//            fileInputValue = filesInput.files;
//        }
//        else {

//        }
//        var filesInputRam = document.getElementById('fileInputRAMyard');
//        if (filesInputRam && filesInputRam.files && filesInputRam.files.length > 0) {
//            fileInputRamValue = filesInputRam.files;
//        }
//        var filesInputDamage = document.getElementById('fileInputDamageyard');
//        if (filesInputDamage && filesInputDamage.files && filesInputDamage.files.length > 0) {
//            fileInputDamageValue = filesInputDamage.files;
//        }
//    }
//    var isValid = true;
//    //if ($(this).is('#fileInput')) {
//    //    fileInputValue = $('#fileInput')[0].files[0];
//    //}
//    var Siteformdata = {
//        Startandfinishtime: $('#yardbstartfinishTime').val(),
//        LiftingEquipmentUsed: $('#yardblifting').val(),
//        ChainLiftingequipmenttobeused: $('#yardchainlifteq').val(),
//        IncidentReporting: $('#yardIncidentreporting').val(),
//        AnyNearMissOccurrences: $('#txtyardAnymiss').val(),
//        BarrierConditionChecks: $('#txtbarriercondition').val(),
//        AllRelevantActivityRams: $('#txtAllrelevant').val(),
//        ActivityId: actid || 0,
//        Id: $('.ytid').val(),
//        ProjectNumberIdCode: $('#txtprojectId').val(),
//        Meetingdateandtime: $('#txtmDateTime').val(),
//        HCSiteTippingActivityToTakePlace: $('#txtactivityPlace').val(),
//        Type: "Yard Tipping",
//        IsNotNeeded: $('#IsNotNeeded').is(':checked'),
//        Whyitsnotneeded: $('#Whyitsnotneeded').val(),
//        // Add other form fields here
//    };
//    if (!Siteformdata.IsNotNeeded) {
//        delete Siteformdata.Whyitsnotneeded;
//        delete Siteformdata.IsNotNeeded;
//    }
//    // Append other form data fields to the formData
//    var formData = new FormData();
//    // Append all files selected to the formData

//    if (filesInput.files.length > 0) {
//        for (var i = 0; i < filesInput.files.length; i++) {
//            formData.append('SiteImages', filesInput.files[i]);
//        }
//    }
//    if (filesInputRam.files.length > 0) {
//        for (var i = 0; i < filesInputRam.files.length; i++) {
//            formData.append('RAMSImages', filesInputRam.files[i]);
//        }
//    }
//    if (filesInputDamage.files.length > 0) {
//        for (var i = 0; i < filesInputDamage.files.length; i++) {
//            formData.append('DamageImages', filesInputDamage.files[i]);
//        }
//    }
//    //$.each($('#fileInput')[0].files, function (index, file) {
//    //    formData.append('SiteImages', file);
//    //});


//    // Append other form data fields to the formData
//    $.each(Siteformdata, function (key, value) {
//        formData.append('Sitedata.' + key, value);
//    });

//    $.each(Siteformdata, function (key, value) {
//        if (!value) {
//            // Set error message based on the field
//            switch (key) {
//                case 'Startandfinishtime':
//                    $('#bstartfinishTimeError').text('Start & finish Time is required.');
//                    break;
//                case 'LiftingEquipmentUsed':
//                    $('#bliftingError').text('Lifting equipment used is required.');
//                    break;
//                case 'ProjectNumberIdCode':
//                    $('#txtprojid').text('Project Number / ID code is required.');
//                    break;
//                case 'Meetingdateandtime':
//                    $('#txtmeetigdate').text('Meeting Date and Time is required.');
//                    break;
//                case 'HCSiteTippingActivityToTakePlace':
//                    $('#txtactiplc').text('HC Site tipping activity to take place is required.');
//                    break;
//                // Add cases for other fields
//                default:
//                    break;
//            }
//            isValid = false; // Set isValid to false
//        } else {
//            // Clear error message if the field is not empty
//            switch (key) {
//                case 'Startandfinishtime':
//                    $('#bstartfinishTimeError').text('');
//                    break;
//                case 'LiftingEquipmentUsed':
//                    $('#bliftingError').text('');
//                    break;
//                case 'ProjectNumberIdCode':
//                    $('#txtprojid').text('');
//                    break;
//                case 'Meetingdateandtime':
//                    $('#txtmeetigdate').text('');
//                    break;
//                case 'HCSiteTippingActivityToTakePlace':
//                    $('#txtactiplc').text('');
//                    break;
//                // Add cases for other fields
//                default:
//                    break;
//            }
//        }
//    });
    
//    if (filesInput.files.length == 0) {
//        var IsimageCount = document.querySelectorAll('#UploadPath');
//        var oldFileCount = $('#fileInputyard').attr('oldFileCount');
//        oldFileCount = oldFileCount == undefined ? 0 : oldFileCount;

//        if (IsimageCount.length > 0 || oldFileCount > 0) {
//            $('#yardfileInputyardError').text('');
//        }
//        else {
//            $('#yardfileInputyardError').text('Site/Layout drawings/site images is required.');
//            isValid = false;
//        }
//    } else {
//        $('#yardfileInputyardError').text('');
//    }
    
//    if (isValid) {
//        isValid = ValidateTeamTimeDetailsData();
//    }
//    // Move AJAX call inside the isValid block
//    if (isValid) {
//        var pageReloaded = false;
//        $.ajax({
//            url: '/activity/SaveDataactivitydetails',
//            method: 'post',
//            processData: false, // Prevent jQuery from processing the data
//            contentType: false, // Prevent jQuery from setting contentType
//            data: formData,
//            success: function (response) {
                
//                //SaveActivityTeamTimeDetails();
//                if (response.success && !pageReloaded) {
//                    isSuccess = true;
//                    if ($('.ytid').val() != 0) {
//                        $('#sitesuccessupdatemessage').fadeIn().delay(1000).fadeOut();

//                    } else {
//                        $('#sitesuccessmessage').fadeIn().delay(1000).fadeOut();
//                    }
                   

//                    //pageReloaded = true;
//                    //setTimeout(function () {
//                    //    location.reload(); // Reload the page after a 2-second delay
//                    //}, 2000);
//                }
//            },
//            error: function (xhr, status, error) {
//                $('#siteerrormessage').fadeIn().delay(1000).fadeOut();
//            }
//        });
//    }
//}


function clearValidationErrorsTeamTimeDetails($row) {
    $row.find('.text-danger').empty();
}
function TeamTimeDetailsChangeExists() {
    
    var doChangesExists = false;
    $('#TeamTimeTable').find('.teamTimeRow').each(function (i, obj) {
        var $currentRow = $(obj);
        var TimeLeftAtHighwayCare = $currentRow.find('input[name="TimeLeftAtHighwayCare"]').val();
        var TimeArrivedAtCustomerCare = $currentRow.find('input[name="TimeArrivedAtCustomerCare"]').val();
        var JobStartTime = $currentRow.find('input[name="JobStartTime"]').val();
        var JobFinishTime = $currentRow.find('input[name="JobFinishTime"]').val();
        var TimeBackAtHighwayCare = $currentRow.find('input[name="TimeBackAtHighwayCare"]').val();

        if (!$currentRow.hasClass("existingRow")) {
            if ((TimeLeftAtHighwayCare != "" || TimeArrivedAtCustomerCare != "" || JobStartTime != "" || JobFinishTime != "" || TimeBackAtHighwayCare != ""))// || (Name == "" && Comments == "" && Shift == "")) {
            {
                doChangesExists = true;
            }
        }
        else {
            var TimeLeftAtHighwayCareOldVal = $currentRow.find('input[name="TimeLeftAtHighwayCare"]').attr('oldvalue');
            var TimeArrivedAtCustomerCareOldVal = $currentRow.find('input[name="TimeArrivedAtCustomerCare"]').attr('oldvalue');
            var JobStartTimeOldVal = $currentRow.find('input[name="JobStartTime"]').attr('oldvalue');
            var JobFinishTimeOldVal = $currentRow.find('input[name="JobFinishTime"]').attr('oldvalue');
            var TimeBackAtHighwayCareOldVal = $currentRow.find('input[name="TimeBackAtHighwayCare"]').attr('oldvalue');

            if ((TimeLeftAtHighwayCare != TimeLeftAtHighwayCareOldVal || TimeArrivedAtCustomerCare != TimeArrivedAtCustomerCareOldVal
                || JobStartTime != JobStartTimeOldVal || JobFinishTime != JobFinishTimeOldVal || TimeBackAtHighwayCare != TimeBackAtHighwayCareOldVal)) {
                doChangesExists = true;
            }
        }
    });
    return doChangesExists;
}
function ValidateTeamTimeDetailsData() {
    
    var isValidFinal = true;
    $('#TeamTimeTable').find('.teamTimeRow').each(function (i, obj) {

        if (!$(obj).hasClass("existingRow")) {
            var $currentRow = $(obj);
            var isValid = validateInputFieldsTeamTimeDetails($currentRow);

            if (!isValid) {
                isValidFinal = false;
            }

        }
    });
    return isValidFinal;
}

function validateInputFieldsTeamTimeDetails($row) {

    var isValid = true;
    
    var TimeLeftAtHighwayCare = $row.find('input[name="TimeLeftAtHighwayCare"]').val();
    var TimeArrivedAtCustomerCare = $row.find('input[name="TimeArrivedAtCustomerCare"]').val();
    var JobStartTime = $row.find('input[name="JobStartTime"]').val();
    var JobFinishTime = $row.find('input[name="JobFinishTime"]').val();
    var TimeBackAtHighwayCare = $row.find('input[name="TimeBackAtHighwayCare"]').val();

    if ((TimeLeftAtHighwayCare != "" && TimeArrivedAtCustomerCare != "" && JobStartTime != "" && JobFinishTime != "" && TimeBackAtHighwayCare != ""))
    {
    }
    else {
        isValid = false;
    }


    if (!isValid) {
        $row.find('select ,input[name="TimeLeftAtHighwayCare"], input[name="TimeArrivedAtCustomerCare"], input[name="JobStartTime"], input[name="JobFinishTime"], input[name="TimeBackAtHighwayCare"]').each(function () {
            var $input = $(this);
            var fieldName = $input.attr('name');
            var fieldValue = $input.val();

            if (!fieldValue.trim()) {
                isValid = false;
                $row.find('#' + fieldName).text(fieldName + ' is required');
            }
        });
    }
    return isValid;
}


function SaveActivityTeamTimeDetails() {
    
    $('#TeamTimeTable').find('.teamTimeRow').each(function (i, obj) {

        //if (!$(obj).hasClass("existingRow")) {

            var $currentRow = $(obj);//.closest('.teamTimeRow');
            var aid = $('#activityid').val();

        if (!aid) {
            $('#fildata').fadeIn().delay(1000).fadeOut();
            return;
        }



        clearValidationErrorsTeamTimeDetails($currentRow);

            var isValid = validateInputFieldsTeamTimeDetails($currentRow);


            if (isValid && !isDropdownOrTextboxFocusedJobTab) {

                var teamTimeData = {
                    ActivityId: aid,
                    TimeLeftAtHighwayCare: $currentRow.find('input[name="TimeLeftAtHighwayCare"]').val(),
                    TimeArrivedAtCustomerCare: $currentRow.find('input[name="TimeArrivedAtCustomerCare"]').val(),
                    JobStartTime: $currentRow.find('input[name="JobStartTime"]').val(),
                    JobFinishTime: $currentRow.find('input[name="JobFinishTime"]').val(),
                    TimeBackAtHighwayCare: $currentRow.find('input[name="TimeBackAtHighwayCare"]').val(),
                    Id: $currentRow.find('#tid').val()
                    
                };
                $.ajax({
                    async: false,
                    url: '/activity/SaveTeamTimeData',
                    method: 'POST',
                    data: teamTimeData,
                    success: function (response) {
                        
                        if (response.success) {
                            var doDisableTT = true;
                            $(".teamTimeCtl").each(function () {
                                var currVal = $(this).val();

                                if (currVal != "") {
                                    doDisableTT = doDisableTT && true;
                                    $(this).attr("oldvalue", currVal)

                                }
                                else {
                                    doDisableTT = doDisableTT && false;
                                }
                            });

                            if (doDisableTT == true) {
                                $('.teamTimeCtl').attr('disabled', 'disabled');
                            }

                            if (response.cid > 0) {

                                $('#teamtimesuccessmessage').fadeIn().delay(1000).fadeOut();
                            }
                            else {
                                $('#teamtimesuccessmessage').fadeIn().delay(1000).fadeOut();
                            }
                        }
                    },
                    error: function (xhr, status, error) {
                        $('#teamtimeerrormessage').fadeIn().delay(1000).fadeOut();
                    }
                });
            }
        //}

    });

}
function toggleCheckboxes(clickedId, otherId) {
    const clickedCheckbox = document.getElementById(clickedId);
    const otherCheckbox = document.getElementById(otherId);

    if (clickedCheckbox.checked) {
        otherCheckbox.checked = false;
    }
}
function addRowTeamTime(button) {
    var aid = $('#activityid').val();
    var table = document.getElementById("TeamTimeTable");
    var currentRow = button.parentNode.parentNode; // Get the current row
    var inputs = currentRow.querySelectorAll('.form-control');
    var errorSpans = currentRow.querySelectorAll('.text-danger');
    var canAddRow = true;

    inputs.forEach(function (input, index) {
        if (input.value.trim() === '') {
            canAddRow = false;
            if (errorSpans[index]) {
                errorSpans[index].innerText = "Please fill out this field.";
            } else {
                var errorSpan = document.createElement('span');
                errorSpan.classList.add('text-danger');
                errorSpan.innerText = "Please fill out this field.";
                input.parentNode.appendChild(errorSpan);
            }
        } else {
            if (errorSpans[index]) {
                errorSpans[index].innerText = "";
            }
        }
    });

    // Check if any dropdown is not filled out
    var dropdowns = currentRow.querySelectorAll('select');
    dropdowns.forEach(function (dropdown) {
        if (dropdown.value.trim() === '') {
            canAddRow = false;
            var errorSpan = document.createElement('span');
            errorSpan.classList.add('text-danger');
            errorSpan.innerText = "Please select an option.";
            dropdown.parentNode.appendChild(errorSpan);
        }
    });

    if (canAddRow) {

        var newRow = table.insertRow(-1); // Insert row at the top (reversed)
        newRow.classList.add('teamTimeRow');
        var cell1 = newRow.insertCell(0);
        var cell2 = newRow.insertCell(1);
        var cell3 = newRow.insertCell(2);
        var cell4 = newRow.insertCell(3);
        var cell5 = newRow.insertCell(4);
        var cell6 = newRow.insertCell(5);

        cell1.innerHTML = '<input value="" placeholder = "--:--" type="Time" class="form-control teamTimeCtl" id="TimeLeftAtHighwayCare" name="TimeLeftAtHighwayCare">' + '<span id="TimeLeftAtHighwayCare" class="text-danger"></span>';
        cell2.innerHTML = '<input value="" placeholder = "--:--" type="Time" class="form-control teamTimeCtl" id="TimeArrivedAtCustomerCare" name="TimeArrivedAtCustomerCare">' + '<span id="TimeArrivedAtCustomerCare" class="text-danger"></span>';
        cell3.innerHTML = '<input value="" placeholder = "--:--" type="Time" class="form-control teamTimeCtl" id="JobStartTime" name="JobStartTime">' + '<span id="JobStartTime" class="text-danger"></span>';
        cell4.innerHTML = '<input value="" placeholder = "--:--" type="Time" class="form-control teamTimeCtl" id="JobFinishTime" name="JobFinishTime">' + '<span id="JobFinishTime" class="text-danger"></span>';
        cell5.innerHTML = '<input value="" placeholder = "--:--" type="Time" class="form-control teamTimeCtl" id="TimeBackAtHighwayCare" name="TimeBackAtHighwayCare">' + '<span id="TimeBackAtHighwayCare" class="text-danger"></span>';
        cell6.innerHTML = '<input value="0" type="text" id="tid" style="display: none;">' + '<input value="' + aid + '" type="text" id="activityid" style="display: none;" /> ';
    }

}
