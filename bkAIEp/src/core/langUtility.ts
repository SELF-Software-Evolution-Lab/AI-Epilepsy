import { es  } from '@app/resources/langs/es'


class LangUtility {
  
  private locale: string = 'es'
  
  constructor(){}
  
  public setLocale(locale: string){
    this.locale = locale
  }
  
  public _ (key:string, variables?:any){
    let text
    if(this.locale === 'es'){
      text = es
    } else if (this.locale === 'en'){
      text = es
    }
    
    for (const _k of key.split('.')) {
      if(text[_k]){
        text = text[_k]
      } else {
        break
      }
    }

    if(typeof text === 'object'){
      text = key
    }
    
    if(variables){
      for (const _k of Object.keys(variables)) {
        text = text.replace(`{{${_k}}}`, variables[_k])
      }
    }
    
    return text
  }
  
}

export const langUtility = new LangUtility()
export { LangUtility }