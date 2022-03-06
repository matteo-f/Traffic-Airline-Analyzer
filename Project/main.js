
function getValue(element){
    var btnValue = element.innerText;    
    console.log(btnValue)
    d3.queue()
        .defer(d3.json, "world.topojson")
        .defer(d3.csv, "./dataset/airports2.csv")
        .defer(d3.csv, "./dataset/routes2.csv")
        .defer(d3.csv, "./dataset/airlines.csv")
        .defer(d3.csv, "./dataset/worldCountry.csv")
        .defer(d3.json, "./dataset/pca_positions.json")
        .defer(d3.csv, "./dataset/country_centroids.csv")
        .await(ready);

        function ready(error, data, airports, routes2, airlines,worldCountry,pca_data,c_centroids){
            //getArrayPCA(airports,airlines,routes2)
            var countries = topojson.feature(data,data.objects.countries).features
            //compute centroids 
            //console.log(countries)
            //console.log(countries[1].geometry)
            //console.log(cent)
            //centroids_country = {}
            /*
            var centroids_country = countries.map(function (country){
                c_name = country.properties.name
                centroid =  path.centroid(country);
                return {'country':c_name, 'centroid':centroid}
            });*/
            //console.log(c_centroids)

            

            //console.log(centroids_country)

            //console.log(centroids)
            //console.log(countries)
            //AIRLINE ROUTES CONNECTION --------------------
            links = drawFlights(routes2)
            //console.log(links)
            svg.selectAll("#init_map").remove()
            // MAP BUILDING ---------------
            svg.selectAll(".country")
                .data(countries)
                .enter()
                .append("path")
                .attr("class", "country")
                .attr("d",path) //coordinates of country borders
                .style("stroke", "#fff")
                .style("stroke-width", "0.2")
                .attr("fill", "#b8b8b8")
                .on("mouseover", function(d){
                    d3.select(this).classed("selected", true);
                        //qui qualcosa si può inserire per quando si cliccal una nazione
                        // si potrebbe zoommare sulla nazione e vedere gli aereoporti ed i suoi collegamenti
                        // le classi si gestiscono poi nel css per dare effetti
        
                })
                .on("mouseout", function(d){
                    d3.select(this).classed("selected", false);
            
                })
               
            if(btnValue=="Airport"){
                svg.selectAll("#point-airports").remove()
                svg.selectAll("#Country_c").remove()
                svg.selectAll("#centroids").remove()
                
                //AIRPORTS POINTS --------------------------
                svg.selectAll(".world-airports")
                    .data(airports)
                    .enter()
                    .append("g")
                    .attr("id","point-airports")
                    .append("circle")
                    .attr("r", 0.2)
                    .attr("cx", function(d){
                        var coords = projection([d.Longitude, d.Latitude])
                        return coords[0] //longitude;
                    })
                    .attr("cy", function(d){
                        var coords = projection([d.Longitude, d.Latitude])
                        return coords[1] //latitude;
                    })
                    .on("mouseover", mouseover)
                    .on("mousemove", mousemove)
                    .on("mouseleave", mouseleave)
                    .on("click", function(d){
                        
                        tot_d_a = f_click(d,links,airports)
                        // console.log(tot_d_a)
                        if(tot_d_a[0]>0){
                        //barplot design
                           barPlot(routes2, airlines,d.Airport_ID)
                           svg_legend.selectAll("*").remove()
                           svg_scatter.selectAll("*").remove()
                           heatMap_country(data,links,d.Airport_ID,airports,worldCountry)
                           scatterPlot(pca_data, d.Airport_ID, routes2, airports)
                           
                           document.getElementById("check1").checked = true;
                           document.getElementById("check2").checked = false;
                           //svg_legend.selectAll("*").remove()
                           //heatMap_country(data,links,d.Airport_ID, airports,worldCountry)
                           let allCheckBox = document.querySelectorAll('.mCheckbox')
                            allCheckBox.forEach((checkbox) => { 
                                checkbox.addEventListener('change', (event) => {
                                    if (event.target.checked) {
                                        //console.log(event.target.value)
                                        
                                        if(event.target.value == "continents"){
                                            svg_heat.selectAll("*").remove()
                                            svg_legend.selectAll("*").remove()
                                            //svg_heat.selectAll("#heatMap-continents").remove()
                                            heatMap(data,links,d.Airport_ID, airports,worldCountry)
                                        }
                                        else if(event.target.value == "countries"){
                                            svg_heat.selectAll("*").remove()
                                            svg_legend.selectAll("*").remove()
                                            heatMap_country(data,links,d.Airport_ID,airports,worldCountry)
                                        }
                                    }
                                })
                            })
                           
                        }
                        else{
                            document.getElementById("check1").checked = true;
                            document.getElementById("check2").checked = false;
                            svg_legend.selectAll("*").remove()
                            svg_scatter.selectAll("*").remove()
                            missing()
                        }
                    })
            }
            //DA SISTEMARE
            else if(btnValue=="Country"){
                
                svg.selectAll("#point-airports").remove()
                svg.selectAll("#flights_d").remove()
                svg.selectAll("#flights_color").remove()
                svg.selectAll("#Country_c").remove()
                svg_air_inf.selectAll("*").remove()
                svg_bar.selectAll("*").remove()
                svg_heat.selectAll("*").remove()
                svg_legend.selectAll("*").remove()
                svg_scatter.selectAll("*").remove()
                svg.selectAll("#centroids").remove()

                document.getElementById("check1").checked = true;
                document.getElementById("check2").checked = false;

                svg.selectAll(".country_c")
                .data(countries)
                .enter()
                .append("g")
                .attr("id","Country_c")
                .append("path")
                .attr("class", "country")
                .attr("d",path) //coordinates of country borders
                .style("stroke", "#fff")
                .style("stroke-width", "0.2")
                .attr("fill", "#b8b8b8")
                .on("mouseover", function(d){
                    d3.select(this).classed("selected", true);
                        //qui qualcosa si può inserire per quando si cliccal una nazione
                        // si potrebbe zoommare sulla nazione e vedere gli aereoporti ed i suoi collegamenti
                        // le classi si gestiscono poi nel css per dare effetti
                        
                })
                .on("mouseout", function(d){
                    d3.select(this).classed("selected", false);
                    
                })
                
                svg.selectAll(".world-country_points")
                .data(c_centroids)
                .enter()
                .append("g")
                .attr("id","centroids")
                .append("circle")
                .attr("r", 0.5)
                .attr("cx", function (d){ 
                    //console.log(d)
                    var coords = projection([d.longitude, d.latitude])
                    /*
                    x = 0
                    if(d.country == 'United States'){
                        x = d.centroid[0] +30
                    }
                    else if(d.country == 'Canada'){
                        x = d.centroid[0] - 30
                    }
                    else if(d.country == 'Norway'){
                        x = d.centroid[0] - 12
                    }
                    else if(d.country == 'Vietnam'){
                        x = d.centroid[0] + 3.5
                    }
                    else if(d.country == 'Laos'){
                        x = d.centroid[0] - 2
                    }
                    else if(d.country == 'Malaysia'){
                        x = d.centroid[0] - 13
                    }
                    else if(d.country == 'Indonesia'){
                        x = d.centroid[0] - 6
                    }
                    else if(d.country == 'New Zealand'){
                        x = d.centroid[0] + 2
                    }
                    else if(d.country == 'Chile'){
                        x = d.centroid[0] - 2
                    }
                    else if(d.country == 'Denmark'){
                        x = d.centroid[0] - 1.5
                    }
                    else if(d.country == 'United Kingdom'){
                        x = d.centroid[0] + 1.5
                    }
                    else if(d.country == 'Western Sahara'){
                        x = d.centroid[0] - 0.5
                    }
                    else{
                        x = d.centroid[0]
                    }
                    console.log(x) */
                    return coords[0]; })
                .attr("cy", function (d){ 
                    /*
                    y = 0
                    if(d.country == 'United States'){
                        y = d.centroid[1] +30
                    }
                    else if(d.country == 'Canada'){
                        y = d.centroid[1] + 30
                    }
                    else if(d.country == 'Norway'){
                        y = d.centroid[1] + 55
                    }
                    else if(d.country == 'Japan'){
                        y = d.centroid[1] + 4
                    }
                    else if(d.country == 'Croatia'){
                        y = d.centroid[1] - 1.5
                    }
                    else if(d.country == 'Vietnam'){
                        y = d.centroid[1] + 7
                    }
                    else if(d.country == 'Laos'){
                        y = d.centroid[1] - 2
                    }
                    else if(d.country == 'Indonesia'){
                        y = d.centroid[1] - 2
                    }
                    else if(d.country == 'Cuba'){
                        y = d.centroid[1] - 0.5
                    }
                    else if(d.country == 'Panama'){
                        y = d.centroid[1] - 0.5
                    }
                    else{
                        y = d.centroid[1]
                    }
                    console.log(y) */
                    var coords = projection([d.longitude, d.latitude])
                    return coords[1]; })
                    
                .on('mouseover', mouseover)
                .on('mousemove', function(d){
                    Tooltip.html("<p> Country: " + d.country + " </p>")
                        .style("left", (d3.event.pageX+2) + "px")		
                        .style("top", (d3.event.pageY-20) + "px");
                })
                .on('mouseleave', mouseleave)
                .on("click", function(d){
                    console.log(d.country)
                    c_click(d,links,airports, c_centroids)
                })

                
            }
            else{ console.log("sono vuoto")}

    
    }  

}
