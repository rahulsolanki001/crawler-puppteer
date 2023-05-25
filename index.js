const API_KEY = "e1fae59664eb09955699f7a2b24aba9b";

// prefil();

function getValue(curr, res) {
    let ftodate = $(curr).val();
    console.log(ftodate);
    if (ftodate == "Round way") {
        $("#todate").show();
    } else {
        $("#todate").hide();
    }
    $("#wayData").html(ftodate);
}

function getValue2(curr) {
    // console.log(res)
    $("#classData").html($(curr).val());
}

$("body").click(function() {
    $(".search-locality-dropdown").hide();
});

//typed text*********************************************************************

const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["Travel", "Stories"];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000; // Delay between current and next text
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if (!cursorSpan.classList.contains("typing"))
            cursorSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        if (!cursorSpan.classList.contains("typing"))
            cursorSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(
            0,
            charIndex - 1
        );
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    // On DOM Load initiate the effect
    if (textArray.length) setTimeout(type, newTextDelay + 250);
});

$("#fromto").click(function() {
    $(this).find("img").toggleClass("rotateFromto");

    let val = $("#leaveFrom").val();
    let val1 = $("#goingTo").val();
    $("#goingTo").val(val);
    $("#leaveFrom").val(val1);
});

$("#leaveFrom").on("keydown", function() {
    console.log($(this).parents(".bordered-input"));
    $(this).parents(".travellingContent").find(".errorMsg .show_error").html("");
});

$("#goingTo").on("keydown", function() {
    console.log($(this).parents(".bordered-input"));
    $(this).parents(".travellingContent").find(".errorMsg .show_error").html("");
});

//typed text over*****************************************************************************

function prefil(via, current) {
    // console.log($(current).val().trim())

    console.log(
        $(current)
        .parents(".search-container")
        .siblings(".search-locality-dropdown")
        .fadeIn()
    );

    $.ajax({
        type: "GET", // http method
        beforeSend: function(request) {
            request.setRequestHeader("X-API-KEY", API_KEY);
        },
        url: "https://cybernauts.app/matrix/api/getLocationByName",
        data: {
            name: via == 1 ? $("#leaveFrom").val() : $("#goingTo").val(),
        },
        dataType: "json",
        success: function(data, status, xhr) {
            $("#dropdownListTo").fadeIn();
            if (status == "success") {
                if (data.status) {
                    var res = data.data.$values;
                    // console.log(res);
                    let show = "";
                    res.forEach((item, index) => {
                        if (via == 1) {
                            show += `   
                        <div class="search-item" onclick="setCountrySelect(this)" ><p><i class="bi bi-geo-alt-fill"></i><label> ${item.Name} </label></p><h6>${item.Code}</h6></div>`;
                        } else {
                            show += `   
                        <div class="search-item" onclick="setCountrySelect1(this)" ><p><i class="bi bi-geo-alt-fill"></i><label> ${item.Name} </label></p><h6>${item.Code}</h6></div>`;
                        }

                        if (index % 7 == 0 && index != 0) {
                            show += `</div><div class="row p-5" style="padding:0px 20px">`;
                        }
                    });
                    $("#dropdownListTo h5").html("Suggestions");
                    $("#dropdownListFrom h5").html("Suggestions");

                    via == 1 ? $("#fromCode").html(show) : $("#toCode").html(show);
                    // $('#fromCode').html(show);
                } else {
                    console.log(data.log);
                }
            } else {
                alert("Upload Failed");
            }
        },
        error: function(jqXhr, textStatus, errorMessage) {
            console.log(jqXhr.responseJSON.message);
        },
    });
}

const debounce = (fn, delay) => {
    let timeout;
    if (timeout) {
        clearTimeout(timeout);
    }
    return function() {
        timeout = setTimeout(() => {
            fn();
        }, delay);
    };
};
// const print = () => {
//     // console.log("You have open companyhandle");
//     prefil(1);
// };
// const print2 = () => {
//     // console.log("You have open companyhandle");
//     prefil(2);
// };
let city1 = "";
let city2 = "";
const detailsPage = () => {
    console.log(city1);
    location.href =
        "/travelv2/travel3.html?from=" +
        $("#leaveFrom").val() +
        "&city1=" +
        city1 +
        "&to=" +
        $("#goingTo").val() +
        "&way=" +
        $("#wayData").text().trim() +
        "&class=" +
        $("#classData").text().trim() +
        "&city2=" +
        city2 +
        "&pass=" +
        $("#total_pas").text().trim() +
        "&date=" +
        $("#datepicker5").val() +
        "&date2=" +
        $("#datepicker4").val();
};

