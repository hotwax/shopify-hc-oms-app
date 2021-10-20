import api from '@/api';

const generateAccessToken = async (query: any): Promise <any>  => {
  return api({
    url: "/shopify/oms/access-token", 
    method: "post",
    data: query,
    cache: true
  });
}

const setConfiguration = async (query: any): Promise <any> => {
  return api({
    url: "/shopify/oms/configuration",
    method: "post",
    data: query
  })
}

const getConfiguration = async (query: any): Promise <any> => {
  console.log(query)
  return api({
    url: "/shopify/oms/configuration",
    method: "get",
    data: query
  })
}

export default {
  generateAccessToken,
  setConfiguration,
  getConfiguration
}