import React, { useEffect, useState, useRef } from 'react'
import { Toast } from 'primereact/toast';
import { Loading } from '../../../components/Loading/Loading';
import { getTextMenu } from '../../../utils/MenuUtil';

//PAGE
import DMS03Search from './DMS03Search';
import DMS03List from './DMS03List';
import DMS03Dialog from './DMS03Dialog';

//SERVICE
import { DMS03GetDataList, DMS03GetDetail, DMS03RunProcess } from '../../../service/ServiceDMS/ServiceDMS03';
import { masterService } from '../../../service/ServiceMaster/MasterService';

export default function DMS03() {
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [dataTableDetail, setDataTableDetail] = useState([]);
    const [dialog, setDialog] = useState({ dialog: false, action: '' });
    const [selectedTF, setSelectedTF] = useState([]);
    // SEARCH
    const [searchData, setSearchData] = useState({
        "start_date": new Date(),
        "end_date": new Date(),
        "source_seq": "-1",
        "transfer_data_group_seq": "-1",
        "source_schema": "-1"
    });
    const [msDataSource, setMsDataSource] = useState([]);
    const [msDataTransferGroup, setMsDataTransferGroup] = useState([]);

    useEffect(() => {
        //ALL
        masterService(`GetDataSource?mode=0&source_process=1`, {}, "GET")
            .then(res => {
                setMsDataSource(res.result);
            }, function (err) {
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });
        //แหล่งข้อมูลต้นทาง
        // masterService(`GetTransferDataGroup?mode=0`, {}, "GET")
        //     .then(res => {
        //         let temp = res.result;
        //         temp.splice(0, 1);
        //         setMsDataTransferGroup(temp);
        //     }, function (err) {
        //         showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
        //     });

        //
        onGetDataList();
        onGetTransferDataGroup()
    }, []);

    const onGetTransferDataGroup = (source_schema = '') => {
        masterService(`GetTransferDataGroup?mode=1&source_schema=${source_schema}`, {}, "GET").then(res => {
            let temp = res.result;
            temp.splice(0, 1);
            setMsDataTransferGroup(temp);
            // setMsDataTransferGroup(res.result);
        });
    }

    const onGetDataList = () => {
        let transfer_data_group_seq = "-1";
        let index = 1;
        if (selectedTF !== null && selectedTF !== "" && selectedTF !== undefined) {
            transfer_data_group_seq = "";
            selectedTF.forEach(element => {
                if (selectedTF.length === index || selectedTF.length === 1) {
                    transfer_data_group_seq += element + ""
                } else {
                    transfer_data_group_seq += element + ","
                }
                index++
            });
        }

        setLoading(true);
        DMS03GetDataList({ ...searchData, transfer_data_group_seq: transfer_data_group_seq})
            .then(res => {
                setLoading(false);
                if (res.status === 200) {
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

    const onDMS03GetDetailClick = (rowData) => {
        setLoading(true);
        DMS03GetDetail(rowData)
            .then(res => {
                setDialog({ dialogDetail: true, data: rowData })
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
                    setDataTableDetail(temp);
                }
            }, function (err) {
                setLoading(false);
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });
    }

    const onRunProcessClick = (value) => {
        setLoading(true);
        DMS03RunProcess(value)
            .then(res => {
                if (res.result === true) {
                    showMessages('success', `สำเร็จ`, 'Run การถ่ายโอนข้อมูล');
                    onGetDataList();
                }
            }, function (err) {
                setLoading(false);
                showMessages('error', `เกิดข้อผิดพลาด Status Code: ${err.response.data.status} ${err.response.data.message}`, '');
            });
    }

    const showMessages = (severity = 'error', summary = '', detail = '') => {
        toast.current.show({ severity: severity, summary: summary, detail: detail, life: 8000 });
    }

    const returnStatus = (rowData, checkColumn) => {
        let data = { ...rowData };
        let datavalue = data[`${checkColumn}`];
        return (
            <div className="status-badge">
                <span className={`status-indicator ${datavalue === 'สำเร็จ' ? 'status-active' : 'status-inactive'}`}>
                    {datavalue}
                </span>
            </div>
        );
    }

    return (
        <>
            <Loading loading={loading} />
            <div className="datatable-crud-demo">
                <Toast ref={toast} position="top-right" />
                    <DMS03Search
                        searchData={searchData}
                        setSearchData={setSearchData}
                        msDataSource={msDataSource}
                        msDataTransferGroup={msDataTransferGroup}
                        onGetDataList={onGetDataList}
                        selectedTF={selectedTF}
                        setSelectedTF={setSelectedTF}
                        onGetTransferDataGroup={onGetTransferDataGroup}
                    />
                    <DMS03List
                        dataTable={dataTable}
                        setDialog={setDialog}
                        onRunProcessClick={(e) => onRunProcessClick(e)}
                        onDMS03GetDetailClick={(e) => onDMS03GetDetailClick(e)}
                        returnStatus={returnStatus}
                    />
                    <DMS03Dialog
                        dialog={dialog}
                        setDialog={setDialog}
                        dataTableDetail={dataTableDetail}
                        returnStatus={returnStatus}
                    />
            </div>

        </>
    )
}
