//
//  FirstViewController.swift
//  HungerFreeCity
//
//  Created by Mirek Chowaniok on 6/6/15.
//  Copyright (c) 2015 Jacksonville Community. All rights reserved.
//

import UIKit
import Firebase
import GeoFire

class CentersViewController: UIViewController {
    //}, CLLocationManagerDelegate, UITableViewDataSource, UITableViewDelegate, UIAlertViewDelegate {
//    class CitiesViewController: UITableViewController, CLLocationManagerDelegate, UITableViewDataSource, UITableViewDelegate, UIAlertViewDelegate {


    @IBOutlet weak var mapContainerView: UIView!
    @IBOutlet weak var listContainerView: UIView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        print("entered CentersViewController")
//        let provider: HFCDataProvider()
//            provider.getDistributionCentersNearby()
        
 //       HFCDataProvider provider = HFCDataProvider()
    
//        let tracker = GAI.sharedInstance().defaultTracker
//        tracker.set(kGAIScreenName, value: "/index")
//        tracker.send(GAIDictionaryBuilder.createScreenView().build())
        // UA-64518089-1
        
        let geofireRef = Firebase(url: "https://amber-torch-2255.firebaseio.com/")
        let geoFire = GeoFire(firebaseRef: geofireRef)
        
        let center = CLLocation(latitude: 37.7832889, longitude: -122.4056973)
        // Query locations at [37.7832889, -122.4056973] with a radius of 20000 meters
        var circleQuery = geoFire.queryAtLocation(center, withRadius: 20.0)
        print("circleQuery \(circleQuery)")
        circleQuery.observeReadyWithBlock({
            print("All initial data has been loaded and events have been fired!")
//            println("\(snapshot.key) -> \(snapshot.value)")
        })
//        myRootRef.observeEventType(.Value, withBlock: {
//            snapshot in
//            println("\(snapshot.key) -> \(snapshot.value)")
//        })
//        // Query location by region
//        let span = MKCoordinateSpanMake(0.001, 0.001)
//        let region = MKCoordinateRegionMake(center.coordinate, span)
//        var regionQuery = geoFire.queryWithRegion(region)
        
//        geoFire.setLocation(CLLocation(latitude: 37.7853889, longitude: -122.4056973), forKey: "firebase-hq") { (error) in
//            if (error != nil) {
//                println("An error occured: \(error)")
//            } else {
//                println("Saved location successfully!")
//            }
//        }
    }
    
    override func awakeFromNib() {
        self.navigationController?.navigationBar.titleTextAttributes = Constants.Color.TitleDict as! [String : AnyObject]
    }


    @IBAction func viewTypeSegmentPressed(sender: UISegmentedControl) {
        print("entered viewTypeSegmentPressed \(sender)")
        switch sender.selectedSegmentIndex {
        case 0:
            listContainerView.hidden = true
            mapContainerView.hidden = false
        case 1:
            mapContainerView.hidden = true
            listContainerView.hidden = false
        default:
            break
        }
    }

}

