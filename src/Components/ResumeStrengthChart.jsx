import React, { useMemo, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);
const TECH_COLORS = {
  "react": "#61DAFB",         // React's light blue
  "react.js": "#61DAFB",      // React's light blue
  "node.js": "#68A063",       // Node's green
  "node": "#68A063",          // Node's green
  "javascript": "#F7DF1E",    // JavaScript's yellow
  "next.js": "#000000",       // Next.js black
  "python": "#4B8BBE",        // Python's blue
  "fastAPI": "#009688",       // FastAPI's teal
  "mongoDB": "#47A248",       // MongoDB's green
  "mySQL": "#00758F",         // MySQL's dark blue
  "tailwind CSS": "#38B2AC",  // Tailwind's teal
  "Wordpress": "#007096",     // WordPress blue
  "bootstrap": "#7952B3",     // Bootstrap purple
  "express.js": "#000000",    // Express.js black
  "html": "#E86229",          // HTML orange
  "css": "#32A4D3",           // CSS blue
  "sql": "#005287",           // SQL blue
  "machine learning algorithms": "#FF6B6B",   // example red color
  "deep learning": "#4ECDC4",                 // example teal color
  "data analysis": "#45B7D1",                 // example blue color
  "statistical modeling": "#FFA07A",          // example light salmon
  "cloud computing (aws/azure/gcp)": "#7B68EE", // example medium slate blue
  "aws": "#7B68EE",
  "nlp": "#FFA07A",
};

