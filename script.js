var cityArr=["Toronto", "Ottawa"];
$(document).ready(function()
{
    $("#currentDay").text("Today's Date: "+moment().format("Do MMM, YYYY"));   
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
        var APIKey = "06b37d6fec0ce462c64fc48a6475082d";
        varCity="";

        var varCity=$("#city-name").val();    
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
            
            // Here we are building the URL we need to query the database    
            var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+varCity+"&appid=" + APIKey;
        
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
        } // if
    }); // btn-click    
});
$(".btn-city.row").on("click", function()
{
    console.log("inside btn-city-row");
    console.log(this);
});
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