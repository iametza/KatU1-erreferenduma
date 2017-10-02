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

    var botoak_guztira = 0;
    var bai_guztira = 0;
    var ez_guztira = 0;
    var zuria_guztira = 0;
    var baliogabeak_guztira = 0;

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

                for (var vegueria in data_values) {

                    data_values[vegueria].botoak_guztira = data_values[vegueria].bai + data_values[vegueria].ez + data_values[vegueria].zuria + data_values[vegueria].baliogabeak;

                    botoak_guztira = botoak_guztira + data_values[vegueria].botoak_guztira;
                    bai_guztira = bai_guztira + data_values[vegueria].bai;
                    ez_guztira = ez_guztira + data_values[vegueria].ez;
                    zuria_guztira = zuria_guztira + data_values[vegueria].zuria;
                    baliogabeak_guztira = baliogabeak_guztira + data_values[vegueria].baliogabeak;

                    data_values[vegueria].bai_ehunekoa = kalkulatuEhunekoa(data_values[vegueria].bai, data_values[vegueria].botoak_guztira, 2);
                    data_values[vegueria].ez_ehunekoa = kalkulatuEhunekoa(data_values[vegueria].ez, data_values[vegueria].botoak_guztira, 2);
                    data_values[vegueria].zuria_ehunekoa = kalkulatuEhunekoa(data_values[vegueria].zuria, data_values[vegueria].botoak_guztira, 2);
                    data_values[vegueria].baliogabeak_ehunekoa = kalkulatuEhunekoa(data_values[vegueria].baliogabeak, data_values[vegueria].botoak_guztira, 2);
                }

                beteGuztiraTaula(data_values);

                beteVegueriakTaula(data_values);

                marraztuVegueriarenGrafikoa(data_values['barcelona']);

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
                        beteTaula(data_values, 'girona');
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
                        beteTaula(data_values, 'alt pirineu i aran');
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
                        beteTaula(data_values, 'terres de l"ebre');
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
                        beteTaula(data_values, 'tarragona');
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
                        beteTaula(data_values, 'barcelona');
                    });

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
                        beteTaula(data_values, "lleida");
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
                        beteTaula(data_values, "central");
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

    function beteTaula(datuak, vegueria) {

        d3.select("#bai .botoak").text(datuak[vegueria].bai.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
        d3.select("#ez .botoak").text(datuak[vegueria].ez.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
        d3.select("#zuria .botoak").text(datuak[vegueria].zuria.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
        d3.select("#baliogabeak .botoak").text(datuak[vegueria].baliogabeak.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));

        d3.select("#bai .ehunekoak").text("%" + datuak[vegueria].bai_ehunekoa);
        d3.select("#ez .ehunekoak").text("%" + datuak[vegueria].ez_ehunekoa);
        d3.select("#zuria .ehunekoak").text("%" + datuak[vegueria].zuria_ehunekoa);
        d3.select("#baliogabeak .ehunekoak").text("%" + datuak[vegueria].baliogabeak_ehunekoa);
    }

    function beteVegueriakTaula(datuak) {

        var katea = "";

        for (var vegueria in datuak) {

            katea = katea +
                "<tr>" +
                    "<td>" + datuak[vegueria].izena + "</td>" +
                    "<td>" + datuak[vegueria].bai.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " (%" + datuak[vegueria].bai_ehunekoa + ")" + "</td>" +
                    "<td>" + datuak[vegueria].ez.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " (%" + datuak[vegueria].ez_ehunekoa + ")" + "</td>" +
                    "<td>" + datuak[vegueria].zuria.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " (%" + datuak[vegueria].zuria_ehunekoa + ")" + "</td>" +
                    "<td>" + datuak[vegueria].baliogabeak.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " (%" + datuak[vegueria].baliogabeak_ehunekoa + ")" + "</td>" +
                "</tr>";
        }

        var tbody = document.querySelector("#vegueriak-taula");

        tbody.innerHTML = tbody.innerHTML + katea;

    }

    function beteGuztiraTaula(datuak) {

        d3.select("#bai_guztira .botoak").text(bai_guztira.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
        d3.select("#ez_guztira .botoak").text(ez_guztira.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
        d3.select("#zuria_guztira .botoak").text(zuria_guztira.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));
        d3.select("#baliogabeak_guztira .botoak").text(baliogabeak_guztira.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."));

        d3.select("#bai_guztira .ehunekoak").text("%" + kalkulatuEhunekoa(bai_guztira, botoak_guztira, 2));
        d3.select("#ez_guztira .ehunekoak").text("%" + kalkulatuEhunekoa(ez_guztira, botoak_guztira, 2));
        d3.select("#zuria_guztira .ehunekoak").text("%" + kalkulatuEhunekoa(zuria_guztira, botoak_guztira, 2));
        d3.select("#baliogabeak_guztira .ehunekoak").text("%" + kalkulatuEhunekoa(baliogabeak_guztira, botoak_guztira, 2));
    }

    function marraztuVegueriarenGrafikoa(datuak) {

        var vegueriaren_grafikoa = c3.generate({
            bindto: "#vegueria-grafikoa",
            size: {
                height: 200,
                width: 400
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
                    ["Zuriak", datuak.zuria],
                    ["Baliogabeak", datuak.baliogabeak]
                ],
                type: "bar",
                colors: {
                    "Bai": aukerak.koloreak.bai,
                    "Ez": aukerak.koloreak.ez,
                    "Zuriak": aukerak.koloreak.zuria,
                    "Baliogabeak": aukerak.koloreak.baliogabeak
                },
                labels: {
                    format: {
                        "Bai": function (v, id, i, j) { return "%" + datuak.bai_ehunekoa; },
                        "Ez": function (v, id, i, j) { return "%" + datuak.ez_ehunekoa; },
                        "Zuriak": function (v, id, i, j) { return "%" + datuak.zuria_ehunekoa; },
                        "Baliogabeak": function (v, id, i, j) { return "%" + datuak.baliogabeak_ehunekoa; }
                    }
                }
            },
            axis: {
                x: {
                    show: false
                },
                y: {
                    max: (function() {
                        return datuak.bai + datuak.ez + datuak.zuria + datuak.baliogabeak;
                    })(),
                    show: false
                }
            },
            tooltip: {
                show: false
            },
            bar: {
                width: {
                    ratio: 0.5
                }
            }
        });
    }
});
