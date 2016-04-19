//
//  AppDelegate.swift
//  Hunger Free City
//
//  Created by Mirek Chowaniok on 6/26/15.
//  Copyright (c) 2015 Mobilesoft. All rights reserved.
//

import UIKit
import FBSDKCoreKit
import GoogleMaps

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

    var window: UIWindow?
    let googleMapsApiKey = "AIzaSyD2EgzEonJUm-4tlBCTtbYGQTJbwC_XQ_U"

    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        // appearance
        UIApplication.sharedApplication().setStatusBarStyle(UIStatusBarStyle.LightContent, animated: true)
        UINavigationBar.appearance().tintColor = UIColor.whiteColor()
        UINavigationBar.appearance().barTintColor = Constants.Color.MainBlue
        UITabBar.appearance().tintColor = Constants.Color.MainBlue
        
        // maps
        GMSServices.provideAPIKey(googleMapsApiKey)
        
        // google signin
//        var configureErr: NSError?
//        GGLContext.sharedInstance().configureWithError(&configureErr)
//        if configureErr != nil {
//            println("Error configuring the Google context: \(configureErr)")
//        }

        
        // google analytics
        // Configure tracker from GoogleService-Info.plist
        var configureError:NSError?
        GGLContext.sharedInstance().configureWithError(&configureError)
        // Optional: configure GAI options.
        let gai = GAI.sharedInstance()
        gai.trackUncaughtExceptions = true  // report uncaught exceptions
       // gai.logger.logLevel = GAILogLevel.Verbose  // remove before app release
        
        // facebook
        return FBSDKApplicationDelegate.sharedInstance().application(application, didFinishLaunchingWithOptions: launchOptions)
    }

    func applicationWillResignActive(application: UIApplication) {
        // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
        // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
    }

    func applicationDidEnterBackground(application: UIApplication) {
        // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
        // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    }

    func applicationWillEnterForeground(application: UIApplication) {
        // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
    }

    func applicationDidBecomeActive(application: UIApplication) {
        FBSDKAppEvents.activateApp()
    }

    func applicationWillTerminate(application: UIApplication) {
        // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
    }
    
    func application(application: UIApplication, openURL url: NSURL, sourceApplication: String?, annotation: AnyObject?) -> Bool {
        let shouldOpenUrl = FBSDKApplicationDelegate.sharedInstance().application(application, openURL: url, sourceApplication: sourceApplication, annotation: annotation)
//        if !shouldOpenUrl {
//            shouldOpenUrl = GIDSignIn.sharedInstance().handleURL(url, sourceApplication: sourceApplication, annotation: annotation)
//        }
        return shouldOpenUrl
        
    }


}

