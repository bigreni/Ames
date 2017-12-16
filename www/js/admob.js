    function onLoad() {
        if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
            document.addEventListener('deviceready', checkFirstUse, false);
        } else {
            checkFirstUse();
        }
    }

  var admobid = {};
  if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos
    admobid = {
      banner: 'ca-app-pub-1683858134373419/7790106682', // or DFP format "/6253334/dfp_example_ad"
      interstitial: 'ca-app-pub-9249695405712287/5341165715'
    };
  } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
    admobid = {
      banner: 'ca-app-pub-1683858134373419/7790106682', // or DFP format "/6253334/dfp_example_ad"
      interstitial: 'ca-app-pub-9249695405712287/9110634735'
    };
  }

    function initApp() {
        if (!AdMob) { alert('admob plugin not ready'); return; }
        initAd();
        //display interstitial at startup
        loadInterstitial();
    }
    function initAd() {
        var defaultOptions = {
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            bgColor: 'black', // color name, or '#RRGGBB'
            isTesting: false // set to true, to receiving test ad for testing purpose
        };
        AdMob.setOptions(defaultOptions);
        registerAdEvents();
    }
    // optional, in case respond to events or handle error
    function registerAdEvents() {
        // new events, with variable to differentiate: adNetwork, adType, adEvent
        document.addEventListener('onAdFailLoad', function (data) {
            document.getElementById('screen').style.display = 'none';     
        });
        document.addEventListener('onAdLoaded', function (data) { });
        document.addEventListener('onAdPresent', function (data) { });
        document.addEventListener('onAdLeaveApp', function (data) { });
        document.addEventListener('onAdDismiss', function (data) { 
            document.getElementById('screen').style.display = 'none';     
        });
    }

    function createSelectedBanner() {
          AdMob.createBanner({adId:admobid.banner});
    }

    function loadInterstitial() {
        AdMob.prepareInterstitial({ adId: admobid.interstitial, isTesting: true, autoShow: true });
    }

   function checkFirstUse()
    {
        $('#simplemenu').sidr();
        $("span").remove();
        $(".dropList").select2();

        initApp();
        askRating();
        //document.getElementById('screen').style.display = 'none';     
    }

function askRating()
{
  AppRate.preferences = {
  openStoreInApp: true,
  useLanguage:  'en',
  usesUntilPrompt: 10,
  promptAgainForEachNewVersion: true,
  storeAppURL: {
                ios: '1296111737',
                android: 'market://details?id=com.ames.free'
               }
};
 
AppRate.promptForRating(false);
}


function loadDirections() {
    $('.js-next-bus-results').html('').hide(); // reset output container's html
    document.getElementById('btnSave').style.visibility = "hidden";
    $("#routeStopSelect").attr("disabled", "");
    $("#routeStopSelect").val('0');
    $("#message").text('');
    $.ajax(
          {
              type: "GET",
              url: "http://webservices.nextbus.com/service/publicJSONFeed",
              data: "command=routeConfig&a=cyride&r=" + $("#routeSelect").val(),
              contentType: "application/json;	charset=utf-8",
              dataType: "json",
              success: function (msg) {
                  if (msg == null || msg.length == 0) {
                      return;
                  }

                  var list = $("#routeDirectionSelect");
                  $(list).empty();
                  $(list).append($("<option disabled/>").val("0").text("- Select Direction -"));
                  var numDirections = msg['route'].direction;
                  if (numDirections.length == null) {
                      $(list).append($("<option />").val(numDirections.name).text(numDirections.name));
                  }
                  else {
                      $.each(numDirections, function (index, item) {
                          $(list).append($("<option />").val(item.name).text(item.name));
                      });
                  }
                  $(list).removeAttr('disabled');
                  $(list).val('0');
              },
              error: function () {
              }
          }
        );
        $("span").remove();
        $(".dropList").select2();
    }


function loadStops() {
    $('.js-next-bus-results').html('').hide(); // reset output container's html
    document.getElementById('btnSave').style.visibility = "hidden";
    $("#message").text('');
    $.ajax(
          {
              type: "GET",
              url: "http://webservices.nextbus.com/service/publicJSONFeed",
              data: "command=routeConfig&a=cyride&r=" + $("#routeSelect").val(),
              contentType: "application/json;	charset=utf-8",
              dataType: "json",
              success: function (msg) {
                  if (msg == null || msg.length == 0) {
                      return;
                  }
                  var stopList = $("#routeStopSelect");
                  $(stopList).empty();
                  $(stopList).append($("<option disabled/>").val("0").text("- Select Stop -"));
                  var numStops = msg['route'].stop;
                  var numDirections = msg['route'].direction;
                  var arrStops = [];
                      $.each(numStops, function (index, item) {
                          $(stopList).append($("<option />").val(item.stopId).text(item.title));
                      });
                  if (numDirections.length != null) {
                      $.each(numDirections, function (index, item) {
                          if ($("#routeDirectionSelect").val() == item.name) {
                              for (var x in item.stop) {
                                  arrStops.push(item.stop[x].tag);
                              }
                              alert(arrStops.length);
                              $("#routeStopSelect option").each(function () {
                                  if (arrStops.indexOf(this.value) == -1) {
                                      //alert(item.stop.indexOf(this.value));
                                      $("#routeStopSelect option[value=" + this.value + "]").remove();
                                  }
                              });
                          }
                      });
                     }
                  $(stopList).removeAttr('disabled');
                  $(stopList).val('0');

              },
              error: function () {
              }
          }
        );
        $("span").remove();
        $(".dropList").select2();
}

function loadArrivals() {
    var outputContainer = $('.js-next-bus-results');

    $.ajax(
          {
              type: "GET",
              url: "http://webservices.nextbus.com/service/publicJSONFeed",
              data: "command=predictions&a=cyride&r=" + $("#routeSelect").val() + "&s=" + $("#routeStopSelect").val(),
              contentType: "application/json;	charset=utf-8",
              dataType: "json",
              success: function (output) {
                  if (output == null || output.length == 0) {
                      $(outputContainer).html('').hide(); // reset output container's html
                      document.getElementById('btnSave').style.visibility = "hidden";
                  }

                  else {
                      var results = "";
                      var direction = output['predictions'].direction;
                      results = results.concat("<p><strong>" + $("#routeSelect option:selected").text() + " - " + $("#routeStopSelect option:selected").text() + "</strong></p>");
                      if (direction == null) {
                          results = results.concat("<p> No upcoming arrivals.</p>");
                      }
                      else if (output['predictions'].direction.prediction.length > 1) {
                          $.each(output['predictions'].direction.prediction, function (index, item) {
                              results = results.concat("<p>" + item.minutes + " minutes </p>");
                          });
                      }
                      else {
                          results = results.concat("<p>" + output['predictions'].direction.prediction.minutes + " minutes </p>");
                      }
                      if (results == "") {
                          results = results.concat("<p> No upcoming arrivals.</p>");
                      }
                      $(outputContainer).html(results).show();
                      document.getElementById('btnSave').style.visibility = "visible";
                  }
              }
          });
}