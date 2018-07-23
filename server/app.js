const express = require('express')

const app = express()

app.get('/', (req, res, err) => {
    res.send('GET 5000')
})

app.listen(5050, console.log('server is listening on 5050'))