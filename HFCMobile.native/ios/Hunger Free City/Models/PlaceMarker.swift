//
//  PlaceMarker.swift
//  Hunger Free City
//
//  Created by Mirek Chowaniok on 6/26/15.
//  Copyright (c) 2015 Jacksonville Community. All rights reserved.
//

import UIKit
import GoogleMaps

class PlaceMarker: GMSMarker {
    let place: GooglePlace
    
    init(place: GooglePlace) {
        self.place = place
        super.init()
        
        position = place.coordinate
        icon = UIImage(named: place.placeType+"_pin")
        groundAnchor = CGPoint(x: 0.5, y: 1)
        //appearAnimation = kGMSMarkerAnimationPop
    }
    
}
