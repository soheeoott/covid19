// useState : 리액트 후크, 데이터를 담아 배열을 관리
// useEffect : fetch api 사용
import {useState, useEffect} from 'react';

// 차트를 그리기 위한 컴포넌트
import {Bar, Doughnut, Line} from 'react-chartjs-2';

// axios 불러오기
// https://github.com/axios/axios
import axios from 'axios'; 

const Contents = () => {

    // 데이터를 선언하는 부분
    // state 의 조각인 useState 로 confirmedData 추가
    // [데이터명, 설정 메서드]
    // 초깃값 설정 useState({}); confirmedData 를 obj 형태로
    const [confirmedData, setConfirmedData] = useState({});
    const [quarantinedData, setQuarantinedData] = useState({});
    const [comparedData, setComparedData] = useState({});

    useEffect(()=> {
        const fetchEvents = async () => { // 메서드 생성
            // api 주소 https://documenter.getpostman.com/view/10808728/SzS8rjbc
            const res = await axios.get("https://api.covid19api.com/total/dayone/country/kr");
            // console.log(res); // 데이터를 아직 불러오지 못했는데 호출했기 때문에 async + await 로 get 실행 후 다음 라인 수행
            makeData(res.data) // obj array
        }
        const makeData = (items) => {
            // 첫 번째 인자 : 쌓여서 다음 반복문으로 넘겨지는 전달 값
            // 두 번째 인자 : 현재 반복문이 돌고 있는 items 값
            const arr = items.reduce((acc, cur) => {
                // 객체안에 cur 데이터를 담고 현재 날짜를 담아서 변환
                const currentDate = new Date(cur.Date);
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const date = currentDate.getDate();

                const confirmed = cur.Confirmed;
                const active = cur.Active;
                const deaths = cur.Deaths;
                const recovered = cur.Recovered;

                // acc 배열에 값이 있는지
                // 값이 없다면 새로 추가
                // 값이 있다면 날짜를 비교해서 큰 날짜의 값만 저장 
                // 인자의 값과 선언한 값이 있는지 비교
                const findItem = acc.find(a => a.year === year && a.month === month);
                
                if(!findItem){
                    acc.push({
                        year,
                        month,
                        date,
                        confirmed,
                        active,
                        deaths,
                        recovered
                    })
                }
                // 새롭게 데이터를 업데이트
                // 각 달마다 마지막 날의 데이터를 넘기기
                if(findItem && findItem.date < date){
                    findItem.year = year;
                    findItem.month = month;
                    findItem.date = date;
                    findItem.confirmed = confirmed;
                    findItem.active = active;
                    findItem.deaths = deaths;
                    findItem.recovered = recovered;
                }

                // findItem 을 선언할 때 acc 안에 있는 값을 선택했기 때문에
                // acc 안에 값이 같이 적용된다.
                return acc;
            }, []) // 배열로 초깃값 설정
            console.log(arr);

            // map : 어떠한 배열을 재정의할 때 사용
            // 중괄호를 사용하면 return 값이 필요
            // 한 줄인 경우 return 을 쓰지 않아도 return 을 인식
            const labels = arr.map(a => `${a.month + 1}월`);

            // arr 가 만들어지면 추가
            // obj 형태로 업데이트

            // 누적 확진자 추이
            setConfirmedData({
                labels,
                // fill : 그래프의 색상을 채우는지
                // label - data match
                datasets : [
                    {
                        label: "국내 누적 확진자",
                        backgroundColor: "salmon",
                        fill: true,
                        data: arr.map(a => a.confirmed)
                    },
                ]
            });

            // 월별 격리자 현황
            setQuarantinedData({
                labels,
                datasets : [
                    {
                        label: "월별 격리자 현황",
                        borderColor: "salmon",
                        fill: false,
                        data: arr.map(a => a.active)
                    },
                ]
            });

            // 누적 확진, 해제, 사망
            const last = arr[arr.length -1];
            setComparedData({
                labels: ["확진자","격리해제","사망"],
                datasets : [
                    {
                        label: "누적 확진, 해제, 사망 비율",
                        backgroundColor: ["#ff3d67","#059bff","#ffc233"],
                        borderColor: ["#ff3d67","#059bff","#ffc233"],
                        fill: false,
                        data: [last.confirmed, last.recovered, last.deaths]
                    },
                ]
            });
        }
        fetchEvents()
    }, [])
    // [] (두번째 dependency) : useState 의 계속적인 호출 방지

    return (
        <section>
            <h2>국내 코로나 현황</h2>
            <div className="contents"> {/* 리액트에서는 클래스를 줄 때 className 을 작성 */}
                {/* 누적 확진자 추이 */}
                <div className="wrap">
                    {/* object 형태 */}
                    {/* chartjs 옵션 : https://www.chartjs.org/ */}
                    {/* chartjs REACT 사용법 : https://github.com/reactchartjs/react-chartjs-2 */}
                    <Bar data={confirmedData} options={
                        {title: {display: true, text: "누적 확진자 추이", fontSize: 16}},
                        {legend: {display:  true, position: "bottom"}}
                    } />
                </div>

                {/* 월별 격리자 현황 */}
                <div className="wrap">
                    {/* object 형태 */}
                    <Line data={quarantinedData} options={
                        {title: {display: true, text: "월별 격리자 현황", fontSize: 16}},
                        {legend: {display:  true, position: "bottom"}}
                    } />
                </div>
                
                {/* 누적 확진, 해제, 사망 */}
                <div className="wrap">
                    {/* object 형태 */}
                    <Doughnut data={comparedData} options={
                        {title: {display: true, text: `누적 확진, 해제, 사망 (${new Date().getMonth()+1}월)`, fontSize: 16}},
                        {legend: {display:  true, position: "bottom"}}
                    } />
                </div>
            </div>
        </section>
    )
}

export default Contents
