import React, { useEffect, useState, useRef } from 'react'
import { Toast } from 'primereact/toast';
import { Loading } from '../../../components/Loading/Loading';

//PAGE
import DBT04List from './DBT04List';

//SERVICE
import { DBT04GetDataList, DBT04RunProcess } from '../../../service/ServiceDBT/ServiceDBT04';

export default function DBT04() {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [dataTable, setDataTable] = useState([]);

    const onDBT04GetDataList = () => {
        setLoading(true);
        DBT04GetDataList()
            .then(res => {
                setLoading(false);
                if (res.status === 200 && res.error === false) {
                    let temp = [];
                    let index = 1;
                    res.result.forEach(element => {
                        temp.push({
                            ...element,
                            index: index
                        })
                        index++;
                    });
                    setDataTable(temp);
                } else {
                    showMessages('error', `เกิดข้อผิดพลาด Status Code: ${res.status}`, res.message);
                }
            }, function (err) {
                setLoading(false);
                if (err.response.data.status == 401) {
                    alert(JSON.stringify('เนื่องจาก Authorized หมดอายุ กรุณาเข้าสู่ระบบใหม่'))
                    window.location.href = '/login'
                } else {
                    alert(JSON.stringify(err.response.data));
                }
                // showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });
    }

    useEffect(() => {
        onDBT04GetDataList();
    }, []);

    const onRunProcessClick = (value, schedule_mode) => {
        setLoading(true);
        DBT04RunProcess(value.source_seq, schedule_mode)
            .then(res => {
                if (res.result === true) {
                    showMessages('success', `สำเร็จ`, 'ดึงข้อมูล');
                    onDBT04GetDataList();
                }
            }, function (err) {
                setLoading(false);
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });
    }

    const showMessages = (severity = 'error', summary = '', detail = '') => {
        toast.current.show({ severity: severity, summary: summary, detail: detail, life: 8000 });
    }

    return (
        <>
            <Loading loading={loading} />
            <div className="datatable-crud-demo">
                <Toast ref={toast} position="top-right" />
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <h1 className="p-m-0">{localStorage.getItem("nameMenu")}</h1>
                    </div>

                    <DBT04List
                        dataTable={dataTable}
                        onRunProcessClick={(a, b) => onRunProcessClick(a, b)}
                    />
                </div>
            </div>
        </>
    )
}
