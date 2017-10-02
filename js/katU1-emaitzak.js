document.addEventListener("DOMContentLoaded", function(e) {

    var width = 400,
        height = 400;

    var projection = d3.geo.mercator()
        .center([1.7,41.7])
        .scale(7000)
        .translate([width / 2, height / 2]);

    var path = d3.geo.path()
        .projection(projection);

    var svg = d3.select("#mapa").append("svg")
        .attr("width", width)
        .attr("height", height);

    var propietateen_izenak = {
        "probintziak": {
            id: "provincia",
            izena: "nom_prov"
        },
        "eskualdeak": {
            id: "comarca",
            izena: "nom_comar"
        },
        "udalerriak": {
            id: "MUNICIPI",
            izena: "NOM_MUNI"
        }
    };

    var vegueriak = {
        'girona': d3.set(["02", "10", "20", "28", "19", "31", "34"]),
        'alt pirineu i aran': d3.set(["26", "05", "25", "04", "15", "39"]),
        'terres de l"ebre': d3.set(["22", "09", "37", "30"]),
        'tarragona': d3.set(["08", "16", "01", "36", "29", "12"]),
        'barcelona': d3.set(["17", "03", "11", "13", "40", "41", "21"]),
        'lleida': d3.set(["33", "23", "27", "18", "38", "32"]),
        'central': d3.set(["14", "35", "07", "06", "24"])
    }

    var probatarako_datuak = {
        baibai: 29774,
        baiez: 2178,
        baizuria: 253,
        ez: 940,
        zuria: 155,
        besteak: 768
    }

    var aukerak = {
        koloreak: {
            bai: "#009EE3",
            ez: "#E6205B",
            zuria: "#918B53",
            baliogabeak: "#DB9A16"
        }
    };

    //marraztuKataluniakoMapa("udalerriak");
    marraztuKataluniakoMapa("eskualdeak");
    //marraztuKataluniakoMapa("vegueriak");
    //marraztuKataluniakoMapa("probintziak");

    function kalkulatuEhunekoa(balioa, guztira, hamartarrak) {

        return (100 * balioa / guztira).toFixed(hamartarrak).replace(/\./g, ',');

    }

    function marraztuKataluniakoMapa(mota) {

        d3.json("datuak/vegueriak.json", function(error, data_values) {

            //console.log(data_values);
            //if (error) return console.error(error);
            console.log(error);

            d3.json("topoJSON/" + mota + ".topo.json", function(error, cat) {

                console.log(cat);

                if (error) return console.error(error);

                beteGuztiraTaula(data_values);

                beteVegueriakTaula(data_values);

                marraztuVegueriarenGrafikoa(data_values['barcelona']);
                
                /*svg.selectAll("." + mota)
                    .data(topojson.feature(cat, cat.objects[mota]).features)
                    .enter().append("path")
                    .attr("class", mota)
                    .attr("id", function(d) {
                        return mota + "_" + d.properties[propietateen_izenak[mota].id];
                    })
                    .attr("d", path)
                    .on("mouseover", function(d) {
                        //console.log(data_values[parseInt(d.properties[propietateen_izenak[mota].id], 10) - 1].Catalan);
                        d3.select("#unitate-izena").text(d.properties[propietateen_izenak[mota].izena]);
                        console.log(d.properties[propietateen_izenak[mota].id]);
                        //drawPieChart(data_values[parseInt(d.properties[propietateen_izenak[mota].id], 10) - 1].Catalan);
                        drawPieChart(probatarako_datuak);
                    });
                */

                svg.append("path")
                    .datum(topojson.merge(cat, cat.objects.eskualdeak.geometries.filter(function(d) { return vegueriak['girona'].has(d.properties.comarca); })))
                    .attr("class", "vegueriak")
                    .attr("id", "girona")
                    .attr("d", path)
                    .on("mouseover", function(d) {
                        d3.selectAll(".vegueriak").attr("class", "vegueriak");
                        d3.select(this).attr("class", "vegueriak aktibo");
                        d3.select("#unitate-izena").text(data_values['girona'].izena);
                        marraztuVegueriarenGrafikoa(data_values['girona']);
                        beteTaula(data_values['girona']);
                    });

                svg.append("path")
                    .datum(topojson.merge(cat, cat.objects.eskualdeak.geometries.filter(function(d) { return vegueriak['alt pirineu i aran'].has(d.properties.comarca); })))
                    .attr("class", "vegueriak")
                    .attr("d", path)
                    .on("mouseover", function(d) {
                        d3.selectAll(".vegueriak").attr("class", "vegueriak");
                        d3.select(this).attr("class", "vegueriak aktibo");
                        console.log(data_values['alt pirineu i aran']);
                        d3.select("#unitate-izena").text(data_values['alt pirineu i aran'].izena);
                        marraztuVegueriarenGrafikoa(data_values['alt pirineu i aran']);
                        beteTaula(data_values['alt pirineu i aran']);
                    });

                svg.append("path")
                    .datum(topojson.merge(cat, cat.objects.eskualdeak.geometries.filter(function(d) { return vegueriak['terres de l"ebre'].has(d.properties.comarca); })))
                    .attr("class", "vegueriak")
                    .attr("d", path)
                    .on("mouseover", function(d) {
                        d3.selectAll(".vegueriak").attr("class", "vegueriak");
                        d3.select(this).attr("class", "vegueriak aktibo");
                        console.log(data_values['terres de l"ebre']);
                        d3.select("#unitate-izena").text(data_values['terres de l"ebre'].izena);
                        marraztuVegueriarenGrafikoa(data_values['terres de l"ebre']);
                        beteTaula(data_values['terres de l"ebre']);
                    });

                svg.append("path")
                    .datum(topojson.merge(cat, cat.objects.eskualdeak.geometries.filter(function(d) { return vegueriak['tarragona'].has(d.properties.comarca); })))
                    .attr("class", "vegueriak")
                    .attr("d", path)
                    .on("mouseover", function(d) {
                        d3.selectAll(".vegueriak").attr("class", "vegueriak");
                        d3.select(this).attr("class", "vegueriak aktibo");
                        console.log(data_values['tarragona']);
                        d3.select("#unitate-izena").text(data_values['tarragona'].izena);
                        marraztuVegueriarenGrafikoa(data_values['tarragona']);
                        beteTaula(data_values['tarragona']);
                    });

                svg.append("path")
                    .datum(topojson.merge(cat, cat.objects.eskualdeak.geometries.filter(function(d) { return vegueriak['barcelona'].has(d.properties.comarca); })))
                    .attr("class", "vegueriak aktibo")
                    .attr("d", path)
                    .on("mouseover", function(d) {
                        d3.selectAll(".vegueriak").attr("class", "vegueriak");
                        d3.select(this).attr("class", "vegueriak aktibo");
                        console.log(data_values['barcelona']);
                        d3.select("#unitate-izena").text(data_values['barcelona'].izena);
                        marraztuVegueriarenGrafikoa(data_values['barcelona']);
                        beteTaula(data_values['barcelona']);
                    });

                drawPieChart(data_values['barcelona']);

                svg.append("path")
                    .datum(topojson.merge(cat, cat.objects.eskualdeak.geometries.filter(function(d) { return vegueriak['lleida'].has(d.properties.comarca); })))
                    .attr("class", "vegueriak")
                    .attr("d", path)
                    .on("mouseover", function(d) {
                        d3.selectAll(".vegueriak").attr("class", "vegueriak");
                        d3.select(this).attr("class", "vegueriak aktibo");
                        console.log(data_values['lleida']);
                        d3.select("#unitate-izena").text(data_values['lleida'].izena);
                        marraztuVegueriarenGrafikoa(data_values['lleida']);
                        beteTaula(data_values['lleida']);
                    });

                svg.append("path")
                    .datum(topojson.merge(cat, cat.objects.eskualdeak.geometries.filter(function(d) { return vegueriak['central'].has(d.properties.comarca); })))
                    .attr("class", "vegueriak")
                    .attr("d", path)
                    .on("mouseover", function(d) {
                        d3.selectAll(".vegueriak").attr("class", "vegueriak");
                        d3.select(this).attr("class", "vegueriak aktibo");
                        console.log(data_values['central']);
                        d3.select("#unitate-izena").text(data_values['central'].izena);
                        marraztuVegueriarenGrafikoa(data_values['central']);
                        beteTaula(data_values['central']);
                    });

                /*
                // Unitateen arteko mugak (a !== b)
                svg.append("path")
                    .datum(topojson.mesh(cat, cat.objects[mota], function(a, b) { return a !== b; }))
                    .attr("d", path)
                    .attr("class", mota + "-mugak");
                */
                // Kanpo-mugak (a === b)
                svg.append("path")
                    .datum(topojson.mesh(cat, cat.objects[mota], function(a, b) { return a === b; }))
                    .attr("d", path)
                    .attr("class", "kanpo-mugak");
            });
        });
    }

    /**
    * Function that could be used to round a number to a given decimal points. Returns the answer
    * Arguments :  number - The number that must be rounded
    *				decimal_points - The number of decimal points that should appear in the result
    */
   function roundNumber(number,decimal_points) {
       if(!decimal_points) return Math.round(number);
       if(number == 0) {
           var decimals = "";
           for(var i=0;i<decimal_points;i++) decimals += "0";
           return "0."+decimals;
       }

       var exponent = Math.pow(10,decimal_points);
       var num = Math.round((number * exponent)).toString();

       return num.slice(0,-1*decimal_points) + "." + num.slice(-1*decimal_points)
   }

    function beteTaula(datuak) {

        var botoak_guztira = datuak.bai + datuak.ez + datuak.zuria + datuak.baliogabeak;
        //var botoak_guztira = datuak.baibai + datuak.baiez + datuak.baizuria + datuak.ez + datuak.zuria;

        d3.select("#bai .botoak").text(datuak.bai.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
        d3.select("#ez .botoak").text(datuak.ez.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
        d3.select("#zuria .botoak").text(datuak.zuria.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
        d3.select("#baliogabeak .botoak").text(datuak.baliogabeak.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));

        d3.select("#bai .ehunekoak").text("%" + ((roundNumber(100 * datuak.bai / botoak_guztira, 2) < 1) ? '0' : '') + roundNumber(100 * datuak.bai / botoak_guztira, 2).toString().replace(/\./g, ','));
        d3.select("#ez .ehunekoak").text("%" + ((roundNumber(100 * datuak.ez / botoak_guztira, 2) < 1) ? '0' : '') + roundNumber(100 * datuak.ez / botoak_guztira, 2).toString().replace(/\./g, ','));
        d3.select("#zuria .ehunekoak").text("%" + ((roundNumber(100 * datuak.zuria / botoak_guztira, 2) < 1) ? '0' : '') + roundNumber(100 * datuak.zuria / botoak_guztira, 2).toString().replace(/\./g, ','));
        d3.select("#baliogabeak .ehunekoak").text("%" + ((roundNumber(100 * datuak.baliogabeak / botoak_guztira, 2) < 1) ? '0' : '') + roundNumber(100 * datuak.baliogabeak / botoak_guztira, 2).toString().replace(/\./g, ','));
    }

    function beteVegueriakTaula(datuak) {

        var katea = "";

        for (var vegueria in datuak) {

            var guztira = datuak[vegueria].bai + datuak[vegueria].ez + datuak[vegueria].zuria + datuak[vegueria].baliogabeak;

            katea = katea +
                "<tr>" +
                    "<td>" + datuak[vegueria].izena + "</td>" +
                    "<td>" + datuak[vegueria].bai.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " (%" + kalkulatuEhunekoa(datuak[vegueria].bai, guztira, 2) + ")" + "</td>" +
                    "<td>" + datuak[vegueria].ez.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " (%" + kalkulatuEhunekoa(datuak[vegueria].ez, guztira, 2) + ")" + "</td>" +
                    "<td>" + datuak[vegueria].zuria.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " (%" + kalkulatuEhunekoa(datuak[vegueria].zuria, guztira, 2) + ")" + "</td>" +
                    "<td>" + datuak[vegueria].baliogabeak.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " (%" + kalkulatuEhunekoa(datuak[vegueria].baliogabeak, guztira, 2) + ")" + "</td>" +
                "</tr>";
        }

        var tbody = document.querySelector("#vegueriak-taula");

        tbody.innerHTML = tbody.innerHTML + katea;

    }

    function beteGuztiraTaula(datuak) {

        var botoak_guztira = 0;
        var bai_guztira = 0;
        var ez_guztira = 0;
        var zuria_guztira = 0;
        var baliogabeak_guztira = 0;

        for (var vegueria in datuak) {

            botoak_guztira = botoak_guztira + datuak[vegueria].bai + datuak[vegueria].ez + datuak[vegueria].zuria + datuak[vegueria].baliogabeak;
            bai_guztira = bai_guztira + datuak[vegueria].bai;
            ez_guztira = ez_guztira + datuak[vegueria].ez;
            zuria_guztira = zuria_guztira + datuak[vegueria].zuria;
            baliogabeak_guztira = baliogabeak_guztira + datuak[vegueria].baliogabeak;

        }

        d3.select("#bai_guztira .botoak").text(bai_guztira.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
        d3.select("#ez_guztira .botoak").text(ez_guztira.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
        d3.select("#zuria_guztira .botoak").text(zuria_guztira.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
        d3.select("#baliogabeak_guztira .botoak").text(baliogabeak_guztira.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));

        d3.select("#bai_guztira .ehunekoak").text("%" + ((roundNumber(100 * bai_guztira / botoak_guztira, 2) < 1) ? '0' : '') + roundNumber(100 * bai_guztira / botoak_guztira, 2).toString().replace(/\./g, ','));
        d3.select("#ez_guztira .ehunekoak").text("%" + ((roundNumber(100 * ez_guztira / botoak_guztira, 2) < 1) ? '0' : '') + roundNumber(100 * ez_guztira / botoak_guztira, 2).toString().replace(/\./g, ','));
        d3.select("#zuria_guztira .ehunekoak").text("%" + ((roundNumber(100 * zuria_guztira / botoak_guztira, 2) < 1) ? '0' : '') + roundNumber(100 * zuria_guztira / botoak_guztira, 2).toString().replace(/\./g, ','));
        d3.select("#baliogabeak_guztira .ehunekoak").text("%" + ((roundNumber(100 * baliogabeak_guztira / botoak_guztira, 2) < 1) ? '0' : '') + roundNumber(100 * baliogabeak_guztira / botoak_guztira, 2).toString().replace(/\./g, ','));
    }

    function marraztuVegueriarenGrafikoa(datuak) {

        var vegueriaren_grafikoa = c3.generate({
            bindto: "#vegueria-grafikoa",
            size: {
                height: 200,
                width: 300
            },
            legend: {
                hide: true
            },
            transition: {
                duration: 1000
            },
            data: {
                columns: [
                    ["Bai", datuak.bai],
                    ["Ez", datuak.ez],
                    ["Zuria", datuak.zuria],
                    ["Baliogabeak", datuak.baliogabeak]
                ],
                type: "bar",
                colors: {
                    "Bai": aukerak.koloreak.bai,
                    "Ez": aukerak.koloreak.ez,
                    "Zuria": aukerak.koloreak.zuria,
                    "Baliogabeak": aukerak.koloreak.baliogabeak
                },
                labels: true
            },
            axis: {
                x: {
                    show: false
                },
                y: {
                    max: (function() {
                        var max = datuak.bai;

                        if (datuak.ez > datuak.bai) {
                            max = datuak.ez;
                        }
                        return max;
                    })(),
                    show: false
                }
            },
            tooltip: {
                format: {
                    title: function(d) {
                        return d;
                    }
                }
            },
            bar: {
                width: {
                    ratio: 0.5
                }
            }
        });
    }

    function drawPieChart(datuak) {
        var w = 150;
        var h = 150;
        var r = h/2;
        var color = ["#FF7F02", 	// Bai
                     "#5AC8D5",		// Ez
                     "#D86969",		// Zuria
                     "#95AA62"]; 	// Baliogabeak

        var data = [{"label": "Bai",
                     "value": datuak.bai},
                    {"label":"Ez",
                     "value": datuak.ez},
                    {"label":"Zuria",
                     "value": datuak.zuria},
                    {"label":"Baliogabeak",
                     "value": datuak.baliogabeak}];


        d3.select("#tarta svg").remove();

        var vis = d3.select('#tarta')
                    .append("svg:svg")
                    .data([data])
                    .attr("width", w)
                    .attr("height", h)
                    .append("svg:g")
                    .attr("transform", "translate(" + r + "," + r + ")");

        var pie = d3.layout.pie().value(function(d){return d.value;});

        // declare an arc generator function
        var arc = d3.svg.arc().outerRadius(r);

        // select paths, use arc generator to draw
        var arcs = vis.selectAll("g.slice").data(pie).enter().append("svg:g").attr("class", "slice");
        arcs.append("svg:path")
            .attr("fill", function(d, i){
                return color[i];
            })
            .attr("d", function (d) {
                // log the result of the arc generator to show how cool it is :)
                //console.log(arc(d));
                return arc(d);
            });

        // add the text
        /*arcs.append("svg:text").attr("transform", function(d){
                    d.innerRadius = 0;
                    d.outerRadius = r;
                    return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
                        return data[i].label;
                    });*/
    }
});
