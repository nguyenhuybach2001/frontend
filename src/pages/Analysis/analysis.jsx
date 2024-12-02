import React, { useEffect, useState } from "react";
import s from "./analysis.module.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { Tabs } from "antd";
import apiCaller from "../../api/apiCaller";
import { analysisApi } from "../../api/analysisApi";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      display: false,
    },
    title: {
      display: true,
      text: "Chart.js Horizontal Bar Chart",
    },
  },
};
const options1 = {
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      display: false,
    },
    title: {
      display: true,
      text: "Chart.js Horizontal Bar Chart",
    },
  },
};
function getRandomLightColor() {
  const r = Math.floor(Math.random() * 156) + 100; // Giá trị từ 100 đến 255
  const g = Math.floor(Math.random() * 156) + 100; // Giá trị từ 100 đến 255
  const b = Math.floor(Math.random() * 156) + 100; // Giá trị từ 100 đến 255
  return `rgb(${r}, ${g}, ${b})`;
}

function generateLightColors(length) {
  return Array.from({ length }, () => getRandomLightColor());
}

export default function AnalysisScreen() {
  const [type, setType] = useState("t");
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [data3, setData3] = useState([]);
  const [data4, setData4] = useState([]);
  const [data5, setData5] = useState([]);
  const backgroundColors = generateLightColors(data2.length);
  const fetchRevenue = async (data) => {
    const response = await apiCaller({
      request: analysisApi.revenue(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };
  const fetchShopRevenue = async (data) => {
    const response = await apiCaller({
      request: analysisApi.shop_revenue(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };
  const fetchCategory_qtt_sold = async (data) => {
    const response = await apiCaller({
      request: analysisApi.category_qtt_sold(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };
  const fetchTiki_price_rage = async (data) => {
    const response = await apiCaller({
      request: analysisApi.tiki_price_rage(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };
  const fetchSendo_price_rage = async (data) => {
    const response = await apiCaller({
      request: analysisApi.sendo_price_rage(data),
      errorHandler: (error) => {
        console.error("Failed to fetch top discounts:", error);
      },
    });

    if (response) {
      return response;
    }

    return null;
  };
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const data = { token: token, type: type };
    fetchRevenue(data).then((res) => {
      setData1(res.data);
    });
    fetchShopRevenue(data).then((res) => {
      setData2(res.data);
    });
    fetchCategory_qtt_sold(data).then((res) => {
      setData3(res.data);
    });
    type === "t" &&
      fetchTiki_price_rage(data).then((res) => {
        setData4(res.data?.list);
        console.log(res.data);
      });
    type === "s" &&
      fetchSendo_price_rage(data).then((res) => {
        setData5(res.data?.list);
        console.log(res.data);
      });
  }, [type]);

  const dataList1 = {
    labels: data1.map((val) => val.category_name),
    datasets: [
      {
        label: "Dataset 1",
        data: data1.map((val) => val.total_revenue),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  const dataList4 = {
    labels: (type == "t" ? data4 : data5).map((val) => val.price_range),
    datasets: [
      {
        label: "Dataset 1",
        data: (type == "t" ? data4 : data5).map((val) => val.total_sales),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  const dataList3 = {
    labels: data3.map((val) => val.category_name),
    datasets: [
      {
        label: "Dataset 1",
        data: data3.map((val) => val.total_quantity_sold),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };
  const dataList2 = {
    labels: data2.map((val) => val.shop_name),
    datasets: [
      {
        label: "# of Votes",
        data: data2.map((val) => val.total_revenue),
        backgroundColor: backgroundColors,
      },
    ],
  };
  const items1 = [
    {
      key: "1",
      label: "Tiki",
      children: (
        <div>
          <Bar options={options} data={dataList1} />
          <Bar options={options} data={dataList3} />
          <Bar options={options1} data={dataList4} />
          <Doughnut
            style={{ margin: "auto" }}
            width={500}
            height={500}
            data={dataList2}
          />
        </div>
      ),
    },
    {
      key: "2",
      label: "Sen đỏ",
      children: (
        <div>
          <Bar options={options} data={dataList1} />
          <Bar options={options} data={dataList3} />
          <Bar options={options1} data={dataList4} />
          <Doughnut
            style={{ margin: "auto" }}
            width={500}
            height={500}
            data={dataList2}
          />
        </div>
      ),
    },
  ];
  return (
    <div className={s.body}>
      <Tabs
        defaultActiveKey="1"
        items={items1}
        onChange={(e) => {
          if (e == "1") {
            setType("t");
          } else if (e == "2") {
            setType("s");
          }
        }}
      />
    </div>
  );
}
