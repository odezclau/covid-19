let regions = document.querySelector('#regions');
regions.addEventListener('change', function () {
  fetchCOVIDdata(this.value);
  document.getElementById('region').innerHTML = this.options[this.selectedIndex].text;
});
async function fetchCOVIDdata(region) {
  try {
    const response = await fetch(`https://covid-19-info.onrender.com/news/${region}`);
    const newsData = await response.json();

    const response2 = await fetch(`https://covid-19-info.onrender.com/stats/${region}`);
    const statsData = await response2.json();

    // vIsualizar (tutorial parte 3 (min 32))
    const newsContainer = document.querySelector('#news-container');
    newsContainer.innerHTML = '';
    let news = newsData.news;

    chartCreate(statsData.stats.totalConfirmedCases, statsData.stats.newlyConfirmedCases, statsData.stats.totalDeaths, statsData.stats.newDeaths, statsData.stats.totalRecoveredCases, statsData.stats.newlyRecoveredCases);
    if (news.length > 0) {
      for (let i = 0; i < news.length; i++) {
        let topics = news[i].topics;
        let topicShow = '';
        for (let j = 0; j < topics.length; j++) {
          topicShow += `<span class="topic">${topics[j]}</span>`;
        }
        newsContainer.innerHTML += `<div class="news-card">
        <h2><a href="${news[i].webUrl}" target="_blank">${news[i].title}</a></h2>
        <p>${news[i].excerpt}</p>
        <div class="metadata">
          <span class="date-time">${getDate(news[i].publishedDateTime)}</span>
          <span class="publisher"><a href="http://${news[i].provider.domain}">${news[i].provider.name}</a></span>
        </div>
        <div class="tags">
          <br>
          <h5>Topics</h5>
          <div id="topics">
            ${topicShow}
          </div>
        </div>
      </div>`;
      }
    } else {
      newsContainer.innerHTML = '<p class="error">No News Found!</p>';
    }

    // console.log(newsData);
  } catch (error) {
    console.error(error);
    const newsContainer = document.querySelector('#news-container');
    newsContainer.innerHTML = '<p>An error occurred. Please try again later.</p>';
  }
}



function getDate(timestamp) {
  const date = new Date(timestamp);

  // Formateo de la fecha
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  const formattedDate = date.toLocaleDateString('en-US', options); //probar on otras opciones hehe

  return formattedDate;
}

function chartCreate(totalConfirmed, newConfirmed, totalDeaths, newDeaths, totalRecovered, newRecovered) {
  const chartElement = document.getElementById('myChart');
  // ver si el proyecto ya esta
  const existingChart = Chart.getChart(chartElement);

  // Esto es para eliminar la info 
  if (existingChart) {
    existingChart.destroy();
  }
  console.log(totalConfirmed, newConfirmed, totalDeaths, newDeaths, totalRecovered, newRecovered);
  // Data
  const data = {
    labels: ['Total Confirmed', 'New Confirmed', 'Total Deaths', 'New Deaths', 'Total Recovered', 'Newly Recovered'],
    datasets: [{
      label: 'COVID-19 Data',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      data: [totalConfirmed, newConfirmed, totalDeaths, newDeaths, totalRecovered, newRecovered],
    }]
  };

  // Configurar el chart (tutorial del tom, esta rebueno)
  const config = {
    type: 'bar',
    data: data,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      }
    },
  };

//estaria creado
  const myChart = new Chart(chartElement, config);

}
