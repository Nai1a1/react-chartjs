import React, { useEffect, useState } from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import "./App.css";

import revenueData from "./data/revenueData.json";
import sourceData from "./data/sourceData.json";
import sample from "./data/sample.json";


defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

export const App = () => {
  const [transactionData, setTransactionData] = useState({
    labels: [],
    counts: [],
    amounts: [],
  });

  const [amountRangesData, setAmountRangesData] = useState({
    labels: [],
    counts: [],
  });

  const [fraudData, setFraudData] = useState({
    labels: [],
    counts: [],
  });

  const [fraudOverTime, setFraudOverTime] = useState([]);
 

  useEffect(() => {
    // Process `sample.json` to extract fraud counts over time
    const stepCounts = {};

    // Process `sample.json` to extract insights
    const typeCounts = {};
    const typeAmounts = {};

    

    const amountRanges = {
      "<500": 0,
      "500-15000": 0,
      "15000-50000": 0,
      "50000-100000": 0,
      "100000-1000000": 0,
      ">1000000": 0,
    };

    // Process `sample.json` to extract fraudulent transaction data
    const fraudCounts = {};

    

    sample.forEach((item) => {
      const type = item.type;
      const amount = parseFloat(item.amount);

      // Count transactions by type
      typeCounts[type] = (typeCounts[type] || 0) + 1;

      // Sum amounts by type
      typeAmounts[type] = (typeAmounts[type] || 0) + amount;

      // Categorize amounts into ranges
      if (amount < 500) {
        amountRanges["<500"] += 1;
      } else if (amount >= 500 && amount < 15000) {
        amountRanges["500-15000"] += 1;
      } else if (amount >= 15000 && amount < 50000) {
        amountRanges["50000-100000"] += 1;
      } else if (amount >= 50000 && amount < 100000) {
        amountRanges["1000-5000"] += 1;
      } else if (amount >= 100000 && amount < 1000000) {
        amountRanges["5000-10000"] += 1;
      } else {
        amountRanges[">10000"] += 1;
      }

      if (item.isFraud === "1") {
        const type = item.type;
        fraudCounts[type] = (fraudCounts[type] || 0) + 1;
      }
      if (item.isFraud === "1") {
        const step = parseInt(item.step, 10);
        stepCounts[step] = (stepCounts[step] || 0) + 1;
      }

  });

    // Prepare data sorted by steps
    const sortedData = Object.keys(stepCounts)
      .map((step) => ({
        label: `${step}`,
        count: stepCounts[step],
      }))
      .sort((a, b) => parseInt(a.label.split(" ")[1]) - parseInt(b.label.split(" ")[1]));

    setFraudOverTime(sortedData);    


    setTransactionData({
      labels: Object.keys(typeCounts),
      counts: Object.values(typeCounts),
      amounts: Object.values(typeAmounts),
    });

    setAmountRangesData({
      labels: Object.keys(amountRanges),
      counts: Object.values(amountRanges),
    });

    setFraudData({
      labels: Object.keys(fraudCounts),
      counts: Object.values(fraudCounts),
    });


  }, []);

    
  
  return (
    <div className="App">
      {/** Line Chart for Fraudulent Transactions Over Time */}
      <div className="dataCard fraudOverTimeCard">
        <Line
          data={{
            labels: fraudOverTime.map((data) => data.label),
            datasets: [
              {
                label: "Number of Fraudulent Transactions",
                data: fraudOverTime.map((data) => data.count),
                backgroundColor: "#FF3030",
                borderColor: "#FF3030",
              },
            ],
          }}
          options={{
            elements: {
              line: {
                tension: 0.5, 
              },
            },
            plugins: {
              title: {
                text: "Transactions Frauduleuses Dans Le Temps (Steps)",
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Time (Steps)",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Number of Fraudulent Transactions",
                },
              },
            },
          }}
        />
      </div>
      {/** Exemple */}
      <div className="dataCard revenueCard">
        <Line
          data={{
            labels: revenueData.map((data) => data.label),
            datasets: [
              {
                label: "Revenue",
                data: revenueData.map((data) => data.revenue),
                backgroundColor: "#064FF0",
                borderColor: "#064FF0",
              },
              {
                label: "Cost",
                data: revenueData.map((data) => data.cost),
                backgroundColor: "#FF3030",
                borderColor: "#FF3030",
              },
            ],
          }}
          options={{
            elements: {
              line: {
                tension: 0.5,
              },
            },
            plugins: {
              title: {
                text: "Exemple : Monthly Revenue & Cost",
              },
            },
          }}
        />
      </div>


      {/* Bar Chart for Transaction Counts */}
      <div className="dataCard customerCard">
        <Bar
          data={{
            labels: transactionData.labels,
            datasets: [
              {
                label: "Transaction Counts",
                data: transactionData.counts,
                backgroundColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                  "rgba(34, 139, 34, 0.8)", 
                  "rgba(255, 99, 71, 0.8)",
                ],
                borderRadius: 5,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "Type of Transactions",
              },
            },
          }}
        />
      </div>

      {/* Bar Chart for Transaction Amounts */}
      <div className="dataCard amountCard">
        <Bar
          data={{
            labels: transactionData.labels,
            datasets: [
              {
                label: "Transaction Amounts",
                data: transactionData.amounts,
                backgroundColor: [
                  "rgba(43, 63, 229, 0.8)",
                  "rgba(250, 192, 19, 0.8)",
                  "rgba(253, 135, 135, 0.8)",
                  "rgba(34, 139, 34, 0.8)", 
                  "rgba(255, 99, 71, 0.8)",
                ],
                borderRadius: 5,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "Montant de Transactions par Type",
              },
            },
          }}
        />
      </div>

      {/* Bar Chart for Fraudulent Transactions by Type */}
      <div className="dataCard fraudCard">
        <Bar
          data={{
            labels: fraudData.labels,
            datasets: [
              {
                label: "Number of Fraudulent Transactions",
                data: fraudData.counts,
                backgroundColor: [
                  "rgba(255, 99, 71, 0.8)",
                  "rgba(54, 162, 235, 0.8)",
                  "rgba(255, 206, 86, 0.8)",
                  "rgba(75, 192, 192, 0.8)",
                  "rgba(153, 102, 255, 0.8)",
                ],
                borderRadius: 5,
              },
            ],
          }}
          options={{
            plugins: {
              title: {
                text: "Fraude par Type",
              },
            },
          }}
        />
      </div>     

     
    </div>
  );
};
