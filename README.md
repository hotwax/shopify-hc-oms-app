# shopify-hotwax-commerce-app
Shopify HotWax Commerce app


### Firebase hosting deployment for browser platform
- Setup firebase hosting at mentioned [here](https://firebase.google.com/docs/hosting)
- Goto your project directly on terminal
- Initialilze firebae
    `firebase init`
- Select hosting from options
- Select Use existing project 
- Select prject from list
- It will ask some question, plesae go with default option
- Configure hosting in case of [multiple site deployed](https://firebase.google.com/docs/hosting/multisites#define_hosting_config) for same project
- Add target to with respect to site 
    `firebase target:apply hosting TARGET_NAME RESOURCE_NAME`
- Update your firebase.json file for target
- firebase deploy --only hosting:TARGET_NAME
- [Deploying to multiple environments](https://firebase.googleblog.com/2016/07/deploy-to-multiple-environments-with.html)
    `$ firebase use default # sets environment to the default alias`
    `$ firebase use production # sets environment to the production alias`
    OR
    `firebase deploy -P production # deploy to production alias`
- Deploy app
    `ionic build [--prod]`
    `firebase use production` (In case of production)
    `firebase deploy --only hosting:clienteling `
