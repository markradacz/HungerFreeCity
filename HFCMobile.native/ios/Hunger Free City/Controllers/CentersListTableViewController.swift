//
//  MapTableViewController.swift
//  HungerFreeCity
//
//  Created by Mirek Chowaniok on 6/25/15.
//  Copyright (c) 2015 Jacksonville Community. All rights reserved.
//

import UIKit


class CentersListTableViewController: UITableViewController {

   // @IBOutlet var tableView: UITableView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        print("entered CentersListTableViewController")
        // Uncomment the following line to preserve selection between presentations
        // self.clearsSelectionOnViewWillAppear = false

        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem()
        
        // Create a reference to a Firebase location
//        var myRootRef = Firebase(url:"https://<YOUR-FIREBASE-APP>.firebaseio.com")
        // Write data to Firebase
//        myRootRef.setValue("Do you have data? You'll love Firebase.")
        
        // Create a reference to a Firebase location
       // var myRootRef = Firebase(url:"https://hungerfreecity.firebaseio.com/")
        // Read data and react to changes
//        myRootRef.observeEventType(.Value, withBlock: {
//            snapshot in
//            println("\(snapshot.key) -> \(snapshot.value)")
//        })
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    // MARK: - Table view data source
    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 0
    }
    
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("Cell", forIndexPath: indexPath) 
        return cell
    }
    
    override func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        
    }

//    override func numberOfSectionsInTableView(tableView: UITableView) -> Int {
//        // #warning Potentially incomplete method implementation.
//        // Return the number of sections.
//        return 1
//    }
//
//    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
//        // #warning Incomplete method implementation.
//        // Return the number of rows in the section.
//        return 1
//    }
//
    /*
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("reuseIdentifier", forIndexPath: indexPath) as! UITableViewCell

        // Configure the cell...

        return cell
    }
    */

    /*
    // Override to support conditional editing of the table view.
    override func tableView(tableView: UITableView, canEditRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        // Return NO if you do not want the specified item to be editable.
        return true
    }
    */

    /*
    // Override to support editing the table view.
    override func tableView(tableView: UITableView, commitEditingStyle editingStyle: UITableViewCellEditingStyle, forRowAtIndexPath indexPath: NSIndexPath) {
        if editingStyle == .Delete {
            // Delete the row from the data source
            tableView.deleteRowsAtIndexPaths([indexPath], withRowAnimation: .Fade)
        } else if editingStyle == .Insert {
            // Create a new instance of the appropriate class, insert it into the array, and add a new row to the table view
        }    
    }
    */

    /*
    // Override to support rearranging the table view.
    override func tableView(tableView: UITableView, moveRowAtIndexPath fromIndexPath: NSIndexPath, toIndexPath: NSIndexPath) {

    }
    */

    /*
    // Override to support conditional rearranging of the table view.
    override func tableView(tableView: UITableView, canMoveRowAtIndexPath indexPath: NSIndexPath) -> Bool {
        // Return NO if you do not want the item to be re-orderable.
        return true
    }
    */

//    override func tableView(tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
//        if(section == 0) {
//            var view = UIView() // The width will be the same as the cell, and the height should be set in tableView:heightForRowAtIndexPath:
//            var label = UILabel()
//            label.font = UIFont(name: "Verdana", size: 18)
//            label.text="My Details"
//            label.setTranslatesAutoresizingMaskIntoConstraints(false)
//            
//            let button   = UIButton.buttonWithType(UIButtonType.System) as! UIButton
//            button.addTarget(self, action: "visibleRow:", forControlEvents:.TouchUpInside)
//            button.setTranslatesAutoresizingMaskIntoConstraints(false)
//            button.setTitle("Test Title", forState: .Normal)
//            let views = ["label": label,"button":button,"view": view]
//            view.addSubview(label)
//            view.addSubview(button)
//            var horizontallayoutContraints = NSLayoutConstraint.constraintsWithVisualFormat("H:|-10-[label]-60-[button]-10-|", options: .AlignAllCenterY, metrics: nil, views: views)
//            view.addConstraints(horizontallayoutContraints)
//            
//            var verticalLayoutContraint = NSLayoutConstraint(item: label, attribute: .CenterY, relatedBy: .Equal, toItem: view, attribute: .CenterY, multiplier: 1, constant: 0)
//            view.addConstraint(verticalLayoutContraint)
//            return view
//        }
//        return nil
//    }
//    
//    override func tableView(tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
//        return 50
//    }
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        // Get the new view controller using [segue destinationViewController].
        // Pass the selected object to the new view controller.
    }
    */

}
