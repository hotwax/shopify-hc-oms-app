import api from '@/api';

const generateAccessToken = async (query: any): Promise <any>  => {
  return api({
    url: "/access-token", 
    method: "post",
    data: query,
    cache: true
  });
}

const setConfiguration = async (query: any): Promise <any> => {
  return api({
    url: "/configuration",
    method: "post",
    data: query
  })
}

const getConfiguration = async (query: any): Promise <any> => {
  return api({
    url: "/configuration",
    method: "get",
    params: query
  })
}

export default {
  generateAccessToken,
  setConfiguration,
  getConfiguration
}