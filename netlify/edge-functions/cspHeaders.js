export default async (request, context) => {

    const response = await context.next();
    const page = await response.text();

    const urlSplit = request.url.split("?");
    let cspValue = "frame-ancestors 'none';";
  
    if (urlSplit.length >= 2) {
      const queryString = new URLSearchParams(urlSplit[1]);
      const shop = queryString.get("shop");
 
      if (shop != undefined && shop.endsWith("myshopify.com")) {
        cspValue = `frame-ancestors https://admin.shopify.com https://${shop}`;
      }
    }

    response.headers.set("Content-Security-Policy", cspValue)
    return new Response(page, response);
}

export const config = { path: "/" }
