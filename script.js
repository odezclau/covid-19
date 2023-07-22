let regions = document.querySelector('#regions');
regions.addEventListener('change', function () {
  fetchCOVIDdata(this.value);
  document.getElementById('region').innerHTML = this.options[this.selectedIndex].text;
});
async function fetchCOVIDdata(region) {
  try {
    const response = await fetch(`/news/${region}`);
    const newsData = await response.json();

    const response2 = await fetch(`/stats/${region}`);
    const statsData = await response2.json();

    // Display the news articles
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

  // Options for formatting the date
  const options = { day: 'numeric', month: 'short', year: 'numeric' };

  // Convert the date to the desired format
  const formattedDate = date.toLocaleDateString('en-US', options);

  return formattedDate;
}

function chartCreate(totalConfirmed, newConfirmed, totalDeaths, newDeaths, totalRecovered, newRecovered) {
  // HTML element to render the chart
  const chartElement = document.getElementById('myChart');
  // Check if a chart already exists
  const existingChart = Chart.getChart(chartElement);

  // Destroy the existing chart if it exists
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

  // Chart configuration
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

  // Create the chart
  const myChart = new Chart(chartElement, config);

}