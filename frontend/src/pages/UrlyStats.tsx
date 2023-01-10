import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Form, Row} from "react-bootstrap";
import {useParams} from "react-router-dom";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend, TimeSeriesScale, TimeScale,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { ChartData, ChartOptions } from 'chart.js';
import 'chartjs-adapter-moment';

ChartJS.register(
  TimeSeriesScale,
  TimeScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
        title: {
            display: true,
            text: "Url visitor data"
        }
    },
    scales: {
        x: {
            type: "time"
        }
    }
}

interface DataEntry {
    time: string;
    count: number;
}

interface UrlyData {
    urly_id: string,
    slug: string,
    data: Array<DataEntry>;
}

type TimeChoiceType = "hour" | "day" | "week" | "month" | "year"
const timeChoices: Array<TimeChoiceType> = ["hour", "day", "week", "month", "year"]

export default function UrlyStats () {
    const { id } = useParams();
    const [loading, setLoading] = useState<boolean>(true)
    const [notFound, setNotFound] = useState<boolean>(false)
    const [stats, setStats] = useState<UrlyData|null>(null)
    const [chartData, setChartData] = useState<ChartData<"line">>();
    const [timeChoice, setTimeChoice] = useState<TimeChoiceType>("day")

    useEffect(() => {
        axios.get(`/api/urly/${id}?time_choice=${timeChoice}`)
            .then((res) => {
                setStats(res.data)
            })
            .catch(() => {setNotFound(true)})
    }, [id, timeChoice])

    useMemo(() => {
        if(stats){
            const labels: Array<Date> = []
            const data: Array<number> = []
            stats.data.forEach((item: DataEntry) => {
                labels.push(new Date(item.time))
                data.push(item.count)
            })
            setChartData({
                labels: labels,
                datasets: [{data: data,  label: ''}]
            })
        }
    }, [stats])

    const urly = `${window.location.origin}/${stats?.slug}`

    console.log("chartdata")
    console.log(chartData)

    return (
        <>
            {stats &&
                <>
                    <Row>
                        <Col xs={12}>
                            <h5>Url statistics for {stats?.urly_id} (<a href={urly}>{urly}</a>)</h5>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={1}></Col>
                        {timeChoices.map(c => <Col xs={2} key={c}><Button onClick={() => {setTimeChoice(c)}}>{c}</Button></Col>)}
                    </Row>
                    {chartData &&
                        <Row>
                            <Col xs={12}>
                                <Line options={chartOptions} data={chartData}/>
                            </Col>
                        </Row>
                    }
                </>
            }
        </>
    )
}

