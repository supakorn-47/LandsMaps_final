import { URL_API } from "../Config";
import { setSession } from "../../utils/Crypto";
import api from "../API/http";
import axios from "axios";

const normalizeLogin = (data) => {
  try {
    const token =
      data?.token ||
      data?.result?.token ||
      data?.result?.[0]?.token ||
      "";
    const user_dto =
      data?.result?.user_dto ||
      data?.user_dto ||
      data?.result?.[0]?.user_dto ||
      null;
    return { result: { token, user_dto } };
  } catch {
    return { result: { token: "", user_dto: null } };
  }
};

export const loginService = async (data) => {
  try {
    const url = URL_API("/api/Auth/login");
    const res = await axios.post(url, data);

    if (res.data?.token || res.data?.result) {
      setSession("login", normalizeLogin(res.data));
      window.location.hash = "#/portal";
    }

    return res.data;
  } catch (err) {
    console.error("loginService error:", err);
    throw err;
  }
};

export const LoginADService = async (data) => {
  try {
    const url = URL_API("/api/Auth/login");
    const res = await axios.post(url, data);

    if (res.data?.token || res.data?.result) {
      setSession("login", normalizeLogin(res.data));
      window.location.hash = "#/LPADM01";
    }

    return res.data;
  } catch (err) {
    console.error("LoginADService error:", err);
    throw err;
  }
};

export const loginSAMLService = async (data) => {
  try {
    const url = URL_API("/api/Auth/login");
    const res = await axios.post(url, data);

    if (res.data?.token || res.data?.result) {
      setSession("login", normalizeLogin(res.data));
      window.location.hash = "#/LPADM01";
    }

    return res.data;
  } catch (err) {
    console.error("loginSAMLService error:", err);
    throw err;
  }
};

export const getipAddress = async (url) => {
  try {
    const res = await axios.get(url);
    return res.data;
  } catch (err) {
    console.error("getipAddress error:", err);
    throw err;
  }
};
