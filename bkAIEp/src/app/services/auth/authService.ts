import { Permission, Role, User } from "@app/models"
import { responseUtility } from "@core/responseUtility"
import moment from 'moment'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'



/**
* Service for handling authentication-related operations.
* @class QueueService
*/
class AuthService {
  
  constructor () {}
  
  /**
  * Authenticates a user by validating the provided username and password.
  * @param {Object} _params - Object containing username and password for login.
  * @returns {Promise<Object>} A Promise containing the result of the login operation.
  */
  public async login (_params: {username:string, password:string}) {
    try{
      // Find a user with the provided username
      let user:any = await User.findOne({
        where: {
          username: _params.username
        }
      })
      // If user not found, return an error response
      if(!user){
        return responseUtility.error('auth.login.error')
      }
      // Convert user to JSON for easier manipulation
      user = JSON.parse( JSON.stringify(user, null, 4))
      
      // Compare the provided password with the hashed password stored in the database
      const validation = await this.compare(_params.password, user.password)
      
      // If password validation fails, return an error response
      if(!validation){
        return responseUtility.error('auth.login.error')
      }
      
      // Generate a JWT token for the authenticated user
      const token = await this.token(user)
      
      // Retrieve the user's role along with associated permissions
      const role = await Role.findOne({
        where: {
          id : user.role_id
        },
        include: Permission
      })
      
      // Initialize user's 'can' property for permission checking
      if(!user['can']) user['can'] = {}
      
      // If a role is found, map permissions to the 'can' property
      if(role){
        role.dataValues.Permissions.forEach(_p => {
          if(!user['can'][_p.dataValues.module]) user['can'][_p.dataValues.module] = {}
          user['can'][_p.dataValues.module][_p.dataValues.access] = true
        })
      }
      
      // Remove sensitive information from the user object before returning
      delete user.password
      
      // Return a success response with the authenticated user and token
      return responseUtility.success({user, token})
      
    } catch (error) {
      console.log('error', error)
      return responseUtility.error('auth.login.fail_action')
    }
  }
  
  /**
  * Signs up a new user.
  * @param {Object} _params - Object containing information for user registration.
  * @returns {Promise<Object>} A Promise containing the result of the signup operation.
  */
  public async signUp (_params: any) {
    try{
      
    } catch (error) {
      console.log('error', error)
    }
  }
  
  /**
  * A test method that can be used for experimentation or development purposes.
  * @param {Object} _params - Parameters for the test method.
  * @returns {Promise<Object>} A Promise containing the result of the test operation.
  */
  public async test (_params: any) {
    try{
      
    } catch (error) {
      console.log('error', error)
    }
  }
  
  /**
  * Hashes the provided password using bcrypt.
  * @param {string} password - The password to be hashed.
  * @returns {Promise<string>} A Promise containing the hashed password.
  */
  public async hash (password) {
    try{
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      return hash
    } catch (error) {
      console.log('error', error)
    }
  }
  
  /**
  * Generates a JWT token for the provided user.
  * @param {Object} user - The user object for whom the token is generated.
  * @returns {Promise<string>} A Promise containing the generated JWT token.
  */
  private async token (user) {
    try{
      return jwt.sign({ user: user._id }, global.env.jwt, {
        expiresIn: '30d'
      })
    } catch (error) {
      console.log('error', error)
    }
  }
  
  /**
  * Compares a password with its hashed version.
  * @param {string} password - The password to be compared.
  * @param {string} hash - The hashed version of the password.
  * @returns {Promise<boolean>} A Promise indicating whether the password matches the hash.
  */
  private async compare (password, hash) {
    try{
      return await bcrypt.compare(password, hash)
    } catch (error) {
      console.log('error', error)
    }
  }
}

export const authService = new AuthService()
export { AuthService }