const print = (curr) => {
    $(curr).siblings(".cross-icon").fadeIn();
    // console.log("You have open companyhandle");
    if ($("#leaveFrom").val().length >= 3) {
        prefil(1, curr);
    }
    if ($(curr).val().trim() == "") {
        $(curr)
            .parents(".search-container")
            .siblings(".search-locality-dropdown")
            .fadeOut();
    }
};

const print2 = (curr) => {
    if ($("#goingTo").val().length >= 3) {
        prefil(2, curr);
    }
    if ($(curr).val().trim() == "") {
        $(curr)
            .parents(".search-container")
            .siblings(".search-locality-dropdown")
            .fadeOut();
    }
};
const processChange = (curr) => debounce(print(curr), 100);
const processChangeTo = (curr) => debounce(print2(curr), 100);

$("#fullImgContainer").slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    adaptiveHeight: true,
    dots: true,
    prevArrow: $(".prevArrow"),
    nextArrow: $(".nextArrow"),
});
$(".slickCarousel").slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    adaptiveHeight: true,
    dots: true,
    prevArrow: $(".slick2Next"),
    nextArrow: $(".slick2Prev"),
});

$("#ticketmultiCityContainer").slick({
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: $("#ticketPrevArrow2"),
    nextArrow: $("#ticketNextArrow2"),
    responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true,
            },
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            },
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
    ],
});

$("#ticketContainerInternation").slick({
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: $("#ticketPrevArrow1"),
    nextArrow: $("#ticketNextArrow1"),
    responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true,
            },
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            },
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
    ],
});
$("#ticketContainer").slick({
    dots: true,
    infinite: false,
    speed: 300,
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: $("#ticketPrevArrow"),
    nextArrow: $("#ticketNextArrow"),
    responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true,
            },
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
            },
        },
        {
            breakpoint: 480,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
    ],
});
// $(".search-container").click(function(){

// })
$("#searchDropdown").click(function(e) {
    // console.log("in
    e.stopPropagation();
    $("#searchDropdown").parent().removeClass("book-manager-alert");
    $(".search-locality-dropdown").fadeOut();
    $(this).siblings(".search-locality-dropdown").fadeToggle();
});
$("#searchDropdown1").click(function(e) {
    // console.log("in")
    e.stopPropagation();

    $("#searchDropdown").parent().removeClass("book-manager-alert");
    $(this).siblings(".search-locality-dropdown").fadeToggle();
    // $(this).siblings(".search-locality-dropdown").slideToggle('slow', function () {
    //     if ($(".search-locality-dropdown").is(":hidden")) {
    //         $(this).find("i").css({
    //             "transform": "rotate(180deg)"
    //         });
    //     } else {
    //         $(this).find("i").css({
    //             "transform": "rotate(0deg)"
    //         });

    //     }
    // });
});

let setCountrySelect = (curr) => {
    $(curr).parents(".bordered-input").find(".cross-icon").fadeIn();
    $("#leaveFrom").val($(curr).find("h6").text());
    $(".search-locality-dropdown").fadeOut();
    $("#leavefromErr").css({ visibility: "hidden" });
    city1 = $(curr).find("label").text();
};

let setCountrySelect1 = (curr) => {
    $(curr).parents(".bordered-input").find(".cross-icon").fadeIn();
    $("#goingTo").val($(curr).find("h6").text());
    $("#goingToErr").css({ visibility: "hidden" });
    $(".search-locality-dropdown").fadeOut();
    city2 = $(curr).find("label").text();
};

// $('#datepicker2').datepicker().on('changeDate', function (ev) { })

$("#oneData").click(function() {
    $(".To").hide();
    $(".second").hide();
});

$("#roundData").click(function() {
    $(".To").show();
    $(".second").show();
});

$(".done_btn").click(function() {
    let sum = 0;
    $(".number-input").each((index, obj) => {
        sum += parseInt($(obj).val());
    });

    $("#totalpas").text(sum);
    $("#propogateStop").removeClass("show");
});

