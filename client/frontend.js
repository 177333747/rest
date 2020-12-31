import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'

Vue.component('loader', {
    template: `
      <div style="display: flex;justify-content: center;align-items: center">
        <div class="spinner-border" role="status">
          <span class="sr-only"></span>
        </div>
      </div>
    `
  })

  //создаем новый экземпляр vue
  new Vue({
   
    //указываем какой элемент является корневым, указаваем селектор по которому vue может получить данный элемент
    el: '#app', 
   
    // в методе data возвращаем обьект который  является моделями для нашего приложения control -value
    data() {
      return {
        loading: false,
        form: {
          value: Math.random()
        },

        //массив содержащий в себе контакты
        contacts: []
      }
    },
     
    methods: {
      
      async generate() {
        // с помощью деструктуризации создаем новый обьект contactи с помощью оператора rest соберем все значения которые находятся в this form
        const {...contact} = this.form

        //сначала делаем запрос на сервер для того чтобы сервер нам создал эти данные
        const newContact = await request('/api/contacts', 'POST', contact)

        //пока мы не работаем с сервером добавляем его в текущий массив
        this.contacts.push(newContact)
       
        
      },

      //метод принимает id
      async retrieve(id) {

        // находим текущий контакт
        const contact = this.contacts.find(c => c.id === id)

        //ждем пока выполниться request по адресу и указываем что это метод put
        const updated = await request(`/api/contacts/${id}`, 'PUT', {

        //с помощью оператора spread разверну текущий контакт
          ...contact,
          marked: true
        })
        contact.marked = updated.marked
      },
      async removeContact(id) {
        await request(`/api/contacts/${id}`, 'DELETE')
        
        //Если contact id = тому id который мы передавали в remove contact то это означает что нужно удалить этот элемент
        this.contacts = this.contacts.filter(c => c.id !== id)
      }
    },
   
    // вызывается тогда когда компонент готов
    async mounted() {
      this.loading = true
      
      // ждем пока функция request выполнитьс указываем url по которому делается запрос, contacts- это сущность с которой мы работаем
      this.contacts = await request('/api/contacts')
      this.loading = false
    }
  })
  
  //функция делаем асинхронные запросы на серверпараметры: url по которому делаем запрос и передаем метод get по умолчанию, и обьект дата если она нужна
  async function request(url, method = 'GET', data = null) {
    try {
      
      //header это метадынные которые говорят что с этим запросом происходит
      const headers = {}
      
      // let потому что мы будем его переопределять
      let body

      //если параметр data не пустой, то я передам 1 header. тип контента который мы передаем это json
      if (data) {
        headers['Content-Type'] = 'application/json'

        //stringify сериализует обьект
        body = JSON.stringify(data)
      }
     
      // метод fetch дает возможность делать ajax запросы, первым параметром он принимает url, а вторым обьект конфигурации который позволяет законфигурировать даннный запрос
     //  получаем обьект response и подождем когда промис fetch закончится
      const response = await fetch(url, {
        method,
        headers,
        body
      })
      return await response.json()
    } catch (e) {
      
      // если произошла ошибка выводим
      console.warn('Error:', e.message)
    }
  }