export default function Charts({ View = false, strengthData = null, techTimeLine = null }) {
  const [useSlimBars, setUseSlimBars] = useState(true);

 let skillsData = useMemo(() => {
  return [];  // or some computation that returns your skills data
}, []); 

 skillsData = useMemo(() => {
  if (!strengthData) return [];
  
  return strengthData.map(item => ({
    skill: item.Skill.toLowerCase(), 
    percentage: item.Score  
  }));
}, [strengthData]);

const skillsChartData = React.useMemo(() => {
  return {
    labels: skillsData.map(item => item.skill),
    datasets: [
      {
        data: skillsData.map(item => item.percentage),
        backgroundColor: skillsData.map(item => TECH_COLORS[item.skill.toLowerCase()] || '#176A66'),
        borderColor: skillsData.map(item => TECH_COLORS[item.skill.toLowerCase()] || '#176A66'),
        borderWidth: 1,
      }
    ]
  };
}, [skillsData]);
  
  const strengthChartData = React.useMemo(() => {
    if (!strengthData) return null;
    return {
      labels: strengthData.map(item => item.Skill),
      datasets: [
        {
          label: 'Programming Languages',
          data: strengthData.map(item => item.Score),
          backgroundColor: strengthData.map(item => TECH_COLORS[item.Skill.toLowerCase()] || '#176A66'),
          borderColor: strengthData.map(item => TECH_COLORS[item.Skill.toLowerCase()] || '#176A66'),
          borderWidth: 1,
          borderRadius: useSlimBars ? 5 : 0,
        }
      ]
    };
  }, [strengthData, useSlimBars]);
  const createCurrentStackData = React.useCallback((originalData) => {
    if (!originalData || originalData.length === 0) return null;
    const years = new Set();
    const currentYear = new Date().getFullYear();
    originalData.forEach(item => {
      const [ startYear] = item.start_date.split('/');
      years.add(parseInt(startYear));
      if (item.end_date === 'Present') {
        for (let y = parseInt(startYear) + 1; y <= currentYear; y++) {
          years.add(y);
        }
      } else {
        const [ endYear] = item.end_date.split('/');
        for (let y = parseInt(startYear) + 1; y <= parseInt(endYear); y++) {
          years.add(y);
        }
      }
    });
    const sortedYears = Array.from(years)
      .sort((a, b) => a - b)
      .map(y => y.toString());
    const labels = sortedYears;
    const datasets = originalData.map(tech => {
      const [ techStartYear] = tech.start_date.split('/');
      const techEndYear = tech.end_date === 'Present' ? currentYear : parseInt(tech.end_date.split('/')[1]);
      
      return {
        label: tech.tech,
        data: sortedYears.map(year => {
          if (parseInt(year) >= parseInt(techStartYear) && parseInt(year) <= techEndYear) {
            const yearsSinceStart = parseInt(year) - parseInt(techStartYear);
            const totalYears = techEndYear - parseInt(techStartYear) + 1;
            const progress = Math.min(1, (yearsSinceStart + 1) / totalYears);
            return Math.round(tech.usage_score * progress);
          }
          return 0;
        }),
        backgroundColor: 'transparent',
        borderColor: TECH_COLORS[tech.tech.toLowerCase()] || '#176A66',
        borderWidth: 2,
        tension: 0.4,
        fill: false,
        pointRadius: 3,
        pointHoverRadius: 5,
      };
    });

    return { labels, datasets };
  }, []);

  const stackData = React.useMemo(() => {
    return techTimeLine ? createCurrentStackData(techTimeLine) : null;
  }, [techTimeLine, createCurrentStackData]);
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        display: false, 
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: function(tooltipItems) {
            return tooltipItems[0].label;
          },
          label: function(context) {
            return `Score: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
        title: {
          display: true,
          text: 'Proficiency Score'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Programming Languages'
        }
      }
    },
    maintainAspectRatio: false,
    barPercentage: useSlimBars ? 0.3 : 0.7,     
    categoryPercentage: useSlimBars ? 0.5 : 0.9, 
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    maintainAspectRatio: false,
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
    },
    hover: {
      mode: 'nearest',
      intersect: true
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        title: {
          display: true,
          text: 'Usage Score'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Year'
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className={`${View ? "flex-wrap py-6" : "bg-gray-100 p-6"} min-h-screen flex ${View ? "" : "flex-col"} gap-10 items-center`}>
      <div className={`w-full ${View ? "" : "max-w-4xl"} p-4 bg-white shadow-lg rounded-lg`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#176A66]">Programming Languages Proficiency</h2>
          <div className="flex items-center">
            <span className="mr-2 text-sm text-gray-600">Bar Style:</span>
            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
              <input 
                type="checkbox" 
                name="toggle" 
                id="toggle" 
                checked={useSlimBars}
                onChange={() => setUseSlimBars(!useSlimBars)}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <label 
                htmlFor="toggle" 
                className={`toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${useSlimBars ? 'bg-[#176A66]' : 'bg-gray-300'}`}
              ></label>
            </div>
            <span className="text-sm text-gray-600">{useSlimBars ? 'Slim' : 'Wide'}</span>
          </div>
        </div>
        <div className="h-80 w-full">
          {strengthChartData && <Bar data={strengthChartData} options={barOptions} />}
        </div>
      </div>
      {skillsData && (
        <div className={`w-full ${View ? "max-w-[41rem]" : "max-w-4xl"} p-4 bg-white shadow-lg rounded-lg flex flex-col items-center`}>
          <h2 className="text-xl font-bold text-center text-[#176A66]">Skills Distribution</h2>
          <div className="h-64 w-full">
            <Pie data={skillsChartData} options={pieOptions} />
          </div>
        </div>
      )}
      <div className={`w-full ${View ? "max-w-[41rem]" : "max-w-4xl"} p-4 bg-white shadow-lg rounded-lg`}>
        <h2 className="text-xl font-bold text-center text-[#176A66]">Tech Stack Usage Over Time</h2>
        <div className="h-64 w-full">
          {stackData && <Line data={stackData} options={lineOptions} />}
        </div>
      </div>
    </div>
  );
}

Charts.propTypes = {
  View: PropTypes.bool,
  strengthData: PropTypes.arrayOf(
    PropTypes.shape({
      Skill: PropTypes.string.isRequired,
      Score: PropTypes.number.isRequired,
    })
  ),
  techTimeLine: PropTypes.arrayOf(
    PropTypes.shape({
      tech: PropTypes.string.isRequired,
      start_date: PropTypes.string.isRequired,
      end_date: PropTypes.string.isRequired,
      usage_score: PropTypes.number.isRequired,
    })
  ),
};

Charts.defaultProps = {
  View: false,
  strengthData: null,
  techTimeLine: null,
};