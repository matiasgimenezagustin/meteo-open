/* const URL_API = "https://archive-api.open-meteo.com/v1/archive?latitude=43.14&longitude=-7.77&start_date=2001-01-01&end_date=2023-03-25&daily=precipitation_sum&timezone=Europe%2FBerlin" */


const sumatoriaArray = (array) => {
    let nuevoArray = [];
    let sumatoria = 0;
    for (let i = 0; i < array.length; i++) {
        sumatoria += array[i];
        nuevoArray.push(sumatoria);
    }
    return nuevoArray;
}


let yearDays = []
fetch("https://archive-api.open-meteo.com/v1/archive?latitude=43.14&longitude=-7.77&start_date=2001-01-01&end_date=2001-12-31&daily=precipitation_sum&timezone=Europe%2FBerlin").then(res => res.json()).then(data => yearDays = data.daily.time)

const doNewChart = (chartId, parameter) =>{
    

    const datesToFetch = []
    for(let i = 2015; i <= 2022; i++){
        datesToFetch.push(`https://archive-api.open-meteo.com/v1/archive?latitude=42.69&longitude=-7.77&start_date=${i}-01-01&end_date=${i}-12-31&daily=${parameter}&timezone=Europe%2FBerlin`)
    }
    
    const responses = datesToFetch.map(  (url) =>  fetch(url).then(res => res.json()))
    const dataPerYear = []
   
    Promise.all(responses)
        .then((data) => {
            console.log(data);
            data.forEach(year => {
                dataPerYear.push({year: year.daily.time[0].split("-").shift(), values: sumatoriaArray(year.daily[parameter])})
    
            
            })
            const chartDataYears = dataPerYear.map(year => {
                const color = getRandomColor()
                console.log(color)
                return (
                        {
                            label: 'Precipitación acumulada ' + year.year + ' (mm)',
                            data: year.values,
                            backgroundColor: color,
                            borderColor: color,
                            borderWidth: 1
                        }
                    )
                }
            )
            console.log(chartDataYears)
            setTimeout(() => {createChart(chartId, yearDays, chartDataYears)}, 3000)
            
        })
}
doNewChart("myChart","precipitation_sum")
doNewChart("mySnowChart", "snowfall_sum")
    const getRandomColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r}, ${g}, ${b}, 0.8)`;
      }




const createChart = (chartId, days, dataYears) =>{
    const ctx = document.getElementById(chartId).getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: days,
            datasets: dataYears
            
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'category',
                    labels: ['Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', 'Enero', 'Febrero', 'Marzo']
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

