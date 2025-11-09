import axios from "axios"
import { URL_API } from "../Config"
import { getSession } from "../../utils/Crypto"

const api = axios.create({
  baseURL: URL_API("/backOfficeApi/LPASM01"),
  headers: { "Content-Type": "application/json", Accept: "application/json" },
})

const getUserInfo = async () => {
  const session = await getSession("login")
  const token = session?.result?.token || session?.token || ""
  const user = session?.result?.user_dto || session?.user_dto || {}
  return { token, user }
}

const getDataList = async () => {
  const { token } = await getUserInfo()
  const res = await api.get("/Get", {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

const addData = async (data) => {
  const { token, user } = await getUserInfo()
  const payload = {
    register_type_name: String(data.register_type_name || "").trim(),
    register_type_ord: Number(data.register_type_ord || 1),
    register_type_flag:
      data.register_type_flag === 0 || data.register_type_flag === "0"
        ? "0"
        : "1",
    remark: data.remark ?? "",
    record_status: data.record_status || "A",
    create_user: user?.user_id || "1",
    last_upd_user: user?.user_id || "1",
  }
  const res = await api.post("/Add", payload, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

const updateData = async (data) => {
  const { token, user } = await getUserInfo()
  const payload = {
    register_type_seq: Number(data.register_type_seq || 0),
    register_type_name: String(data.register_type_name || "").trim(),
    register_type_ord: Number(data.register_type_ord || 1),
    register_type_flag:
      data.register_type_flag === 0 || data.register_type_flag === "0"
        ? "0"
        : "1",
    remark: data.remark || "",
    record_status:
      data.record_status === "C" ? "A" : data.record_status || "A",
    create_user: user?.user_id || "1",
    last_upd_user: user?.user_id || "1",
  }
  const res = await api.put("/Update", payload, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

const deleteData = async (data) => {
  console.log(data);
  
  const { token } = await getUserInfo();

  const payload = {
    register_type_seq: Number(data || 0),
    record_status: "C",
  };

  console.log("[Delete Payload]", payload);

  try {
   
    const res = await api.request({
      method: "DELETE",
      url: "/Delete",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      data: payload,
    });

    console.log("[Delete Response]", res.data);
    return res.data;
  } catch (err) {
    console.error("[API Error /Delete]", err.response?.data || err.message);
    throw err;
  }
};


const updateOrder = async (orderList) => {
  const { token, user } = await getUserInfo()
  const payload = {
    data: { order_seq_list: orderList, user_dto: user },
  }
  const res = await api.post("/UpdateOrder", payload, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.data
}

export default {
  getDataList,
  addData,
  updateData,
  deleteData,
  updateOrder,
}
