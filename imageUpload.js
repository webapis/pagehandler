var cloudinary = require('cloudinary');
const fs =require('fs')
cloudinary.config({ 
    cloud_name: 'codergihub', 
    api_key: '583195742238215', 
    api_secret: 'mkZu56VXRtIqRI83FbX-Az1so6w' 
  });
cloudinary.uploader.upload("data.json", function(error, result) {console.log(result, error)})
cloudinary.v2.uploader.upload("data.json",
  { public_id: "olympic_flag", resource_type: "auto"  }, 
  function(error, result) {console.log(result);console.log(error) });

