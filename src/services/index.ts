import api from '@/api';

const generateAccessToken = async (query: any): Promise <any>  => {
  return api({
    url: "/app",
    method: "post",
    params: query,  // As discussed, we will always pass the query in request params irrespective of method used
    cache: true
  });
}

const setConfiguration = async (query: any, data: any): Promise <any> => {
  return api({
    url: "/app/instance",
    method: "POST",
    params: query,   // As discussed, we will always pass the query in request params irrespective of method used
    data
  })
}

const getConfiguration = async (query: any): Promise <any> => {
  return api({
    url: "/app/instance",
    method: "get",
    params: query
  })
}
const getApiKey = async (query: any): Promise <any> => {
  return api({
    url: "/app",
    method: "get",
    params: query
  })
}

const verifyRequest = async (query: any): Promise <any> => {
  return api({
    url: "/app/verify",
    method: "GET",
    params: query
  })
}

const getInstance = async (query: any): Promise <any> => {
  return api({
    url: "/app/instance",
    method: "GET",
    params: query
  })
}

export {
  generateAccessToken,
  getApiKey,
  setConfiguration,
  getConfiguration,
  getInstance,
  verifyRequest
}