import React, { useEffect, useState } from "react";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Bar, Doughnut, Line } from "react-chartjs-2";

import "./App.css";

import revenueData from "./data/revenueData.json";
import sample from "./data/sample.json";
import sample3 from "./data/sample3.json";



defaults.maintainAspectRatio = false;
defaults.responsive = true;

defaults.plugins.title.display = true;
defaults.plugins.title.align = "start";
defaults.plugins.title.font.size = 20;
defaults.plugins.title.color = "black";

export const App = () => {
  {/** DATASET 1 */}
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

  const [fraudData1, setFraudData1] = useState({
    transactionPercentage: [0, 0],
    amountPercentage: [0, 0],
  });
  

  const [fraudOverTime, setFraudOverTime] = useState([]);

  {/** DATASET 2 */}
  const [sample3Stats, setSample3Stats] = useState({
    fraudPercentage: [0, 0],
    transactionsByChannel: {},
    transactionsByHour: [],
  });
  const [sample3Data, setSample3Data] = useState({
    labels: [],
    counts: [],
    amounts: [],
  });
  
  const [sample3FraudData, setSample3FraudData] = useState({
    labels: [],
    counts: [],
  });
  

 

  useEffect(() => {
    {/** DATASET 1 */}
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

    // Process the data to calculate fraud percentages
    let totalTransactions = 0;
    let fraudTransactions = 0;

    let totalAmount = 0;
    let fraudAmount = 0;    

    sample.forEach((item) => {
      const type = item.type;
      const amount = parseFloat(item.amount);

      totalTransactions++;
      totalAmount += parseFloat(item.amount);

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
      if (item.isFraud === "1") {
        fraudTransactions++;
        fraudAmount += parseFloat(item.amount);
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

    const transactionPercentage = [
      ((fraudTransactions / totalTransactions) * 100).toFixed(2),
      (100 - (fraudTransactions / totalTransactions) * 100).toFixed(2),
    ];
    const amountPercentage = [
      ((fraudAmount / totalAmount) * 100).toFixed(2),
      (100 - (fraudAmount / totalAmount) * 100).toFixed(2),
    ];

    setFraudData1({
      transactionPercentage,
      amountPercentage,
    });

  ////////////////////////////////////////////////////////////////
    {/** DATASET 2 */}
     // Process the data for sample3.json
    let totalT = 0; // T:Transaction
    let fraudT = 0;
    let totalA = 0; //A:Amount
    let fraudA = 0;

    const channelCounts = {};
    const hourlyCounts = Array(24).fill(0); // Array for 24 hours, initialize to 0

    const transactionCounts = {};
    const transactionAmounts = {};
    const fraudCounts1 = {};

    sample3.forEach((item) => {
      totalT++;
      const amount = parseFloat(item.amount);
      totalA += amount;
      const type = item.card_type;

      // Update transaction counts and amounts
      transactionCounts[type] = (transactionCounts[type] || 0) + 1;
      transactionAmounts[type] = (transactionAmounts[type] || 0) + amount;

      // Update fraud counts
      if (item.is_fraud === "True") {
        fraudCounts1[type] = (fraudCounts1[type] || 0) + 1;
      }

      // Count fraudulent transactions
      if (item.is_fraud === "True") {
        fraudT++;
        fraudA += amount;
      }

      // Count transactions by channel
      channelCounts[item.channel] = (channelCounts[item.channel] || 0) + 1;

      // Count transactions by hour
      const hour = parseInt(item.transaction_hour, 10);
      hourlyCounts[hour]++;
    });

    // Convert to arrays for chart labels and data
    const labels = Object.keys(transactionCounts);
    const counts = Object.values(transactionCounts);
    const amounts = Object.values(transactionAmounts);
    const fraudLabels = Object.keys(fraudCounts1);
    const fraudCountsArray = Object.values(fraudCounts1);

    setSample3Data({ labels, counts, amounts });
    setSample3FraudData({ labels: fraudLabels, counts: fraudCountsArray });

    const fraudPercentage = [
      ((fraudT / totalT) * 100).toFixed(2),
      (100 - (fraudT / totalT) * 100).toFixed(2),
    ];
    const fraudTransactionPercentage = [
      ((fraudT / totalT) * 100).toFixed(2),
      (100 - (fraudT / totalT) * 100).toFixed(2),
    ];
    const fraudAmountPercentage = [
      ((fraudA / totalA) * 100).toFixed(2),
      (100 - (fraudA / totalA) * 100).toFixed(2),
    ];
    

    setSample3Stats({
      fraudPercentage,
      fraudTransactionPercentage,
      fraudAmountPercentage,
      transactionsByChannel: channelCounts,
      transactionsByHour: hourlyCounts,
    });  
  }, []);

    



  return (
    <div className="App">
      {/** -------------------------------data: sample.json------------------------------- */ }    
      <div className="datasetCard">
        <h2>Dataset 1</h2>
        {/** Line Chart for Fraudulent Transactions Over Time */}
        <div className="dataCard fraudOverTimeCard">
          <Line
            data={{
              labels: fraudOverTime.map((data) => data.label),
              datasets: [
                {
                  label: "Number of Fraudulent Transactions",
                  data: fraudOverTime.map((data) => data.count),
                  backgroundColor: "#AAC94A",
                  borderColor: "#AAC94A",
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
                    "#AAC94A",
                    "#0096B0",
                    "#F37F88",
                    "#705c33", 
                    "rgba(255, 99, 71, 0.8)",
                  ],
                  borderRadius: 5,
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  text: "Type de Transactions",
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
                    "#AAC94A",
                    "#0096B0",
                    "#F37F88",
                    "#705c33", 
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
                    "#AAC94A",
                    "#0096B0",
                    "#F37F88",
                    "#705c33", 
                    "rgba(255, 99, 71, 0.8)",
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

        {/** Doughnut for Fraudulent Transactions Percentage */}
        <div className="dataCard fraudTransactionCard">
          <Doughnut
            data={{
              labels: ["Fraud", "Normal"],
              datasets: [
                {
                  data: fraudData1.transactionPercentage,
                  backgroundColor: ["rgba(243, 127, 136, 0.8)", "rgba(0, 150, 176, 0.8)"],
                  borderColor: ["rgba(243, 127, 136, 1)", "rgba(0, 150, 176, 0.8)"],
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  text: "Fraude dans le total des Transactions",
                },
              },
            }}
          />
        </div>

        {/** Doughnut for Fraudulent Amount Percentage */}
        <div className="dataCard fraudAmountCard">
          <Doughnut
            data={{
              labels: ["Fraud", "Normal"],
              datasets: [
                {
                  data: fraudData1.amountPercentage,
                  backgroundColor: ["rgba(243, 127, 136, 0.8)", "rgba(0, 150, 176, 0.8)"],
                  borderColor: ["rgba(243, 127, 136, 1)", "rgba(0, 150, 176, 0.8)"],
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  text: "Fraude dans le Montant total",
                },
              },
            }}
          />
        </div> 
      </div>   

      {/** -------------------------------data: sample3.json------------------------------- */ } 
      <div className="datasetCard">
        <h2>Dataset 2</h2><hr/>
        {/** Bar Chart for Transaction Counts */}
        <div className="dataCard customerCard">
          <Bar
            data={{
              labels: sample3Data.labels, // Transaction types
              datasets: [
                {
                  label: "Transaction Counts",
                  data: sample3Data.counts, // Number of transactions by type
                  backgroundColor: [
                    "#AAC94A",
                    "#0096B0",
                    "#F37F88",
                    "#705c33",
                    "rgba(255, 99, 71, 0.8)",
                  ],
                  borderRadius: 5,
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  text: "Type de Transactions",
                },
              },
            }}
          />
        </div>

        {/** Bar Chart for Transaction Amounts */}
        <div className="dataCard amountCard">
          <Bar
            data={{
              labels: sample3Data.labels, // Transaction types
              datasets: [
                {
                  label: "Transaction Amounts",
                  data: sample3Data.amounts, // Total amount of transactions by type
                  backgroundColor: [
                    "#AAC94A",
                    "#0096B0",
                    "#F37F88",
                    "#705c33",
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

        {/** Bar Chart for Fraudulent Transactions by Type */}
        <div className="dataCard fraudCard">
          <Bar
            data={{
              labels: sample3FraudData.labels, // Transaction types (fraudulent)
              datasets: [
                {
                  label: "Number of Fraudulent Transactions",
                  data: sample3FraudData.counts, // Fraudulent transactions count by type
                  backgroundColor: [
                    "#AAC94A",
                    "#0096B0",
                    "#F37F88",
                    "#705c33",
                    "rgba(255, 99, 71, 0.8)",
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

        
        {/** Doughnut for Fraudulent Transactions Percentage */}
        <div className="dataCard fraudTransactionCard">
          <Doughnut
            data={{
              labels: ["Fraud", "Normal"],
              datasets: [
                {
                  data: sample3Stats.fraudTransactionPercentage,
                  backgroundColor: ["rgba(243, 127, 136, 0.8)", "rgba(0, 150, 176, 0.8)"],
                  borderColor: ["rgba(243, 127, 136, 1)", "rgba(0, 150, 176, 1)"],
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  text: "Fraude dans le total des Transactions",
                },
              },
            }}
          />
        </div>

        {/** Doughnut for Fraudulent Amount Percentage */}
        <div className="dataCard fraudAmountCard">
          <Doughnut
            data={{
              labels: ["Fraud", "Normal"],
              datasets: [
                {
                  data: sample3Stats.fraudAmountPercentage,
                  backgroundColor: ["rgba(243, 127, 136, 0.8)", "rgba(0, 150, 176, 0.8)"],
                  borderColor: ["rgba(243, 127, 136, 1)", "rgba(0, 150, 176, 1)"],
                },
              ],
            }}
            options={{
              plugins: {
                title: {
                  text: "Fraude dans le Montant total",
                },
              },
            }}
          />
        </div>
              

      </div>   
    </div>
  );
};
