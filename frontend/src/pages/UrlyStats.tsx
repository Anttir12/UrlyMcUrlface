import React, {useEffect, useMemo, useState} from 'react';
import {Button, Col, Row} from "react-bootstrap";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";
import {
    Chart as ChartJS,
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
    const [stats, setStats] = useState<UrlyData|null>(null)
    const [chartData, setChartData] = useState<ChartData<"line">>();
    const [timeChoice, setTimeChoice] = useState<TimeChoiceType>("day")

    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`/api/urly/${id}?time_choice=${timeChoice}`)
            .then((res) => {
                setStats(res.data)
            })
            .catch(() => {
                navigate("/")
            })
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

    const handleDelete = () => {
        if(window.confirm("Are you sure you want to delete this Urly?")){
            axios.delete(`/api/urly/${id}`)
                .then(() => {
                    navigate("/")
                })
                .catch(() => {
                    window.alert("Delete failed")
                })
        }
    }

    return (
        <>
            {stats &&
                <>
                    <Row className={"mt-4"}>
                        <Col xs={12}>
                            <h5>Url statistics for {stats?.urly_id} (<a href={urly}>{urly}</a>)</h5>
                        </Col>
                    </Row>
                    <Row>
                        {chartData &&
                        <>
                            <Col xs={12} md={9} lg={10}>
                                <Line options={chartOptions} data={chartData}/>
                            </Col>
                            <Col xs={12} md={3} lg={2} className={"mt-md-5"}>
                                {timeChoices.map(c =>
                                    <Col xs={1} md={12} key={c} className={"mb-3"}>
                                        <Button disabled={timeChoice === c} onClick={() => {setTimeChoice(c)}}>
                                            {c}
                                        </Button>
                                    </Col>)}
                            </Col>
                        </>
                        }
                    </Row>
                    <Row className={"mt-5"}>
                        <Col>
                            <Button variant={"danger"} onClick={handleDelete} className={"float-end"}>
                                Delete this Urly
                            </Button>
                        </Col>
                    </Row>
                </>
            }
        </>
    )
}

