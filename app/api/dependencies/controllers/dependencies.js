const { sanitizeEntity } = require('strapi-utils');
const axios = require('axios');

module.exports = {
  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { url } = ctx.params;

    const entity = await strapi.services.dependencies.findOne({ url });
    return sanitizeEntity(entity, { model: strapi.models.dependencies });
  },
  async webhookGet() {
    const { data } = await axios.get('http://bitbucket.plium.club:1337/dependencies/xcut');

    console.log(data);  
    return "Received GET request. Check the console for more info.";
  },
  async webhookPost(ctx) {
    console.log("Received webhook request to /webhook-receive");
    console.log("Request body:");
    console.log(ctx.request.body);

    if (ctx.request.body.pullRequest && ctx.request.body.pullRequest.state == "MERGED" && ctx.request.body.pullRequest.open == false && ctx.request.body.pullRequest.closed == true) {
        console.log("New pull request created: "+ctx.request.body.pullRequest.fromRef.id)

        const refId = ctx.request.body.pullRequest.fromRef.id;
        const branch = refId.split('/')[2];

        let headerGet = {
            headers: {
                'Authorization': 'Bearer ' + process.env.BITBUCKET_TOKEN
            }
          };
        
        console.log("Call api");
        axios.get('https://bitbucket.plium.club:1337/dependencies/'+ctx.request.body.fromRef.repository.slug)
          .then(res => {
            //const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
            //console.log('Status Code:', res.status);
            //console.log('Date in Response header:', headerDate);
            console.log("res"+res);

            const projects = res.data;
        
            for(project of projects) {
        
                  console.log(JSON.stringify(project));
  
                  axios.get('http://bitbucket.plium.club:7990/rest/api/1.0/projects/'+project.url+'/commits?until=master', headerGet)
                  .then(res => {
                      console.log(res)

                      let lastCommit = res.data.values[0].id;
                      console.log("Last commit: " + lastCommit)

                      var data = {
                          name: branch,
                          startPoint: lastCommit
                      };

                      let headerPost = {
                          headers: {
                              'Content-Type': 'application/json',
                              'Authorization': 'Bearer ' + process.env.BITBUCKET_TOKEN
                          }
                      };

                      axios.post('http://bitbucket.plium.club:7990/rest/api/1.0/projects/'+project.url+'/branches', data, headerPost)
                      .then(res => {
                          console.log(res)
                      })
                      .catch(error => {
                          console.error(error.response)
                      })

                  })
                  .catch(error => {
                      console.error(error.response)
                  })
              }
        });

    }

    return "Received POST request. Check the console for more info.";
  },
};