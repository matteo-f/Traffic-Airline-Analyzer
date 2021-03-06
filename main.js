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
        .defer(d3.json, "./dataset/pca_countries_pos.json")
        .await(ready);

        function ready(error, data, airports, routes2, airlines,worldCountry,pca_data,c_centroids,pca_data_c){
            //getArrayPCA(airports,airlines,routes2)
            var countries = topojson.feature(data,data.objects.countries).features
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
                    Tooltip.style("opacity", 1)
        
                })
                .on("mousemove", function(d){
                    Tooltip.html("<p> " + d.properties.name + " </p>")
                                .style("left", (d3.event.pageX+10) + "px")		
                                .style("top", (d3.event.pageY-90) + "px");
                })
                .on("mouseout", function(d){
                    d3.select(this).classed("selected", false);
                    Tooltip.style("opacity", 0)
                })
               
            if(btnValue=="Airport"){
                svg.selectAll("#point-airports").remove()
                svg.selectAll("#Country_c").remove()
                svg.selectAll("#centroids").remove()
                svg.selectAll("#flights_d").remove()
                svg.selectAll("#flights_c").remove()
                svg.selectAll("#flights_color").remove()
                svg_air_inf.selectAll("*").remove()
                svg_bar.selectAll("*").remove()
                svg_heat.selectAll("*").remove()
                svg_legend.selectAll("*").remove()
                svg_scatter.selectAll("*").remove()
                legend_worldmap.selectAll("*").remove()
                legend_pca.selectAll("*").remove()

                document.getElementById("check1").checked = true;
                document.getElementById("check2").checked = false;
                
                //init
                init_maps(data,'c','Heatmap','PCA','Barplot')
                //LEGEND 
                getLegendWorldMap('Airport')
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
                           scatterPlot(pca_data, d.Airport_ID, routes2, airports,data, airlines, worldCountry)
                           getLegendPCA('Airport')
                           
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
                            svg_heat.selectAll("*").remove()
                            svg_legend.selectAll("*").remove()
                            svg_scatter.selectAll("*").remove()
                            legend_pca.selectAll("*").remove()
                            missing(data)
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
                legend_worldmap.selectAll("*").remove()
                legend_pca.selectAll("*").remove()

                document.getElementById("check1").checked = true;
                document.getElementById("check2").checked = false;

                //init
                init_maps(data,'c','Heatmap','PCA','Barplot')
                
                //LEGEND 
                getLegendWorldMap('Country')

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
                        //qui qualcosa si pu?? inserire per quando si cliccal una nazione
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
                    return coords[0]; })
                .attr("cy", function (d){ 
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
                    //console.log(d)
                    tot_dep = c_click(d,links,airports, c_centroids)
                    //console.log(tot_dep)
                    if(tot_dep>0){
                        country_coords = [d.latitude,d.longitude]
                        barplot_country(routes2,airports,airlines,d.country,country_coords)
                        countryHeatMap_country(data,d.country,links,airports,worldCountry)
                        //used to create pca dataset for countries
                        //getArrayPCA_country(c_centroids,links,airports,airlines,routes2)
                        scatterPlot_countries(pca_data_c,d.country,links,airports,data,c_centroids,routes2, airlines, worldCountry)
                        getLegendPCA('Country')

                        document.getElementById("check1").checked = true;
                        document.getElementById("check2").checked = false;
                        let allCheckBox = document.querySelectorAll('.mCheckbox')
                        allCheckBox.forEach((checkbox) => { 
                            checkbox.addEventListener('change', (event) => {
                                if (event.target.checked) {
                                    //console.log(event.target.value)
                                    
                                    if(event.target.value == "continents"){
                                        svg_heat.selectAll("*").remove()
                                        svg_legend.selectAll("*").remove()
                                        //svg_heat.selectAll("#heatMap-continents").remove()
                                        countryHeatMap_continents(data,d.country,links,airports,worldCountry)
                                    }
                                    else if(event.target.value == "countries"){
                                        svg_heat.selectAll("*").remove()
                                        svg_legend.selectAll("*").remove()
                                        countryHeatMap_country(data,d.country,links,airports,worldCountry)
                                    }
                                }
                            })
                        })

                    }
                    else{
                        document.getElementById("check1").checked = true;
                        document.getElementById("check2").checked = false;
                        svg_heat.selectAll("*").remove()
                        svg_legend.selectAll("*").remove()
                        svg_scatter.selectAll("*").remove()
                        legend_pca.selectAll("*").remove()
                        missing_country(data)
                    }
                })

                
            }
            else{ console.log("sono vuoto")}

    
    }  

}
