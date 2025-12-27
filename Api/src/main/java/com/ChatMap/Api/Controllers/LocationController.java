package com.ChatMap.Api.Controllers;


import com.ChatMap.Api.Dto.UpdateLocationRequest;
import com.ChatMap.Api.Entities.Location;
import com.ChatMap.Api.Services.LocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping(path = "/location")
@RestController
public class LocationController {

    @Autowired
    LocationService locationService;

    @GetMapping("/health")
    public @ResponseBody ResponseEntity<?> health() {
        return ResponseEntity.ok().build();
    }


    @PostMapping("/update")
    public @ResponseBody ResponseEntity<?> updateLocation(@RequestBody UpdateLocationRequest updateLocationRequest) {
        locationService.updateLocation(updateLocationRequest);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/current")
    public ResponseEntity<?> getCurrentLocation() {
        Location location = locationService.getCurrentLocation();
        if (location != null)
            return ResponseEntity.ok(Map.of("location", location));
        else
            return ResponseEntity.noContent().build();
    }

    @GetMapping("/nearbyNotCurrent")
    public @ResponseBody ResponseEntity<?> getNearbyLocation(@RequestParam Double lat, @RequestParam Double lon, @RequestParam Double radius) {
        return ResponseEntity.ok(
                locationService.getNearbyLocationsNotCurrent(
                        lat,
                        lon,
                        radius));
    }

}
