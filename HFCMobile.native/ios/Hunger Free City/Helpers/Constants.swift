//
//  Constants.swift
//  HungerFreeCity
//
//  Created by Mirek Chowaniok on 6/25/15.
//  Copyright (c) 2015 Jacksonville Community. All rights reserved.
//

import Foundation
import UIKit

struct Constants {
    struct Color {
        static let MainBlue = UIColor(red: 74/255.0, green: 155/255.0, blue: 235/255.0, alpha: 1.0)
        static let TitleDict: [NSObject : AnyObject] = [NSForegroundColorAttributeName: UIColor.whiteColor()]
    }
    struct HFCService {
        static let HFCServerUrl = "https://hungerfreecity.herokuapp.com/api/centers"
    }
}