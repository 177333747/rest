const express = require('express') //подключаем express
const path = require('path') //для того чтобы корректно работать с путями
const {v4} = require('uuid')
const app = express() //создаем обьект приложения


let CONTACTS = [
    {id: v4(), value: Math.random(), marked:false}
]

//если я добавляю эту строчку  я могу работать с реквестами
app.use(express.json())

//GET
// api contact это route 
// ( ) => колбек у него есть request response
app.get('/api/contacts', (req, res) =>{

        //200 статус запроса - говорит что у сервер все хорошо, а чтобы вернуть данные используем метод json
        res.status(200).json(CONTACTS)
})

//POST
//создаем элементы на сервере
app.post('/api/contacts', (req, res)=>{
  
    //новый контакт это обьект где я разверну request body
    const contact = {...req.body, id: v4(), value: Math.random(), marked: false}
    CONTACTS.push(contact)
    res.status(201).json(contact) //201 означает что элемент был создан

})

// DELETE
app.delete('/api/contacts/:id', (req, res) => {
    CONTACTS = CONTACTS.filter(c => c.id !== req.params.id)
    res.status(200).json({message: 'Deleted'})
  })

//PUT
app.put('/api/contacts/:id', (req, res) => {
  // находим индекс нашего элемента в базе данных, параметр id храниться в req.param.id 
    const idx = CONTACTS.findIndex(c => c.id === req.params.id)

    //меняем contact на request body
    CONTACTS[idx] = req.body

    //возвращаем измененный контакт
    res.json(CONTACTS[idx])
  })


// Для того чтобы коректно отдавать статические файлы из клиента. Папка client - теперь статическая
// делаем client статической для того чтобы index.html нашел frontend js
app.use(express.static(path.resolve(__dirname, 'client')))

// когда я выполняю метод get по любым роутам, екпресс 
// будет следить за любыми гет запросами, которые у нас есть
// path.resolve - путь к файлу index.html
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'))
})
// запускам данный сервер, 3000 это порт на котором будет
//  запущено, и  когда сервер запуститься пусть
// в консоли покажется server started
app.listen(3000, ()=> console.log("Server started...")); 

