interface ContributionData {
  date: string;
  amount: number;
}

declare var contributionsData: ContributionData[];

// Function to generate the contribution calendar
function generateCalendar(data : ContributionData[]) {
  const calendarElement = document.getElementById('calendar')!;

  const calendarGrid = document.createElement('div');
  calendarGrid.className = 'grid grid-cols-7 gap-1';

  //- grid-template-columns: repeat(2, minmax(0, 1fr));

  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 30); // Display one year's worth of contributions
  console.log(data)

  for (let i = 0; i < 31; i++) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    const contributionData = data.find(item => item.date.split("T")[0] === dateStr);
    
    const contributionCount = contributionData ? contributionData.amount : 0;
    
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