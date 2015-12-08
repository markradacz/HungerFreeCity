//
//  SecondViewController.swift
//  HungerFreeCity
//
//  Created by Mirek Chowaniok on 6/6/15.
//  Copyright (c) 2015 Jacksonville Community. All rights reserved.
//

import UIKit
import CoreData
import DZNEmptyDataSet

class NeedsViewController: UITableViewController, NSFetchedResultsControllerDelegate, DZNEmptyDataSetSource, DZNEmptyDataSetDelegate {
    
    deinit {
        tableView.emptyDataSetSource = nil
        tableView.emptyDataSetDelegate = nil
    }
    
    override func awakeFromNib() {
        //let titleDict: NSDictionary = [NSForegroundColorAttributeName: UIColor.whiteColor()]
        //self.navigationController!.navigationBar.titleTextAttributes = titleDict as! [String : AnyObject]
        
        self.navigationController!.navigationBar.titleTextAttributes = Constants.Color.TitleDict as? [String : AnyObject]
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.emptyDataSetSource = self
        tableView.emptyDataSetDelegate = self
        
        // A little trick for removing the cell separators
        tableView.tableFooterView = UIView()
    }
    
    override func viewWillAppear(animated: Bool) {
        let tracker = GAI.sharedInstance().defaultTracker
        tracker.set(kGAIScreenName, value: "NeedsView")
        
        let builder = GAIDictionaryBuilder.createScreenView()
        tracker.send(builder.build() as [NSObject : AnyObject])
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources th at can be recreated.
    }
    
    // MARK: - Table View
    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 0
    }
    
    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        //let sectionInfo = self.fetchedResultsController.sections![section] as! NSFetchedResultsSectionInfo
        return 0
    }
    
    // MARK: - DZNEmptyDataSetSource
    func titleForEmptyDataSet(scrollView: UIScrollView!) -> NSAttributedString! {
        
        let attrString = NSAttributedString(
            string: "Star your favorite Donation Center",
            attributes: [
                NSFontAttributeName: UIFont(name: "HelveticaNeue-Light", size: 19.0) ?? UIFont.systemFontOfSize(19.0),
                NSForegroundColorAttributeName: UIColor(red:0.48, green:0.54, blue:0.58, alpha:1.0)
            ]
        )
        
        return attrString
    }
    
    func buttonTitleForEmptyDataSet(scrollView: UIScrollView!, forState state: UIControlState) -> NSAttributedString! {
        let attrString = NSAttributedString (
            string: "Select Donation Center",
            attributes: [
                NSFontAttributeName: UIFont(name: "", size: 17.0) ?? UIFont.systemFontOfSize(17.0),
                NSForegroundColorAttributeName: UIColor(red: 0.0, green: 126.0, blue: 229.0, alpha: 1.0)
            ]
        )
        return attrString
    }
    
    func imageForEmptyDataSet(scrollView: UIScrollView!) -> UIImage! {
        return UIImage(named: "favorites_empty")
    }
    
    func backgroundColorForEmptyDataSet(scrollView: UIScrollView!) -> UIColor! {
        return UIColor(red: 178.0, green: 210.0, blue: 251.0, alpha: 1.0)
    }
    
    // MARK: - DZNEmptyDataSetDelegate
    
    func emptyDataSetDidTapButton(scrollView: UIScrollView!) {
        print("tapped button on the empty view!")
        tabBarController?.selectedIndex = 1

//        self.performSegueWithIdentifier("distributionCenters", sender: self)
    }
    
}

