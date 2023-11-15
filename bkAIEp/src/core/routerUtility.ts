import { Request, Response, Application } from 'express';


/**
* Interface for defining route parameters.
* @interface IRouteParams
*/
interface IRouteParams {
  method: string
  path: string
  handler: (req: Request, res: Response) => Promise<any>
  middleware: any[] | any
}

/**
* Utility class for managing routes in Express.
* @class RouterUtility
*/
class RouterUtility {
  
  /**
  * Express application instance.
  * @private
  * @type {Application}
  */
  private app: Application
  
  /**
  * Prefix for all routes managed by this utility.
  * @private
  * @type {string}
  */
  private prefix: string
  
  /**
  * Creates an instance of RouterUtility.
  * @param {Application} app - The Express application instance.
  * @param {string} prefix - The prefix for all routes managed by this utility.
  * @memberof RouterUtility
  */
  constructor(app:Application, prefix:string){
    this.app = app
    this.prefix = prefix
  }
  
  /**
  * Define a route based on the provided parameters.
  * @param {IRouteParams} _params - The route parameters.
  * @memberof RouterUtility
  */
  public route(_params: IRouteParams){
    try{
      // Define a route using Express application instance.
      // Combines the route path with the utility's prefix and sets middleware and handler.
      this.app[_params.method](`${this.prefix}${_params.path}`, _params.middleware, _params.handler)
    } catch (error) {
      // Log any errors that occur during route definition.
      console.log('error', error)
    }
  }
}

// Export the RouterUtility and IRouteParams for external usage.
export { RouterUtility, IRouteParams }