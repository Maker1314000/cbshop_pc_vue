import Setting from '~/setting'
export default function ({redirect, $axios, app})  {
  // 数据访问前缀
  $axios.defaults.baseURL = Setting.apiBaseURL;
  if(process.server){
    // 获取服务端的token
    // var token = getCookie.getcookiesInServer(req).token;
  }
  if(process.client){
    // 获取客户端token
    // var token = getCookie.getcookiesInClient('token');
  }
  // 请求拦截器
  $axios.interceptors.request.use(
    config => {
      let local = app.$cookies.get('auth.strategy');
      let token = app.$cookies.get(`auth._token.${local}`);
      if (token) {
        config.headers.common['Authori-zation'] = token;
      }
      config.headers.common['Form-type'] = 'pc';
      return config
    },
    error => {
      // do something with request error
      return Promise.reject(error)
    }
  )
  // response拦截器，数据返回后，可以先在这里进行一个简单的判断
  $axios.interceptors.response.use(
    response => {
      let code = response.data ? response.data.status : 0;
      switch (code) {
        case 200:
          return response.data
        case 400:
          return Promise.reject(response.data.msg)
        case 401:
          return Promise.reject(response.data.msg)
        case 402:
          return Promise.reject(response.data.msg)
        case 410000:
        case 410001:
        case 410002:
          app.$cookies.set("fromPath",location.pathname+location.search);
          let local = app.$cookies.get('auth.strategy');
          app.$cookies.remove(`auth._token.${local}`);
          localStorage.clear();
          redirect('/login');
          return Promise.reject(response.data.msg)
          // app.$auth.logout().then(res=>{
          //
          // })
          break
        default:
          break
      }
    },
    error => {
      if(process.client){
      }
      // if(error.response.status == 500){
      //   // http状态500，服务器内部错误，重定向到500页面
      //   redirect("/500.htm")
      // }
      // if(error.response.status == 404){
      //   // http状态500，请求API找不到，重定向到404页面
      //   redirect("/404.html")
      // }
      return Promise.reject(error)   // 返回接口返回的错误信息
    })
}
