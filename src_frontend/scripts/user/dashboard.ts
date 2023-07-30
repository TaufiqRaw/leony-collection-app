import {Chart, registerables} from 'chart.js';
Chart.register(...registerables);

const ctx = document.getElementById('myChart') as HTMLCanvasElement;
console.log(ctx)

const myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

interface ContributionData {
  date: string;
  count: number;
}

// Sample data (replace this with your actual data)
const contributionsData = [
  { date: '2023-07-01', count: 1 },
  { date: '2023-07-05', count: 3 },
  // Add more data as needed
];

// Function to generate the contribution calendar
function generateCalendar(data : ContributionData[]) {
  const calendarElement = document.getElementById('calendar')!;

  const calendarGrid = document.createElement('div');
  calendarGrid.className = 'grid grid-cols-7 gap-1';

  //- grid-template-columns: repeat(2, minmax(0, 1fr));

  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 30); // Display one year's worth of contributions

  for (let i = 0; i < 31; i++) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    const contributionData = data.find(item => item.date === dateStr);

    const contributionCount = contributionData ? contributionData.count : 0;

    const cell = document.createElement('div');
    cell.className = `h-8 w-8 
      flex items-center justify-center text-xs font-medium
      ${contributionCount > 0 
        ? contributionCount > 3 
          ? 'bg-green-600 text-white' 
          : contributionCount > 2 ?
            'bg-green-400 text-white' :
            'bg-green-200 text-gray-500'  
        : 'bg-gray-200 text-gray-500'}`;

    cell.innerHTML = currentDate.getDate() + "";
    cell.title = `${dateStr}: ${contributionCount} Piece`;

    calendarGrid.appendChild(cell);

    currentDate.setDate(currentDate.getDate() + 1);
  }

  calendarElement.appendChild(calendarGrid);
}

// Call the function with the sample data
generateCalendar(contributionsData);

//input guard
const jobResult = document.getElementById('jobResult') as HTMLInputElement;
jobResult.addEventListener('keyup', (e) => {
  let element = e.target as HTMLInputElement 
  if(!element.value)
    element.value = String(0);
  if(parseInt(element.value) > 100)
    element.value = String(100);
});
jobResult.addEventListener('keydown', (e)=>{
  let element = e.target as HTMLInputElement 
  if(!(/^Digit[0-9]*$/.test(e.code)) && !(/^Numpad[0-9]*$/.test(e.code)) && !(/^Backspace$/.test(e.code)))
    return e.preventDefault()
  if(element.value == String(0)){
    element.value = e.key
    e.preventDefault();
  }
})