#def isAeris(data)
    #if $Extras.forecast_provider == "aeris"
        $data
    #endif
#end def

#def isWF(data)
    #if $Extras.forecast_provider == "weatherflow"
        $data
    #endif
#end def

function queryForecast(forecast_interval, key, n = 0) {
    var i = n; #for copy and paste issues...
    switch(key) {
        case 'numberOfForecasts':
            $isAeris(return data[(forecast_interval)][0]["response"][0]["periods"].length;)
            $isWF(return data["forecast"][(forecast_interval)].length;)
        case 'imageUrl':
            $isAeris(return get_relative_url() + "/images/" + aeris_icon(data[(forecast_interval)][0]["response"][0]["periods"][n]["icon"]) + ".png";)
            $isWF(return weatherflow_iconpath(data["forecast"][(forecast_interval)][n]["icon"]);)
        case 'conditionText':
            $isAeris(return aeris_coded_weather(data[(forecast_interval)][0]["response"][0]["periods"][n]["weatherPrimaryCoded"], false);)
            $isWF(return data["forecast"][(forecast_interval)][n]["conditions"];)
        case 'timestamp':
            $isAeris(return data[(forecast_interval)][0]["response"][0]["periods"][n]["timestamp"];)
            $isWF(return data["forecast"][(forecast_interval)][n]["day_start_local"];)
        case 'minTemp':
            #if $Extras.forecast_provider == "aeris"
            if (("$Extras.forecast_units" == "ca") || ("$Extras.forecast_units" == "uk2") || ("$Extras.forecast_units" == "si")) {
                return data[(forecast_interval)][0]["response"][0]["periods"][i]["minTempC"];
            }
            else {
                return data[(forecast_interval)][0]["response"][0]["periods"][i]["minTempF"];
            }
            #end if
            $isWF(return data["forecast"][(forecast_interval)][n]["air_temp_low"];)
        case 'maxTemp':
            #if $Extras.forecast_provider == "aeris"
            if (("$Extras.forecast_units" == "ca") || ("$Extras.forecast_units" == "uk2") || ("$Extras.forecast_units" == "si")) {
                return data[(forecast_interval)][0]["response"][0]["periods"][i]["maxTempC"];
            }
            else {
                return data[(forecast_interval)][0]["response"][0]["periods"][i]["maxTempF"];
            }
            #end if
            $isWF(return data["forecast"][(forecast_interval)][n]["air_temp_high"];)
        case 'avgTemp':
            #if $Extras.forecast_provider == "aeris"
            if (("$Extras.forecast_units" == "ca") || ("$Extras.forecast_units" == "uk2") || ("$Extras.forecast_units" == "si")) {
                return data[(forecast_interval)][0]["response"][0]["periods"][i]["avgTempC"];
            }
            else {
                return data[(forecast_interval)][0]["response"][0]["periods"][i]["avgTempF"];
            }
            #end if
            ##TODO: not available for daily weatherflow data, but needed for some calculations later. giving it a try...
            $isWF(if (forecast_interval == "hourly") {return data["forecast"][(forecast_interval)][n]["air_temperature"]} else {return (data[(forecast_interval)][n]["air_temp_low"] + data[(forecast_interval)][n]["air_temp_high"]) / 2;})
        case 'dewPoint':
            #if $Extras.forecast_provider == "aeris"
            if (("$Extras.forecast_units" == "ca") || ("$Extras.forecast_units" == "uk2") || ("$Extras.forecast_units" == "si")) {
                return data[(forecast_interval)][0]["response"][0]["periods"][i]["dewpointC"];
            }
            else {
                return data[(forecast_interval)][0]["response"][0]["periods"][i]["dewpointF"];
            }
            #end if
            return "";
        case 'windSpeed':
            #if $Extras.forecast_provider == "aeris"
            if ("$unit.unit_type.windSpeed" == "knot") {
                return data[(forecast_interval)][0]["response"][0]["periods"][i]["windSpeedKTS"];
            } else if ("$unit.unit_type.windSpeed" == "beaufort") {
                return kts_to_beaufort(data[(forecast_interval)][0]["response"][0]["periods"][i]["windSpeedKTS"]);
            } else if ("$Extras.forecast_units" == "ca") {
                // ca = kph
                return data[(forecast_interval)][0]["response"][0]["periods"][i]["windSpeedKPH"];
            } else if ("$Extras.forecast_units" == "si") {
                // si = meters per second. MPS is KPH / 3.6
                return data[(forecast_interval)][0]["response"][0]["periods"][i]["windSpeedKPH"] / 3.6;
            } else {
                // us and uk2 and default = mph
                return data[(forecast_interval)][0]["response"][0]["periods"][i]["windSpeedMPH"];
            }
            #end if
            $isWF(return data["forecast"][(forecast_interval)][n]["wind_avg"];)
        case 'windGust':
            #if $Extras.forecast_provider == "aeris"
            if ("$unit.unit_type.windSpeed" == "knot") {
                return data[(forecast_interval)][0]["response"][0]["periods"][i]["windGustKTS"];
            } else if ("$unit.unit_type.windSpeed" == "beaufort") {
                return kts_to_beaufort(data[(forecast_interval)][0]["response"][0]["periods"][i]["windGustKTS"]);
            } else if ("$Extras.forecast_units" == "ca") {
                // ca = kph
                return data[(forecast_interval)][0]["response"][0]["periods"][i]["windGustKPH"];
            } else if ("$Extras.forecast_units" == "si") {
                // si = meters per second. MPS is KPH / 3.6

                return data[(forecast_interval)][0]["response"][0]["periods"][i]["windGustKPH"] / 3.6;
            } else {
                // us and uk2 and default = mph
                return data[(forecast_interval)][0]["response"][0]["periods"][i]["windGustMPH"];
            }
            #end if
            $isWF(return data["forecast"][(forecast_interval)][n]["wind_gust"];)
        case "precipProbability":
            #*As per API specification, "pop" is either a number from 0 to
                100 or null. We convert to 0 in the second case.
                *#
            $isAeris(return data[(forecast_interval)][0]["response"][0]["periods"][i]["pop"] || 0;)
            $isWF(return data["forecast"][(forecast_interval)][n]["precip_probability"];)
        case "humidity":
            $isAeris(data[(forecast_interval)][0]["response"][0]["periods"][i]["humidity"];)
            $isWF(if (forecast_interval == "hourly") {return data["forecast"][(forecast_interval)][n]["relative_humidity"]} else {return "";})
        case "precipType":
            $isWF(return data["forecast"][(forecast_interval)][n]["precip_type"]);
            return;
        case "precipImage":
            $isWF(return weatherflow_iconpath(data["forecast"][(forecast_interval)][n]["precip_icon"]));
            return;
    }
}