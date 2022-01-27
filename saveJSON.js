const fs =require('fs')
const object ={name:"hello"}

fs.writeFileSync('./data.json',JSON.stringify(object))