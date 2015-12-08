//
//  LoginViewController.swift
//  Hunger Free City
//
//  Created by Mirek Chowaniok on 6/26/15.
//  Copyright (c) 2015 Mobilesoft. All rights reserved.
//

import UIKit
import FBSDKLoginKit

class LoginViewController: UIViewController, FBSDKLoginButtonDelegate {

   
    @IBOutlet weak var fbLoginButton: FBSDKLoginButton!
    
 //   @IBOutlet weak var googleLoginButton: GIDSignInButton!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        fbLoginButton.readPermissions = ["public_profile", "email"]
        fbLoginButton.delegate = self
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    // MARK: Facebook Delegate Methods
    func loginButton(loginButton: FBSDKLoginButton!, didCompleteWithResult result: FBSDKLoginManagerLoginResult!, error: NSError!) {
        print("User Logged In")
        
        if error != nil {
            print("process error")
        } else if result.isCancelled {
            print("handle cancellations")
        } else {
            // If you ask for multiple permissions at once, you
            // should check if specific permissions missing
            
        }
    }
    
    func loginButtonDidLogOut(loginButton: FBSDKLoginButton!) {
        print("User logged Out")
    }
    
    @IBOutlet weak var userDataLabel: UILabel!
    @IBAction func clickUserData() {
        returnUserData()
    }
    func returnUserData() {
        let graphRequest: FBSDKGraphRequest = FBSDKGraphRequest(graphPath: "me", parameters: nil)
        graphRequest.startWithCompletionHandler { (connection, result, error) -> Void in
            if error != nil {
                print("Error: \(error)")
            } else {
                print("fetched user: \(result)")
                let userName: NSString = result.valueForKey("name") as! NSString
                print("User Name is: \(userName)")
                let userEmail: NSString = result.valueForKey("email") as! NSString
                print("User Email is: \(userEmail)")
                dispatch_async(dispatch_get_main_queue(), {
                    self.userDataLabel.text = "\(result)"
                })
                
            }
        }
        
        
    }
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
