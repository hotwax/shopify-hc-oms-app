import api from '@/api';

const generateAccessToken = async (query: any): Promise <any>  => {
  return api({
    url: "/shopify/v1/access-token", 
    method: "post",
    data: query,
    cache: true
  });
}

export default {
  generateAccessToken
}