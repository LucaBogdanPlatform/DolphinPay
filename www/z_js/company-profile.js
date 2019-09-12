/* Dashboard chart combo line and bar */
var ctx = document.getElementById("linechart").getContext('2d');

var company_name = getUrlVars()["company"];

//HERE CALL THE WEB SERVICE FOR THE CHART DATA, POSITION DATA AND EVENT DATA

var chartWrapper = {"labels":["Free","Occupied"],"data":[20, 30]};

var slicesColors = ["#34A300","#A30000"];

var position = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2789.893803961078!2d13.0641811154345!3d45."+
"63286963019402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477b92ed1beff245%3A0xde971aafed44e741!2sChio"+
"sco+Delfino!5e0!3m2!1sit!2sit!4v1565623709037!5m2!1sit!2sit";

var companyInfo = JSON.parse(window.localStorage.getItem("currentCompany"));

setChart(chartWrapper);
setPosition(position);
setCartCounter();
setWaitingTime(new Date(2018, 11, 24, 10, 50, 30));

function setChart(chartWrapper){
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: { labels: chartWrapper["labels"],
                datasets: [{
                backgroundColor: slicesColors,
                label: 'Prenotation',data: chartWrapper["data"],pointBackgroundColor: "black",
                pointHoverBackgroundColor: "#F07260",pointHoverBorderColor: "rgba(220,220,220,1)"}]
        },
        options: {responsive:true,maintainAspectRatio: true,showAllTooltips: true,
                    tooltips: {titleFontSize: 20,bodyFontSize: 20,enabled:true,},
                    legend: {display: false,},
                    scales: {
                        yAxes: [{
                        ticks: {fontSize: 0},
                        gridLines:{color:"rgba(255,255,255,0.05)",zeroLineColor:"rgba(255,255,255,0.2)"}
                        }],
                        xAxes: [{
                        ticks: {fontSize: 0},
                        gridLines:{color:"rgba(255,255,255,0.05)",zeroLineColor:"rgba(255,255,255,0.2)"}}]
                    }

        },
        plugins: [{
                 beforeDraw: function(chart) {
                    var width = chart.chart.width, height = chart.chart.height, ctx = chart.chart.ctx;
                    ctx.restore();
                    var fontSize = (height / 114).toFixed(2);
                    ctx.font = "bold " + fontSize + "em sans-serif";
                    ctx.textBaseline = "middle";
                    var text = chartWrapper.data[0]/(chartWrapper.data[0]+chartWrapper.data[1])*100 + '%',
                        textX = Math.round((width - ctx.measureText(text).width) / 2) + 5,
                        textY = (height / 2) - 3;
                    ctx.fillStyle = "#34A300";
                    ctx.fillText(text, textX, textY);
                    ctx.save();
                  }
            }]
    });
}

function setPosition(position){document.getElementById("company-position").src = position;}

function setWaitingTime(time){
    var minutes = time.getMinutes();
    var wrpMinutes = document.getElementById('waiting-time-min');
    var hours = time.getHours();
    var wrpHours = document.getElementById('waiting-time-hour');
    if(hours === 0 && minutes < 15){
        wrpMinutes.style.color = "#34A300";
        wrpHours.style.color = "#34A300";
    }
    else if(hours === 0 && minutes < 40){
        wrpMinutes.style.color = "#E09600";
        wrpHours.style.color = "#E09600";
    }
    else {wrpMinutes.style.color = "#A30000";wrpHours.style.color = "#A30000";}
    wrpHours.innerText = (hours / 10 >= 1) ? hours + " : " : "0"+hours + " : ";
    wrpMinutes.innerText = (minutes / 10 >= 1) ? minutes+"" : minutes+"0";
}

function setCartCounter(){document.getElementById("cart-counter").textContent="10";}

function goToCategoryPage(){
  PGMultiView.loadView("category.html", "", function(){}, function(){});
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}
