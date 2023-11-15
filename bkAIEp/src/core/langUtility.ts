import { es  } from '@app/resources/langs/es'

/**
* Utility class for handling language localization.
* @class LangUtility
*/
class LangUtility {
  
  /**
  * The current locale for language localization.
  * @private
  * @type {string}
  */
  private locale: string = 'es'
  
  /**
  * Creates an instance of LangUtility.
  * @memberof LangUtility
  */
  constructor(){}
  
  /**
  * Set the current locale for language localization.
  * @param {string} locale - The locale to set.
  * @memberof LangUtility
  */
  public setLocale(locale: string){
    this.locale = locale
  }
  
  /**
  * Retrieve a localized text for the provided key, with optional variable substitution.
  * @param {string} key - The key to look up the localized text.
  * @param {any} variables - Optional variables to substitute in the localized text.
  * @returns {string} The localized text.
  * @memberof LangUtility
  */
  public _ (key:string, variables?:any){
    let text
    // Choose the appropriate language resource based on the current locale
    if(this.locale === 'es'){
      text = es
    } else if (this.locale === 'en'){
      text = es // Note: Update this when you have English language resources
    }
    
    // Traverse the language resource to find the text for the provided key
    for (const _k of key.split('.')) {
      if(text[_k]){
        text = text[_k]
      } else {
        break
      }
    }
    
    // If the text is an object, set it back to the key
    if(typeof text === 'object'){
      text = key
    }
    
    // Replace variables in the text if provided
    if(variables){
      for (const _k of Object.keys(variables)) {
        text = text.replace(`{{${_k}}}`, variables[_k])
      }
    }
    
    return text
  }
  
}

// Singleton instance of LangUtility
export const langUtility = new LangUtility()
export { LangUtility }