$(function() {
    let picker = $("#datepicker5")
        .datepicker({
            autoclose: true,
            todayHighlight: true,
            startDate: new Date(),
            forceParse: false,
            onSelect: function(date, e) {
                console.log(date, e);
                var selectedDate = new Date(date);
                var msecsInADay = 86400000;
                var endDate = new Date(selectedDate.getTime() + msecsInADay);
                //Set Minimum Date of EndDatePicker After Selected Date of StartDatePicker
                $("#datepicker4").datepicker("option", "minDate", endDate);
                $("#datepicker4").datepicker("refresh");
            },

            onShow: function() {
                $(this).fadeIn(1000);
            },
        })
        .on("changeDate", function(selected) {
            var minDate = new Date(selected.date.valueOf());
            $("#departDate5").siblings(".date-icon").fadeOut();
            //alert("in")
            // console.log(   $("#departDate4").siblings(".cross"))
            $("#departDate5").siblings(".cross").fadeIn();
            $("#datepicker4").datepicker("setStartDate", minDate);
            $("#departError").css({ visibility: "hidden" });
        });
});

$(".date-icon").click(function() {
    $(this).siblings("input").focus();
});

$(function() {
    $("#datepicker4").datepicker({
        autoclose: true,
        todayHighlight: true,
        forceParse: false,
        startDate: $("#datepicker5").val() == "" ?
            new Date() :
            new Date($("#datepicker5").val()),

        // endDate: '+30d',
    });
    // $("#datepicker4").datepicker("update", new Date());
}).on("change", function(selected) {
    console.log($(selected.target).val());
    $("#departDate4").siblings(".date-icon").fadeOut();
    console.log($("#departDate4").siblings(".cross"));
    $("#departDate4").siblings(".cross").fadeIn();
    $("#datepicker4").datepicker("minDate", $(selected.target).val());
    $("#departError1").css({ visibility: "hidden" });
});

$("#total_pass").click(function() {
    $(".nice-select").removeClass("open");
});

function airplaneValidate() {
    let leaveFrom = $("#leaveFrom").val().trim();
    let goingto = $("#goingTo").val().trim();
    let wayData = $("#wayData").siblings(".nice-select").find(".current").text();
    let passenger = $("#total_pas").text().trim();
    let class1 = $("#classData").siblings(".nice-select").find(".current").text();

    let datepicker = $("#datepicker5").val();
    let datepicker1 = $("#datepicker4").val();
    let adult = $("#adultpas .number-input").val();
    let children = $("#childpas .number-input").val();
    let infant = $("#infantpas .number-input").val();
    if (leaveFrom == "") {
        $("#leavefromErr").css({ visibility: "visible" });
        return false;
    }
    if (goingto == "") {
        $("#goingToErr").css({ visibility: "visible" });
        return false;
    }
    if (leaveFrom == goingto) {
        $("#leavefromErr").css({ visibility: "visible" });
        $("#leavefromErr").html("Origin and destination can't be same");
        return false;
    }
    if (datepicker == "") {
        $("#departError").css({ visibility: "visible" });
        return false;
    }

    if ($("#todate").is(":visible")) {
        if (datepicker1 == "") {
            $("#todateErr").css({ visibility: "visible" });
            return false;
        }
    }

    return true;
}

function refirectInner() {
    if (!airplaneValidate()) {
        return true;
    }
    let leaveFrom = $("#leaveFrom").val().trim();
    let goingto = $("#goingTo").val().trim();
    let wayData = $("#wayData").siblings(".nice-select").find(".current").text();
    let passenger = $("#total_pas").text().trim();
    let class1 = $("#classData").siblings(".nice-select").find(".current").text();

    let datepicker = $("#datepicker5").val();
    let datepicker1 = $("#datepicker4").val();
    let adult = $("#adultpas .number-input").val();
    let children = $("#childpas .number-input").val();
    let infant = $("#infantpas .number-input").val();
    location.href =
        "/travelv2/travel3.html?from=" +
        leaveFrom +
        "&city1=" +
        city1 +
        "&to=" +
        goingto +
        "&city2=" +
        city2 +
        "&way=" +
        wayData +
        "&pass=" +
        passenger +
        "&class=" +
        class1 +
        "&date=" +
        datepicker +
        "&date2=" +
        datepicker1 +
        "&adult=" +
        adult +
        "&children=" +
        children +
        "&infant=" +
        infant;
}

$("select").niceSelect();
$(function() {
    $("#adultpas").htmlNumberSpinner();
});
$(function() {
    $("#childpas").htmlNumberSpinner();
});

$(function() {
    $("#infantpas").htmlNumberSpinner();
});

// ********TO STOP DROPDOWN FROM CLOSING ON INCREMENT OR DECREMENT********
$(document).on("click", "#propogateStop", function(e) {
    e.stopPropagation();
});

$(window).scroll(function() {
    if ($(window).scrollTop() > 0) {
        // alert("ns")

        $(".header-container").addClass("position-fixed-container");
    } else {
        $(".header-container").removeClass("position-fixed-container");
    }
});