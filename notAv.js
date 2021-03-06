
width2 = w_b/1.4
height2 = h_b/1.4

function missing(data){
        svg_bar.append("rect")
                .attr("id", "info_box")
                .attr("x", 20)
                .attr("y", 120)
                .attr("width",width2)
                .attr("height",120)
                .attr("rx", 8)
                .attr('fill','#3182bd')
                .attr("opacity",0.7)
                .attr('stroke-width',2)
                .attr('stroke','black')
                .style("border-width", "5px")
                .style("border-radius", "5px")
                .style("padding", "5px")

        svg_bar.append("text")
                .style("fill", "#f0f0f0")
                .attr("x",95)
                .attr("y", 170)
                .style("font-size", "35px")
                .text("No flights available")
        svg_bar.append("text")
                .style("fill", "#f0f0f0")
                .attr("x",95)
                .attr("y", 210)
                .style("font-size", "35px")
                .text("for this airport")

        //EMPTY HEATMAP 
        var map_countries = topojson.feature(data,data.objects.countries).features

        svg_heat.selectAll(".nation")
                .data(map_countries)
                .enter()
                .append("path")
                .attr("d",pathHeat)
                .attr("fill","#b8b8b8")

        //EMPTY SCATTER 
        svg_scatter.append("rect")
                .attr("id", "info_box")
                .attr("x", 25)
                .attr("y", 80)
                .attr("width",width_pca)
                .attr("height",120)
                .attr("rx", 8)
                .attr('fill','#3182bd')
                .attr("opacity",0.7)
                .attr('stroke-width',2)
                .attr('stroke','black')
                .style("border-width", "5px")
                .style("border-radius", "5px")
                .style("padding", "5px")
        svg_scatter.append("text")
                .style("fill", "#f0f0f0")
                .attr("x",100)
                .attr("y", 130)
                .style("font-size", "35px")
                .text("No PCA available")
        svg_scatter.append("text")
                .style("fill", "#f0f0f0")
                .attr("x",100)
                .attr("y", 170)
                .style("font-size", "35px")
                .text("for this airport")

}
function missing_country(data){
        svg_bar.append("rect")
                .attr("id", "info_box")
                .attr("x", 20)
                .attr("y", 120)
                .attr("width",width2)
                .attr("height",120)
                .attr("rx", 8)
                .attr('fill','#3182bd')
                .attr("opacity",0.7)
                .attr('stroke-width',2)
                .attr('stroke','black')
                .style("border-width", "5px")
                .style("border-radius", "5px")
                .style("padding", "5px")
        svg_bar.append("text")
                .style("fill", "#f0f0f0")
                .attr("x",95)
                .attr("y", 170)
                .style("font-size", "35px")
                .text("No flights available")
        svg_bar.append("text")
                .style("fill", "#f0f0f0")
                .attr("x",95)
                .attr("y", 210)
                .style("font-size", "35px")
                .text("for this country")

        //EMPTY HEATMAP 
        var map_countries = topojson.feature(data,data.objects.countries).features

        svg_heat.selectAll(".nation")
                .data(map_countries)
                .enter()
                .append("path")
                .attr("d",pathHeat)
                .attr("fill","#b8b8b8")
        //EMPTY SCATTER 
        svg_scatter.append("rect")
                .attr("id", "info_box")
                .attr("x", 25)
                .attr("y", 80)
                .attr("width",width_pca)
                .attr("height",120)
                .attr("rx", 8)
                .attr('fill','#3182bd')
                .attr("opacity",0.7)
                .attr('stroke-width',2)
                .attr('stroke','black')
                .style("border-width", "5px")
                .style("border-radius", "5px")
                .style("padding", "5px")
        svg_scatter.append("text")
                .style("fill", "#f0f0f0")
                .attr("x",100)
                .attr("y", 130)
                .style("font-size", "35px")
                .text("No PCA available")
        svg_scatter.append("text")
                .style("fill", "#f0f0f0")
                .attr("x",100)
                .attr("y", 170)
                .style("font-size", "35px")
                .text("for this country")
}