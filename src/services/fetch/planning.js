// TODO: REMOVE ME
// import FetchOrder from '@fetchdrones/order'
// import ContactServiceFactory from './contact';
//
// export default class PlanningService {
//   constructor (token) {
//     let t = token
//     this.config = {
//       host: 'planning-service',
//       port: 3000,
//       isSSL: false,
//       interceptors: {}
//     }
//     let interceptor = request => {
//       request.headers['Authorization'] = t
//       return request
//     }
//
//     this.config.interceptors = {
//       request: {interceptor},
//       response: {
//         logger: response => {
//           console.log('we did a thing')
//
//           return response
//         }
//       }
//     }
//
//     this.contact = ContactServiceFactory(this.config);
//   }
//   createOrder ({project, resources}) {
//     let service = this
//     return service.orderFactory()
//     .then(order => {
//       return project
//       .orderResourceNodes(order, resources)
//     }).catch(err => {
//       console.log('made a boo boo', err.message)
//       return err
//     })
//   }
//   orderFactory (order = {}) {
//     let service = this
//     let config = Object.assign({
//       endpoint: 'order'
//     }, this.config);
//     return new FetchOrder(order, config).save().then(order => {
//       console.log('created order', order._adaptor)
//
//       return order
//     }).catch(err => {
//       console.log('made a boo boo', err.message)
//       return err
//     })
//   }
//   contactFactory (order = {}) {
//     let service = this
//     return new FetchOrder(order, {
//       host: 'planning-service',
//       port: 3000,
//       isSSL: false,
//       endpoint: 'order'
//     }, service.config).save().then(order => {
//       console.log('created order', order)
//
//       return order
//     }).catch(err => {
//       console.log('made a boo boo', err.message)
//       return err
//     })
//   }
//   addToOrder (orderId, { project, resources }) {
//     console.log('ORDERIDDD', orderId)
//     return this.getOrder({id: orderId}).then(order => {
//       return project.orderResourceNodes(order, resources)
//     })
//   }
//   getOrder (order = {}) {
//     let service = this
//     console.log('SERVICE', service)
//     return new FetchOrder(order, {
//       host: 'planning-service',
//       port: 3000,
//       isSSL: false,
//       endpoint: 'order'
//     }, service.config).get(order.id).then(order => {
//       console.log('created order', order)
//
//       return order || this.orderFactory()
//     }).catch(err => {
//       console.log('made a boo boo', err.message)
//       return err
//     })
//   }
//
// }
