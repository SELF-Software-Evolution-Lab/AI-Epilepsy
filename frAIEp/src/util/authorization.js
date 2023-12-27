export const headers = () =>{
  const token = localStorage.getItem('TOKEN')
  let response 
  if(token && token !== 'undefine'){
    response = `Bearer ${token}`
  }
  return response
}

export const validate = (_params) => {
  if(_params.code === 401){
    //localStorage.removeItem('TOKEN')
  }
  //window.location.replace('/')
}