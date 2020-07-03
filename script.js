var cityArr=["Toronto", "Ottawa"];
$(document).ready(function()
{
    $("#currentDay").text("Today's Date: "+moment().format("Do MMM, YYYY"));   
    
        // Geo-location
        var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    
    function success(pos) {
        var crd = pos.coords;
    
        // console.log(pos);
        // console.log('Your current position is:');
        // console.log(`Latitude : ${crd.latitude}`);
        // console.log(`Longitude: ${crd.longitude}`);
        // console.log(`More or less ${crd.accuracy} meters.`);
    }
    
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    
    navigator.geolocation.getCurrentPosition(success, error, options);
    
    init();
    
    // When City Search button is clicked
    $("#btn-city").on("click", function()
    {
        // Clear HTML of previous values
        $(".city").empty();
        $(".temp").empty();
        $(".humidity").empty();
        $(".wind").empty();  
        $(".wOutlook").empty();  
        
        varCity="";

        var varCity=$("#city-name").val().trim();    
        if(varCity) // perform the following steps only if a City value is provided
        {   
            var varUnique=true;
            for(var ctr=0;ctr<cityArr.length;ctr++)
            {
                if(varCity===cityArr[ctr])
                    varUnique=false;
            }  
            if(varUnique)       
            {
                cityArr.push(varCity);
                console.log(varCity+"line 22 "+cityArr);
                localStorage.setItem("cityList", JSON.stringify(cityArr)); 
                init();
            }
            cityCurrent(varCity);  // Function displays the current conditions for the selected city            
        } // if
    }); // btn-click    
    $(".btn-city-row").on("click", function()
    {
        var tempCity=$(this).text();        
        cityCurrent(tempCity);
    });
});

function cityCurrent(prevCity)
{
    var APIKey = "06b37d6fec0ce462c64fc48a6475082d";
    varCity=prevCity;
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+varCity+"&appid=" + APIKey;

    // Clear HTML of previous values
    $(".city").empty();
    $(".temp").empty();
    $(".humidity").empty();
    $(".wind").empty();  
    $(".wOutlook").empty();  
        
    // Here is the AJAX call
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) 
    {      
        var varCity=$("<h2>").text("City: "+response.name+", "+response.sys.country);
        var varWind=$("<h2>").text("Wind Speed: "+response.wind.speed+" Knots");
        var varHumidity=$("<h2>").text("Humidity: "+response.main.humidity+" gms/cubic meter");
        //   var varUVee=$("<h2>").text("UV Index: "+response.main.temp);
        var varKelvin=parseInt(response.main.temp);
        var varCgrade=(varKelvin -273.15).toFixed(2);
        var varTempC=$("<h2>").text("Temperature (c): "+varCgrade);
        var varOutlook=$("<h2>").text("Weather Conditions: "+response.weather[0].description);

        // This code transfers content to HTML
        $(".city").append(varCity);
        $(".temp").append(varTempC);
        $(".humidity").append(varHumidity);
        $(".wind").append(varWind);  
        $(".wOutlook").append(varOutlook);    
        // $(".uVee").append(varUVee);            

        varCity="";
    }); // ajax
} // cityCurrent function

function init() 
{
    // Get stored appointments from localStorage     
    var storedCities = JSON.parse(localStorage.getItem("cityList"));
    if (storedCities !== null) 
    {
        cityArr = storedCities;
    }         
    else // entering some default values if there is nothing in localStorage.
    {
        localStorage.setItem("cityList", JSON.stringify(cityArr));      
    }   
    showHistory(); 
}
//----------------
function showHistory() // Function shows city history from the DOM
{            
    // Clear cityList element
    var myCityList=$(".city-list");       
    myCityList.empty();         
    for(var ctr=cityArr.length-1;ctr>=0;ctr--)
    {         
        // var varRow=$("<div class='cityRow'>");     
        var varRow=$("<button class='col-lg-12 btn-success btn-city-row'>").text(cityArr[ctr]);  
        varRow.attr("id","city-"+cityArr[ctr]);
        myCityList.append(varRow);
    }    
}